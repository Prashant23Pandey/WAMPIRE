import React from 'react';
import { Terminal, Quote, Shield } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { ABOUT_PILLARS } from '../../utils/constants.js';

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white border-b border-black/10 relative tech-grid-light">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[650px] h-[350px] bg-[#FF007F]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <Badge variant="pink" size="md">
            FOUNDERS & ORIGINS
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
            THE STORY OF{' '}
            <span className="gradient-text-neon italic">WAMPIRE.</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
            Founded on the conviction that the most transformative software is forged through architectural rigor, authentic collaboration, and sleepless nights of passionate engineering.
          </p>
        </div>

        {/* Narrative & Founder's Statement Grid on Light Theme */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch mb-16">
          
          {/* Left Column: The Founder's Note (Reco Labs Style) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
            {/* Top Accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent opacity-80" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF007F] font-bold">
                  [ FOUNDER DISPATCH // VOL. 02 ]
                </span>
                <Quote className="w-8 h-8 text-[#FF007F]/30" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-black tracking-tight leading-snug">
                "We built Wampire because hackathons became slide decks. We craved an arena of pure software craftsmanship."
              </h3>

              <div className="space-y-4 text-sm text-neutral-600 font-sans leading-relaxed">
                <p>
                  In recent years, the developer spirit was too often diluted by polished slides and empty buzzwords. Real builders were sidelined by theoretical concepts with zero backend integrity.
                </p>
                <p>
                  <strong className="text-black">WAMPIRE</strong> was engineered to reverse that trend. Here, winning demands compiling code, verifiable unit tests, responsive user experiences, and microservices that actually spin up. We reward engineering muscle, aesthetic intuition, and structural resilience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/10">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center shrink-0 text-[#FF007F]">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-black">Merit-First Execution</h4>
                    <p className="text-[11px] text-neutral-600 mt-0.5">Evaluated purely on code capability and execution speed.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center shrink-0 text-[#FF007F]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-black">Open Source Heritage</h4>
                    <p className="text-[11px] text-neutral-600 mt-0.5">Championing peer-to-peer knowledge and lasting artifacts.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/10 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span className="font-serif italic text-black text-sm">Prashant & Wampire Core Guild</span>
              <span className="text-[#FF007F] font-bold">EST. 2026 // MUMBAI - GLOBAL</span>
            </div>
          </div>

          {/* Right Column: High-Contrast Duotone Vision Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {ABOUT_PILLARS.map((pillar, pIdx) => (
              <div
                key={pIdx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 relative overflow-hidden group flex-1 flex flex-col justify-between"
              >
                {/* Subtle Pink gradient accent background glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF007F]/5 rounded-full blur-2xl group-hover:bg-[#FF007F]/15 transition-all" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                      [ PILLAR 0{pIdx + 1} ]
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF007F] bg-[#FF007F]/10 px-2 py-0.5 rounded-full border border-[#FF007F]/20">
                      CORE TENET
                    </span>
                  </div>

                  <h4 className="text-xl font-display font-bold text-black mb-2 group-hover:text-[#FF007F] transition-colors">
                    {pillar.title}
                  </h4>

                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                  <span>Architecture</span>
                  <span className="text-black font-semibold">100% Validated</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;
