// Constants for WAMPIRE Hackathon Portal

export const EVENT_DETAILS = {
  name: 'WAMPIRE',
  tagline: 'INNOVATE TODAY. BUILD TOMORROW.',
  subtitle: 'Where bold ideas meet brilliant minds. Build, collaborate and create solutions that matter.',
  contactEmail: 'contact@wampire.org',
  supportEmail: 'support@wampire.org',
};

// Configurable Prize Structure - Strictly Pink, Black, and White Palette
export const PRIZE_TIERS = [
  {
    rank: 'First Prize',
    title: 'Grand Champion',
    reward: '₹75,000 INR Bounty',
    subtitle: 'Awarded to the most impactful, technically sound, and innovative solution overall.',
    badge: 'GRAND CHAMPION // 01',
    color: 'from-[#FF007F] to-[#FF2A85]',
    borderColor: 'border-[#FF007F]',
    accentColor: 'text-[#FF007F]',
    bgGlow: 'shadow-glow-pink',
    perks: [
      'Top-tier grant bounty & capital pool',
      'Exclusive incubation & venture mentorship',
      'Direct sponsor interview tracks',
      'Custom championship trophy & credentials',
    ],
    highlight: true,
  },
  {
    rank: 'Second Prize',
    title: '1st Runner-Up',
    reward: '₹45,000 INR Bounty',
    subtitle: 'Honoring exceptional engineering rigor, design elegance, and market viability.',
    badge: '1ST RUNNER-UP // 02',
    color: 'from-white to-neutral-400',
    borderColor: 'border-white/30',
    accentColor: 'text-white',
    bgGlow: 'shadow-card-dark',
    perks: [
      'Substantial grant bounty allocation',
      'One-on-one architectural coaching sessions',
      'Partner API credits & cloud infra credits',
      'Runner-up awards & verified credentials',
    ],
    highlight: false,
  },
  {
    rank: 'Third Prize',
    title: '2nd Runner-Up',
    reward: '₹30,000 INR Bounty',
    subtitle: 'Recognizing outstanding creativity, rapid prototyping, and collaborative excellence.',
    badge: '2ND RUNNER-UP // 03',
    color: 'from-pink-400 to-neutral-400',
    borderColor: 'border-pink-500/30',
    accentColor: 'text-pink-300',
    bgGlow: 'shadow-card-dark',
    perks: [
      'Grant bounty allocation',
      'Technical mentorship network access',
      'Developer tool licenses & builder swag kit',
      'Certificate of technical distinction',
    ],
    highlight: false,
  },
];

// Event Highlights
export const EVENT_HIGHLIGHTS = [
  {
    id: 'innovation',
    title: 'Innovation',
    description: 'Transform disruptive thoughts into functional software solutions that challenge existing technological boundaries.',
    iconName: 'Zap',
    tag: 'Creativity & Edge',
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Assemble high-performing squads, bridge complementary skills, and co-create with driven peers worldwide.',
    iconName: 'Users',
    tag: 'Synergy',
  },
  {
    id: 'mentorship',
    title: 'Expert Mentorship',
    description: 'Receive continuous guidance, architectural reviews, and debugging feedback from experienced industry professionals.',
    iconName: 'Compass',
    tag: 'Guidance',
  },
  {
    id: 'problem-solving',
    title: 'Real-world Problem Solving',
    description: 'Tackle open-ended challenges with tangible societal, environmental, and enterprise significance.',
    iconName: 'Target',
    tag: 'Impact',
  },
];

// Hackathon Timeline (Dynamic 5-Phase Progression + Results)
export const TIMELINE_STEPS = [
  {
    step: '01',
    title: 'Registration',
    phase: 'Phase 1',
    description: 'Sign up to create your hacker profile, verify credentials, and access the portal resources.',
  },
  {
    step: '02',
    title: 'Team Formation',
    phase: 'Phase 2',
    description: 'Form a squad with teammates (1-5 members) or connect through the matchmaking gateway.',
  },
  {
    step: '03',
    title: 'Idea Submission',
    phase: 'Phase 3',
    description: 'Submit your project abstract, problem statement, architecture blueprint, and chosen tech stack.',
  },
  {
    step: '04',
    title: 'Development',
    phase: 'Phase 4',
    description: 'Intense 48-hour sprint: write code, engineer systems, debug collaboratively, and consult with mentors.',
  },
  {
    step: '05',
    title: 'Final Evaluation',
    phase: 'Phase 5',
    description: 'Demonstrate your prototype, submit code repositories, and present live demos before the evaluation panel.',
  },
  {
    step: '06',
    title: 'Results',
    phase: 'Phase 6',
    description: 'Celebrate top builders, award grants and trophies, and connect winners with incubation opportunities.',
  },
];

// About Initiative Pillars
export const ABOUT_PILLARS = [
  {
    title: 'Why Wampire?',
    description:
      'Wampire was conceived to bridge the gap between theoretical computing and hands-on production engineering. We cultivate an environment where builders test hypotheses, ship code, and learn by shipping.',
  },
  {
    title: 'Open Collaborative Culture',
    description:
      'We believe the most enduring technologies are forged through open collaboration, multidisciplinary teamwork, and an ethos of mutual learning across all experience tiers.',
  },
  {
    title: 'Focus on Real Impact',
    description:
      'Rather than isolated toys, Wampire challenges participants to engineer scalable solutions capable of answering real-world problems with practical, sustainable software.',
  },
];
