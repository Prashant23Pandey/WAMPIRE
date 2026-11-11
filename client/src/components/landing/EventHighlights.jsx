import React from 'react';
import { Sparkles, Users, Award, Briefcase, Check } from 'lucide-react';
import Badge from '../common/Badge.jsx';

export const EventHighlights = () => {
  const highlights = [
    {
      title: 'Autonomous Engineering',
      tag: 'CREATIVE AUTONOMY',
      icon: <Sparkles className="w-5 h-5 text-[#FF007F]" />,
      description:
        'Unleash unconventional software concepts. Build prototypes that disrupt established norms and explore next-generation tech architectures.',
      bullets: [
        'Experimental tech stacks & AI integrations',
        'Freedom to tackle non-standard problem angles',
        'Judging focused on ingenuity & technical execution',
      ],
    },
    {
      title: 'Team Dynamics',
      tag: 'SQUAD COHESION',
      icon: <Users className="w-5 h-5 text-black" />,
      description:
        'Connect with software engineers, product designers, and technical visionaries to assemble high-output, cross-functional squads.',
      bullets: [
        'Matchmaking engine for solo builders and squads',
        'Squads of 1 to 5 collaborative builders',
        'Shared Git repositories & rapid agile sprints',
      ],
    },
    {
      title: 'Expert Mentorship',
      tag: 'ARCHITECTURAL ADVICE',
      icon: <Award className="w-5 h-5 text-[#FF007F]" />,
      description:
        'Get feedback and unblock technical hurdles with dedicated mentors who bring production engineering and system design experience.',
      bullets: [
        'On-demand code reviews and debugging assistance',
        'Architectural guidance during system formation',
        'Pitch critique and presentation readiness support',
      ],
    },
    {
      title: 'Real-World Utility',
      tag: 'TANGIBLE VALUE',
      icon: <Briefcase className="w-5 h-5 text-black" />,
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
    <section id="highlights" className="py-24 bg-neutral-50/70 border-b border-black/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="pink" size="md">
            EVENT HIGHLIGHTS
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
            CRAFTED FOR{' '}
            <span className="gradient-text-neon italic">EXCEPTIONAL MINDS.</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
            Every element of WAMPIRE is intentionally crafted to elevate your technical prowess, expand your professional network, and push the envelope of software design.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Top Accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FF007F] transition-all">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-700 bg-neutral-100 border border-black/10 px-3 py-1 rounded-full font-semibold">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-black mb-3 group-hover:text-[#FF007F] transition-colors">
                  {card.title}
                </h3>

                <p className="text-sm text-neutral-600 leading-relaxed mb-6 font-sans">
                  {card.description}
                </p>

                <div className="space-y-2.5">
                  {card.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2.5 text-xs text-neutral-700">
                      <div className="w-4 h-4 rounded-full bg-[#FF007F]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#FF007F]" />
                      </div>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-black/10 flex items-center justify-between text-xs font-mono text-neutral-500 uppercase tracking-widest">
                <span>[ MODULE 0{idx + 1} ]</span>
                <span className="text-[#FF007F] font-bold">READY</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EventHighlights;
