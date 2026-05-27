import { Job, Course, AssistiveDevice, AccessiblePlace, CommunityPost, BlueprintSection } from "./types";

export const MOCK_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Accessibility Tester & QA Analyst",
    company: "Irembo Technologies",
    location: "Kigali, Rwanda (Hybrid / Remote Option)",
    salary: "450,000 RWF / month",
    category: "Accessibility Testing",
    disabilityFriendlyTicks: ["Screen Reader Tested", "Flexible Breaks", "Keyboard Navigation Friendly"],
    isRemote: true,
    description: "Verify that electronic government portal pages meet WCAG 2.2 AA parameters. Perform testing using screen readers (NVDA/JAWS) and keyboard-only layouts.",
    requirements: [
      "Basic knowledge of HTML and accessibility guidelines.",
      "Lived experience using assistive software (NVDA, TalkBack, or Zoom) is highly valued.",
      "Meticulous attention to detail and ability to write plain language reports."
    ],
    employerVerified: true,
  },
  {
    id: "job-2",
    title: "AI Chat Dataset Annotator (Kinyarwanda)",
    company: "Kigali AI Alliance",
    location: "Kigali, Rwanda (100% Remote)",
    salary: "15,000 RWF / hour",
    category: "AI Microtask",
    disabilityFriendlyTicks: ["Cognitive Friendly", "No Speech Required", "Self-Paced Schedule"],
    isRemote: true,
    description: "Evaluate and label machine-translated Kinyarwanda conversational dialogue. Fix grammatical bugs and tag semantic intents using our simple client portal.",
    requirements: [
      "Fluency in Kinyarwanda and English or French.",
      "Reliable internet connection (data packages can be subsidized by the platform).",
      "Ability to follow text-based styling rules."
    ],
    employerVerified: true,
  },
  {
    id: "job-3",
    title: "Remote Customer Success Specialist",
    company: "Yego Moto Logistics",
    location: "Kigali, Rwanda",
    salary: "350,000 RWF / month",
    category: "Remote Job",
    disabilityFriendlyTicks: ["Wheelchair Accessible Hub", "Deaf Friendly Text Channels", "Supportive Care Coordinator On-Site"],
    isRemote: true,
    description: "Coordinate rider and client support tickets via incoming WhatsApp messages, live chat channels, and CRM tickets. No active voice calling required.",
    requirements: [
      "Good written communication skills on electronic devices.",
      "Empathy and problem solving readiness.",
      "Previous chat-support experience is an asset, but full paid training is provided."
    ],
    employerVerified: true,
  },
  {
    id: "job-4",
    title: "Accessible UI Web Audit Consultant",
    company: "Bank of Kigali",
    location: "Kigali, Rwanda (Freelance Project)",
    salary: "1,200,000 RWF Project Fee",
    category: "Accessibility Testing",
    disabilityFriendlyTicks: ["Braille Display Supportive", "Flexible Milestones", "Virtual Weekly Standups"],
    isRemote: true,
    description: "Review and analyze the electronic banking single page application layout. Provide specific recommendations to maximize keyboard target margins and focus indicators.",
    requirements: [
      "Deep understanding of WCAG standards and WAI-ARIA roles.",
      "Familiarity with React or standard CSS layouts.",
      "Confidence presenting remediation feedback to development leaders."
    ],
    employerVerified: true,
  },
  {
    id: "job-5",
    title: "Simple Data Input Associate",
    company: "Rwanda Development Board (RDB)",
    location: "Kigali Hub (Wheelchair Ramp Accessible)",
    salary: "280,000 RWF / month",
    category: "Remote Job",
    disabilityFriendlyTicks: ["Optimized Keyboard Layouts", "Assistive Software Pre-installed", "On-site Sign Language Interpreter", "Physically Accessible Parking"],
    isRemote: false,
    description: "Support registration services by reviewing scans and logging categorical metadata into the central registry database system. Quiet room workspace with assistive seating.",
    requirements: [
      "Familiarity with general spreadsheets (Excel, Google Sheets).",
      "Accuracy when transferring digital statistics."
    ],
    employerVerified: true,
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Web Accessibility Audit 101: Manual Tools & Screencasts",
    category: "Web Accessibility Testing",
    instructor: "Jean d'Amour Habimana",
    lectures: 14,
    hasSignLanguage: true,
    hasAudioDescription: true,
    rating: 4.9,
    duration: "6 hours",
    description: "Learn to perform accessibility testing using screen-readers, Lighthouse, AXE DevTools, and keyboard navigation. Empower organizations to achieve WCAG 2.2 AA standard conformity.",
    syllabus: [
      "Foundations of Inclusive Digital Design",
      "Screen Reader Operations (NVDA, VoiceOver, Android TalkBack)",
      "Semantic HTML & WAI-ARIA attribute mappings",
      "Color Contrast & Fluid Focus Indicators",
      "How to write professional accessibility audit reports clients pay for"
    ]
  },
  {
    id: "course-2",
    title: "AI Prompt Engineering for Disabled Solopreneurs",
    category: "AI Prompt Engineering",
    instructor: "Aisha Uwase",
    lectures: 8,
    hasSignLanguage: true,
    hasAudioDescription: false,
    rating: 4.8,
    duration: "4 hours",
    description: "Leverage Gemini generative models to streamline document processing, craft client proposals, draft computer code, and translate technical text. Build an automated freelance workflow.",
    syllabus: [
      "Introduction to Assistant AI models",
      "Formulating specific, disability-adaptive prompts for cognitive task acceleration",
      "Drafting business correspondence & freelance agreements with AI",
      "Creating summaries of complex government policies and project specifications"
    ]
  },
  {
    id: "course-3",
    title: "Upwork & Fiverr Freelancing Success Strategies",
    category: "Freelancing 101",
    instructor: "Emmanuel Ntambara",
    lectures: 12,
    hasSignLanguage: false,
    hasAudioDescription: true,
    rating: 4.7,
    duration: "5 hours",
    description: "Launch your global digital freelancing business from Kigali. Establish payment gateways, configure professional portfolios, estimate hourly rates, and manage remote communication tools successfully.",
    syllabus: [
      "Establishing professional digital networks in Africa",
      "Writing winning freelance gig templates",
      "Using local mobile money systems for global currency payouts",
      "Handling client communication confidently"
    ]
  },
  {
    id: "course-4",
    title: "Essential Digital Literacy for Career Readiness",
    category: "Digital Literacy",
    instructor: "Marie-Claire Mukasanga",
    lectures: 10,
    hasSignLanguage: true,
    hasAudioDescription: true,
    rating: 4.6,
    duration: "8 hours",
    description: "A friendly, comprehensive initiation course for beginners. Covers basic file managers, secure email correspondence, internet navigation, web safety, and leveraging assistive tools built into modern computers.",
    syllabus: [
      "Familiarizing with keyboard layouts & screen magnifiers",
      "Composing clear email proposals and attaching files",
      "Online security, dark web scams, and safe data habits",
      "Collaborating on cloud documents"
    ]
  }
];

