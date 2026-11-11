import React from 'react';
import { UserCheck, Users, FileText, Code2, CheckSquare, Trophy } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { TIMELINE_STEPS } from '../../utils/constants.js';

export const TimelineSection = () => {
  const stepIcons = [
    <UserCheck className="w-5 h-5 text-[#FF007F]" />,
    <Users className="w-5 h-5 text-black" />,
    <FileText className="w-5 h-5 text-[#FF007F]" />,
    <Code2 className="w-5 h-5 text-black" />,
    <CheckSquare className="w-5 h-5 text-[#FF007F]" />,
    <Trophy className="w-5 h-5 text-black" />,
  ];

  return (
    <section id="timeline" className="py-24 bg-white border-b border-black/10 relative tech-grid-light">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#FF007F]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <Badge variant="pink" size="md">
            HACKATHON TIMELINE
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
            FROM BLUEPRINT TO{' '}
            <span className="gradient-text-neon italic">DEPLOYMENT.</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
            A dynamic 5-phase roadmap mapping your trajectory from initial account setup and squad formation to final production review and victory.
          </p>
        </div>

        {/* Timeline Steps Grid (6 steps) on Light Theme */}
        <div className="relative">
          {/* Subtle connecting line across desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF007F]/30 to-transparent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {TIMELINE_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FF007F] transition-all">
                      {stepIcons[idx]}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-500">
                        [{step.step}]
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF007F] bg-[#FF007F]/10 border border-[#FF007F]/30 px-2.5 py-1 rounded-full font-bold">
                        {step.phase}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-black mb-2 group-hover:text-[#FF007F] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse" />
                    <span className="text-xs font-mono font-bold text-neutral-800 uppercase tracking-wider">
                      {step.title} Stage
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 font-semibold">SYNCED</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TimelineSection;
