import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Sparkles } from 'lucide-react';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';
import CrowdCanvas from '../common/CrowdCanvas.jsx';

export const CommunitySection = () => {
  // Monochrome custom developer avatars representing the community illustration grid (Light Mode)
  const builders = [
    {
      handle: '@0xneo',
      role: 'Fullstack Architect',
      status: 'Deploying Microservices',
      stack: 'React • Go • Rust',
      avatarSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current fill-none stroke-[2]">
          <circle cx="50" cy="50" r="42" className="stroke-neutral-300" />
          <circle cx="50" cy="42" r="16" className="stroke-black" />
          <path d="M26 80c0-14 11-22 24-22s24 8 24 22" className="stroke-black" />
          <path d="M40 38h4M56 38h4" className="stroke-[#FF007F] stroke-[3]" />
          <path d="M45 52q5 4 10 0" className="stroke-black" />
        </svg>
      ),
    },
    {
      handle: '@cypher_alice',
      role: 'Security & Systems',
      status: 'Auditing Contracts',
      stack: 'Solidity • Node • C++',
      avatarSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current fill-none stroke-[2]">
          <circle cx="50" cy="50" r="42" className="stroke-neutral-300" />
          <path d="M35 30h30v40H35z" className="stroke-black" />
          <path d="M30 40h40" className="stroke-[#FF007F] stroke-[2]" />
          <circle cx="45" cy="48" r="3" className="fill-[#FF007F]" />
          <circle cx="55" cy="48" r="3" className="fill-[#FF007F]" />
          <path d="M44 60h12" className="stroke-black" />
        </svg>
      ),
    },
    {
      handle: '@tensor_dan',
      role: 'AI / Model Engineer',
      status: 'Fine-tuning LLMs',
      stack: 'PyTorch • CUDA • Python',
      avatarSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current fill-none stroke-[2]">
          <circle cx="50" cy="50" r="42" className="stroke-neutral-300" />
          <circle cx="50" cy="40" r="18" className="stroke-black" />
          <path d="M38 38a5 5 0 0 1 10 0M52 38a5 5 0 0 1 10 0" className="stroke-[#FF007F] stroke-[2]" />
          <path d="M46 50q4 3 8 0" className="stroke-black" />
          <path d="M30 82c2-12 10-18 20-18s18 6 20 18" className="stroke-black" />
        </svg>
      ),
    },
    {
      handle: '@pixel_priya',
      role: 'Design Technologist',
      status: 'Crafting UI Systems',
      stack: 'Figma • Tailwind • GLSL',
      avatarSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current fill-none stroke-[2]">
          <circle cx="50" cy="50" r="42" className="stroke-neutral-300" />
          <rect x="36" y="32" width="28" height="28" rx="8" className="stroke-black" />
          <circle cx="44" cy="42" r="3" className="fill-[#FF007F]" />
          <circle cx="56" cy="42" r="3" className="fill-[#FF007F]" />
          <path d="M44 52h12" className="stroke-black" />
          <path d="M28 80c4-10 12-16 22-16s18 6 22 16" className="stroke-black" />
        </svg>
      ),
    },
    {
      handle: '@kernel_vikram',
      role: 'DevOps & Cloud',
      status: 'Scaling Kubernetes',
      stack: 'Docker • K8s • AWS',
      avatarSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current fill-none stroke-[2]">
          <circle cx="50" cy="50" r="42" className="stroke-neutral-300" />
          <polygon points="50,28 68,40 68,62 50,74 32,62 32,40" className="stroke-black" />
          <circle cx="50" cy="50" r="7" className="stroke-[#FF007F] fill-[#FF007F]/20" />
          <line x1="50" y1="28" x2="50" y2="43" className="stroke-black" />
          <line x1="68" y1="62" x2="55" y2="54" className="stroke-black" />
          <line x1="32" y1="62" x2="45" y2="54" className="stroke-black" />
        </svg>
      ),
    },
    {
      handle: '@sara_code',
      role: 'Mobile & IoT Engineer',
      status: 'Syncing Bluetooth Mesh',
      stack: 'Flutter • Swift • Kotlin',
      avatarSvg: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-current fill-none stroke-[2]">
          <circle cx="50" cy="50" r="42" className="stroke-neutral-300" />
          <circle cx="50" cy="40" r="14" className="stroke-black" />
          <path d="M42 38h4M54 38h4" className="stroke-[#FF007F] stroke-[3]" />
          <path d="M46 48h8" className="stroke-black" />
          <path d="M30 78c0-12 9-18 20-18s20 6 20 18" className="stroke-black" />
        </svg>
      ),
    },
  ];

  const marqueeTags = [
    '500+ BUILDERS',
    '30+ UNIVERSITIES',
    '₹1.5L+ PURSE',
    '48 HOURS SPRINT',
    'ZERO SLIDE DECKS',
    '100% PRODUCTION CODE',
    'MERN STACK',
    'AI INTEGRATIONS',
    'MUMBAI // GLOBAL',
    'EST. 2026',
  ];

  return (
    <section className="py-24 bg-white border-b border-black/10 relative overflow-hidden tech-grid-light">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[350px] bg-[#FF007F]/5 rounded-full blur-[170px] pointer-events-none" />

      {/* Top Infinite Running Marquee */}
      <div className="border-y border-black/10 py-3.5 bg-neutral-100 overflow-hidden whitespace-nowrap mb-16 flex">
        <div className="animate-marquee inline-flex gap-8 items-center text-xs font-mono tracking-widest text-neutral-600">
          {[...marqueeTags, ...marqueeTags].map((tag, idx) => (
            <span key={idx} className="inline-flex items-center gap-4">
              <span className="text-[#FF007F]">★</span>
              <span className="text-black font-semibold hover:text-[#FF007F] transition-colors">{tag}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <Badge variant="pink" size="md">
            COMMUNITY & BUILDER SQUADS
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
            MEET THE MINDS IN THE{' '}
            <span className="gradient-text-neon italic">ARENA.</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
            A diverse collective of polyglot developers, systems architects, and product dreamers. When you join WAMPIRE, you become part of an elite network of makers.
          </p>
        </div>

        {/* Monochrome Custom Character Illustration Grid (Reco Labs Style on Light) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {builders.map((builder, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl p-6 border border-black/10 hover:border-[#FF007F] transition-all duration-300 hover:shadow-[0_12px_35px_-5px_rgba(255,0,127,0.18)] hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Pink wipe hover effect */}
              <div className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/[0.02] transition-colors pointer-events-none" />

              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-2 rounded-2xl bg-neutral-50 border border-black/10 group-hover:border-[#FF007F]/40 group-hover:scale-105 transition-all text-neutral-800">
                  {builder.avatarSvg}
                </div>
                <div>
                  <h4 className="font-mono font-bold text-black text-base group-hover:text-[#FF007F] transition-colors">
                    {builder.handle}
                  </h4>
                  <p className="text-xs text-neutral-500 font-sans">{builder.role}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-pulse" />
                    <span className="text-[10px] font-mono text-neutral-700">{builder.status}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-neutral-600 relative z-10">
                <span>{builder.stack}</span>
                <span className="text-[#FF007F] font-bold">VERIFIED</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reco Labs Hand-Drawn Community Crowd Showcase */}
        <div className="relative rounded-3xl bg-white border border-black/10 overflow-hidden mb-16 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] group">
          <div className="p-6 sm:p-8 text-center space-y-2 border-b border-black/10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#FF007F] block">
              [ 500+ BUILDERS REGISTERED & WALKING THE ARENA ]
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-black text-black">
              The Living Vampire Community
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 font-sans max-w-lg mx-auto">
              Inspired by the open-source guild culture of Reco Labs. Watch our registered developers, hackers, and creators journey across the stage in real-time.
            </p>
          </div>

          {/* Dynamic Walking Crowd Canvas */}
          <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] overflow-hidden bg-gradient-to-b from-white via-neutral-50/50 to-white">
            <CrowdCanvas className="w-full h-full" id="crowd-canvas-community" />
            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>

          {/* Crowd Character Grid Banner (Attached by User) */}
          <div className="border-t border-black/10 p-4 sm:p-6 bg-neutral-50/60 relative overflow-hidden">
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-black/10 bg-white relative">
              <img
                src="/crowd-banner.jpg"
                alt="WAMPIRE Builder Community - Open Peeps Illustration"
                className="w-full h-auto object-cover grayscale contrast-125 transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bottom Banner Call to Action */}
        <div className="rounded-3xl bg-neutral-50 border border-black/10 p-8 sm:p-12 relative overflow-hidden text-center shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent" />
          
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-4xl font-serif font-black text-black">
              Ready to claim your place in the arena?
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed font-sans">
              Registrations are officially open. Assemble your team of up to 5, choose your specialization track, and prepare to ship software that makes a mark.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider font-bold shadow-glow-pink"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Create Hacker Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider text-black bg-white border border-black/15 hover:border-black/30"
                >
                  Inquire As Partner
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CommunitySection;