export const MOCK_DEVICES: AssistiveDevice[] = [
  {
    id: "dev-1",
    name: "Ikaze Go Smart Electric Wheelchair",
    category: "Mobility",
    price: 980000, // in RWF
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400", // generic representative electronics
    isRentalAvailable: true,
    rentalPricePerMonth: 35000,
    description: "A lightweight, foldable motorized wheelchair suited for Kigali's terrain. Includes safety gyroscopes, custom dynamic shocks, puncture-proof wheels, and an long-range lithium battery with USB ports to charge mobile devices.",
    specs: ["Range: 25 km", "Weight: 22 kg", "Battery: Lithium 24V 12Ah", "USB Charger integrated"],
    stockCount: 8
  },
  {
    id: "dev-2",
    name: "OptiDisplay Refreshable Braille Reader",
    category: "Sensory",
    price: 1550000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400",
    isRentalAvailable: true,
    rentalPricePerMonth: 55000,
    description: "A modular, pocket-sized braille reader that pairs via Bluetooth with smartphones and personal computers. Enables blind students and remote developers to read and compose emails, coding layouts, or books instantly.",
    specs: ["40 braille cells", "Bluetooth 5.2", "Battery life: 18 hours", "MicroSD storage support"],
    stockCount: 3
  },
  {
    id: "dev-3",
    name: "BoneConductor Wireless Audiology Aid",
    category: "Sensory",
    price: 190000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=400",
    isRentalAvailable: false,
    description: "Bone conduction audiology headphones that circumvent outer-ear damage to transmit crystal-clear sound frequencies directly through the temporal bone. Waterproof, ergonomic, and compatible with tele-health pipelines.",
    specs: ["Direct skull frequency conduction", "Noise reduction mic", "Bluetooth pairing Multipoint", "Sweat resistant"],
    stockCount: 15
  },
  {
    id: "dev-4",
    name: "Kigali Tactile Solar Smart Cane",
    category: "Mobility",
    price: 120000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
    isRentalAvailable: true,
    rentalPricePerMonth: 6000,
    description: "A revolutionary white cane augmented with ultrasonic proximity sensors that vibrate to signal high-level overhead obstacles (tree branches, low-hanging wiring, awnings). Features solar-powered GPS tracking for caregiver safety integrations.",
    specs: ["Obstacle range: 2m radius", "Dual ultrasound transceivers", "Rechargeable via solar panel on shaft", "Integrated emergency panic bell"],
    stockCount: 22
  },
  {
    id: "dev-5",
    name: "VocalScribe Premium Speech-to-Text Suite",
    category: "Digital Aids",
    price: 45000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=400",
    isRentalAvailable: false,
    description: "An offline-first, highly specialized voice navigation software supporting continuous speech processing in Kinyarwanda, Swahili, French, and English, designed for writers and motor-impaired individuals.",
    specs: ["Zero-latency local processing", "Custom dictation vocabularies", "Compatible with LibreOffice & Microsoft Word", "Integrates with desktop keyboard shortcuts"],
    stockCount: 99
  }
];

