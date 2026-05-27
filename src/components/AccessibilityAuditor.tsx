import React, { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle2, Code2, Play, RefreshCw, BarChart } from "lucide-react";

const CODE_PRESETS = [
  {
    name: "❌ Messy Non-Accessible Form",
    description: "Contains missing labels, poor contrast inline styling, zero focus rings, and empty anchor components.",
    code: `<div style="background: #ffffff; color: #ececec; font-family: sans-serif;">
  <span style="font-size: 24px; font-weight: bold;">Signup Portal</span>
  <br/>
  Enter your name:
  <input type="text" style="border: none; background: #fafafa;" />
  <br/>
  Enter password:
  <input type="password" style="background: #fafafa;" />
  <br/>
  <div onclick="submitForm()" style="width: 100px; height: 35px; background: pink; border-radius: 5px; text-align: center; line-height:35px;">
    SIGNUP
  </div>
  <a href="#" onclick="forgot()">Click here</a>
</div>`
  },
  {
    name: "✅ Optimized WAI-ARIA Form",
    description: "Fully accessible implementation with semantic tags, strict contrast ratios, keyboard outlines, and role statuses.",
    code: `<form aria-labelledby="form-heading" class="bg-slate-900 border border-slate-700 p-6 rounded-xl max-w-md space-y-4">
  <h2 id="form-heading" class="text-xl font-bold text-white tracking-tight">Accessible Registration</h2>
  
  <div class="flex flex-col gap-1.5">
    <label htmlFor="user-name" class="text-sm font-semibold text-slate-300">Full Name (Required)</label>
    <input 
      id="user-name" 
      type="text" 
      required 
      aria-required="true"
      class="bg-slate-800 border-2 border-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/25 px-4 py-2.5 text-white rounded-lg outline-none transition-all"
    />
  </div>

  <div class="flex flex-col gap-1.5">
    <label htmlFor="user-password" class="text-sm font-semibold text-slate-300">Password</label>
    <input 
      id="user-password" 
      type="password" 
      required
      class="bg-slate-800 border-2 border-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/25 px-4 py-2.5 text-white rounded-lg outline-none transition-all"
    />
  </div>

  <button 
    type="submit" 
    class="w-full bg-cyan-600 hover:bg-cyan-550 text-white font-semibold py-2.5 px-4 rounded-lg focus:ring-4 focus:ring-cyan-400/50 outline-none transition-all cursor-pointer"
  >
    Register Account
  </button>
</form>`
  }
];

export function AccessibilityAuditor() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customCode, setCustomCode] = useState(CODE_PRESETS[0].code);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const applyPreset = (index: number) => {
    setSelectedPreset(index);
    setCustomCode(CODE_PRESETS[index].code);
    setAuditResult(null);
  };

  const runAudit = async () => {
    if (!customCode.trim() || loading) return;
    setLoading(true);
    setAuditResult(null);

    try {
      const response = await fetch("/api/gemini/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: customCode,
          siteDescription: "Testing pasted template against WCAG 2.2 AA regulations."
        })
      });

      if (!response.ok) {
        throw new Error("Web compliance server is unresponsive. Retrying...");
      }

      const data = await response.json();
      setAuditResult(data.text || "No diagnostics yielded.");
    } catch (err: any) {
      setAuditResult(`### Compliance System Timeout\n\nFailed to finish the audit run. Details: **${err.message || "Intermittent network drop"}**`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <h3 className="text-base font-bold text-white tracking-tight mb-2 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-cyan-400" />
          WCAG Developer SaaS Audit Engine
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The SaaS compliance module evaluates client sites in real-time. Corporates pay to verify portals, and certified disabled developers earn validation commissions for manual checks. Try auditing sample templates below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input parameters */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Select Audit Template Preset</span>
            <div className="flex flex-col gap-2">
              {CODE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(idx)}
                  className={`p-3 text-left rounded-xl border transition-all text-xs cursor-pointer ${
                    selectedPreset === idx 
                      ? "bg-slate-800 border-cyan-500/50 text-white" 
                      : "bg-slate-900/50 border-slate-805 hover:bg-slate-800/40 text-slate-400"
                  }`}
                >
                  <p className="font-bold text-sm mb-1">{p.name}</p>
                  <p className="text-xs text-slate-400 leading-normal">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-slate-500" />
                Raw HTML to Validator
              </span>
              <button
                onClick={() => setCustomCode("")}
                className="text-slate-500 hover:text-red-400 text-xs font-mono transition-colors"
              >
                Clear Sandbox
              </button>
            </div>
            <textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="Paste HTML source markup here to begin..."
              rows={9}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-200 outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
          </div>

          <button
            onClick={runAudit}
            disabled={loading || !customCode.trim()}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-550 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:bg-slate-800 disabled:text-slate-500 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Running Gemini WCAG Analysis...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white fill-current" />
                <span>Validate & generate Scorecard</span>
              </>
            )}
          </button>
        </div>

        {/* Audit reports display wrapper */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 min-h-[360px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" />
                Audit Scorecard Outputs
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                auditResult ? "bg-cyan-950 text-cyan-400 border border-cyan-800" : "bg-slate-800 text-slate-400"
              }`}>
                {auditResult ? "Report Generated" : "Awaiting Audit Run"}
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">Evaluating Semantic Nodes...</p>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">Comparing input lines against WCAG Title, Landmark, ARIA, and Contrast AA limits.</p>
                </div>
              </div>
            ) : auditResult ? (
              <div className="text-slate-300 text-sm leading-relaxed overflow-y-auto max-h-[360px] pr-2 space-y-4 font-sans prose prose-invert prose-xs">
                {/* Simulated Markdown renderer for easier viewing */}
                <div className="bg-slate-950/80 p-4 border border-slate-800 rounded-xl font-mono text-xs whitespace-pre-wrap selection:bg-cyan-700/55 text-slate-200">
                  {auditResult}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <Code2 className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-semibold">Ready for compilation run</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Select an HTML template preset on the left, then click 'Validate & generate Scorecard' to execute AI compliance verification.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> ISO/IEC 40500 standards aligned</span>
            <span>IKaze Audit Suite v1.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
