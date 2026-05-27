import React, { useState } from "react";
import { STRATEGIC_BLUEPRINTS } from "../mockData";
import { BlueprintSection } from "../types";
import { Compass, BarChart, Key, DollarSign, Cpu, Database, Zap, ShieldAlert, TrendingUp, Calendar, Search } from "lucide-react";

// Helper map to display specific icons
const ICON_MAP: Record<string, any> = {
  Compass,
  BarChart,
  Key,
  DollarSign,
  Cpu,
  Database,
  Zap,
  ShieldAlert,
  TrendingUp,
  Calendar
};

export function BlueprintsPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<BlueprintSection>(STRATEGIC_BLUEPRINTS[0]);

  const filteredTopics = STRATEGIC_BLUEPRINTS.filter(bp => 
    bp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bp.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bp.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <h3 className="text-base font-bold text-white tracking-tight mb-2 flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          Platform Strategic Blueprints & Tech Specifications
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The following multi-tier structural blueprints define Ikaze's SaaS architecture, database schemas, API parameters, economic models, WCAG specifications, and global go-to-market strategies. Use the guidelines checklist on the left to toggle sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Search box */}
          <div className="relative flex items-center shrink-0">
            <Search className="absolute left-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search specifications database..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-2">
            {filteredTopics.map((bp) => {
              const TopicIcon = ICON_MAP[bp.icon] || Compass;
              const isSelected = selectedTopic.id === bp.id;
              return (
                <button
                  key={bp.id}
                  onClick={() => setSelectedTopic(bp)}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-slate-850 border-cyan-500/50 text-white shadow-md" 
                      : "bg-slate-900/50 border-slate-805 hover:bg-slate-800/30 text-slate-400"
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${isSelected ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-950 text-slate-500"}`}>
                    <TopicIcon className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs leading-snug">{bp.title}</p>
                    <p className="text-[10px] text-slate-500 overflow-hidden text-ellipsis line-clamp-1">{bp.subtitle}</p>
                  </div>
                </button>
              );
            })}
            
            {filteredTopics.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">No specifications match search keywords.</p>
            )}
          </div>
        </div>

        {/* Content Details Panel */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between font-sans min-h-[460px]">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-cyan-400 border border-cyan-500/25 bg-cyan-950/40 px-2 py-0.5 rounded-full font-mono">
                  IKaze spec catalog: #{selectedTopic.id}
                </span>
                <h4 className="text-base md:text-lg font-bold text-white tracking-tight mt-1.5 leading-tight">{selectedTopic.title}</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">{selectedTopic.subtitle}</p>
              </div>
            </div>

            {/* Content Body with nice prose typography and high readability */}
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 prose prose-invert max-w-none text-xs md:text-sm leading-relaxed text-slate-300">
              <p className="whitespace-pre-line text-slate-350 leading-relaxed font-sans">{selectedTopic.content}</p>

              {/* Highlights section */}
              {selectedTopic.keyPoints && selectedTopic.keyPoints.length > 0 && (
                <div className="mt-5 p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Critical Chapter Takeaways</span>
                  <ul className="space-y-1.5">
                    {selectedTopic.keyPoints.map((kp, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500">
            <span>Corporate Class Document SEC-924</span>
            <span className="font-mono text-[10px]">Active Node: Kigali Central Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
