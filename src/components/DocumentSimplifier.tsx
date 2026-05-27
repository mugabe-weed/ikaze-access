import React, { useState } from "react";
import { Sparkles, Loader2, ArrowRightLeft, BookOpen, Layers, CheckSquare } from "lucide-react";

const SAMPLES = [
  {
    title: "📜 Legal SLA Clause (dense corporate language)",
    text: "The service provider warrants that for a minimum duration of ninety-nine point nine percent (99.9%) calculated continuously across any calendar month, excluding scheduled maintenance outages notified seven (7) days in advance, the database system node clustering and remote execution nodes shall demonstrate an active operational responsiveness latency profile below fifty (50) milliseconds. Failure to maintain such metrics will lead to an escrow rebate calculation matching the schedules listed on appendix five."
  },
  {
    title: "💼 High-Boilerplate Technical Job Post",
    text: "We are paradigm-shifting pioneers searching for a highly synergized multi-disciplinary full-stack engineer ready to leverage deep cloud-native automation frameworks. You will actively manage legacy technical debt, establish hyper-scalable microservices utilizing stateful streaming pipelines, and coordinate on-call engineering response rotations under high-pressure parameters. Must demonstrate elite multi-year tenure managing databases under stressful architectural environments."
  }
];

export function DocumentSimplifier() {
  const [selectedSample, setSelectedSample] = useState(0);
  const [inputText, setInputText] = useState(SAMPLES[0].text);
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);
  const [targetType, setTargetType] = useState<"general" | "neurodiverse" | "dyslexic" | "low-bandwidth">("neurodiverse");
  const [loading, setLoading] = useState(false);

  const applySample = (index: number) => {
    setSelectedSample(index);
    setInputText(SAMPLES[index].text);
    setSimplifiedText(null);
  };

  const handleSimplify = async () => {
    if (!inputText.trim() || loading) return;
    setLoading(true);
    setSimplifiedText(null);

    try {
      const response = await fetch("/api/gemini/simplify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          targetType
        })
      });

      if (!response.ok) {
        throw new Error("Unable to contact backend document compiler. Verify server state.");
      }

      const data = await response.json();
      setSimplifiedText(data.text || "Failed to parse simplified feedback.");
    } catch (err: any) {
      setSimplifiedText(`### Parsing Issue\n\nFailed to calculate plain language summary. Detail: **${err.message || "Network exception"}**`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <h3 className="text-base font-bold text-white tracking-tight mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Plain Language & Cognitive Simplifier
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Dense contracts and technical job files are significant barriers for deaf and neurodiverse (ADHD/Autism) citizens. Select a dense sample or paste your own document, select your cognitive reading parameter, and click 'Simplify' to run plain-language translation in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input box and options */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Select Dense Sample</span>
            <div className="flex gap-2">
              {SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => applySample(idx)}
                  className={`flex-1 p-2.5 text-left rounded-lg text-xs border font-medium cursor-pointer transition-colors ${
                    selectedSample === idx 
                      ? "bg-slate-800 border-cyan-500/50 text-white" 
                      : "bg-slate-900/40 border-slate-805 text-slate-400 hover:bg-slate-800/40"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Document Text to Simplify</span>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste any dense textbook content, job details, or service contracts here..."
              rows={8}
              className="w-full bg-slate-950 border border-slate-880 focus:border-cyan-500 rounded-xl p-4 text-xs text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40 leading-relaxed"
            />
          </div>

          {/* Cognitive target selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Select Simplification Parameter</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "neurodiverse", label: "🧩 Neurodiverse", sub: "ADHD/Autistic" },
                { id: "dyslexic", label: "📖 Dyslexia", sub: "Plain & Spaced" },
                { id: "low-bandwidth", label: "⚡ Low Bandwidth", sub: "Abbreviated" },
                { id: "general", label: "👤 General", sub: "Plain Language" }
              ].map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => setTargetType(tp.id as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    targetType === tp.id 
                      ? "bg-slate-800 border-cyan-500/50 text-white shadow-md shadow-pink-900/5" 
                      : "bg-slate-900/40 border-slate-805 text-slate-400 hover:bg-slate-800/30"
                  }`}
                >
                  <p className="font-bold text-xs">{tp.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono capitalize">{tp.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSimplify}
            disabled={loading || !inputText.trim()}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-550 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:bg-slate-800 disabled:text-slate-500 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>Simplifying via Gemini AI...</span>
              </>
            ) : (
              <>
                <ArrowRightLeft className="w-4 h-4 text-white" />
                <span>Process Document translation</span>
              </>
            )}
          </button>
        </div>

        {/* Translation Results */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 min-h-[350px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Simplified Text Result
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full capitalize">
                {targetType} filter active
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-slate-200">Revising syntax hierarchy...</p>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">Isolating idioms and generating clear, formatted bullet descriptions.</p>
                </div>
              </div>
            ) : simplifiedText ? (
              <div className="text-slate-300 text-sm leading-relaxed overflow-y-auto max-h-[350px] pr-2 space-y-3 font-sans prose prose-invert">
                <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl leading-relaxed whitespace-pre-line text-sm text-slate-200">
                  {simplifiedText}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                <BookOpen className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-semibold">Ready for compilation</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">Provide dense clauses or check custom templates, choose target mode, and apply simplify engine.</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1"><CheckSquare className="w-4 h-4 text-cyan-500" /> Fully aligned to Plain Writing mandates</span>
            <span>IKaze PlainLanguage Suite v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
