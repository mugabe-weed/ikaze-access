import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini API wrapper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST APIs
// Helper for cleaning phone numbers for Rwanda Paypack Gateway format
function cleanPhoneNumberForPaypack(phone: string): string {
  let cleaned = phone.replace(/[\s+()-]/g, "");
  if (cleaned.startsWith("250")) {
    cleaned = "0" + cleaned.substring(3);
  }
  return cleaned;
}

// Paypack Rwanda Mobile Money payment (MTN MoMo & Airtel Money direct USSD push)
app.post("/api/momo/pay", async (req, res) => {
  try {
    const { phone, amount, provider, name, targetType, targetId } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required." });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "A valid positive payment amount is required." });
    }

    const paypackClientId = process.env.PAYPACK_CLIENT_ID;
    const paypackClientSecret = process.env.PAYPACK_CLIENT_SECRET;

    const cleanedPhone = cleanPhoneNumberForPaypack(phone);

    // If API credentials are not set, return simulated high-fidelity response.
    if (!paypackClientId || !paypackClientSecret) {
      console.log(`[PAYPACK SYSTEM] No config keys. Returning beautiful simulation flow for ${cleanedPhone} (${provider}).`);
      return res.json({
        isSimulated: true,
        ref: `MOCK-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: "pending",
        amount: Number(amount),
        phone: cleanedPhone,
        provider: provider || "MTN",
        warning: "Paypack mobile money authentication keys not defined. Operating securely in simulated Sandbox mode with instant mock confirmations."
      });
    }

    console.log(`[PAYPACK SYSTEM] Initiating REAL payment of ${amount} RWF to ${cleanedPhone} using Paypack credentials.`);

    // 1. Authenticate with Paypack
    const authHeaders = { "Content-Type": "application/json" };
    const authResponse = await fetch("https://opay-api.paypack.rw/v1/auth/sign-in", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        client_id: paypackClientId,
        client_secret: paypackClientSecret
      })
    });

    if (!authResponse.ok) {
      const errTxt = await authResponse.text();
      console.error("[PAYPACK SYSTEM] Authentication connection failed:", errTxt);
      return res.status(502).json({
        error: "Telecom Gateway Authenticate handshake failed. Please verify your PAYPACK_CLIENT_ID and PAYPACK_CLIENT_SECRET keys.",
        details: errTxt
      });
    }

    const authData: any = await authResponse.json();
    const token = authData.access || authData.access_token || authData.token;

    if (!token) {
      return res.status(502).json({ error: "Failed to extract access signature from Paypack." });
    }

    // 2. Trigger Cash-in request
    const cashinHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    };

    const cashinPayload = {
      amount: Number(amount),
      number: cleanedPhone
    };

    console.log("[PAYPACK SYSTEM] Sending real Cashin payload:", cashinPayload);
    const cashinResponse = await fetch("https://opay-api.paypack.rw/v1/payment/cashin", {
      method: "POST",
      headers: cashinHeaders,
      body: JSON.stringify(cashinPayload)
    });

    if (!cashinResponse.ok) {
      const errTxt = await cashinResponse.text();
      console.error("[PAYPACK SYSTEM] Cashin trigger failed:", errTxt);
      return res.status(502).json({
        error: "Telecom gateway rejected checkout request. Verify subscriber status and balance amount.",
        details: errTxt
      });
    }

    const cashinData: any = await cashinResponse.json();
    console.log("[PAYPACK SYSTEM] Cash-in started successfully:", cashinData);

    return res.json({
      isSimulated: false,
      ref: cashinData.ref || cashinData.id || cashinData.transaction_id || `PAYPACK-${Date.now()}`,
      status: cashinData.status || "pending",
      amount: Number(amount),
      phone: cleanedPhone,
      provider: provider || "MTN"
    });

  } catch (error: any) {
    console.error("[PAYPACK ERROR] Trigger payment caught:", error);
    res.status(500).json({ error: error.message || "Internal server error connecting to telecom gateway." });
  }
});

// Check real Paypack transaction status
app.get("/api/momo/status/:ref", async (req, res) => {
  try {
    const { ref } = req.params;
    if (!ref) {
      return res.status(400).json({ error: "Transaction reference is required." });
    }

    // Handle mock transactions instantly
    if (ref.startsWith("MOCK-")) {
      return res.json({
        ref: ref,
        status: "successful",
        isSimulated: true
      });
    }

    const paypackClientId = process.env.PAYPACK_CLIENT_ID;
    const paypackClientSecret = process.env.PAYPACK_CLIENT_SECRET;

    if (!paypackClientId || !paypackClientSecret) {
      return res.json({
        ref: ref,
        status: "successful",
        isSimulated: true
      });
    }

    // 1. Authenticate to get a fresh token
    const authResponse = await fetch("https://opay-api.paypack.rw/v1/auth/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: paypackClientId,
        client_secret: paypackClientSecret
      })
    });

    if (!authResponse.ok) {
      return res.status(502).json({ error: "Failed to authenticate tracking gateway session." });
    }

    const authData: any = await authResponse.json();
    const token = authData.access || authData.access_token || authData.token;

    // 2. Query status from Paypack
    const statusUrl = `https://opay-api.paypack.rw/v1/payment/transactions/${ref}`;
    console.log(`[PAYPACK SYSTEM] Querying real status for reference: ${ref} at ${statusUrl}`);

    const statusResponse = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    let txStatus = "pending";
    let rawData: any = null;

    if (statusResponse.ok) {
      rawData = await statusResponse.json();
      txStatus = rawData.status || "pending";
    } else {
      // Fallback: try checking inside transaction events `/events/transactions?ref=`
      const altUrl = `https://opay-api.paypack.rw/v1/events/transactions?ref=${ref}`;
      const altResponse = await fetch(altUrl, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (altResponse.ok) {
        const altData: any = await altResponse.json();
        rawData = altData.transactions?.[0] || altData.events?.[0] || altData;
        txStatus = rawData?.status || "pending";
      } else {
        console.error(`[PAYPACK SYSTEM] Could not locate transaction: ${ref}`);
        return res.status(404).json({ error: "Transaction reference not found on network." });
      }
    }

    // Standardize Paypack statuses to "successful", "failed", "pending"
    let unifiedStatus = "pending";
    if (txStatus === "successful" || txStatus === "completed" || txStatus === "success") {
      unifiedStatus = "successful";
    } else if (txStatus === "failed" || txStatus === "cancelled" || txStatus === "refused" || txStatus === "error") {
      unifiedStatus = "failed";
    }

    return res.json({
      ref: ref,
      status: unifiedStatus,
      isSimulated: false,
      rawStatus: txStatus,
      raw: rawData
    });

  } catch (error: any) {
    console.error("[PAYPACK ERROR] check status caught:", error);
    res.status(500).json({ error: error.message || "Failed to audit remote transaction status." });
  }
});

// REST APIs
// 1. General AI assistant tailored to user's accessibility needs
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { message, disabilityType, language = "English" } = req.body;
    const ai = getGeminiClient();

    let systemInstruction = `You are the Ikaze AI Accessibility Companion, an assistant dedicated to disability economic empowerment, digital independence, career coaching, and vocational skills development in Africa. Specifically, you are talking to a user who has identified as having a '${disabilityType || "general/unspecified"}' disability or preference. Maintain an empowering, respectful, highly legible and structured tone. Keep your responses practical, direct, and focused on helping them earn, learn, or solve problems. Respond in ${language}. Use clear bullet points and markdown tables where needed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Assistant error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI system." });
  }
});

// 2. Simplify complex text for cognitive access / neurodiversity / deaf readers
app.post("/api/gemini/simplify", async (req, res) => {
  try {
    const { text, targetType = "general" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text payload is required." });
    }
    const ai = getGeminiClient();

    let targetPrompt = "Summarize and rewrite the text to be extremely clear, digestible, using short sentences, and avoiding passive voice or confusing corporate jargon.";
    if (targetType === "neurodiverse") {
      targetPrompt = "Rewrite this text with maximum structural clarity. Use bold bullet points, clear actionable headers, spacious paragraphs, and absolute literal meanings. Eliminate ambiguous idioms, confusing expressions, and large walls of text.";
    } else if (targetType === "dyslexic") {
      targetPrompt = "Rewrite using short, highly distinct sentences. Use spacing lists to prevent visual crowding. Rephrase dense technical phrasing into plain, direct standard phrasing.";
    } else if (targetType === "low-bandwidth") {
      targetPrompt = "Condense this text into its bare essential points to reduce readability bandwidth, creating a super tight outline.";
    }

    const systemInstruction = `You are Ikaze's Plain Language Processor. Your goal is to democratize complex document reading (contracts, job forms, legal drafts, study material) for disabled individuals. ${targetPrompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Simplify and restructure this input content:\n\n${text}`,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Simplify error:", error);
    res.status(500).json({ error: error.message || "Failed to process text simplification." });
  }
});

