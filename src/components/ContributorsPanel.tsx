import React, { useState, useEffect } from "react";
import { Users, Code, Award, Plus, CheckCircle2, Terminal, AlertCircle } from "lucide-react";

interface ContributorsPanelProps {
  prefContrast: "slate" | "high-contrast" | "eye-care" | "bandwidth";
}

interface DeveloperTask {
  id: string;
  title: string;
  module: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  bountyPoints: number;
  signedUpCount: number;
}

const INITIAL_TASKS: DeveloperTask[] = [
  {
    id: "task-1",
    title: "Enhance WCAG Scraper Multi-route Validation",
    module: "WCAG Audit SaaS tool",
    difficulty: "Advanced",
    bountyPoints: 450,
    signedUpCount: 3,
  },
  {
    id: "task-2",
    title: "Identify & Tag Wheelchair Accessible Ramps at Nyabugogo Transit Link",
    module: "Crowdsourced Kigali Map",
    difficulty: "Beginner",
    bountyPoints: 120,
    signedUpCount: 8,
  },
  {
    id: "task-3",
    title: "Add OpenDyslexic Spacing support across PDF layout rendering",
    module: "Plain Text Simplifier",
    difficulty: "Intermediate",
    bountyPoints: 220,
    signedUpCount: 2,
  },
  {
    id: "task-4",
    title: "Translate Academic Syllabus content into clear audio narration flows",
    module: "Accessible E-Learning",
    difficulty: "Beginner",
    bountyPoints: 150,
    signedUpCount: 5,
  },
  {
    id: "task-5",
    title: "Implement Node.js server-side caching flow for Gemini API proxy queries",
    module: "AI Accessibility Assistant",
    difficulty: "Advanced",
    bountyPoints: 500,
    signedUpCount: 1,
  }
];

interface ContributorRegistration {
  id: string;
  name: string;
  email: string;
  experienceLevel: string;
  taskId: string;
  taskTitle: string;
  timestamp: string;
}

const INITIAL_REGISTRATIONS: ContributorRegistration[] = [
  {
    id: "reg-1",
    name: "Alex Nshuti",
    email: "alex.n@example.com",
    experienceLevel: "Intermediate",
    taskId: "task-3",
    taskTitle: "Add OpenDyslexic Spacing support across PDF layout rendering",
    timestamp: "2 hours ago",
  },
  {
    id: "reg-2",
    name: "Clemence Umutoni",
    email: "clem@example.com",
    experienceLevel: "Advanced",
    taskId: "task-1",
    taskTitle: "Enhance WCAG Scraper Multi-route Validation",
    timestamp: "5 hours ago",
  },
  {
    id: "reg-3",
    name: "Christian Kagabo",
    email: "kagabo.c@example.com",
    experienceLevel: "Beginner",
    taskId: "task-2",
    taskTitle: "Identify & Tag Wheelchair Accessible Ramps at Nyabugogo Transit Link",
    timestamp: "1 day ago",
  }
];

