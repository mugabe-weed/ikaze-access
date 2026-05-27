import React, { useState } from "react";
import {
  Accessibility,
  Activity,
  Award,
  BarChart2,
  BookOpen,
  Briefcase,
  ChevronRight,
  Coins,
  FileText,
  HelpCircle,
  Info,
  Layers,
  LayoutDashboard,
  Lightbulb,
  ListFilter,
  LogIn,
  MapPin,
  Menu,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Sparkles,
  TrendingUp,
  X
} from "lucide-react";

import { AccessibilityPreferences, Job, Course, AssistiveDevice, UserAccount } from "./types";
import { MOCK_JOBS, MOCK_COURSES, MOCK_DEVICES, MOCK_POSTS } from "./mockData";
import { AIAssistant } from "./components/AIAssistant";
import { AccessibilityAuditor } from "./components/AccessibilityAuditor";
import { DocumentSimplifier } from "./components/DocumentSimplifier";
import { AccessibleMap } from "./components/AccessibleMap";
import { BlueprintsPanel } from "./components/BlueprintsPanel";
import { ContributorsPanel } from "./components/ContributorsPanel";
import { AuthManager } from "./components/AuthManager";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "careers" | "ai-assistant" | "web-auditor" | "simplifier" | "kigali-map" | "elearning" | "marketplace" | "analytics" | "blueprints"
  >("dashboard");

  // User Authentication & Loyalty Session state
  const [currentSession, setCurrentSession] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("ikaze_current_session");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Accessibility Options state
  const [prefContrast, setPrefContrast] = useState<"slate" | "high-contrast" | "eye-care" | "bandwidth">("slate");
  const [prefDyslexia, setPrefDyslexia] = useState(false);
  const [prefTextSize, setPrefTextSize] = useState<"standard" | "expanded" | "visionary">("standard");
  const [prefDisabilityPreset, setPrefDisabilityPreset] = useState<string>("general");
  const [prefLanguage, setPrefLanguage] = useState<string>("English");

  // Job Board States
  const [jobSearch, setJobSearch] = useState("");
  const [jobCategoryFilter, setJobCategoryFilter] = useState<string>("All");
  const [selectedJob, setSelectedJob] = useState<Job | null>(MOCK_JOBS[0]);
  const [jobApplyName, setJobApplyName] = useState("");
  const [jobApplyEmail, setJobApplyEmail] = useState("");
  const [jobApplyResumeSimulated, setJobApplyResumeSimulated] = useState<string>("my_disability_verification_resume.pdf");
  const [jobApplySuccess, setJobApplySuccess] = useState<string | null>(null);

  // E-Learning Quiz States
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [certName, setCertName] = useState("");

  // Assistive device Marketplace States
  const [cart, setCart] = useState<{ item: AssistiveDevice; quantity: number; isRental: boolean }[]>([]);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  // Sync session with simple form settings
  React.useEffect(() => {
    if (currentSession) {
      setJobApplyName(currentSession.name);
      setJobApplyEmail(currentSession.email);
      if (currentSession.prefDisabilityPreset && currentSession.prefDisabilityPreset !== "general") {
        setPrefDisabilityPreset(currentSession.prefDisabilityPreset);
      }
    } else {
      setJobApplyName("");
      setJobApplyEmail("");
    }
  }, [currentSession]);

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentSession(user);
    localStorage.setItem("ikaze_current_session", JSON.stringify(user));
  };

  const handleLogoutSuccess = () => {
    setCurrentSession(null);
    localStorage.removeItem("ikaze_current_session");
  };

  const handleUpdateProfile = (updated: UserAccount) => {
    setCurrentSession(updated);
    localStorage.setItem("ikaze_current_session", JSON.stringify(updated));
  };

  // Community State Simulation
  const [communityFeed, setCommunityFeed] = useState(MOCK_POSTS);
  const [newPostText, setNewPostText] = useState("");

  const QUIZ_QUESTIONS = [
    {
      q: "What does WCAG criterion 1.1.1 (Non-text Content) ask developers to provide for screen reader compatibility?",
      options: [
        "Inline background sound arrays",
        "Alternative text descriptions (alt attributes) for visual components",
        "Large font families on all visual structures",
        "Immediate auto-redirect buttons"
      ],
      correct: 1
    },
    {
      q: "Which element configuration ensures a keyboard-only user can successfully traverse custom layout dialogs?",
      options: [
        "Adding onmouseover javascript tags",
        "Enforcing strict focus trapping and tab-index configurations",
        "Wrapping components in background video containers",
        "Enabling dark contrast mode exclusively"
      ],
      correct: 1
    },
    {
      q: "In what key way does the 'Plain Language mandate' empower deaf and cognitive-diverse workers?",
      options: [
        "By replacing all text structures with complex video links exclusively",
        "By translating dense, multi-clause paragraphs into simple, direct bullet descriptions",
        "By adding complex Latin legal terminology on form headers",
        "By enforcing mandatory voice controls on all buttons"
      ],
      correct: 1
    }
  ];

  // Cart operations
  const addToCart = (device: AssistiveDevice, isRental: boolean) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === device.id && i.isRental === isRental);
      if (existing) {
        return prev.map(i => i.item.id === device.id && i.isRental === isRental ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item: device, quantity: 1, isRental }];
    });
  };

  const removeFromCart = (id: string, isRental: boolean) => {
    setCart(prev => prev.filter(i => !(i.item.id === id && i.isRental === isRental)));
  };

  const calculateTotal = () => {
    return cart.reduce((total, entry) => {
      const rate = entry.isRental ? (entry.item.rentalPricePerMonth || 5000) : entry.item.price;
      return total + (rate * entry.quantity);
    }, 0);
  };

  const executeCheckout = () => {
    setIsCheckoutSuccess(true);
    setTimeout(() => {
      setCart([]);
      setIsCheckoutSuccess(false);
    }, 4500);
  };

  // Job Submission Handler
  const handleApplyJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobApplyName.trim() || !jobApplyEmail.trim()) {
      alert("Please fill out your full name and email to proceed.");
      return;
    }
    if (currentSession && selectedJob) {
      const updatedSession: UserAccount = {
        ...currentSession,
        appliedJobs: currentSession.appliedJobs.includes(selectedJob.id)
          ? currentSession.appliedJobs
          : [...currentSession.appliedJobs, selectedJob.id],
        xpPoints: currentSession.xpPoints + 150
      };
      handleUpdateProfile(updatedSession);
      setJobApplySuccess(`Application submitted to ${selectedJob.company} for "${selectedJob.title}"! Attached verified Adaptability Profile: "${currentSession.prefDisabilityPreset || "general"}". +150 XP awarded!`);
    } else {
      setJobApplySuccess(`Application submitted to ${selectedJob?.company} for the "${selectedJob?.title}" position! They are committed to disability-inclusive interviewing.`);
    }
    setTimeout(() => {
      setJobApplySuccess(null);
      if (!currentSession) {
        setJobApplyName("");
        setJobApplyEmail("");
      }
    }, 5000);
  };

  const handleOneClickApply = (jobId: string) => {
    if (!currentSession) return;
    const targetJob = MOCK_JOBS.find(j => j.id === jobId);
    if (!targetJob) return;

    const updatedSession: UserAccount = {
      ...currentSession,
      appliedJobs: currentSession.appliedJobs.includes(jobId)
        ? currentSession.appliedJobs
        : [...currentSession.appliedJobs, jobId],
      xpPoints: currentSession.xpPoints + 150
    };
    handleUpdateProfile(updatedSession);
    setJobApplySuccess(`Applied instantly to ${targetJob.company}! Verified profile ("${currentSession.prefDisabilityPreset || "general"}") successfully attached. +150 XP loyalty reward added.`);
    setTimeout(() => {
      setJobApplySuccess(null);
    }, 5000);
  };

  // E-learning Quiz Handler
  const handleAnswerQuiz = (optionIdx: number) => {
    const updated = [...quizAnswers, optionIdx];
    setQuizAnswers(updated);
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      // Calculate Score
      let correctCount = 0;
      updated.forEach((ans, idx) => {
        if (ans === QUIZ_QUESTIONS[idx].correct) correctCount++;
      });
      setQuizScore(Math.round((correctCount / QUIZ_QUESTIONS.length) * 100));
    }
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizAnswers([]);
    setQuizScore(null);
    setCertName("");
  };

  // Community Post Handler
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const item = {
      id: "post-" + Date.now(),
      author: "Marie-Claire U.",
      avatar: "MU",
      authorRole: "Self-Advocate" as const,
      content: newPostText,
      likes: 1,
      comments: 0,
      timestamp: "Just now",
      category: "General Chat" as const
    };
    setCommunityFeed([item, ...communityFeed]);
    setNewPostText("");
  };

  // Visual text scale bindings
  const sizeClasses = {
    standard: "text-base",
    expanded: "text-lg",
    visionary: "text-xl"
  };

  const headingSizeClasses = {
    standard: "text-2xl",
    expanded: "text-3xl",
    visionary: "text-4xl"
  };

  // Themes mapping
  const activeBg = {
    slate: "bg-slate-900 border-slate-800 text-slate-100",
    "high-contrast": "bg-black border-white text-white border-2",
    "eye-care": "bg-[#FAF6EE] border-[#D6C29B] text-[#1E1E1E]",
    bandwidth: "bg-neutral-50 border-neutral-300 text-black font-sans"
  };

  const activeCard = {
    slate: "bg-slate-950/80 border-slate-805 text-slate-100",
    "high-contrast": "bg-black border-white border-2 text-white",
    "eye-care": "bg-[#F4EFE2] border-[#E2D6B5] text-[#2B2B2B]",
    bandwidth: "bg-white border-black text-black"
  };

  const inlineText = {
    slate: "text-slate-400 font-sans",
    "high-contrast": "text-yellow-400 font-bold font-mono",
    "eye-care": "text-[#65543D] font-serif",
    bandwidth: "text-neutral-700"
  };

  const headingText = {
    slate: "text-white font-sans tracking-tight font-bold",
    "high-contrast": "text-white font-mono uppercase font-black",
    "eye-care": "text-[#3D2C1C] font-serif font-black",
    bandwidth: "text-black font-sans font-bold"
  };

  const brandAccent = {
    slate: "bg-cyan-600 hover:bg-cyan-550 text-white",
    "high-contrast": "bg-white hover:bg-yellow-400 text-black border-2 border-white",
    "eye-care": "bg-[#8B5E3C] hover:bg-[#70482C] text-[#FAF6EE]",
    bandwidth: "bg-black hover:bg-neutral-800 text-white"
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-all duration-300 ${activeBg[prefContrast]} ${
        prefDyslexia ? "dyslexia-spacing font-mono text-cyan-200" : ""
      } ${sizeClasses[prefTextSize]}`}
    >
      {/* Structural Accessible Skip-link */}
      <a
        href="#main-portal-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold font-mono z-50 ring-4 ring-black"
      >
        Skip directly to Main Platform Content
      </a>

      {/* Persistent Visual Announcement */}
      {prefContrast === "bandwidth" && (
        <div className="bg-neutral-200 text-black p-2 text-xs font-semibold text-center border-b border-neutral-300">
          ⚡ Low Bandwidth Data Saving Mode Active: Zero gradients or animation rendering overheads.
        </div>
      )}

      {/* Core Layout Header */}
      <header className={`border-b ${prefContrast === "high-contrast" ? "border-white border-b-4" : "border-slate-805"} transition-colors shrink-0`}>
        <div className="max-w-7xl mx-auto px-4 py-4.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              prefContrast === 'high-contrast' ? 'bg-white border-2 border-black text-black' : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
            }`}>
              <Accessibility className="w-6 h-6" id="brand-logo" />
            </div>
            <div>
              <h1 className={`${headingText[prefContrast]} text-xl md:text-2xl flex flex-wrap items-center gap-1.5`}>
                IKAZE ACCESS
                <span className="text-[10px] font-mono tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full uppercase">
                  Empowerment Hub
                </span>
                <span className="text-[10px] font-mono tracking-wider bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full uppercase">
                  Dev: MUGABEPRINCE
                </span>
              </h1>
              <p className={`text-xs ${inlineText[prefContrast]}`}>Disability Digital Operating System & Career Accelerator</p>
            </div>
          </div>

          {/* Quick-toggle settings toolbar */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-950/40 p-2.5 rounded-2xl border border-slate-805/45">
            {/* Contrast Theme Selector */}
            <div className="flex items-center space-x-1.5">
              <label htmlFor="pref-theme" className="text-[10px] font-mono opacity-75">Theme:</label>
              <select
                id="pref-theme"
                value={prefContrast}
                onChange={(e: any) => setPrefContrast(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded p-1 text-xs text-slate-200 outline-none"
              >
                <option value="slate">Slate Cosmic</option>
                <option value="high-contrast">🪟 High Contrast</option>
                <option value="eye-care">📖 Eye-Care Warm</option>
                <option value="bandwidth">⚡ Low Bandwidth</option>
              </select>
            </div>

            {/* Font dyslexia mode */}
            <button
              onClick={() => setPrefDyslexia(!prefDyslexia)}
              aria-label="Toggle Dyslexia spacing adjustments"
              className={`p-1 px-2.5 rounded text-xs transition-colors cursor-pointer ${
                prefDyslexia ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-400"
              }`}
            >
              📖 OpenDyslexic Spacing
            </button>

            {/* Text Scale Controller */}
            <div className="flex items-center space-x-1.5">
              <label htmlFor="pref-size" className="text-[10px] font-mono opacity-75">Text size:</label>
              <select
                id="pref-size"
                value={prefTextSize}
                onChange={(e: any) => setPrefTextSize(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded p-1 text-xs text-slate-200 outline-none"
              >
                <option value="standard">Standard</option>
                <option value="expanded">Expanded</option>
                <option value="visionary">Visionary Large</option>
              </select>
            </div>

            {/* Target Disability Context (for conversational coaching) */}
            <div className="flex items-center space-x-1.5">
              <label htmlFor="pref-dis" className="text-[10px] font-mono opacity-75">My Profile Presets:</label>
              <select
                id="pref-dis"
                value={prefDisabilityPreset}
                onChange={(e) => setPrefDisabilityPreset(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded p-1 text-xs text-slate-200 outline-none"
              >
                <option value="general">Select Seeker Mode</option>
                <option value="blind">Visually Impaired / Blind Seeker</option>
                <option value="deaf">Deaf / Hard of Hearing Seeker</option>
                <option value="neurodiverse">Neurodiverse (ADHD, Autism)</option>
                <option value="motor">Wheelchair / Motor Disabled Seeker</option>
                <option value="dyslexic">Dyslexic Reader</option>
              </select>
            </div>

            {/* User Session Profile / Authentication Trigger */}
            <div className="flex items-center pl-1.5 border-l border-slate-700/40">
              {currentSession ? (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  id="header-profile-btn"
                  title="View achievements, loyalty XP and change accessibility needs"
                  className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-500/50 rounded-lg py-1 px-2 text-xs text-slate-100 font-bold transition-all cursor-pointer shadow-sm"
                >
                  <span className="text-sm shrink-0 leading-none">{currentSession.avatar}</span>
                  <span className="max-w-[80px] truncate hidden sm:inline leading-none">{currentSession.name.split(" ")[0]}</span>
                  <span className="bg-amber-950 text-amber-400 border border-amber-800/30 px-1.5 py-0.5 rounded text-[9.5px] font-mono shrink-0 leading-none">
                    {currentSession.xpPoints} XP
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  id="header-signin-btn"
                  className="flex items-center gap-1.5 bg-cyan-950/70 border border-cyan-800/40 hover:border-cyan-500/60 hover:bg-cyan-950/90 text-cyan-400 rounded-lg py-1 px-2 px-3 text-xs font-bold cursor-pointer transition-all leading-none"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Main Structural Layout Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8" id="main-portal-content">
        
        {/* Navigation Landmarks Sidebar */}
        <nav aria-label="Ecosystem Directory Navigation" className="lg:col-span-3 space-y-2 shrink-0">
          <p className="text-[10px] font-mono uppercase text-slate-500 tracking-widest px-3 mb-2">Primary Modules</p>
          {[
            { id: "dashboard", label: "Overview Dashboard", icon: LayoutDashboard },
            { id: "careers", label: "Inclusive Job Board", icon: Briefcase },
            { id: "ai-assistant", label: "AI Accessibility Assistant", icon: Sparkles },
            { id: "web-auditor", label: "WCAG Audit SaaS tool", icon: ShieldCheck },
            { id: "simplifier", label: "Plain Text Simplifier", icon: FileText },
            { id: "kigali-map", label: "Crowdsourced Kigali Map", icon: MapPin },
            { id: "elearning", label: "Accessible E-Learning", icon: BookOpen },
            { id: "marketplace", label: "Assistive Device Market", icon: ShoppingBag },
            { id: "analytics", label: "Government Analytics", icon: BarChart2 },
            { id: "blueprints", label: "Platform Deep Blueprints", icon: Layers }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                aria-current={isTabActive ? "page" : undefined}
                className={`w-full p-3.5 py-4 rounded-xl text-left font-semibold text-xs transition-all flex items-center justify-between cursor-pointer group ${
                  isTabActive
                    ? prefContrast === "high-contrast" 
                      ? "bg-white text-black high-contrast-border font-black" 
                      : "bg-cyan-600 font-bold text-white shadow-lg shadow-cyan-900/10"
                    : prefContrast === "eye-care"
                      ? "bg-[#FAF6EE] text-[#65543D] hover:bg-[#F4EFE2] border border-[#E2D6B5]"
                      : "bg-slate-900/50 hover:bg-slate-805/45 border border-slate-805/35 text-slate-400"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <TabIcon className={`w-4 h-4 shrink-0 transition-transform ${isTabActive ? "text-white" : "text-slate-500 group-hover:text-cyan-400"}`} />
                  <span>{tab.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isTabActive ? "translate-x-0.5 text-white" : "text-slate-600 opacity-0 group-hover:opacity-100"}`} />
              </button>
            );
          })}

          <div className={`mt-8 p-4.5 rounded-2xl border ${activeCard[prefContrast]} text-sm space-y-3`}>
            <p className="font-bold text-xs flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Quick Preset Guide
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Set Seeker Mode at the top bar to immediately tailor content. Selecting 'Dyslexic Reader' or 'Visually Impaired' unlocks assistive support.
            </p>
          </div>
        </nav>

        {/* Action Window Main Area */}
        <main className="lg:col-span-9 space-y-8 min-h-[400px]">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <section className="space-y-6 animate-entrance" aria-labelledby="overview-title">
              {/* Introduction Card */}
              <div className={`p-6 md:p-8 rounded-2xl border ${activeCard[prefContrast]} relative overflow-hidden flex flex-col justify-between min-h-[180px]`}>
                <div>
                  <h3 id="overview-title" className={`${headingText[prefContrast]} text-xl md:text-3xl font-extrabold tracking-tight mb-2.5 leading-tight`}>
                    Welcome to Ikaze Access
                  </h3>
                  <p className="text-xs md:text-sm text-slate-400 max-w-2xl leading-relaxed">
                    Designed and built as Rwanda's first tech-driven disability digital operating system. This is an integrated social impact venture where people with disabilities monetize their cognitive skills, and corporations acquire top inclusive talent.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-3 py-1 rounded-full border border-cyan-800">
                    📍 Live Pilot: Gasabo, Kigali
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800">
                    📈 Growth Plan: Continental Scale
                  </span>
                </div>
              </div>

              {/* Economic KPI Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Empowered Seekers", value: "12,480", detail: "Registered seekers", icon: Accessibility, color: "text-cyan-400" },
                  { title: "Remote Gigs Completed", value: "1,842", detail: "Completed this month", icon: Briefcase, color: "text-indigo-400" },
                  { title: "Seekers Distributed Fees", value: "412.5M RWF", detail: "Wages distributed", icon: Coins, color: "text-emerald-400" },
                  { title: "SaaS Audited Sites", value: "84 Partners", detail: "WCAG audited sites", icon: Award, color: "text-amber-400 animate-pulse" }
                ].map((m, index) => {
                  const Icon = m.icon;
                  return (
                    <div key={index} className={`p-4 rounded-xl border ${activeCard[prefContrast]} flex flex-col justify-between min-h-[100px]`}>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] font-mono uppercase text-slate-400">{m.title}</span>
                        <Icon className={`w-4 h-4 ${m.color}`} />
                      </div>
                      <div>
                        <p className={`text-lg md:text-xl font-black ${headingText[prefContrast]} leading-dense mt-2`}>{m.value}</p>
                        <p className="text-[10px] text-slate-500">{m.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Logged-In Applications Status Dashboard Panel */}
              {currentSession && (
                <div className={`p-5 rounded-2xl border ${activeCard[prefContrast]} space-y-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-805/45 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800 animate-pulse">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">My Inclusive Job Applications</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Automated status tracking with your Adaptability Profile attached.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900 px-2.5 py-1 rounded-full uppercase">
                         👤 Profile: {currentSession.prefDisabilityPreset || "general"}
                       </span>
                    </div>
                  </div>

                  {currentSession.appliedJobs.length === 0 ? (
                    <div className="py-6 text-center text-slate-500 text-xs italic">
                      You haven't applied to any jobs yet. Visit the{" "}
                      <button
                        onClick={() => setActiveTab("careers")}
                        className="text-cyan-400 font-bold hover:underline cursor-pointer"
                      >
                        Inclusive Job Board
                      </button>{" "}
                      to apply instantly with 1-click!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {currentSession.appliedJobs.map((jobId) => {
                        const job = MOCK_JOBS.find((j) => j.id === jobId);
                        
                        const statusPresets: Record<string, { label: string; text: string; border: string; bg: string; description: string }> = {
                          "job-1": {
                            label: "Interview Scheduled",
                            text: "text-indigo-400",
                            border: "border-indigo-900/60",
                            bg: "bg-indigo-950/45",
                            description: "Corporate remote technical interview with live speech accessibility tools validated."
                          },
                          "job-2": {
                            label: "Screening Match Audit (98%)",
                            text: "text-amber-400",
                            border: "border-amber-900/60",
                            bg: "bg-amber-950/45",
                            description: "Initial Kinyarwanda/English text-matching verification check passed. High-scoring fit."
                          },
                          "job-3": {
                            label: "Accommodations Ready",
                            text: "text-emerald-400",
                            border: "border-emerald-950/60",
                            bg: "bg-emerald-950/45",
                            description: "Workspace visual tools & flexible scheduling guarantees approved by corporate client."
                          },
                          "job-4": {
                            label: "Match Pending",
                            text: "text-cyan-400",
                            border: "border-cyan-900/60",
                            bg: "bg-cyan-950/45",
                            description: "Adaptability Profile is attached. Technical team is reviewing ARIA recommendations report."
                          },
                          "job-5": {
                            label: "Passed Initial Match",
                            text: "text-teal-400",
                            border: "border-teal-900/60",
                            bg: "bg-teal-950/45",
                            description: "Physical ramp accessibility and keyboard configurations confirmed ready on-site."
                          }
                        };

                        const currentStatus = statusPresets[jobId] || {
                          label: "Verified & Profile Attached",
                          text: "text-emerald-400",
                          border: "border-emerald-950/60",
                          bg: "bg-emerald-950/45",
                          description: "Your inclusive profile credentials have been safely attached and submitted."
                        };

                        return (
                          <div
                            key={jobId}
                            className={`p-4 rounded-xl border ${currentStatus.border} bg-slate-950/30 text-xs flex flex-col justify-between space-y-3 hover:border-cyan-500/20 transition-all`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-slate-200 block truncate leading-tight">{job?.title || "Inclusive Contractor"}</span>
                                <span className={`shrink-0 text-[9.5px] font-mono border px-2 py-0.5 rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
                                  ● {currentStatus.label}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-450 block">{job?.company || "Disability-Inclusive Org"}</span>
                              <p className="text-[11px] text-slate-500 leading-normal">{currentStatus.description}</p>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-900/40 pt-2 shrink-0 font-mono">
                              <span>📁 Profile Attached</span>
                              <span>Match: 95%+</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Dual Column Portal Info & Interactive Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Visual Statistics Dashboard Box */}
                <div className={`md:col-span-2 p-5 rounded-xl border ${activeCard[prefContrast]} space-y-4 flex flex-col justify-between`}>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2 tracking-wide">Inclusive Economic Growth Dashboard</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Rwandan disability demographic workforce participation rates compiled across the three Kigali districts: Gasabo, Kicukiro, and Nyarugenge.
                    </p>

                    {/* Simple dynamic SVG visual data bar graphs to demonstrate d3/recharts layout */}
                    <div className="space-y-4 font-mono text-[11px]">
                      <div>
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span>Gasabo District Workforce</span>
                          <span className="text-cyan-400 font-bold">42% (Target: 50%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: "42%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span>Kicukiro District Digitization</span>
                          <span className="text-indigo-400 font-bold">58% (Target: 60%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: "58%" }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-slate-400 mb-1">
                          <span>Nyarugenge District Transit Ramps</span>
                          <span className="text-emerald-400 font-bold">71% (Target: 80%)</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: "71%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-500">
                    <span>Source: National Council of Persons with Disabilities</span>
                    <button onClick={() => setActiveTab("analytics")} className="text-cyan-400 font-bold hover:underline">View Analytics</button>
                  </div>
                </div>

                {/* Community Forum Side Panel */}
                <div className={`p-5 rounded-xl border ${activeCard[prefContrast]} flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-white tracking-widest uppercase">Ecosystem Feed</h4>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    </div>

                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                      {communityFeed.slice(0, 2).map((post) => (
                        <div key={post.id} className="p-3 bg-slate-900 border border-slate-805/45 rounded-xl space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono text-[9px] flex items-center justify-center border border-cyan-800">
                              {post.avatar}
                            </span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-200 leading-none">{post.author}</p>
                              <span className="text-[8px] text-slate-500 font-mono capitalize">{post.authorRole}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">"{post.content}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit mini community post */}
                  <form onSubmit={handleCreatePost} className="mt-4 pt-3 border-t border-slate-850 flex gap-2">
                    <input
                      type="text"
                      value={newPostText}
                      onChange={(e) => setNewPostText(e.target.value)}
                      placeholder="Add announcement to feed..."
                      className="flex-1 bg-slate-950 border border-slate-805 rounded px-2 py-1 text-[11px] text-white outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newPostText.trim()}
                      className="p-1 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[10px] rounded cursor-pointer disabled:bg-slate-800"
                    >
                      Post
                    </button>
                  </form>
                </div>

              </div>

              {/* Contributors Stats and Dev Work Sign Up Component */}
              <ContributorsPanel prefContrast={prefContrast} />

              {/* Startup Strategic Roadmap Quick-Access Section */}
              <div className={`p-6 rounded-2xl border ${activeCard[prefContrast]} space-y-4`}>
                <h4 className="text-base font-bold text-white tracking-wide">Recommended Pilot Milestones</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Stage 1: Launch Kigali Pilot", desc: "Form recruitment pipelines with local employers like RDB, Irembo and Bank of Kigali.", status: "In Progress" },
                    { title: "Stage 2: Expand SaaS Validation", desc: "Roll out compliance scraper API suite and auto-crawl tools to local tech sectors.", status: "Upcoming" },
                    { title: "Stage 3: Sub-Saharan Growth", desc: "Federate logistics and custom assistive hardware distributions into Kenya & Uganda.", status: "Planned" }
                  ].map((st, i) => (
                    <div key={i} className="p-4 bg-slate-950/45 border border-slate-855 rounded-xl relative">
                      <span className="absolute top-3 right-3 text-[8px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                        {st.status}
                      </span>
                      <h5 className="font-bold text-xs text-slate-200 mt-2 mb-1">{st.title}</h5>
                      <p className="text-[11px] text-slate-400 leading-normal">{st.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: INCLUSIVE JOBS DIRECTORY */}
          {activeTab === "careers" && (
            <section className="space-y-6 animate-entrance" aria-labelledby="jobs-title">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 id="jobs-title" className={`${headingText[prefContrast]} text-lg font-bold flex items-center gap-1.5`}>
                    <Briefcase className="w-5 h-5 text-cyan-400" />
                    Inclusive Remote & Freelance Directory
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Every corporate client in our pipeline has verified physical and visual accessibility parameters.
                  </p>
                </div>

                {/* Categories Filter list tags */}
                <div className="flex flex-wrap gap-1.5 shrink-0">
                  {["All", "Accessibility Testing", "AI Microtask", "Remote Job"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setJobCategoryFilter(cat)}
                      className={`px-3 py-1 font-semibold text-[11px] rounded-full transition-all cursor-pointer ${
                        jobCategoryFilter === cat 
                          ? "bg-cyan-600 font-bold text-white shadow-md shadow-cyan-900/10" 
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyword Search Section */}
              <div className="relative flex items-center shrink-0">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Search inclusive jobs by tech criteria, titles, or tags..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              {/* Jobs Board Splits Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual List Section */}
                <div className="lg:col-span-6 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {MOCK_JOBS
                    .filter((job) => jobCategoryFilter === "All" || job.category === jobCategoryFilter)
                    .filter((job) => job.title.toLowerCase().includes(jobSearch.toLowerCase()) || job.company.toLowerCase().includes(jobSearch.toLowerCase()))
                    .map((job) => {
                      const isSelected = selectedJob?.id === job.id;
                      return (
                        <button
                          key={job.id}
                          onClick={() => {
                            setSelectedJob(job);
                            setJobApplySuccess(null);
                          }}
                          className={`p-4.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                            isSelected 
                              ? "bg-slate-800 border-cyan-500/50 text-white" 
                              : "bg-slate-900/50 border-slate-805 text-slate-400 hover:bg-slate-800/30"
                          }`}
                        >
                          <div className="flex items-start justify-between w-full">
                            <div>
                              <p className="font-bold text-sm tracking-tight">{job.title}</p>
                              <p className="text-xs text-slate-400 font-medium">{job.company}</p>
                            </div>
                            {isSelected && <span className="text-[8px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded uppercase font-mono">Viewing</span>}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded text-cyan-400">
                              {job.category}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">{job.salary}</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-1">
                            {job.disabilityFriendlyTicks.map((t, idx) => (
                              <span key={idx} className="text-[9px] rounded bg-teal-950/40 text-teal-400 px-2 py-0.5 border border-teal-800/30">
                                ♿ {t}
                              </span>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                </div>

                {/* Dynamic application Drawer Details panel */}
                <div className="lg:col-span-6">
                  {selectedJob ? (
                    <div className={`p-5 rounded-xl border ${activeCard[prefContrast]} space-y-4`}>
                      <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-800">
                            {selectedJob.category}
                          </span>
                          <h4 className="text-base font-bold text-white mt-2 leading-snug">{selectedJob.title}</h4>
                          <p className="text-xs text-slate-400 font-medium">{selectedJob.company} — {selectedJob.location}</p>
                        </div>
                        <span className="text-xs font-mono text-emerald-400 font-bold">{selectedJob.salary}</span>
                      </div>

                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Scope of work</span>
                        <p className="text-xs text-slate-350 leading-relaxed font-sans">{selectedJob.description}</p>
                      </div>

                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Core Requirements</span>
                        <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-400 leading-relaxed font-sans">
                          {selectedJob.requirements.map((req, idx) => (
                            <li key={idx}>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Apply pipeline form */}
                      <div className="pt-4 border-t border-slate-850">
                        {currentSession ? (
                          currentSession.appliedJobs.includes(selectedJob.id) ? (
                            <div className="p-4 bg-slate-950/80 border border-teal-800/60 rounded-xl space-y-3">
                              <div className="flex items-center gap-2 text-teal-400">
                                <ShieldCheck className="w-5 h-5 shrink-0" />
                                <span className="font-bold text-xs uppercase tracking-wider font-mono">Application Status: In Review Match</span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                Your **{currentSession.prefDisabilityPreset || "general"}** Adaptability Profile is permanently attached & validated. Remote employer HR team is auditing accessibility needs.
                              </p>
                              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-805 flex items-center justify-between text-xs">
                                <span className="text-[10px] font-mono text-slate-500">Distributors Tracker Status:</span>
                                <span className="text-[11.5px] font-mono text-cyan-400 px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/40 rounded">
                                  {selectedJob.id === "job-1" ? "Interview Scheduled" : selectedJob.id === "job-2" ? "Screening Match Review (98%)" : "Verified & Profile Attached"}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4.5 bg-cyan-950/10 border border-cyan-800/35 rounded-xl space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="text-[9.5px] font-mono uppercase tracking-widest text-cyan-400 block font-bold">Accelerated Inclusive Applying</span>
                                  <p className="text-xs text-white mt-1 font-bold font-sans">Apply with 1-Click as: {currentSession.name}</p>
                                </div>
                                <span className="text-2xl shrink-0">{currentSession.avatar}</span>
                              </div>
                              
                              <div className="space-y-1 text-[11px] text-slate-400 font-sans">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-emerald-450 font-bold">✓</span>
                                  <span>Pre-attaching profile: <strong>{currentSession.prefDisabilityPreset || "general"}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-emerald-450 font-bold">✓</span>
                                  <span>Uploading verified resume: <strong>{jobApplyResumeSimulated}</strong></span>
                                </div>
                              </div>

                              {jobApplySuccess ? (
                                <div className="p-3 bg-teal-950 border border-teal-850 text-teal-300 rounded-xl text-xs flex gap-1.5 items-center leading-relaxed">
                                  <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                                  <span>{jobApplySuccess}</span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleOneClickApply(selectedJob.id)}
                                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg shadow-lg hover:shadow-cyan-900/40 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0 animate-pulse" />
                                  <span>Apply Instantly with Adaptability Profile (+150 XP)</span>
                                </button>
                              )}
                            </div>
                          )
                        ) : (
                          <div className="space-y-4">
                            {/* Call to action for quick single click applies */}
                            <div className="p-3 bg-slate-950/60 border border-slate-805 rounded-xl flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 font-mono text-xs flex items-center justify-center border border-cyan-800">
                                  ✨
                                </div>
                                <div>
                                  <p className="font-bold text-white leading-tight">1-Click Fast Applying Available</p>
                                  <p className="text-[10px] text-slate-500">Sign in to attach your Adaptability Profile instantly.</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setIsAuthOpen(true)}
                                className="px-3 py-1.5 bg-cyan-950/80 border border-cyan-800/60 hover:border-cyan-500/50 text-cyan-400 font-bold text-[10px] rounded cursor-pointer transition-all shrink-0"
                              >
                                Sign In
                              </button>
                            </div>

                            {jobApplySuccess ? (
                              <div className="p-3 bg-teal-950/90 border border-teal-850/60 text-teal-300 rounded-xl text-xs flex gap-1.5 items-center leading-relaxed">
                                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                                <span>{jobApplySuccess}</span>
                              </div>
                            ) : (
                              <form onSubmit={handleApplyJob} className="space-y-3">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Submit Inclusive Quick Application</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    required
                                    value={jobApplyName}
                                    onChange={(e) => setJobApplyName(e.target.value)}
                                    placeholder="Your Full Name"
                                    className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
                                  />
                                  <input
                                    type="email"
                                    required
                                    value={jobApplyEmail}
                                    onChange={(e) => setJobApplyEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-lg text-white text-xs outline-none focus:ring-1 focus:ring-cyan-500 font-sans"
                                  />
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-slate-500 bg-slate-950/50 p-2 rounded-lg border border-slate-805/45">
                                  <span className="flex items-center gap-1">📁 Auto Attached CV: <span className="font-mono text-cyan-400">{jobApplyResumeSimulated}</span></span>
                                  <button type="button" onClick={() => alert("Simulated: Custom PDF uploaded")} className="text-cyan-400 hover:underline">Change File</button>
                                </div>
                                <button
                                  type="submit"
                                  className="w-full py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-555 hover:to-indigo-555 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer"
                                >
                                  Submit verified application
                                </button>
                              </form>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                      Select a job from the directory folder to apply.
                    </div>
                  )}
                </div>

              </div>
            </section>
          )}

          {/* TAB 3: AI ACCESSIBILITY ASSISTANT */}
          {activeTab === "ai-assistant" && (
            <section className="space-y-4 animate-entrance">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <h3 className="text-base font-bold text-white tracking-tight mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  AI Accessibility & Career Assistant
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Direct connection proxy running on our Express secure backend services, leveraging the <span className="text-cyan-400 font-semibold font-mono">gemini-3.5-flash</span> model. Adjust your profile preset parameters on the top bar to tailor advice. Toggle speech synthesis below.
                </p>
              </div>

              {/* Injected component */}
              <AIAssistant disabilityType={prefDisabilityPreset} userLanguage={prefLanguage} />
            </section>
          )}

          {/* TAB 4: WCAG DEVELOPER AUDITING SaaS TOOL */}
          {activeTab === "web-auditor" && (
            <section className="space-y-4 animate-entrance">
              {/* Injected component */}
              <AccessibilityAuditor />
            </section>
          )}

          {/* TAB 5: PLAIN LANGUAGE & COGNITIVE SIMPLIFIER */}
          {activeTab === "simplifier" && (
            <section className="space-y-4 animate-entrance">
              {/* Injected component */}
              <DocumentSimplifier />
            </section>
          )}

          {/* TAB 6: KIGALI ACCESSIBLE MAP DIRECTORY */}
          {activeTab === "kigali-map" && (
            <section className="space-y-4 animate-entrance">
              {/* Injected component */}
              <AccessibleMap />
            </section>
          )}

          {/* TAB 7: ACCESSIBLE E-LEARNING */}
          {activeTab === "elearning" && (
            <section className="space-y-6 animate-entrance" aria-labelledby="academic-title">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <h3 id="academic-title" className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  Accessible Educational Curriculum
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enhance your digital independence and learn technical testing skills certified by the National Board.
                </p>
              </div>

              {/* Grid courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_COURSES.map((course) => (
                  <div key={course.id} className={`p-5 rounded-xl border ${activeCard[prefContrast]} space-y-4 flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-800">
                          {course.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-amber-400">
                          <span className="font-bold">{course.rating}</span>
                          <span className="opacity-75">★</span>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white mt-2.5 leading-snug">{course.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">Instructor: {course.instructor}</p>
                      <p className="text-xs text-slate-350 leading-relaxed mt-2.5 font-sans">{course.description}</p>

                      <div className="mt-4 pt-3 border-t border-slate-850">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Course Syllabus Outline</span>
                        <ul className="space-y-1 mt-1 font-sans text-xs text-slate-400">
                          {course.syllabus.map((syl, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                              <span>{syl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
                      <span>Lectures: {course.lectures} ({course.duration})</span>
                      <button
                        onClick={() => alert(`Simulated: Joined course "${course.title}". Check your learner dashboard. Enjoy!`)}
                        className="p-1 px-4 bg-slate-850 hover:bg-slate-800 text-cyan-400 border border-slate-805 font-bold rounded cursor-pointer transition-colors"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz and printable Certification Panel */}
              <div className={`p-6 rounded-2xl border ${activeCard[prefContrast]} space-y-5`}>
                <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white tracking-wide">Are you ready for digital independence?</h4>
                    <p className="text-xs text-slate-400">Complete this evaluation test to verify standard WCAG and remote freelance literacy.</p>
                  </div>
                  <Award className="w-8 h-8 text-amber-400 shrink-0" />
                </div>

                {quizScore !== null ? (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-805 space-y-4 text-center">
                    <p className="text-sm font-semibold text-slate-300">Test evaluation parsed successfully.</p>
                    <p className="text-2xl font-black text-emerald-400">{quizScore}% correct answers</p>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {quizScore >= 66 
                        ? "Pristine score! You qualify for the IKaze Digital Solopreneur and Website Auditor Certification." 
                        : "Almost there! We recommend reading Module 1 again before starting client projects."}
                    </p>

                    {quizScore >= 66 && (
                      <div className="space-y-3 pt-3">
                        <div className="flex flex-col gap-1.5 max-w-xs mx-auto">
                          <label htmlFor="student-name" className="text-[10px] text-slate-400 uppercase tracking-widest block">Print Name on Certificate</label>
                          <input
                            id="student-name"
                            type="text"
                            value={certName}
                            onChange={(e) => setCertName(e.target.value)}
                            placeholder="e.g. Marie-Claire Mukasanga"
                            className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-white text-xs outline-none text-center"
                          />
                        </div>
                        {certName.trim() && (
                          <div className="p-6 bg-slate-900 border-2 border-dashed border-amber-500/40 rounded-xl max-w-md mx-auto relative overflow-hidden animate-entrance">
                            <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-400 text-[8px] font-mono px-3 py-1 rounded-bl border-l border-b border-amber-500/25 uppercase">Official Seal</div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B5945A] block">Digital Independence Fellowship</span>
                            <h5 className="text-sm font-serif font-bold text-white mt-2">IKaze Web Audit & Solopreneur Certificate</h5>
                            <p className="text-xs text-slate-400 mt-2">This certifies that</p>
                            <p className="text-lg font-serif font-bold text-amber-300 mt-1 capitalize">{certName}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-3">VERIFICATION NODE: #KIG-FELL-924-AA • 2026-05-27</p>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={resetQuiz}
                      className="p-1.5 px-6 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs rounded transition-colors cursor-pointer mt-2"
                    >
                      Reset Evaluation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
                    </p>
                    <p className="text-sm font-semibold text-slate-200 leading-snug">
                      {QUIZ_QUESTIONS[quizIndex].q}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {QUIZ_QUESTIONS[quizIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerQuiz(idx)}
                          className="p-3 bg-slate-950 border border-slate-805 hover:bg-slate-800 text-left text-xs rounded-xl cursor-pointer text-slate-300 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* TAB 8: ASSISTIVE DIGITAL DEVICES MARKETPLACE */}
          {activeTab === "marketplace" && (
            <section className="space-y-6 animate-entrance" aria-labelledby="marketplace-title">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <h3 id="marketplace-title" className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <ShoppingBag className="w-5 h-5 text-cyan-400" />
                  Assistive Devices & Smart Hardware Marketplace
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  We assembly and maintain precision hardware inside Rwanda. Rent sensory components or buy digital software directly.
                </p>
              </div>

              {/* Checkout success */}
              {isCheckoutSuccess && (
                <div className="p-4 bg-teal-950 border border-teal-850 text-teal-300 rounded-xl text-xs space-y-2 animate-entrance leading-relaxed">
                  <span className="font-bold block text-sm text-teal-400">Device Checkout Finalized!</span>
                  <p>Our secure mobile money API linked with MTN Mobile Money and Airtel Money has processed the transactions. Kigali courier repair division has logged delivery schedules.</p>
                </div>
              )}

              {/* Shopping section splits */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Catalog items lists grid */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MOCK_DEVICES.map((dev) => (
                    <div key={dev.id} className={`p-4 rounded-xl border ${activeCard[prefContrast]} flex flex-col justify-between`}>
                      <div>
                        {/* Image banner with alt descriptive text inside */}
                        <div className="w-full h-32 rounded-lg bg-slate-950 overflow-hidden relative border border-slate-805/45 mb-3.5">
                          <img
                            src={dev.image}
                            alt=""
                            className="w-full h-full object-cover opacity-80"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-slate-950/80 px-2 py-0.5 rounded text-cyan-400">
                            {dev.category}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-100 line-clamp-1">{dev.name}</h4>
                          <span className="text-[11px] font-mono text-cyan-450 font-bold ml-1">{dev.price.toLocaleString()} RWF</span>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1.5 leading-normal">{dev.description}</p>
                      </div>

                      {/* Buy triggers */}
                      <div className="mt-4 pt-3 border-t border-slate-850 flex gap-1.5">
                        <button
                          onClick={() => addToCart(dev, false)}
                          className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-555 text-white font-bold text-[10px] rounded cursor-pointer transition-colors"
                        >
                          Buy Outright
                        </button>
                        {dev.isRentalAvailable && (
                          <button
                            onClick={() => addToCart(dev, true)}
                            className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-705 text-cyan-400 border border-slate-805 font-bold text-[10px] rounded cursor-pointer transition-colors"
                          >
                            Lease lease ({dev.rentalPricePerMonth?.toLocaleString()} RWF/Mo)
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shopping Cart checkout pane */}
                <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[360px]">
                  <div>
                    <div className="border-b border-slate-800 pb-3 mb-4">
                      <h4 className="text-xs font-bold text-white tracking-widest uppercase">Purchase Escrow Basket</h4>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {cart.map((entry, index) => {
                        const rate = entry.isRental ? (entry.item.rentalPricePerMonth || 5000) : entry.item.price;
                        return (
                          <div key={index} className="p-3 bg-slate-950/60 border border-slate-805 rounded-xl space-y-1 text-xs">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-200 leading-tight">{entry.item.name}</h5>
                                <span className="text-[9px] font-mono opacity-70">
                                  {entry.isRental ? "Lease lease Monthly" : "Outright Purchase"} • Qty: {entry.quantity}
                                </span>
                              </div>
                              <button
                                onClick={() => removeFromCart(entry.item.id, entry.isRental)}
                                className="text-red-400 hover:text-red-350 text-[10px]"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="text-right text-[11px] text-slate-350 font-mono font-bold">
                              {(rate * entry.quantity).toLocaleString()} RWF
                            </div>
                          </div>
                        );
                      })}

                      {cart.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-12 font-mono">Cart is empty.</p>
                      )}
                    </div>
                  </div>

                  {cart.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-850 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Cumulative:</span>
                        <span className="font-bold font-mono text-white text-base">{calculateTotal().toLocaleString()} RWF</span>
                      </div>
                      <button
                        onClick={executeCheckout}
                        className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-555 hover:to-teal-555 text-white font-bold text-xs rounded-lg shadow"
                      >
                        Checkout Order using MoMo Pay
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </section>
          )}

          {/* TAB 9: GOVERNMENT & NGO ANALYTICS REPORTS */}
          {activeTab === "analytics" && (
            <section className="space-y-6 animate-entrance" aria-labelledby="analytics-title">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <h3 id="analytics-title" className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <BarChart2 className="w-5 h-5 text-cyan-400" />
                  Rwandan Disability Employment & Infrastructure Database
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Access regional development statistics, inclusive school networks, macro-employment indices, and active SaaS audit reports.
                </p>
              </div>

              {/* Data breakdowns cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* School accessibility score reviews */}
                <div className={`p-5 rounded-xl border ${activeCard[prefContrast]} space-y-4`}>
                  <h4 className="text-xs font-bold text-white tracking-widest uppercase">School Inclusivity Metrics</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Rwandan primary, secondary, and tertiary schools tracked for physical ramps and blind learning equipment.
                  </p>
                  <div className="space-y-3 font-mono text-[11px]">
                    {[
                      { name: "UR - Gikondo Campus", score: "88/100 AA", color: "text-emerald-400" },
                      { name: "Kigali Inclusive School", score: "92/100 AAA", color: "text-emerald-400" },
                      { name: "Gasabo Secondary Academy", score: "45/100 Fail", color: "text-red-400" }
                    ].map((school, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-805">
                        <span className="text-slate-200">{school.name}</span>
                        <span className={`font-bold ${school.color}`}>{school.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Macro employment index */}
                <div className={`p-5 rounded-xl border ${activeCard[prefContrast]} space-y-4`}>
                  <h4 className="text-xs font-bold text-white tracking-widest uppercase">Ecosystem Revenue Channels</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Financial outcomes distributed back to disabled developers, auditors, and remote labeling agents in East Africa.
                  </p>
                  <div className="space-y-2.5 font-mono text-xs">
                    {[
                      { channel: "SaaS WCAG Subscriptions", amt: "72,800 USD/Mo", label: "Enterprise accounts" },
                      { channel: "Labor Gig commissions", amt: "12,400 USD/Mo", label: "8% transactional cut" },
                      { channel: "Assistive device rentals", amt: "8,205 USD/Mo", label: "Monthly lease yields" }
                    ].map((ch, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-300">{ch.channel}</span>
                          <span className="text-cyan-400 font-bold">{ch.amt}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{ch.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance progress logs */}
                <div className={`p-5 rounded-xl border ${activeCard[prefContrast]} space-y-4`}>
                  <h4 className="text-xs font-bold text-white tracking-widest uppercase">Inclusive Legal Compliance</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Rwandan tech startups and ministerial portals verified for native screen reader parameters.
                  </p>
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Verified Portals</span>
                      <span className="font-bold text-emerald-400">42 checked</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Critical remediation pending</span>
                      <span className="font-bold text-amber-400">18 entities</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Avg site rating metric</span>
                      <span className="font-bold text-cyan-400">72.4/100</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          )}

          {/* TAB 10: STRATEGIC BLUEPRINTS VIEW */}
          {activeTab === "blueprints" && (
            <section className="space-y-4 animate-entrance">
              {/* Injected component */}
              <BlueprintsPanel />
            </section>
          )}

        </main>

      </div>

      {/* Footer landmarks layout */}
      <footer className={`border-t ${prefContrast === "high-contrast" ? "border-white border-t-4" : "border-slate-805"} transition-colors shrink-0 bg-slate-950/40 mt-auto`}>
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500 leading-relaxed">
            <p className="text-slate-400 font-bold flex flex-wrap items-center gap-2">
              <span>Ikaze Access Empowerment Platform</span>
              <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full uppercase">Developed by MUGABEPRINCE</span>
            </p>
            <p className="mt-0.5">Designed first for Rwanda, scaling globally. © 2026. All rights conforming to WCAG 2.2 AA standards.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-slate-400 font-medium">
            <button onClick={() => alert("Support: contact@ikazeaccess.rw • Tel: +250 788 000 000")} className="hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Support Hotlines
            </button>
            <a href="https://www.ncpd.gov.rw" target="_blank" rel="noreferrer" className="hover:underline">
              NCPD Partner Site
            </a>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-mono text-[10px]">SYSTEM STATUS: ALL NODES LIVE</span>
          </div>
        </div>
      </footer>

      {/* Dynamic Account Registration & Authentication Overlay Modal */}
      <AuthManager
        prefContrast={prefContrast}
        currentSession={currentSession}
        onLoginSuccess={handleLoginSuccess}
        onLogoutSuccess={handleLogoutSuccess}
        onUpdateProfile={handleUpdateProfile}
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
