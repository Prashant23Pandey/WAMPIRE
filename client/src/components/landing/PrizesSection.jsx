import React from 'react';
import { Trophy, Medal, Award, Check } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { PRIZE_TIERS } from '../../utils/constants.js';

export const PrizesSection = () => {
  const trophyIcons = [
    <Trophy className="w-7 h-7 text-[#FF007F]" />,
    <Medal className="w-7 h-7 text-black" />,
    <Award className="w-7 h-7 text-[#FF007F]" />,
  ];

  return (
    <section id="prizes" className="py-24 bg-white border-b border-black/10 relative tech-grid-light">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[350px] bg-[#FF007F]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <Badge variant="pink" size="md">
            BOUNTY & RECOGNITION
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
            REWARDING EXCEPTIONAL{' '}
            <span className="gradient-text-neon italic">CRAFT.</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
            Configurable award packages engineered to accelerate top engineering squads with immediate capital grants, incubation mentorship, and production tool access.
          </p>
        </div>

        {/* 3 Prize Cards on Light Theme with Pink Outlines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRIZE_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between relative overflow-hidden bg-white border ${
                tier.highlight
                  ? 'border-2 border-[#FF007F] shadow-[0_12px_40px_-5px_rgba(255,0,127,0.22)] lg:-translate-y-2'
                  : 'border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.12)]'
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 bg-[#FF007F] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-glow-pink-sm">
                  TOP TIER PURSE
                </div>
              )}

              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center">
                    {trophyIcons[idx]}
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full border font-bold ${
                      tier.highlight
                        ? 'bg-[#FF007F]/10 text-[#FF007F] border-[#FF007F]/30'
                        : 'bg-neutral-100 text-neutral-700 border-black/10'
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                {/* Rank & Title */}
                <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                  [ {tier.rank} ]
                </div>
                <h3 className="text-2xl font-serif font-bold text-black mb-2">
                  {tier.title}
                </h3>

                {/* Amount Box */}
                <div className={`my-6 p-5 rounded-2xl border ${tier.highlight ? 'bg-[#FF007F]/5 border-[#FF007F]/30' : 'bg-neutral-50 border-black/10'}`}>
                  <div className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest mb-1">
                    Grant Allocation
                  </div>
                  <div className={`text-2xl sm:text-3xl font-serif font-black tracking-tight ${tier.highlight ? 'text-[#FF007F]' : 'text-black'}`}>
                    {tier.reward}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-1">
                    Configurable award grant package
                  </div>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-sans">
                  {tier.subtitle}
                </p>

                {/* Perks Checklist */}
                <div className="space-y-3 pt-4 border-t border-black/10">
                  <div className="text-xs font-mono uppercase tracking-wider text-black mb-2 font-bold">
                    Package Inclusions:
                  </div>
                  {tier.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 font-sans">
                      <div className="w-4 h-4 rounded-full bg-[#FF007F]/10 flex items-center justify-center shrink-0 mt-0.5 border border-[#FF007F]/20">
                        <Check className="w-2.5 h-2.5 text-[#FF007F]" />
                      </div>
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between text-xs font-mono text-neutral-500">
                <span>Award Track</span>
                <span className="text-[#FF007F] font-bold">CONFIGURED</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PrizesSection;