export const MOCK_PLACES: AccessiblePlace[] = [
  {
    id: "place-1",
    name: "Rwanda Development Board (RDB) Headquarters",
    category: "Government Building",
    locationDescription: "KG 2 Rd, Gishushu, Kigali",
    lat: -1.9442,
    lng: 30.0913,
    accessibilityScore: 5,
    hasRamps: true,
    hasAccessibleToilets: true,
    hasTactilePaving: true,
    hasElevator: true,
    hasSignLanguageStaff: true,
    reviews: [
      { user: "Innocent M.", rating: 5, text: "Excellent physically accessible ramp at the main entrance, wide doors, and clean, properly signed disabled toilets. Staff inside were outstanding and helped with registration priorities.", date: "2026-05-12" },
      { user: "Solange U.", rating: 5, text: "Fantastic blind navigation lanes on the floor. First-floor reception desk features direct low-counter writing bays for wheelchair clients.", date: "2026-04-20" }
    ]
  },
  {
    id: "place-2",
    name: "Kigali Heights Office Complex & Mall",
    category: "Restaurant",
    locationDescription: "KG 7 Ave, Kimihurura, Kigali",
    lat: -1.9525,
    lng: 30.0931,
    accessibilityScore: 4,
    hasRamps: true,
    hasAccessibleToilets: true,
    hasTactilePaving: false,
    hasElevator: true,
    hasSignLanguageStaff: false,
    reviews: [
      { user: "Jean de Dieu N.", rating: 4, text: "Elevators are modern with braille voice audio prompts. Ramps inside are smooth, though the tactile street entry points could be improved.", date: "2026-05-01" }
    ]
  },
  {
    id: "place-3",
    name: "CHUK Kigali University Teaching Hospital",
    category: "Hospital",
    locationDescription: "KN 4 Ave, Kiyovu, Kigali",
    lat: -1.9472,
    lng: 30.0611,
    accessibilityScore: 4,
    hasRamps: true,
    hasAccessibleToilets: true,
    hasTactilePaving: true,
    hasElevator: true,
    hasSignLanguageStaff: true,
    reviews: [
      { user: "Chantal M.", rating: 4, text: "Medical queues prioritize disabled citizens automatically. Ramps connect all ground wards nicely. Sign-language interpreter on duty during clinical days.", date: "2026-05-15" }
    ]
  },
  {
    id: "place-4",
    name: "Nyabugogo Intercity Bus Terminal",
    category: "Public Transit Hub",
    locationDescription: "KN 1 Rd, Nyabugogo, Kigali",
    lat: -1.9392,
    lng: 30.0445,
    accessibilityScore: 2,
    hasRamps: true,
    hasAccessibleToilets: false,
    hasTactilePaving: false,
    hasElevator: false,
    hasSignLanguageStaff: false,
    reviews: [
      { user: "Gaspard T.", rating: 2, text: "Very crowded and uneven gravel surfaces. Ramps exist for the ticketing bays, but boarding buses in wheelchairs requires assistance as bus doors lack hydraulic steps. Hoping for transport upgrades.", date: "2026-03-30" }
    ]
  }
];