export function ContributorsPanel({ prefContrast }: ContributorsPanelProps) {
  const [tasks, setTasks] = useState<DeveloperTask[]>(() => {
    const saved = localStorage.getItem("ikaze_dev_tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [registrations, setRegistrations] = useState<ContributorRegistration[]>(() => {
    const saved = localStorage.getItem("ikaze_dev_registrations");
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupExp, setSignupExp] = useState("Intermediate");
  const [signupTaskId, setSignupTaskId] = useState(INITIAL_TASKS[0].id);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");

  useEffect(() => {
    localStorage.setItem("ikaze_dev_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("ikaze_dev_registrations", JSON.stringify(registrations));
  }, [registrations]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) {
      return;
    }

    const selectedTask = tasks.find(t => t.id === signupTaskId);
    if (!selectedTask) return;

    const newReg: ContributorRegistration = {
      id: "reg-" + Date.now(),
      name: signupName.trim(),
      email: signupEmail.trim(),
      experienceLevel: signupExp,
      taskId: signupTaskId,
      taskTitle: selectedTask.title,
      timestamp: "Just now"
    };

    setRegistrations([newReg, ...registrations]);
    
    // Increment count
    setTasks(prev => prev.map(t => t.id === signupTaskId ? { ...t, signedUpCount: t.signedUpCount + 1 } : t));

    setSuccessMsg(`🚀 Successfully registered for the workspace task! MUGABEPRINCE and the core tech reviewers have received your ticket.`);
    
    // Clear fields
    setSignupName("");
    setSignupEmail("");
    
    setTimeout(() => {
      setSuccessMsg(null);
    }, 5000);
  };

  // Theme support inline classes
  const styles = {
    card: {
      slate: "bg-slate-950/80 border-slate-805 text-slate-100",
      "high-contrast": "bg-black border-white border-2 text-white",
      "eye-care": "bg-[#F4EFE2] border-[#E2D6B5] text-[#2B2B2B]",
      bandwidth: "bg-white border-black text-black"
    }[prefContrast],
    cardInner: {
      slate: "bg-slate-900 border-slate-800",
      "high-contrast": "bg-black border-white border",
      "eye-care": "bg-[#FAF6EE] border-[#D6C29B]",
      bandwidth: "bg-neutral-50 border-neutral-300"
    }[prefContrast],
    heading: {
      slate: "text-white",
      "high-contrast": "text-white uppercase font-bold",
      "eye-care": "text-[#3D2C1C] font-serif font-black",
      bandwidth: "text-black font-sans font-bold"
    }[prefContrast],
    textMuted: {
      slate: "text-slate-400 font-sans",
      "high-contrast": "text-yellow-400 font-mono font-bold",
      "eye-care": "text-[#65543D] font-serif",
      bandwidth: "text-neutral-700"
    }[prefContrast],
    input: {
      slate: "bg-slate-950 border-slate-800 focus:border-cyan-500 text-white",
      "high-contrast": "bg-black border-white focus:border-white text-white",
      "eye-care": "bg-[#FAF6EE] border-[#C0B298] focus:border-[#8B5E3C] text-[#2B2B2B]",
      bandwidth: "bg-white border-neutral-400 focus:border-black text-black"
    }[prefContrast],
    button: {
      slate: "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white",
      "high-contrast": "bg-white hover:bg-yellow-400 text-black border-2 border-white font-extrabold",
      "eye-care": "bg-[#8B5E3C] hover:bg-[#70482C] text-[#FAF6EE] font-serif",
      bandwidth: "bg-black hover:bg-neutral-800 text-white font-bold"
    }[prefContrast],
    badgeDifficulty: (diff: string) => {
      const colors = {
        Beginner: {
          slate: "bg-emerald-950 text-emerald-400 border-emerald-800/30",
          "high-contrast": "bg-black text-white border-white border",
          "eye-care": "bg-[#E2F0D9] text-[#385723] border-[#C5E0B4]",
          bandwidth: "bg-neutral-200 text-black border-neutral-300"
        },
        Intermediate: {
          slate: "bg-cyan-950 text-cyan-400 border-cyan-800/30",
          "high-contrast": "bg-black text-white border-white border",
          "eye-care": "bg-[#DDEBF7] text-[#1F4E79] border-[#B4C6E7]",
          bandwidth: "bg-neutral-200 text-black border-neutral-300"
        },
        Advanced: {
          slate: "bg-rose-950 text-rose-400 border-rose-800/30",
          "high-contrast": "bg-black text-white border-white border",
          "eye-care": "bg-[#FCE4D6] text-[#C65911] border-[#F8CBAD]",
          bandwidth: "bg-neutral-200 text-black border-neutral-300"
        }
      }[diff];

      return `${colors[prefContrast]} text-[9px] font-mono border px-2 py-0.5 rounded`;
    }
  };

  // Calculate live overall stats
  const totalDevsSignedUp = registrations.length;
  const totalBountyAwarded = registrations.reduce((acc, r) => {
    const taskObj = tasks.find(t => t.id === r.taskId);
    return acc + (taskObj?.bountyPoints || 0);
  }, 0);

  const filteredTasks = tasks.filter(
    task => filterDifficulty === "All" || task.difficulty === filterDifficulty
  );

  return (
    <div className={`p-6 rounded-2xl border ${styles.card} space-y-6 animate-entrance`}>
      
      {/* Visual Workspace Stats Header Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h4 className={`${styles.heading} text-base md:text-lg font-extrabold flex items-center gap-2`}>
            <Terminal className="w-5 h-5 text-cyan-400 shrink-0" />
            Core Taskroom space: Contributors Hub
          </h4>
          <p className={`text-xs ${styles.textMuted} mt-1`}>
            Empowering the community to build, audibly inspect, and crowdsource accessibility tooling for Kigali. Managed by lead dev <strong className="font-mono text-cyan-400">MUGABEPRINCE</strong>.
          </p>
        </div>

        {/* Dynamic Contributor Counters */}
        <div className="grid grid-cols-2 sm:flex gap-3 w-full sm:w-auto">
          <div className="p-3 sm:p-2.5 px-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center sm:shrink-0 flex flex-col justify-center">
            <span className="text-[10px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Devs Engaged</span>
            <span className={`text-sm md:text-base font-black ${styles.heading}`}>{totalDevsSignedUp} self-advocates</span>
          </div>
          <div className="p-3 sm:p-2.5 px-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center sm:shrink-0 flex flex-col justify-center">
            <span className="text-[10px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-wider block">Bounty Pool</span>
            <span className="text-sm md:text-base font-black text-emerald-400">{(totalBountyAwarded + 4500).toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Dynamic List of Available Tasks */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h5 className={`${styles.heading} text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5`}>
              <Code className="w-4 h-4 text-cyan-500" />
              Active Platform Development Task Pipeline
            </h5>
            <p className={`text-xs ${styles.textMuted} mt-1`}>
              Select one task to submit your review sign-up from the dashboard workspace.
            </p>
          </div>

          {/* Level Filter Tags Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
            {(["All", "Beginner", "Intermediate", "Advanced"] as const).map((diff) => {
              const isSelected = filterDifficulty === diff;
              const count = diff === "All" 
                ? tasks.length 
                : tasks.filter(t => t.difficulty === diff).length;

              const activeTagClasses = {
                slate: "bg-cyan-600 border-cyan-500/40 text-white font-bold shadow-md shadow-cyan-950/40",
                "high-contrast": "bg-white text-black font-black border-2 border-white",
                "eye-care": "bg-[#8B5E3C] text-[#FAF6EE] border-[#70482C] font-serif font-black",
                bandwidth: "bg-black text-white font-bold border-black"
              }[prefContrast as any] || "bg-cyan-600 text-white";

              const inactiveTagClasses = {
                slate: "bg-slate-900 border border-slate-850 text-slate-400 hover:bg-slate-800 hover:text-slate-200",
                "high-contrast": "bg-black border-2 border-white text-white hover:bg-neutral-950",
                "eye-care": "bg-[#FAF6EE] border border-[#D6C29B] text-[#65543D] hover:bg-[#F4EFE2] font-serif",
                bandwidth: "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              }[prefContrast as any] || "bg-slate-900 text-slate-400";

              const badgeClasses = isSelected
                ? "bg-black/35 text-white/95"
                : prefContrast === "eye-care"
                  ? "bg-[#D6C29B] text-[#65543D]"
                  : "bg-slate-800/80 text-slate-500";

              return (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-3.5 py-2 md:py-1 text-xs md:text-[11px] rounded-full border transition-all cursor-pointer min-h-[38px] md:min-h-[unset] flex items-center justify-center ${
                    isSelected ? activeTagClasses : inactiveTagClasses
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <span>{diff === "All" ? "All Levels" : diff}</span>
                    <span className={`text-[10px] md:text-[9px] px-2 md:px-1.5 py-0.5 rounded-full font-mono ${badgeClasses}`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-805 rounded-xl text-slate-500 text-xs">
                No active development tasks found matching the "{filterDifficulty}" level.
              </div>
            ) : (
              filteredTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => setSignupTaskId(task.id)}
                  className={`p-4 md:p-3.5 rounded-xl border transition-all text-left cursor-pointer flex flex-col justify-between gap-1.5 min-h-[85px] ${
                    signupTaskId === task.id
                      ? "bg-slate-800/60 border-cyan-500/50" 
                      : "bg-slate-900/30 border-slate-805/45 hover:bg-slate-800/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] md:text-[9.5px] font-mono text-slate-500">{task.module}</span>
                      <h6 className={`text-sm md:text-xs ${styles.heading} font-bold mt-0.5 leading-snug`}>{task.title}</h6>
                    </div>
                    <span className="text-xs md:text-xs font-mono font-bold text-amber-400 shrink-0">+{task.bountyPoints} XP</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/30 pt-2 mt-1">
                    <div className="flex gap-2">
                      <span className={styles.badgeDifficulty(task.difficulty)}>{task.difficulty}</span>
                      <span className="text-[10px] md:text-[9px] font-mono text-slate-500">🔖 #{task.id}</span>
                    </div>
                    <span className="text-[11px] md:text-[10px] font-mono text-slate-400">
                      👥 {task.signedUpCount} registered
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Interactive Sign-up Form */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className={`p-4 md:p-4 rounded-xl ${styles.cardInner} border space-y-4`}>
            <div>
              <h5 className={`${styles.heading} text-xs uppercase tracking-widest font-extrabold flex items-center gap-1`}>
                <Plus className="w-4 h-4 text-cyan-400" />
                Submit Task Sign-up
              </h5>
              <p className={`text-[11px] ${styles.textMuted} mt-0.5`}>
                Your contribution will be tagged directly to your profile.
              </p>
            </div>

            {successMsg ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 rounded-xl text-xs md:text-xs flex gap-2 items-start leading-relaxed animate-entrance">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="dev-name" className="text-[10px] uppercase font-mono tracking-wider opacity-75">Full Name / GitHub User</label>
                  <input
                    id="dev-name"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Marie-Claire Mukasanga"
                    className={`w-full px-3 py-2.5 md:py-2 rounded-lg text-base md:text-xs outline-none focus:ring-1 border min-h-[42px] md:min-h-[unset] ${styles.input}`}
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="dev-email" className="text-[10px] uppercase font-mono tracking-wider opacity-75">Work Email</label>
                  <input
                    id="dev-email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. developer@ikaze.rw"
                    className={`w-full px-3 py-2.5 md:py-2 rounded-lg text-base md:text-xs outline-none focus:ring-1 border min-h-[42px] md:min-h-[unset] ${styles.input}`}
                  />
                </div>

                {/* Level selection */}
                <div className="space-y-1.5">
                  <label htmlFor="dev-exp" className="text-[10px] uppercase font-mono tracking-wider opacity-75">Dev Experience Level</label>
                  <select
                    id="dev-exp"
                    value={signupExp}
                    onChange={(e) => setSignupExp(e.target.value)}
                    className={`w-full px-3 py-2.5 md:py-2 rounded-lg text-base md:text-xs outline-none focus:ring-1 border min-h-[42px] md:min-h-[unset] ${styles.input}`}
                  >
                    <option value="Beginner">Beginner & Universal Reviewer</option>
                    <option value="Intermediate">Intermediate Fullstack Dev</option>
                    <option value="Advanced">Advanced Engineering Fellow</option>
                  </select>
                </div>

                {/* Selected task summary */}
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 flex items-start gap-2 text-xs md:text-[10px] text-slate-400 leading-normal">
                  <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    You are signing up for task <strong>#{signupTaskId}</strong>: "
                    {tasks.find(to => to.id === signupTaskId)?.title || "Selected Task"}"
                  </span>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 md:py-2.5 rounded-lg font-bold text-sm md:text-xs mt-2 transition-all cursor-pointer select-none min-h-[44px] sm:min-h-[unset] ${styles.button}`}
                >
                  Join Task Force & Earn XP
                </button>
              </form>
            )}
          </div>

          {/* Quick List of Active Registrations (Live Feed of activity) */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">Workspace Dev Registry</span>
            <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
              {registrations.slice(0, 3).map(reg => (
                <div key={reg.id} className="p-2.5 md:p-2 rounded-lg bg-slate-950/30 border border-slate-850/45 flex items-center justify-between text-[12px] md:text-[11px] leading-tight">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-300">{reg.name} <span className="font-mono text-[10px] md:text-[9px] text-slate-500">({reg.experienceLevel})</span></p>
                    <p className="text-[11px] md:text-[10px] text-slate-400 line-clamp-1">🛠️ {reg.taskTitle}</p>
                  </div>
                  <span className="text-[10px] md:text-[9px] font-mono text-slate-500 tracking-tight shrink-0">{reg.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
