// Shared Type Specifications for Ikaze Access Disability Economic Empowerment Platform

export interface AccessibilityPreferences {
  highContrast: boolean;
  dyslexiaFont: boolean;
  screenReaderVoice: boolean;
  speechRate: number; // 0.5 to 2.0
  lowBandwidth: boolean;
  deafCaptions: boolean;
  signLanguageInterpreter: boolean;
  simplifiedTextMode: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  category: "Remote Job" | "Freelance Gig" | "AI Microtask" | "Accessibility Testing";
  disabilityFriendlyTicks: string[];
  isRemote: boolean;
  description: string;
  requirements: string[];
  employerVerified: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: "Digital Literacy" | "Freelancing 101" | "Web Accessibility Testing" | "AI Prompt Engineering";
  instructor: string;
  lectures: number;
  hasSignLanguage: boolean;
  hasAudioDescription: boolean;
  rating: number;
  duration: string;
  description: string;
  syllabus: string[];
}

export interface AssistiveDevice {
  id: string;
  name: string;
  category: "Mobility" | "Sensory" | "Cognitive" | "Communication" | "Digital Aids";
  price: number;
  rating: number;
  image: string;
  isRentalAvailable: boolean;
  rentalPricePerMonth?: number;
  description: string;
  specs: string[];
  stockCount: number;
}

export interface AccessiblePlace {
  id: string;
  name: string;
  category: "Hospital" | "Restaurant" | "School" | "Government Building" | "Bank" | "Public Transit Hub";
  locationDescription: string;
  lat: number;
  lng: number;
  accessibilityScore: number; // 1 to 5 stars
  hasRamps: boolean;
  hasAccessibleToilets: boolean;
  hasTactilePaving: boolean;
  hasElevator: boolean;
  hasSignLanguageStaff: boolean;
  reviews: { user: string; rating: number; text: string; date: string }[];
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  authorRole: "Self-Advocate" | "Caregiver" | "Inclusive Employer" | "NGO Partner" | "Expert";
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: "Mentorship" | "Resource Sharing" | "Inspiring Story" | "General Chat";
}

export interface WCAGAuditSummary {
  score: number;
  issuesCount: number;
  criticalIssues: string[];
  warningIssues: string[];
  remediationPlan: string;
  auditorUser?: string;
}

export interface ArchitectureMetric {
  title: string;
  value: string;
  sub: string;
}

export interface BlueprintSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  content: string;
  keyPoints: string[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional simple verification
  role: "Self-Advocate" | "Caregiver" | "Inclusive Employer" | "NGO Partner" | "Expert";
  xpPoints: number;
  avatar: string;
  prefDisabilityPreset: string;
  bio?: string;
  enrolledCourses: string[]; // Course IDs
  appliedJobs: string[]; // Job IDs
  completedQuizzes: { quizId: string; score: number }[];
}

