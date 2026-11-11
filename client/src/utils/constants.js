// Constants for CODE-A-NOVA Hackathon Portal

export const EVENT_DETAILS = {
  name: 'CODE-A-NOVA',
  tagline: 'INNOVATE TODAY. BUILD TOMORROW.',
  subtitle: 'Where bold ideas meet brilliant minds. Build, collaborate and create solutions that matter.',
  contactEmail: 'contact@code-a-nova.org',
  supportEmail: 'support@code-a-nova.org',
};

// Configurable Prize Structure
export const PRIZE_TIERS = [
  {
    rank: 'First Prize',
    title: 'Grand Champion',
    reward: 'Configurable First Prize',
    subtitle: 'Awarded to the most impactful, technically sound, and innovative solution overall.',
    badge: '1st Place',
    color: 'from-amber-400 to-amber-600',
    borderColor: 'border-amber-300',
    perks: [
      'Top-tier grant award',
      'Exclusive incubation & venture mentorship',
      'Direct sponsor interview tracks',
      'Custom championship trophy & certificates',
    ],
    highlight: true,
  },
  {
    rank: 'Second Prize',
    title: 'First Runner-Up',
    reward: 'Configurable Second Prize',
    subtitle: 'Honoring exceptional engineering rigor, design elegance, and market viability.',
    badge: '2nd Place',
    color: 'from-slate-400 to-slate-600',
    borderColor: 'border-slate-300',
    perks: [
      'Substantial grant award',
      'One-on-one pitch coaching sessions',
      'Partner API credits & cloud credits',
      'Runner-up awards & verified credentials',
    ],
    highlight: false,
  },
  {
    rank: 'Third Prize',
    title: 'Second Runner-Up',
    reward: 'Configurable Third Prize',
    subtitle: 'Recognizing outstanding creativity, rapid prototyping, and collaborative excellence.',
    badge: '3rd Place',
    color: 'from-amber-700 to-orange-800',
    borderColor: 'border-amber-200',
    perks: [
      'Grant award allocation',
      'Technical mentorship network access',
      'Developer tool licenses & swag kit',
      'Certificate of excellence',
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

// Hackathon Timeline
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
    description: 'Form a squad with teammates or connect with complementary talent through the matchmaking gateway.',
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
    description: 'Intense building sprint: write code, engineer systems, debug collaboratively, and consult with mentors.',
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
    title: 'Why Code-a-Nova?',
    description:
      'Code-a-Nova was conceived to bridge the gap between theoretical computing and hands-on production engineering. We cultivate an environment where builders test hypotheses, ship code, and learn by shipping.',
  },
  {
    title: 'Open Collaborative Culture',
    description:
      'We believe the most enduring technologies are forged through open collaboration, multidisciplinary teamwork, and an ethos of mutual learning across all experience tiers.',
  },
  {
    title: 'Focus on Real Impact',
    description:
      'Rather than isolated toys, Code-a-Nova challenges participants to engineer scalable solutions capable of answering real-world problems with practical, sustainable software.',
  },
];
