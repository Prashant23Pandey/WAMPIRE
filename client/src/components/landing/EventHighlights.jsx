import React from 'react';
import { Sparkles, Users, Award, Briefcase, CheckCircle2 } from 'lucide-react';
import Badge from '../common/Badge.jsx';

export const EventHighlights = () => {
  const highlights = [
    {
      title: 'Innovation',
      tag: 'Creative Autonomy',
      icon: <Sparkles className="w-6 h-6 text-blue-600" />,
      accentGradient: 'from-blue-600 to-indigo-600',
      description:
        'Unleash unconventional software concepts. Build prototypes that disrupt established norms and explore next-generation tech architectures.',
      bullets: [
        'Experimental tech stacks & AI integrations',
        'Freedom to tackle non-standard problem angles',
        'Judging focused on ingenuity & technical execution',
      ],
    },
    {
      title: 'Team Collaboration',
      tag: 'Squad Dynamics',
      icon: <Users className="w-6 h-6 text-violet-600" />,
      accentGradient: 'from-violet-600 to-purple-600',
      description:
        'Connect with software engineers, product designers, and technical visionaries to assemble high-output, cross-functional squads.',
      bullets: [
        'Interactive matchmaking portal for solo hackers',
        'Teams of up to 5 collaborative builders',
        'Shared Git repositories & rapid agile sprints',
      ],
    },
    {
      title: 'Expert Mentorship',
      tag: 'Technical Guidance',
      icon: <Award className="w-6 h-6 text-indigo-600" />,
      accentGradient: 'from-indigo-600 to-blue-600',
      description:
        'Get feedback and unblock technical hurdles with dedicated mentors who bring production engineering and system design experience.',
      bullets: [
        'On-demand code reviews and debugging assistance',
        'Architectural guidance during system formation',
        'Pitch critique and presentation readiness support',
      ],
    },
    {
      title: 'Real-world Problem Solving',
      tag: 'Tangible Utility',
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      accentGradient: 'from-emerald-600 to-teal-600',
      description:
        'Develop software products engineered to endure beyond demo day—creating practical tools that resolve concrete real-world pain points.',
      bullets: [
        'Open-ended domains with real operational relevance',
        'Evaluation weighted on deployment readiness',
        'Potential for continued post-hackathon incubation',
      ],
    },
  ];

  return (
    <section id="highlights" className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="violet" size="md">
            Event Highlights
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Designed For Exceptional Outcomes
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Every element of CODE-A-NOVA is intentionally crafted to elevate your technical prowess, expand your professional network, and push the envelope of software design.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-soft-sm hover:shadow-soft-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top Accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.accentGradient}`} />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-soft-sm group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {card.description}
                </p>

                {/* Feature Bullet Points */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  {card.bullets.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EventHighlights;

