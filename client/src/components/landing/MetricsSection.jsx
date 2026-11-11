import React from 'react';
import { Users, Award, Clock, Code, Sparkles } from 'lucide-react';

export const MetricsSection = () => {
  const metrics = [
    {
      id: 'registrations',
      label: 'Total Registrations',
      value: '900+',
      suffix: 'BUILDERS',
      description: 'Engineers, designers, and innovators registered across premier technical campuses.',
      icon: Users,
    },
    {
      id: 'prize-pool',
      label: 'Cash & Grant Pool',
      value: '₹1.5L+',
      suffix: 'IN AWARDS',
      description: 'Substantial bounty purse distributed across Champion, Runners Up, and track categories.',
      icon: Award,
    },
    {
      id: 'sprint-duration',
      label: 'Non-Stop Hackathon',
      value: '48h',
      suffix: 'CONTINUOUS',
      description: 'Intense day-and-night marathon from ideation to architectural deployment.',
      icon: Clock,
    },
    {
      id: 'engineering-tracks',
      label: 'Core Domains',
      value: '05',
      suffix: 'SPECIALIZATIONS',
      description: 'AI/ML Systems, Web3 & FinTech, Healthcare Tech, Cloud DevOps, and Open Innovation.',
      icon: Code,
    },
  ];

  return (
    <section className="relative py-20 bg-neutral-50/80 border-y border-black/10 tech-grid-light overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[250px] bg-[#FF007F]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-black/10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black/10 text-[11px] font-mono text-[#FF007F] uppercase tracking-widest mb-3 shadow-sm">
              <Sparkles className="w-3 h-3 text-[#FF007F]" />
              <span>[ 01 // IMPACT BENCHMARKS ]</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-black">
              OUR EXISTENCE IN{' '}
              <span className="gradient-text-neon italic">NUMBERS.</span>
            </h2>
          </div>
          <p className="text-sm font-mono text-neutral-600 max-w-sm">
            Proven community scale engineered to catalyze breakthrough software prototypes into production reality.
          </p>
        </div>

        {/* 4-Box Grid with Crisp Borders & Pink Accent Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.id}
                className="group relative bg-white rounded-3xl p-7 border border-black/10 hover:border-[#FF007F] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] overflow-hidden flex flex-col justify-between"
              >
                {/* Subtle top edge glow bar on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
                      {metric.suffix}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center text-[#FF007F] group-hover:scale-110 group-hover:bg-[#FF007F] group-hover:text-white transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Big Number */}
                  <div className="text-4xl sm:text-5xl font-serif font-black text-black tracking-tight group-hover:text-[#FF007F] transition-colors">
                    {metric.value}
                  </div>

                  <h3 className="text-base font-display font-bold text-neutral-900 mt-2">
                    {metric.label}
                  </h3>
                </div>

                <p className="text-xs text-neutral-600 mt-4 leading-relaxed font-sans border-t border-black/5 pt-3">
                  {metric.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default MetricsSection;