export const MOCK_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "Fabrice Rugamba",
    avatar: "FR",
    authorRole: "Self-Advocate",
    content: "Passed my Web Accessibility Auditor certification today using the Ikaze e-learning tool! Upwork project profile is set up. I am ready to start testing African company portals to optimize WCAG 2.2 ratings. Disability is not inability, let's win!",
    likes: 42,
    comments: 8,
    timestamp: "2 hours ago",
    category: "Inspiring Story"
  },
  {
    id: "post-2",
    author: "Grace Umutoni",
    avatar: "GU",
    authorRole: "Inclusive Employer",
    content: "Our organization (BK Digital Hub) is actively hiring for three AI Annotation remote microtasks. Our job postings are calibrated directly with screen readers and cognitive layouts. Excellent packages are provided.",
    likes: 31,
    comments: 14,
    timestamp: "1 day ago",
    category: "Resource Sharing"
  },
  {
    id: "post-3",
    author: "Dr. Patrick Mugisha",
    avatar: "PM",
    authorRole: "Expert",
    content: "Advocating for digital first mandates in East Africa. If we construct websites with correct ARIA benchmarks, we empower thousands of skilled visually-impaired youngsters to participate in global economic commerce. Let us continue audits!",
    likes: 56,
    comments: 4,
    timestamp: "3 days ago",
    category: "Mentorship"
  }
];

