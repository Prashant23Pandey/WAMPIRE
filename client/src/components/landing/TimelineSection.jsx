import React from 'react';
import { UserCheck, Users, FileText, Code2, CheckSquare, Trophy } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import { TIMELINE_STEPS } from '../../utils/constants.js';

export const TimelineSection = () => {
  const stepIcons = [
    <UserCheck className="w-5 h-5 text-blue-600" />,
    <Users className="w-5 h-5 text-violet-600" />,
    <FileText className="w-5 h-5 text-indigo-600" />,
    <Code2 className="w-5 h-5 text-blue-600" />,
    <CheckSquare className="w-5 h-5 text-emerald-600" />,
    <Trophy className="w-5 h-5 text-amber-500" />,
  ];

  return (
    <section id="timeline" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-20">
          <Badge variant="primary" size="md">
            Hackathon Timeline
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            From Blueprint to Working Prototype
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            A step-by-step roadmap mapping the hackathon progression from initial registration to final evaluation.
          </p>
        </div>

        {/* Timeline Steps Grid (6 steps) */}
        <div className="relative">
          {/* Subtle connecting line across desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-100 via-indigo-100 to-violet-100 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {TIMELINE_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-soft-sm hover:shadow-soft-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-soft-sm">
                      {stepIcons[idx]}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {step.step}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                        {step.phase}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {step.title} Stage
                  </span>
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

