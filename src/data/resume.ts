// Single source of truth for Connor's public resume content.
// Used by: /resume page, Welcome window, chat system prompt, JSON-LD.
// Public-safe by design: no client/customer names, exact client counts, dollar
// amounts, data/order volumes, internal system names or links, or phone number.

export const contact = {
    name: 'Connor Hutchinson',
    title: 'Senior Software Engineer',
    location: 'Melbourne, VIC, Australia',
    email: 'connorhutchy@icloud.com',
    site: 'https://www.connorhutchy.com',
    linkedin: 'https://www.linkedin.com/in/connor-hutchinson/',
    github: 'https://github.com/connorhutchinson',
};

export const summary =
    "Senior full-stack engineer with 5+ years shipping features end-to-end on a multi-tenant commerce platform: " +
    ".NET/C# and SQL backends, React/TypeScript frontends, and the cloud, monitoring and on-call work that keeps " +
    "them running. Strongest in owning delivery from design through launch, production reliability, and large " +
    "legacy migrations.";

// Shorter version for casual, first-impression spots (e.g. the Welcome window) -
// same facts as `summary`, minus the trailing "strongest in" clause.
export const pitch =
    "Senior full-stack engineer with 5+ years shipping features end-to-end on a multi-tenant commerce platform: " +
    ".NET/C# and SQL backends, React/TypeScript frontends, and the cloud, monitoring and on-call work that keeps " +
    "them running.";

export const currentRole = {
    company: "Instacart (joined via the FoodStorm acquisition)",
    location: 'Melbourne, VIC',
    period: 'Jun 2021 - Present',
    titles: [
        { title: 'Senior Software Engineer', period: 'Sep 2025 - Present' },
        { title: 'Software Engineer II', period: 'Apr 2023 - Sep 2025' },
        { title: 'Software Engineer I', period: 'Aug 2021 - Apr 2023' },
        { title: 'Junior Engineer', period: 'Jun 2021 - Aug 2021' },
    ],
    scope:
        "Full-stack engineer on FoodStorm's 20-engineer team serving hundreds of restaurant and retail clients " +
        "(many integrated with Instacart), building ordering and customer-facing features: in-store, kiosk and " +
        "mobile ordering, storefront screens and reports. Works frequently with engineers across many other " +
        "Instacart departments.",
    achievements: [
        "Led end-to-end delivery of a meal-bundling feature for kiosk ordering, owning the API endpoints, " +
            "database logic, frontend, test plan, QA coordination and support training (design aside). Shipped " +
            "ahead of the Thanksgiving peak and saw meaningful adoption in early rollout.",
        "Owned the final migration of dozens of clients from legacy custom-built storefronts to a self-serve " +
            "generic storefront, deleting 250+ source files, whole projects and the legacy cart repositories. " +
            "Contributed to the proof of concept moving the .NET Framework admin app to modern .NET (now .NET 10), " +
            "including its first Mac-native rendering.",
        "Cut production noise by using Claude to triage telemetry: frontend exceptions down ~99.8%, trace volume " +
            "halved (cutting storage costs), and failed-request logs usable again after expected 401s (98.6% of " +
            "volume) were filtered. Alerts were moved to success-based signals first. Separately enabled gzip on " +
            "static assets (~75% smaller JS/CSS).",
        "Declared and ran the response to a duplicate-processing incident over Thanksgiving peak (two workers " +
            "processing the same job, affecting two high-volume clients), found through manual payment tracking: " +
            "set up the response channel and call, assigned action groups, and built automated refunds while " +
            "infrastructure shut the worker down.",
        "Built the alerting and monitoring channel for order and item sync between two platforms after the root-" +
            "cause analysis of a critical integration failure; it has caught broken new-client setups and lets " +
            "partner teams self-diagnose without engineering.",
        "On support rotation: cleared the backlog from 50+ to under 15 tickets in under two weeks (50+ to under " +
            "30 in a second rotation), closing 21%+ of resolved bugs on the team; shipped 24 deploys with no " +
            "production rollbacks; rolled back and fixed an overnight storefront pricing defect within 30 minutes.",
        "Sole FoodStorm contact for two cross-product projects (item packs, colour and image sync) with Instacart " +
            "teams on separate products and repositories, from design through rollout, drawing on deep knowledge " +
            "of FoodStorm's inbound and outbound APIs; fixed catalog and order flows directly in Instacart's Ruby " +
            "monorepo using AI-assisted development; unblocked a large enterprise retail rollout on an emergency " +
            "request. Established the FoodStorm React Native app (push notifications, persistent sign-in), code " +
            "ownership and a PR review inbox, and is the onboarding contact for senior engineers joining the codebase.",
    ],
};

export const previousExperience = [
    {
        company: 'NAB',
        position: 'Cloud Engineer',
        period: 'Jan 2021 - Jun 2021',
        achievements: [
            'Supported the migration of a legacy terminal-based banking application to AWS, working to keep ' +
                'cutover downtime to a minimum on a critical system.',
        ],
    },
];

