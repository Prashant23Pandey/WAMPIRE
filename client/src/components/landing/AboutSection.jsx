import React from 'react';
import { Lightbulb, Compass, Rocket, Code, Terminal, Check } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { ABOUT_PILLARS } from '../../utils/constants.js';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="primary" size="md">
            About The Initiative
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            The CODE-A-NOVA Story
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Founded on the principle that the most transformative software is built through collaboration, rigor, and hands-on experimentation.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6 text-slate-600 leading-relaxed text-base">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              Bridging the gap between conceptual theory and production engineering.
            </h3>
            <p>
              The <strong className="text-slate-900">CODE-A-NOVA initiative</strong> was conceived to create a high-velocity development arena where ambitious minds test bold ideas. Too often, engineering potential remains confined to classroom exercises or fragmented personal repos. CODE-A-NOVA provides the crucible to turn concepts into demonstrable applications.
            </p>
            <p>
              Whether you are an undergraduate exploring your first distributed system, a full-stack engineer architecting complex APIs, or an algorithmic researcher deploying intelligent models, the platform serves as an incubator for your craft.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Merit-Based Growth</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Focusing strictly on technical capability and creativity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Open-Source Spirit</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Encouraging peer code reviews and public artifact sharing.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Feature Panel */}
          <div className="lg:col-span-5 bg-gradient-to-tr from-slate-50 to-blue-50/50 rounded-3xl p-8 border border-slate-200 shadow-soft-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-electric">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Initiative Mandate</h4>
                <p className="text-xs text-slate-500 font-mono">Our foundational compass</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {ABOUT_PILLARS.map((pillar, pIdx) => (
                <div key={pIdx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft-sm">
                  <h5 className="text-sm font-bold text-slate-900 mb-1">{pillar.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;