export const STRATEGIC_BLUEPRINTS: BlueprintSection[] = [
  {
    id: "bp-exec",
    title: "1. Executive Vision",
    subtitle: "A Tech-First Social-Capitalist Model for Africa and Beyond",
    icon: "Compass",
    content: `Historically, disability interventions have been framed by charities and paternalistic NGOs as cost-centers. **Ikaze Access** breaks this paradigm. It is an elite tech-first socio-capitalist platform centered around the premise that human accessibility is a massive, highly underserved digital asset. 

By functioning as a combined professional labor platform, SaaS regulatory compliance auditor, e-learning directory, and assistive device marketplace, Ikaze empowers individuals with disabilities to shift from welfare dependency to active economic producers.

Starting in Kigali, Rwanda—a country committed to digital transformation with robust infrastructure and a progressive policy framework—Ikaze establishes a replicable paradigm for pan-African and global deployment. It forms the central 'digital operating system' connecting local skilled talents with global remote markets, inclusive organizations, and assistive device suppliers.`,
    keyPoints: [
      "Economic Empowerment: Replacing pity with transactional commercial value.",
      "Rwanda Hub First: Leveraging Kigali's status as a continental regulatory tech testbed.",
      "Scalable Platform Playbook: Connecting talent, compliance software, maps, and device manufacturing."
    ]
  },
  {
    id: "bp-market",
    title: "2. Global & Regional Market Analysis",
    subtitle: "Sizing the Underserved Disability Economy",
    icon: "BarChart",
    content: `Globally, there are over **1.3 billion people with disabilities**, representing approximately 16% of the world’s population. In Africa alone, this numbers over **150 million citizens**. 

When family members and caregivers are factored in, the disability ecosystem controls a disposable aggregate micro-economy estimated at **$13 trillion globally**.
Furthermore, companies that actively incorporate disability-inclusive talent enjoy up to 28% higher revenues and a 30% increase in economic profit margins. 

The core market segments in Africa remain intensely fragmented:
1. **Remote Work & Microtasks:** There is highly skilled sensory-impaired youth, yet they lack central access points tailored to assistive technology.
2. **Web Accessibility SaaS:** Corporations, startups, and governments in Africa are rushing to go digital, but over 95% of state, banking, and commerce sites present catastrophic WCAG accessibility barriers. This creates a multi-million dollar local B2B auditing requirement.`,
    keyPoints: [
      "Aggressive Growth: Africa's remote youth workforce expanding by 25% year-over-year.",
      "Regulatory Urgency: Impending compliance mandates in developing markets targeting accessibility standards.",
      "Disposable Income Factor: $13T aggregate market purchasing power globally."
    ]
  },
  {
    id: "bp-hidden",
    title: "3. Hidden High-Revenue Opportunities",
    subtitle: "Underserved Niches in the African & Global Landscape",
    icon: "Key",
    content: `We have identified three critical, untapped sectors representing high margin ROI:
    
- **AI Data Annotation Labeling Pipeline:** Global AI labs (OpenAI, Google, Scale AI) spend billions on RLHF (Reinforcement Learning with Human Feedback) and localization labeling. Visually impaired learners possesses hyper-advanced hearing for language/audio verification, while neurodiverse individuals frequently excel in highly repetitive pattern-matching data tasks. Ikaze organizes this labor force at scale.
- **Enterprise WCAG Auditing-as-a-Service (SaaS):** Standard compliance scrapers frequently miss context problems (e.g. poor screen-reader flow, messy button text labels). Ikaze operates a premium developer SaaS suite coupled with a manual audit marketplace which handles complex testing audits of apps and software.
- **Assistive Hardware Remanufacturing & Logistics:** Importing digital canes, motorized chairs, and smart hearing devices from Europe carries 300% markup. Ikaze plans centralized assembly, maintenance partnerships, and micro-rental logistics in East Africa.`,
    keyPoints: [
      "RLHF & AI Data Annotation: Utilizing highly focused blind/autistic workspaces.",
      "Decentralized Repair Centers: Mobilizing local wheelchair technical hubs in Kigali.",
      "Corporate Compliance: Providing WCAG safety certifications for pan-African banks and fintechs."
    ]
  },
  {
    id: "bp-biz",
    title: "4. Business & Monetization Model",
    subtitle: "A Robust Multi-Stream Non-Donation Revenue Architecture",
    icon: "DollarSign",
    content: `To build an economically sustainable startup, Ikaze deploys a multi-pronged corporate monetization model:

1. **Labor Portal Commission:** 8% service fee on freelancing platforms, assistive microtask payouts, and accessibility testing gigs.
2. **Inclusive Employer Subscriptions:** $149/month B2B licensing fee for businesses to list remote opportunities, deploy verified inclusive badges, and access customized payroll APIs.
3. **WCAG Compliance Auditing SaaS:** Subscriptions ranging from $49/month for local startups to $899/month for banks and telecom giants. This provides automated crawler audits, customized developer checklists, and official Ikaze Trust badges.
4. **Hardware Marketplace Commissions:** 12% transactional facilitation marketplace fee for e-commerce checkouts and a structured cut on local medical hardware rentals.
5. **AI Productivity Subscriptions:** Premium users pay $5/month (waived upon completing high-reception job outputs) to access unrestricted real-time voice, text simplifiers, and OCR APIs.`,
    keyPoints: [
      "Diverse B2B Streams: Moving completely away from donor reliance to commercial contracts.",
      "SaaS Recurring Revenue: Strong retention via continuous web crawl compliance monitoring.",
      "Marketplace Fees: Scalable transactional micro-commissions."
    ]
  },
  {
    id: "bp-archi",
    title: "5. High-Level System Architecture",
    subtitle: "Reliable, Low-Bandwidth, Full-Stack Technology Blueprint",
    icon: "Cpu",
    content: `The system is designed with a service-centric architecture engineered to perform flawlessly even in low-bandwidth, rural connection areas:

- **Frontend Core:** Single-page TypeScript React app optimized for light DOM tree footprints and zero tracking blocking. Uses CSS custom properties to switch to high-contrast and high-dyslexia letter spacing instantly in memory.
- **Backend Node.js API:** Express API layer with modular service boundaries handling authentication, maps calculations, job boards, and e-learning tracking.
- **Persistent Storage:** PostgreSQL handled with resilient indexing strategies, alongside Redis cache for popular map markers and low-latency listings.
- **AI Integration Gateway:** Fast server-side proxy powered by Gemini models, supporting speech-to-press streams, OCR transcriptions, and text summarization structures.
- **Offline Persistence:** Dynamic Service Worker layer caching structural layouts, essential map zones, and learning content locally in standard IndexedDB.`,
    keyPoints: [
      "Optimized DOM: Lightweight markup structures fully aligned with standard assistive technology readers.",
      "API Proxy Security: Protecting Gemini API key credentials and keeping rate limits controlled.",
      "Resilient Local SQLite/IndexedDB: Continuous operational cache during internet signal drops."
    ]
  },
  {
    id: "bp-api",
    title: "6. Database, Auth, & API design",
    subtitle: "Secure RBAC, REST and WCAG schemas",
    icon: "Database",
    content: `Security and access controls are fully baked into the foundation:

- **Role-Based Access Control (RBAC):** Users are taxonomized into distinct personas: 'Seeker', 'Employer', 'Expert/Auditor', 'NGO/Gov', and 'Admin'. Each has specific schema claims.
- **Key API Schemas:** Standardized REST requests with localized security checks. Job applications, maps submissions, and hardware checkouts utilize robust transaction payloads.
- **Accessibility Instrumentation Metadata:** User profiles store structured accessibility preferences in a single JSONB block in the user table, enabling immediate, server-rendered client adjustments.`,
    keyPoints: [
      "JSONB Accessibility Configuration: Real-time customization rendered instantly on initial render.",
      "Strict RBAC guards: Ensuring corporate clients and government entities only pull cleared stats.",
      "Rate Limiting & JWT: High-defense security layers protecting inclusive user records."
    ]
  },
  {
    id: "bp-ai",
    title: "7. AI Accessibility Integrations",
    subtitle: "Next-Gen Practical Assistive Technology Engine",
    icon: "Zap",
    content: `Rather than generic chat bots, Ikaze embeds specific, context-aware AI tools using Gemini models:

1. **The Plain Text Simplifier:** Translates dense corporate job proposals, legal frameworks, and terms-of-service files into high-clarity bullet summaries, facilitating equal access for neurodiverse or dyslexic people.
2. **Web Accessibility Remediation Generator:** Provides immediate actionable code repair patterns for engineers from code logs of their websites.
3. **Vivid Environment describer:** Allows blind applicants and visually-impaired seekers to receive spatial maps and scene analysis of workplace photographs.
4. **Vocal Navigation Scripting:** Translates spoken speech commands directly into visual click signals, facilitating navigation without keyboard accessories.`,
    keyPoints: [
      "Gemini 3.5-flash: Exceptional speed, low latency processing, and robust Kinyarwanda context.",
      "Plain Language Translation: Unlocking academic and complex business content for cognitive empowerment.",
      "Actionable SaaS Audits: Direct output of corrected semantic markup to developers."
    ]
  },
  {
    id: "bp-access",
    title: "8. WCAG Accessibility Architecture",
    subtitle: "Achieving WCAG 2.2 AAA Engineering Standards",
    icon: "ShieldAlert",
    content: `Engineering for accessibility is not just about screen contrast; it requires foundational discipline:

- **Semantic Landmark Layouts:** Using native HTML5 structures (\`<main>\`, \`<nav>\`, \`<aside>\`, \`<header>\`) with strict keyboard focus trapping inside modals and overlays.
- **ARIA Attribute Sincerity:** Always pairing active custom components with appropriate roles (\`role=\"status\"\`, \`aria-live=\"polite\"\`, \`aria-describedby\`), preventing redundant noisy feedback.
- **Contrast Ratios:** Visual styling guarantees a minimum contrast ratio of 7:1 for common text elements and supports immediate, typography adjustments.
- **Dyslexia and Cognitive Optimization:** Clean OpenDyslexic-styled letter layouts with elevated letter line heights to maximize readability during long sessions.`,
    keyPoints: [
      "Keyboard Focus Outlines: Visible, thick high-contrast rings (minimum 3px) for all interactions.",
      "Skip Navigation Links: Bypassing persistent headers to render central contents instantly on keyboard focus.",
      "Speech Rate Controls: Flexible local text-to-speech sliders."
    ]
  },
  {
    id: "bp-growth",
    title: "9. Growth & Traffic Strategy",
    subtitle: "Acquiring High-Value B2B and Community Members",
    icon: "TrendingUp",
    content: `Our global growth strategy focuses on B2B compliance pressure combined with community-led grassroot acquisition:

- **The Accessibility SaaS Compliance Bait:** Offer free automated WCAG crawls to banks, e-government platforms, and fast-growth startups in Rwanda. Provide a 'Disability Accessibility Scorecard' with a clear pricing model for remediating errors. This automatically fuels the Gig Marketplace with auditing contracts for certified disabled testers.
- **Partnerships with National Coalities (NCPD, NGOs):** Partner directly with local disability councils and NGOs to onboard job seekers onto the digital literacy platforms.
- **AdSense & Affiliate Optimization:** Maximize search engine visibility for keywords like 'Remote inclusive jobs Africa', 'Disability grants', 'Accessible Rwanda travel packages', attracting continuous contextual inbound traffic.`,
    keyPoints: [
      "B2B SaaS Hook: Generating jobs automatically via diagnostic web crawls.",
      "Vocational Partnerships: Onboarding pre-vetted learners directly with Ministry support.",
      "SEO Supremacy: High CPC keywords target inclusive recruiting and assistive procurement."
    ]
  },
  {
    id: "bp-roadmap",
    title: "10. Development Roadmap & Milestones",
    subtitle: "From Kigali Pilot to Global Scaled Architecture",
    icon: "Calendar",
    content: `The execution path spans three strategic scaling horizons:

- **Phase 1: Kigali Hub Pilot (Months 1–6):** Focus on core remote job listings, manual accessibility testing assignments, the AI simplification tool, and building relationships with the NCPD and local banks (e.g., Bank of Kigali).
- **Phase 2: East-African Regional Scaling (Months 7–18):** Launch the complete Assistive Device e-commerce/rental ecosystem, expand mapping reviews to Nairobi and Kampala, and roll out the SaaS auto-crawler tool.
- **Phase 3: Deep Continental Integration (Months 19+):** Implement AI-powered neural Kinyarwanda sign language recognition models, forge global enterprise outsourcing partnerships, and pursue global scale.`,
    keyPoints: [
      "Kigali Pilot Focus: Confirming job metrics, training 500 remote testers.",
      "B2B Expansion: Standardizing web compliance regulatory pressure across Eastern Africa.",
      "Financial Automation: Scaling mobile money payout APIs."
    ]
  }
];