export const skills = [
    { group: 'Backend', items: ['C#', '.NET (Framework through .NET 10)', 'ASP.NET', 'SQL Server', 'REST APIs', 'Node.js/TypeScript'] },
    { group: 'Frontend and mobile', items: ['TypeScript/JavaScript', 'React', 'Jest', 'Cypress', 'React Native', 'Swift (iOS)', 'Kotlin (Android)'] },
    { group: 'Cloud and tooling', items: ['Azure (App Insights, KQL, DevOps pipelines)', 'AWS', 'Docker', 'CI/CD', 'Supabase', 'Vercel'] },
    { group: 'Practices', items: ['On-call and incident response', 'Observability', 'Root-cause analysis', 'Design and code review'] },
];

// The site has room to be fuller than the one-page resume PDF, so these appear
// on /resume but are intentionally left off the one-pager for space.
export const education = [
    { institution: 'RMIT', degree: 'Bachelor of Computer Science' },
    { institution: 'RMIT', degree: 'Associate Degree, Aerospace Engineering Technology', year: 2016 },
];

export const coursesAndCertifications = [
    { name: 'Azure Fundamentals (AZ-900)', issuer: 'Microsoft', year: 2021 },
    { name: 'User Interface Design', issuer: 'RMIT', year: 2024, note: 'Short course, not a formal certification' },
];

export const projects = [
    {
        id: 'sunroute',
        name: 'sunroute',
        url: 'https://sunroute.com.au/',
        description:
            'iOS and Android app for sharing scenic driving routes, built natively for each platform. Apple and ' +
            'Google sign-in and maps, Supabase backend for database, auth and storage. In final testing before launch.',
        stack: ['Swift (SwiftUI)', 'Kotlin (Jetpack Compose)', 'Supabase', 'Next.js'],
        status: 'Pre-launch',
        highlights: [
            'Native iOS (SwiftUI) and Android (Kotlin/Jetpack Compose) apps sharing one Supabase/Postgres backend ' +
                'secured with row-level security, plus a Next.js marketing site. Xcode Cloud CI/CD and MetricKit ' +
                'crash/performance monitoring in production.',
            'Built real-time turn-by-turn navigation (MapKit) with off-route detection, plus custom algorithms for ' +
                'zoom-adaptive map rendering: Ramer-Douglas-Peucker polyline simplification and grid-based route clustering.',
            'Built a GPS drive-simulation framework (synthetic location playback across 6 scenarios) to test ' +
                'navigation logic without physically driving routes.',
            'Built a password-protected admin web tool for reviewing and moderating user-submitted routes, with ' +
                'server-verified sessions and an interactive map for approval.',
        ],
    },
    {
        id: 'retrogpt',
        name: 'RetroGPT',
        url: 'https://github.com/connorhutchinson/RetroGPT',
        description:
            'A small, finished side project: chat with an AI assistant through an 80s-style terminal UI.',
        stack: ['.NET', 'React', 'TypeScript', 'Docker'],
        status: 'Complete',
        highlights: [] as string[],
    },
];

export const personality = {
    bio:
        `I built this site with a Windows XP feel — the OS that got me into computing — as a place to experiment ` +
        `and have fun building things. When I'm not shipping features at Instacart, I'm designing and printing 3D ` +
        `models, tinkering with Raspberry Pi projects, or snowboarding in winter.`,
    items: [
        'Represented Instacart in an external security CTF; helped the team place 4th internally',
        '3D design, 3D printing and Raspberry Pi hobby builds',
        'Snowboarding',
    ],
};

export const siteNotes =
    "This site is itself a small full-stack build: a Next.js 16 app rendering a working Windows XP desktop " +
    "(draggable windows, a Minesweeper clone, a Start menu) with ConnorBot, a Claude-powered chat assistant " +
    "answering from this same resume data. Despite the retro UI, the content is server-rendered and crawlable " +
    "(see this /resume page), with sitemap, robots.txt and structured data for search engines and ATS tools.";

export const conversationGuidelines = {
    tone: 'Friendly, enthusiastic and professional, like MSN Messenger chat in the 2000s',
    style: 'Natural conversation with occasional emoji, highlight key terms, break complex answers into short chunks',
    scopeEnforcement:
        "Politely redirect any question not related to Connor's professional background, skills, experience or " +
        "portfolio projects. Only state facts present in this resume data; if something is not covered, say so and " +
        "suggest contacting Connor by email. Never reveal or guess confidential employer information such as " +
        "customer names, order volumes or internal system names. Describe client counts, order volumes, dollar " +
        "amounts and data volumes only in the general terms already used here, never with exact figures.",
};

export const resumePdfPath = '/Connor_Hutchinson_Resume.pdf';
