import React from 'react';
import { Target, Lightbulb, Users2, Cpu, ArrowUpRight } from 'lucide-react';
import Badge from '../common/Badge.jsx';

export const EventOverview = () => {
  const pillars = [
    {
      icon: <Target className="w-5 h-5 text-[#FF007F]" />,
      title: 'Problem-Solving Focus',
      description:
        'Participants confront authentic, complex friction points. We place real problem definitions at the center, demanding durable solutions that deliver verifiable utility.',
      badge: 'PURPOSE-DRIVEN',
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-black" />,
      title: 'Radical Innovation',
      description:
        'Break away from routine boilerplate. Experiment with modern architectures, inventive workflows, and intelligent algorithms that challenge conventional limits.',
      badge: 'UNCONSTRAINED',
    },
    {
      icon: <Users2 className="w-5 h-5 text-[#FF007F]" />,
      title: 'Squad Synergy',
      description:
        'Software at scale is a team sport. Form multidisciplinary squads, share context in real time, and experience the adrenaline of shipping together under pressure.',
      badge: 'COLLABORATIVE',
    },
    {
      icon: <Cpu className="w-5 h-5 text-black" />,
      title: 'Modern Architecture',
      description:
        'Harness the modern full stack—from reactive interfaces and resilient Node/Express backends to distributed cloud pipelines and intelligent developer tools.',
      badge: 'NEXT-GEN STACK',
    },
  ];

  return (
    <section id="event" className="py-24 bg-white border-b border-black/10 relative tech-grid-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="pink" size="md">
            EVENT FOUNDATIONS
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
            ENGINEERED FOR{' '}
            <span className="gradient-text-neon italic">PURPOSE.</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
            WAMPIRE is an intensive technology hackathon created to unite aspiring builders, seasoned engineers, and visionary thinkers. Over a collaborative sprint, participants ideate, prototype, and demonstrate high-impact software solutions designed for real-world adoption.
          </p>
        </div>

        {/* 4 Pillars Grid on Light Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FF007F] transition-all">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-700 bg-neutral-100 border border-black/10 px-2.5 py-1 rounded-full font-semibold">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-black mb-2 group-hover:text-[#FF007F] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-500 group-hover:text-black transition-colors">
                <span>[ PILLAR 0{idx + 1} ]</span>
                <ArrowUpRight className="w-4 h-4 text-[#FF007F] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EventOverview;
