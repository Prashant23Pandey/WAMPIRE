import React from 'react';
import { Trophy, Medal, Award, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { PRIZE_TIERS } from '../../utils/constants.js';

export const PrizesSection = () => {
  const trophyIcons = [
    <Trophy className="w-8 h-8 text-amber-500" />,
    <Medal className="w-8 h-8 text-slate-500" />,
    <Award className="w-8 h-8 text-amber-700" />,
  ];

  return (
    <section id="prizes" className="py-20 lg:py-28 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="violet" size="md">
            Prizes & Recognition
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Rewarding Exceptional Craftsmanship
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Configurable award grants and technical enablement packages designed to fuel your project beyond the hackathon.
          </p>
        </div>

        {/* 3 Prize Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRIZE_TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between relative overflow-hidden bg-white border ${
                tier.highlight
                  ? 'border-blue-400 shadow-electric lg:-translate-y-2 ring-2 ring-blue-500/20'
                  : 'border-slate-200/90 shadow-soft-sm hover:shadow-soft-xl hover:border-slate-300'
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-violet-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-xl shadow-sm">
                  Top Tier Award
                </div>
              )}

              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-soft-sm">
                    {trophyIcons[idx]}
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      tier.highlight
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                {/* Rank & Title */}
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                  {tier.rank}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                  {tier.title}
                </h3>

                {/* Configurable Amount Box */}
                <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                    Grant Allocation
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {tier.reward}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Configurable by hackathon organizers
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {tier.subtitle}
                </p>

                {/* Perks Checklist */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Package Inclusions:
                  </div>
                  {tier.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom tag */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Verified Official Category</span>
              </div>
            </div>
          ))}
        </div>

        {/* Note on Configurable Details */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            * Specific grant sums, partner API allowances, and hardware allocations are determined and finalized per competition season by organizing partners.
          </p>
        </div>

      </div>
    </section>
  );
};

export default PrizesSection;

