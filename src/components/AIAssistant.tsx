import React, { useState, useRef, useEffect } from "react";
import { Send, Volume2, VolumeX, Sparkles, Loader2, User, UserCheck, ShieldAlert } from "lucide-react";

interface AIAssistantProps {
  disabilityType: string;
  userLanguage: string;
}

export function AIAssistant({ disabilityType, userLanguage }: AIAssistantProps) {
  const [messages, setMessages] = useState<{ id: string; sender: "user" | "ai"; text: string }[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "How can I support your digital and economic journey today? Ask me about professional networking, freelance careers, remote jobs in Kigali, or assistive technology setup."
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean speaking on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleSpeech = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Text-to-Speech is not supported in this browser version.");
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    stopSpeech(); // close existing
    // strip markdown for cleaner speech synthesis results
    const cleanText = text.replace(/[#*`_-]/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    
    // Attempt to find English or Swahili/French voice where relevant
    const voices = window.speechSynthesis.getVoices();
    if (userLanguage === "French") {
      const frVoice = voices.find(v => v.lang.startsWith("fr"));
      if (frVoice) utterance.voice = frVoice;
    } else {
      const enVoice = voices.find(v => v.lang.startsWith("en"));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    currentUtterance.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMsgText = inputText;
    setInputText("");
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: "user", text: userMsgText }]);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsgText,
          disabilityType,
          language: userLanguage
        })
      });

      if (!response.ok) {
        throw new Error("Local connection failed. Verify server is online.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { id: Date.now().toString() + "-ai", sender: "ai", text: data.text || "No output returned." }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "-err",
        sender: "ai",
        text: `Ikaze System Incident: ${err.message || "Unable to retrieve AI services. Check your API key integration."}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <div className="flex flex-col h-[520px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header section */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide">Ikaze AI Assistant</h3>
            <p className="text-xs text-slate-400">Optimized for <span className="text-cyan-400 font-medium capitalize">{disabilityType}</span> assistance</p>
          </div>
        </div>
        
        {/* Voice control parameters */}
        <div className="flex items-center space-x-3 bg-slate-900/40 p-1.5 rounded-lg border border-slate-700/65">
          <label className="text-[10px] text-slate-400 font-mono" id="voice-speed">Speech Rate: {speechRate}x</label>
          <input
            type="range"
            min="0.5"
            max="1.8"
            step="0.10"
            aria-labelledby="voice-speed"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Messages body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm focus:outline-none" tabIndex={0} aria-label="Conversation logs">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-2 max-w-[85%] ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === "user" ? "bg-slate-700 text-slate-300" : "bg-cyan-950 text-cyan-400 border border-cyan-800"
              }`}>
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div>
                <div className={`p-4.5 rounded-2xl relative ${
                  m.sender === "user" 
                    ? "bg-cyan-600 text-white rounded-tr-none" 
                    : "bg-slate-800/80 text-slate-100 border border-slate-700 rounded-tl-none leading-relaxed"
                }`}>
                  <p className="whitespace-pre-line leading-relaxed text-sm">{m.text}</p>
                  
                  {/* TTS integration button for AI response */}
                  {m.sender === "ai" && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleSpeech(m.text)}
                        aria-label="Toggle text to speech reading"
                        className="p-1 px-2 text-[11px] font-mono rounded bg-slate-900/60 hover:bg-slate-900 text-cyan-400 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-red-400" />
                            <span>Stop Reader</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-cyan-400" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center animate-spin">
                <Loader2 className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700 rounded-tl-none flex items-center gap-2">
                <span className="text-xs">Processing via Gemini AI...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts list */}
      <div className="p-2 border-t border-slate-850 bg-slate-900/90 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
        <button
          onClick={() => handleSuggestedQuestion("How can disabled youth in Kigali earn money through microtasks?")}
          className="p-1.5 px-3 bg-slate-800/65 custom-border hover:bg-slate-800 text-slate-300 text-xs rounded-full cursor-pointer whitespace-nowrap transition-colors"
        >
          💡 Remote microtasks
        </button>
        <button
          onClick={() => handleSuggestedQuestion("Explain the accessibility features of Rwanda Development Board headquarters")}
          className="p-1.5 px-3 bg-slate-800/65 custom-border hover:bg-slate-800 text-slate-300 text-xs rounded-full cursor-pointer whitespace-nowrap transition-colors"
        >
          🏢 RDB physical features
        </button>
        <button
          onClick={() => handleSuggestedQuestion("Suggest high-tech assistive technologies for blind software programmers")}
          className="p-1.5 px-3 bg-slate-800/65 custom-border hover:bg-slate-800 text-slate-300 text-xs rounded-full cursor-pointer whitespace-nowrap transition-colors"
        >
          💻 Braille Coding Setup
        </button>
      </div>

      {/* Message compose form */}
      <form onSubmit={handleSend} className="p-3.5 bg-slate-800/95 border-t border-slate-700/80 flex gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything (e.g., 'What remote jobs am I qualified for?')..."
          aria-label="Message prompt field for AI Assistant"
          className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !inputText.trim()}
          aria-label="Submit message"
          className="px-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