// 3. SaaS Accessibility WCAG Audit Tool (simulated compliance audit for web developers)
app.post("/api/gemini/audit", async (req, res) => {
  try {
    const { code, siteDescription } = req.body;
    if (!code && !siteDescription) {
      return res.status(400).json({ error: "Provide code snippet or site description to audit." });
    }
    const ai = getGeminiClient();

    const systemInstruction = `You are the Ikaze SaaS WCAG 2.2 Accessibility Compliance Auditor. You evaluate web layouts, code snippets, or user-interface designs for critical accessibility pitfalls (WCAG A, AA, AAA standards). Output a detailed JSON compliance breakdown with an overall accessibility score (out of 100), critical bugs found, the WCAG criteria failed, and specific HTML remediation snippets.`;

    const prompt = `Perform an accessibility audit on the following context:\n\nCode snippet:\n${code || "Not provided"}\n\nSite / Layout Description:\n${siteDescription || "Not provided"}\n\nProvide an absolute professional audit in standard Markdown with structured tables, clear compliance criteria (e.g., Contrast, Keyboard Access, Screen-Reader Labels), and exact solutions. Give an estimated 'IKaze Accessibility Rating Score' from 0 to 100 and detailed remediation steps.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini WCAG Audit error:", error);
    res.status(500).json({ error: error.message || "Failed to generate compliance report." });
  }
});

// 4. Describe visual layouts or images for blind persons
app.post("/api/gemini/describe", async (req, res) => {
  try {
    const { imagePrompt, sceneDescription } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are a professional audio describer for the blind. Translate user scenes, visual components, or artwork into exceptionally vivid, spacially descriptive, and high-quality narrator-style descriptions that capture colors, shapes, emotional layout, texts in frame, and relative positions of elements.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Describe the following scenario or query carefully:\n\n${sceneDescription || imagePrompt}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Describe error:", error);
    res.status(500).json({ error: error.message || "Failed to generate visual breakdown." });
  }
});

// Vite middleware flow
async function initializeServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ikaze Access Server] Active and listening on port ${PORT}`);
  });
}

initializeServer().catch((err) => {
  console.error("Failed to boot backend server:", err);
});
