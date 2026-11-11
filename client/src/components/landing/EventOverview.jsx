import React from 'react';
import { Target, Lightbulb, Users2, Cpu, ArrowUpRight } from 'lucide-react';
import Badge from '../common/Badge.jsx';

export const EventOverview = () => {
  const pillars = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: 'Problem-Solving Focus',
      description:
        'Participants confront authentic, complex friction points. We place real problem definitions at the center, demanding durable solutions that deliver verifiable utility.',
      badge: 'Purpose-Driven',
      bg: 'bg-blue-50/70',
      border: 'border-blue-100',
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-violet-600" />,
      title: 'Innovation',
      description:
        'Break away from routine patterns. Experiment with modern architectures, inventive workflows, and intelligent algorithms that challenge conventional limits.',
      badge: 'Unconstrained',
      bg: 'bg-violet-50/70',
      border: 'border-violet-100',
    },
    {
      icon: <Users2 className="w-6 h-6 text-indigo-600" />,
      title: 'Collaboration',
      description:
        'Software at scale is a team sport. Form multidisciplinary squads, share context in real time, and experience the adrenaline of shipping together under pressure.',
      badge: 'Synergistic',
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-100',
    },
    {
      icon: <Cpu className="w-6 h-6 text-blue-600" />,
      title: 'Technology',
      description:
        'Harness the modern development stack—from scalable Node/Express APIs and MongoDB backends to reactive Vite interfaces, cloud tools, and intelligent agents.',
      badge: 'Next-Gen Stack',
      bg: 'bg-blue-50/70',
      border: 'border-blue-100',
    },
  ];

  return (
    <section id="event" className="py-20 lg:py-28 bg-white border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="primary" size="md">
            Event Overview
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            An Arena Engineered For Builders
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            CODE-A-NOVA is an intensive technology hackathon created to unite aspiring builders, seasoned engineers, and visionary thinkers. Over a collaborative sprint, participants ideate, prototype, and demonstrate high-impact software solutions designed for real-world adoption.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className={`p-7 rounded-2xl bg-white border ${item.border} shadow-soft-sm hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-600">
                <span>Core Pillar</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default EventOverview;

