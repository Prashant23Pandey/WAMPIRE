import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Shield, Cpu, Code2, Users2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import AboutSection from '../components/landing/AboutSection.jsx';
import CommunitySection from '../components/landing/CommunitySection.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';

export const AboutPage = () => {
  const manifestoPoints = [
    {
      num: '01',
      title: 'Real Code Over Slides',
      desc: 'We judge projects on their actual repository commits, running services, and live interfaces. A functional CLI or API beats an animated Figma mock every day.',
    },
    {
      num: '02',
      title: 'Squad Autonomy & Grit',
      desc: 'You decide the stack, the tools, and the architectural paradigm. We supply the high-pressure environment, mentor support, and objective evaluation.',
    },
    {
      num: '03',
      title: 'Production-First Thinking',
      desc: 'Prototypes must be engineered to scale. We look for clean database schemas, error handling, auth security, and defensive programming.',
    },
    {
      num: '04',
      title: 'Merit Above Credentials',
      desc: 'It does not matter which university you attend or how many followers you have. In the Wampire arena, your code speaks for itself.',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-white text-black pt-24">
      {/* 1. The Story of Wampire (Founders & Origins) */}
      <AboutSection />

      {/* 2. The Wampire Engineering Manifesto */}
      <section className="py-24 bg-neutral-50/70 border-b border-black/10 relative tech-grid-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Badge variant="pink" size="md">
              THE BUILDER MANIFESTO
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
              THE PRINCIPLES THAT{' '}
              <span className="gradient-text-neon italic">GOVERN US.</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
              Our non-negotiable core beliefs that separate WAMPIRE from traditional slide-deck hackathons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {manifestoPoints.map((point) => (
              <div
                key={point.num}
                className="bg-white rounded-3xl p-8 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 flex items-start gap-6 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center text-[#FF007F] font-mono text-xl font-black shrink-0 group-hover:scale-110 transition-transform">
                  {point.num}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2 group-hover:text-[#FF007F] transition-colors">
                    {point.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick CTA Box */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/10 text-center max-w-3xl mx-auto shadow-sm">
            <h3 className="text-2xl font-serif font-bold text-black mb-3">
              Ready to write history with your squad?
            </h3>
            <p className="text-sm text-neutral-600 max-w-xl mx-auto mb-6">
              Registrations are free and open to all builders. Join the next edition of WAMPIRE today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" size="md" className="font-mono text-xs uppercase tracking-wider font-bold shadow-glow-pink">
                  Create Hacker Account
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="secondary" size="md" className="font-mono text-xs uppercase tracking-wider text-black bg-white border border-black/15">
                  Inspect All Tracks
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Community Builders Section before footer */}
      <CommunitySection />
    </div>
  );
};

export default AboutPage;

