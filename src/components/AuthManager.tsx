import React, { useState, useEffect } from "react";
import { User, LogIn, LogOut, UserPlus, Key, Eye, EyeOff, Shield, Star, Award, Briefcase, BookOpen, UserCheck, X, Settings, CreditCard, Check, Trash2, Plus } from "lucide-react";
import { UserAccount } from "../types";
import { MOCK_JOBS } from "../mockData";

interface AuthManagerProps {
  prefContrast: "slate" | "high-contrast" | "eye-care" | "bandwidth";
  currentSession: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onLogoutSuccess: () => void;
  onUpdateProfile: (updated: UserAccount) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PRE_SEEDED_ACCOUNTS: UserAccount[] = [
  {
    id: "user-1",
    name: "MUGABE PRINCE",
    email: "mugabeprince1@gmail.com",
    password: "password123",
    role: "Expert",
    xpPoints: 5800,
    avatar: "👑",
    prefDisabilityPreset: "motor",
    bio: "Lead Developer of Ikaze Access. Tech reviewer and accessibility advocate in Rwanda, working to standardise inclusion globally.",
    enrolledCourses: ["course-1", "course-3"],
    appliedJobs: ["job-1"],
    completedQuizzes: [{ quizId: "quiz-1", score: 100 }]
  },
  {
    id: "user-2",
    name: "Claudine Umutoni",
    email: "claudine@kigali.org",
    password: "password123",
    role: "Self-Advocate",
    xpPoints: 1250,
    avatar: "🌟",
    prefDisabilityPreset: "visual",
    bio: "Passionate self-advocate from Kigali. Contributing accessibility mapping data and tutoring online developers.",
    enrolledCourses: ["course-2"],
    appliedJobs: ["job-2"],
    completedQuizzes: []
  },
  {
    id: "user-3",
    name: "Benjamin Kagabo",
    email: "employer@inclusive.rw",
    password: "password123",
    role: "Inclusive Employer",
    xpPoints: 2400,
    avatar: "💼",
    prefDisabilityPreset: "general",
    bio: "HR director championing inclusive recruitment and onboarding of cognitive-diverse talents in East African remote markets.",
    enrolledCourses: [],
    appliedJobs: [],
    completedQuizzes: []
  }
];

export function AuthManager({
  prefContrast,
  currentSession,
  onLoginSuccess,
  onLogoutSuccess,
  onUpdateProfile,
  isOpen,
  onClose
}: AuthManagerProps) {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem("ikaze_registered_accounts");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return PRE_SEEDED_ACCOUNTS; }
    }
    return PRE_SEEDED_ACCOUNTS;
  });

  const [authView, setAuthView] = useState<"login" | "signup" | "profile">("login");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [roleInput, setRoleInput] = useState<UserAccount["role"]>("Self-Advocate");
  const [disabilityInput, setDisabilityInput] = useState("general");
  const [bioInput, setBioInput] = useState("");
  const [savedMomoNumberInput, setSavedMomoNumberInput] = useState("");
  const [savedMomoProviderInput, setSavedMomoProviderInput] = useState<"MTN" | "Airtel">("MTN");
  const [savedMomoNameInput, setSavedMomoNameInput] = useState("");
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Sync state view when currentSession changes or modal opens
  useEffect(() => {
    if (currentSession) {
      setAuthView("profile");
      setBioInput(currentSession.bio || "");
      setDisabilityInput(currentSession.prefDisabilityPreset || "general");
      setSavedMomoNumberInput(currentSession.savedMomoNumber || "");
      setSavedMomoProviderInput((currentSession.savedMomoProvider as "MTN" | "Airtel") || "MTN");
      setSavedMomoNameInput(currentSession.savedMomoName || "");
      setIsEditingPayment(!currentSession.savedMomoNumber);
    } else {
      setAuthView("login");
    }
  }, [currentSession, isOpen]);

  // Save accounts to persistent storage
  useEffect(() => {
    localStorage.setItem("ikaze_registered_accounts", JSON.stringify(accounts));
  }, [accounts]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const user = accounts.find(
      a => a.email.toLowerCase().trim() === emailInput.toLowerCase().trim()
    );

    if (!user) {
      setAuthError("No integrated account found with this email. Please click Sign Up to create one!");
      return;
    }

    if (passwordInput && user.password && user.password !== passwordInput) {
      setAuthError("Incorrect security verification password. Please check your credentials.");
      return;
    }

    // Success
    setAuthSuccess(`Welcome back, ${user.name}!`);
    setTimeout(() => {
      onLoginSuccess(user);
      setAuthSuccess(null);
      setEmailInput("");
      setPasswordInput("");
      onClose();
    }, 1500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (!nameInput.trim() || !emailInput.trim() || !passwordInput.trim()) {
      setAuthError("Please complete all required fields.");
      return;
    }

    const exists = accounts.some(
      a => a.email.toLowerCase().trim() === emailInput.toLowerCase().trim()
    );

    if (exists) {
      setAuthError("An account is already linked with this email address. Try logging in.");
      return;
    }

    const newAccount: UserAccount = {
      id: "user-" + Date.now(),
      name: nameInput.trim(),
      email: emailInput.trim().toLowerCase(),
      password: passwordInput,
      role: roleInput,
      xpPoints: 100, // Starting bounty bonus XP
      avatar: roleInput === "Self-Advocate" ? "🌟" : roleInput === "Caregiver" ? "🤝" : roleInput === "Inclusive Employer" ? "💼" : roleInput === "Expert" ? "👑" : "🛡️",
      prefDisabilityPreset: disabilityInput,
      bio: bioInput.trim() || "Empowerment hub member.",
      enrolledCourses: [],
      appliedJobs: [],
      completedQuizzes: []
    };

    const updatedList = [...accounts, newAccount];
    setAccounts(updatedList);
    setAuthSuccess(`Account created successfully! Enjoy a 100 XP starter bounty.`);

    setTimeout(() => {
      onLoginSuccess(newAccount);
      setAuthSuccess(null);
      setNameInput("");
      setEmailInput("");
      setPasswordInput("");
      setBioInput("");
      onClose();
    }, 1500);
  };

  const handleSavePaymentMethod = () => {
    if (!currentSession) return;
    if (!savedMomoNumberInput.trim()) {
      setAuthError("Please enter a valid Mobile Money number.");
      return;
    }
    const updated: UserAccount = {
      ...currentSession,
      savedMomoNumber: savedMomoNumberInput.trim(),
      savedMomoProvider: savedMomoProviderInput,
      savedMomoName: savedMomoNameInput.trim() || undefined,
    };
    setAccounts(prev => prev.map(a => a.id === currentSession.id ? updated : a));
    onUpdateProfile(updated);
    setAuthSuccess("Payment method saved securely for faster future checkout!");
    setIsEditingPayment(false);
    setTimeout(() => {
      setAuthSuccess(null);
    }, 3000);
  };

  const handleRemovePaymentMethod = () => {
    if (!currentSession) return;
    const updated: UserAccount = {
      ...currentSession,
      savedMomoNumber: undefined,
      savedMomoProvider: undefined,
      savedMomoName: undefined,
    };
    setSavedMomoNumberInput("");
    setSavedMomoNameInput("");
    setAccounts(prev => prev.map(a => a.id === currentSession.id ? updated : a));
    onUpdateProfile(updated);
    setAuthSuccess("Saved payment method removed successfully.");
    setIsEditingPayment(true);
    setTimeout(() => {
      setAuthSuccess(null);
    }, 3000);
  };

  const handleUpdateProfileLocal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;
    setAuthSuccess(null);

    const updated: UserAccount = {
      ...currentSession,
      bio: bioInput.trim(),
      prefDisabilityPreset: disabilityInput,
      savedMomoNumber: savedMomoNumberInput.trim() || undefined,
      savedMomoProvider: savedMomoNumberInput.trim() ? savedMomoProviderInput : undefined,
      savedMomoName: savedMomoNameInput.trim() || undefined,
    };

    // Update in our master accounts list
    setAccounts(prev => prev.map(a => a.id === currentSession.id ? updated : a));
    
    // Notify parent App
    onUpdateProfile(updated);
    setAuthSuccess("Profile preference tags updated securely!");

    setTimeout(() => {
      setAuthSuccess(null);
    }, 3000);
  };

  const handleQuickLogin = (acc: UserAccount) => {
    onLoginSuccess(acc);
    setAuthSuccess(`Quick logged in as ${acc.name}!`);
    setTimeout(() => {
      setAuthSuccess(null);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  // Custom theme variables reflecting prefContrast
  const styles = {
    overlay: "fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 overflow-y-auto animate-entrance",
    card: {
      slate: "bg-slate-950 border border-slate-805 text-slate-100 max-w-md w-full rounded-2xl p-6 shadow-2xl relative",
      "high-contrast": "bg-black border-4 border-white text-white max-w-md w-full rounded-none p-6 shadow-[8px_8px_0_0_#ffffff] relative",
      "eye-care": "bg-[#F4EFE2] border-2 border-[#E2D6B5] text-[#2B2B2B] max-w-md w-full rounded-2xl p-6 shadow-xl relative",
      bandwidth: "bg-white border-2 border-black text-black max-w-md w-full rounded-none p-6 relative"
    }[prefContrast],
    cardInner: {
      slate: "bg-slate-900 border border-slate-800",
      "high-contrast": "bg-black border border-white",
      "eye-care": "bg-[#FAF6EE] border border-[#D6C29B]",
      bandwidth: "bg-neutral-50 border border-neutral-300"
    }[prefContrast],
    heading: {
      slate: "text-white font-sans",
      "high-contrast": "text-white uppercase font-bold font-mono tracking-wider",
      "eye-care": "text-[#3D2C1C] font-serif font-black",
      bandwidth: "text-black font-sans font-extrabold"
    }[prefContrast],
    textMuted: {
      slate: "text-slate-400 text-xs",
      "high-contrast": "text-yellow-400 font-mono font-bold text-xs",
      "eye-care": "text-[#65543D] font-serif text-xs",
      bandwidth: "text-neutral-600 text-xs"
    }[prefContrast],
    input: {
      slate: "bg-slate-950 border-slate-800 focus:border-cyan-500 text-white",
      "high-contrast": "bg-black border-white focus:border-white text-white font-mono",
      "eye-care": "bg-[#FAF6EE] border-[#C0B298] focus:border-[#8B5E3C] text-[#2B2B2B]",
      bandwidth: "bg-white border-neutral-400 focus:border-black text-black"
    }[prefContrast],
    primaryBtn: {
      slate: "bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold transition-all shadow-md active:scale-95",
      "high-contrast": "bg-white hover:bg-yellow-400 text-black border-2 border-white font-extrabold shadow-[4px_4px_0_0_#ffffff] hover:shadow-none transition-all active:translate-x-1 active:translate-y-1",
      "eye-care": "bg-[#8B5E3C] hover:bg-[#70482C] text-[#FAF6EE] font-serif font-bold transition-all",
      bandwidth: "bg-black hover:bg-neutral-800 text-white font-bold transition-all"
    }[prefContrast],
    secondaryBtn: {
      slate: "bg-slate-905 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium transition-all",
      "high-contrast": "bg-black text-white hover:bg-yellow-950/40 border-2 border-white font-mono font-bold",
      "eye-care": "bg-[#FAF6EE] hover:bg-[#FAF6EE]/80 text-[#8B5E3C] border border-[#C0B298] font-serif font-semibold",
      bandwidth: "bg-white hover:bg-neutral-100 text-black border border-neutral-300 font-semibold"
    }[prefContrast],
    badge: {
      slate: "bg-cyan-950 text-cyan-400 border border-cyan-800/30",
      "high-contrast": "bg-black text-white border-white border",
      "eye-care": "bg-[#FAF6EE] text-[#8B5E3C] border-[#C2A585]",
      bandwidth: "bg-neutral-200 text-black"
    }[prefContrast]
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div 
        role="dialog" 
        aria-modal="true" 
        id="auth-dialog-modal"
        className={styles.card}
      >
        {/* Close Switch */}
        <button 
          onClick={onClose}
          id="auth-close-btn"
          aria-label="Close authentication panel"
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800/40 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* View Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 mb-2">
            <User className="w-6 h-6" />
          </div>
          <h2 className={`${styles.heading} text-lg md:text-xl font-black`}>
            {authView === "login" && "Sign In to Ikaze Access"}
            {authView === "signup" && "Create Developer Account"}
            {authView === "profile" && "Your Hub Profile Session"}
          </h2>
          <p className={`${styles.textMuted} mt-1`}>
            {authView === "login" && "Access WCAG Audits, jobs, map and courses seamlessly."}
            {authView === "signup" && "Register to secure task bounties, track XP, and apply."}
            {authView === "profile" && "Manage your preference presets and view achievements."}
          </p>
        </div>

        {/* Success / Error Banners */}
        {authError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex gap-2 items-start animate-entrance">
            <Shield className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {authSuccess && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex gap-2 items-start animate-entrance">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{authSuccess}</span>
          </div>
        )}

        {/* --- VIEW: LOGIN --- */}
        {authView === "login" && (
          <div className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Registered Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mugabeprince1@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none font-sans focus:ring-1 ${styles.input}`}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Secret Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password..."
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className={`w-full px-3 py-2 text-xs rounded-lg border outline-none pr-10 ${styles.input}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all mt-3 ${styles.primaryBtn}`}
              >
                Access Account Panel
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-mono text-slate-500 tracking-wider">Quick Testing Accounts</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Quick Login Seeded Accounts */}
            <div className="grid grid-cols-1 gap-2">
              {PRE_SEEDED_ACCOUNTS.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => handleQuickLogin(acc)}
                  className={`w-full p-2.5 text-left rounded-xl flex items-center justify-between border ${styles.cardInner} text-xs hover:border-cyan-500/50 transition-all cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{acc.avatar}</span>
                    <div>
                      <span className="font-bold block">{acc.name}</span>
                      <span className="text-[10px] text-slate-400">{acc.role} • {acc.email}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 shrink-0">{acc.xpPoints} XP</span>
                </button>
              ))}
            </div>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Don't have an account?{" "}
                <button 
                  onClick={() => setAuthView("signup")}
                  className="font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </p>
            </div>
          </div>
        )}

        {/* --- VIEW: SIGN UP --- */}
        {authView === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Full Representative Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Marie-Claire Mukasanga"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${styles.input}`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="developer@ikaze.rw"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${styles.input}`}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Access Password</label>
                <input
                  type="password"
                  required
                  placeholder="Set secret code..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${styles.input}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Your Adaptive Role</label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${styles.input}`}
                >
                  <option value="Self-Advocate">Self-Advocate</option>
                  <option value="Caregiver">Caregiver / Assistant</option>
                  <option value="Inclusive Employer">Inclusive Employer</option>
                  <option value="NGO Partner">NGO / Dev Partner</option>
                  <option value="Expert">Accessibility Expert</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Accessibility Preset</label>
                <select
                  value={disabilityInput}
                  onChange={(e) => setDisabilityInput(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-lg border outline-none ${styles.input}`}
                >
                  <option value="general">None / General</option>
                  <option value="visual">Blind / Screen-Reader</option>
                  <option value="motor">Motor / Keyboard Only</option>
                  <option value="hearing">Deaf / Sign Language staff</option>
                  <option value="cognitive">Dyslexia / Plain Text</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">Short Bio (Who you are)</label>
              <textarea
                placeholder="e.g. Developer specializing in keyboard navigation flows & e-learning tutoring in Rwanda."
                value={bioInput}
                rows={2}
                onChange={(e) => setBioInput(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border outline-none resize-none ${styles.input}`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg text-xs font-bold cursor-pointer transition-all mt-3 ${styles.primaryBtn}`}
            >
              Initialize Developer Profile
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={() => setAuthView("login")}
                  className="font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </div>
          </form>
        )}

        {/* --- VIEW: ACTIVE PROFILE --- */}
        {authView === "profile" && currentSession && (
          <div className="space-y-4">
            {/* Quick Profile Overview */}
            <div className={`p-4 rounded-xl border ${styles.cardInner} space-y-3`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl bg-slate-950 p-2.5 rounded-xl border border-slate-800 shrink-0">{currentSession.avatar}</span>
                  <div>
                    <h3 className={`${styles.heading} text-sm font-bold`}>{currentSession.name}</h3>
                    <p className="text-[10px] text-slate-400">{currentSession.email}</p>
                    <span className="inline-block text-[9px] font-mono mt-1 bg-cyan-950 text-cyan-400 border border-cyan-800/30 px-2 py-0.5 rounded uppercase">
                      {currentSession.role}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">Total Loyalty</span>
                  <span className="text-sm font-black text-amber-400 inline-flex items-center gap-1">
                    <Award className="w-4 h-4" /> {currentSession.xpPoints} XP
                  </span>
                </div>
              </div>

              {/* Bio Detail */}
              {currentSession.bio && (
                <p className="text-xs text-slate-300 italic border-t border-slate-800/60 pt-2 font-sans italic">
                  "{currentSession.bio}"
                </p>
              )}
            </div>

            {/* Loyalty / Progress Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2.5 rounded-xl border ${styles.cardInner} text-center`}>
                <Briefcase className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">Applications</span>
                <span className="text-xs font-bold text-white">
                  {currentSession.appliedJobs.length} active submit{currentSession.appliedJobs.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className={`p-2.5 rounded-xl border ${styles.cardInner} text-center`}>
                <BookOpen className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">E-Learning Enrollments</span>
                <span className="text-xs font-bold text-white">
                  {currentSession.enrolledCourses.length} active classes
                </span>
              </div>
            </div>

            {/* Live Career Applications Tracking Section */}
            <div className={`p-4 rounded-xl border ${styles.cardInner} space-y-3`}>
              <h4 className={`${styles.heading} text-xs uppercase tracking-wider font-extrabold flex items-center justify-between`}>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  My Applications Tracker
                </span>
                <span className="text-[9px] font-mono text-cyan-400 lowercase">{currentSession.prefDisabilityPreset || "general"} profile attached</span>
              </h4>

              {currentSession.appliedJobs.length === 0 ? (
                <p className="text-[11px] text-slate-450 text-center py-4 italic font-sans">
                  No active career applications yet. Visit the Jobs Board to apply instantly with 1-Click!
                </p>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {currentSession.appliedJobs.map((jobId) => {
                    const jobDetails = MOCK_JOBS.find((j) => j.id === jobId);
                    
                    const statusMap: Record<string, { label: string; bg: string; text: string }> = {
                      "job-1": { label: "Interview Scheduled", bg: "bg-indigo-950/70 border-indigo-900/40", text: "text-indigo-400" },
                      "job-2": { label: "Screening Match Review (98%)", bg: "bg-amber-950/70 border-amber-940/40", text: "text-amber-400" },
                      "job-3": { label: "Accommodations Ready", bg: "bg-emerald-950/70 border-emerald-900/40", text: "text-emerald-400" },
                      "job-4": { label: "Match Pending", bg: "bg-cyan-950/70 border-cyan-900/40", text: "text-cyan-400" },
                      "job-5": { label: "Passed Initial Match", bg: "bg-teal-950/70 border-teal-900/40", text: "text-teal-400" },
                    };

                    const status = statusMap[jobId] || { label: "Verified & Profile Attached", bg: "bg-emerald-950/70 border-emerald-900/40", text: "text-emerald-400" };

                    return (
                      <div key={jobId} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-805/50 flex flex-col gap-1 text-[11px] hover:border-cyan-500/20 transition-all">
                        <div className="flex items-start justify-between gap-1">
                          <div className="max-w-[180px]">
                            <span className="font-bold text-white block truncate leading-tight">{jobDetails?.title || "Inclusive Contractor Position"}</span>
                            <span className="text-[10px] text-slate-450 block truncate">{jobDetails?.company || "Disability-Inclusive Partner"}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono border tracking-tight space-nowrap ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-900/40 pt-1.5 mt-1 font-mono">
                          <span>📁 CV Attached & Authenticated</span>
                          <span className="text-cyan-400 font-bold">Preset: {currentSession.prefDisabilityPreset || "general"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Saved Payment Methods Section */}
            <div className={`p-4 rounded-xl border ${styles.cardInner} space-y-3`}>
              <h4 className={`${styles.heading} text-xs uppercase tracking-wider font-extrabold flex items-center justify-between`}>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-cyan-400" />
                  Saved Mobile Wallet Methods
                </span>
                <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">Secure Storage</span>
              </h4>

              {currentSession.savedMomoNumber && !isEditingPayment ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center justify-between animate-entrance">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[9px] ${
                        currentSession.savedMomoProvider === "MTN" ? "bg-amber-400 text-black" : "bg-red-650 text-white"
                      }`}>
                        {currentSession.savedMomoProvider === "MTN" ? "MTN" : "Airtel"}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {currentSession.savedMomoProvider === "MTN" ? "MTN MoMo Account" : "Airtel Money"}
                        </span>
                        <span className="text-[10px] tracking-wider text-slate-400 font-mono font-bold block">
                          {currentSession.savedMomoNumber}
                        </span>
                        {currentSession.savedMomoName && (
                          <span className="text-[9px] text-slate-550 font-sans block">
                            Holder: {currentSession.savedMomoName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingPayment(true)}
                        className="p-1 px-2.5 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-300 rounded font-bold text-[10px] transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={handleRemovePaymentMethod}
                        className="p-1 px-2 bg-rose-955/40 border border-rose-900/60 hover:bg-rose-950/80 text-rose-400 rounded font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                        title="Delete saved payment method"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-550 font-sans leading-relaxed">
                    ✓ This mobile wallet number is set as default. Payments will automatically pull this verification address for lightning fast checkout.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-950/40 p-3 rounded-xl border border-slate-900 animate-entrance">
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block font-bold">Preferred Operator</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSavedMomoProviderInput("MTN")}
                        className={`p-2 rounded-lg border text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          savedMomoProviderInput === "MTN"
                            ? "bg-amber-955/40 border-amber-500/80 text-amber-400 font-bold"
                            : "bg-slate-950/50 border-slate-855 hover:border-slate-800 text-slate-400"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-black font-extrabold text-[8px]">M</span>
                        MTN MoMo
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setSavedMomoProviderInput("Airtel")}
                        className={`p-2 rounded-lg border text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          savedMomoProviderInput === "Airtel"
                            ? "bg-red-955/40 border-red-500/80 text-red-00 font-bold"
                            : "bg-slate-950/50 border-slate-855 hover:border-slate-800 text-slate-400"
                        }`}
                      >
                        <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white font-extrabold text-[8px]">A</span>
                        Airtel Money
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block font-bold font-sans">Mobile Wallet Number</label>
                    <input
                      type="tel"
                      value={savedMomoNumberInput}
                      onChange={(e) => setSavedMomoNumberInput(e.target.value)}
                      placeholder="e.g. 078XXXXXXX or 072XXXXXXX"
                      className="w-full px-2 py-1.5 bg-slate-950 border border-slate-805 focus:border-cyan-500 text-white rounded text-xs font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block font-bold font-sans">Subscriber Name (Optional)</label>
                    <input
                      type="text"
                      value={savedMomoNameInput}
                      onChange={(e) => setSavedMomoNameInput(e.target.value)}
                      placeholder="e.g. Jean d'Amour"
                      className="w-full px-2 py-1.5 bg-slate-950 border border-slate-805 focus:border-cyan-500 text-white rounded text-xs outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleSavePaymentMethod}
                      className="flex-1 py-1.5 bg-cyan-600 hover:bg-cyan-555 text-white rounded font-bold text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Mobile Wallet
                    </button>
                    {currentSession?.savedMomoNumber && (
                      <button
                        type="button"
                        onClick={() => setIsEditingPayment(false)}
                        className="px-3 py-1.5 bg-slate-900 border border-slate-850 hover:border-slate-800 text-slate-400 hover:text-white rounded font-bold text-[10px] transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modify Settings fields */}
            <form onSubmit={handleUpdateProfileLocal} className="space-y-3 border-t border-slate-800/40 pt-3">
              <h4 className={`${styles.heading} text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5`}>
                <Settings className="w-4 h-4 text-cyan-400" />
                Account Preference Adjustments
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-0.5">Adaptability Needs</label>
                  <select
                    value={disabilityInput}
                    onChange={(e) => setDisabilityInput(e.target.value)}
                    className={`w-full px-2 py-1.5 text-xs rounded-lg border outline-none ${styles.input}`}
                  >
                    <option value="general">None / General</option>
                    <option value="visual">Blind / Screen-Reader</option>
                    <option value="motor">Motor / Keyboard Only</option>
                    <option value="hearing">Deaf / Sign Language staff</option>
                    <option value="cognitive">Dyslexia / Plain Text</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono tracking-wider text-slate-500 block mb-0.5">Edit Statement Bio</label>
                  <input
                    type="text"
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Short statement bio..."
                    className={`w-full px-2 py-1.5 text-xs rounded-lg border outline-none ${styles.input}`}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className={`flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${styles.primaryBtn}`}
                >
                  Save Active Preferences
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogoutSuccess();
                    setAuthView("login");
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${styles.secondaryBtn}`}
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Logout
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
