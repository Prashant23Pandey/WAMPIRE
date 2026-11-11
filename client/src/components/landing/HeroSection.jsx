import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Terminal, Cpu, GitBranch, Check, Zap } from 'lucide-react';
import Button from '../common/Button.jsx';

export const HeroSection = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white tech-grid-light">
      {/* Background subtle radial pink glow accents */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#FF007F]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-28 w-80 h-80 bg-[#FF007F]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-28 w-96 h-96 bg-[#FF007F]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">
            {/* Floating Pill Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#FF007F]/40 shadow-[0_2px_15px_rgba(255,0,127,0.15)] text-xs font-mono font-bold text-black">
                <span className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse" />
                <span className="uppercase tracking-widest text-[#FF007F]">
                  REGISTRATION PHASE ACTIVE
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#FF007F]" />
              </div>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-neutral-100 border border-black/10 text-[11px] font-mono uppercase tracking-wider text-neutral-700">
                EST. 2026 // EDITION II
              </span>
            </div>

            {/* Main Editorial Heading */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-[#FF007F] font-bold">
                [ THE PREMIER TECH HACKATHON ]
              </p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black text-black tracking-tight leading-[1.05]">
                AN ARENA ENGINEERED FOR{' '}
                <span className="gradient-text-neon italic block sm:inline">
                  BUILDERS.
                </span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Where ambitious engineers assemble to break boundaries. 48 hours of intense coding, architectural grit, and scalable product deployment.
            </p>

            {/* Action Buttons: Pill shaped with glow */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-sm uppercase tracking-wider font-mono font-bold shadow-glow-pink"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Register Now
                </Button>
              </Link>
              <Link to="/events" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto text-sm uppercase tracking-wider font-mono text-black bg-white border border-black/15 hover:border-black/30 shadow-sm"
                >
                  Explore Tracks
                </Button>
              </Link>
            </div>

            {/* Reco-style Value Indicators */}
            <div className="pt-6 border-t border-black/10 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Environment</p>
                <p className="text-sm font-display font-bold text-black mt-1">High Intensity</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Prize Pool</p>
                <p className="text-sm font-display font-bold text-[#FF007F] mt-1">₹1,50,000 INR</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Sprint Span</p>
                <p className="text-sm font-display font-bold text-black mt-1">48 Hours Live</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visually Attractive High-Tech Terminal Card on White */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Outer Decorative Glow Frame */}
              <div className="relative rounded-3xl bg-white p-4 sm:p-6 border border-black/10 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)]">
                
                {/* Central Code Terminal Card */}
                <div className="bg-neutral-50 rounded-2xl border border-black/10 overflow-hidden shadow-inner">
                  
                  {/* Terminal Header */}
                  <div className="bg-neutral-100 px-4 py-3 border-b border-black/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF007F] inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 inline-block" />
                    </div>
                    <div className="text-[11px] font-mono font-medium text-neutral-700 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#FF007F]" />
                      <span>wampire-core.ts</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#FF007F] font-bold uppercase tracking-wider">LIVE</span>
                  </div>

                  {/* Terminal Code Snippet Preview */}
                  <div className="p-5 font-mono text-xs leading-relaxed text-neutral-800 space-y-2 bg-white">
                    <div className="text-neutral-400">// Assembling project squad & pipeline</div>
                    <div>
                      <span className="text-[#FF007F] font-bold">const</span>{' '}
                      <span className="text-black font-semibold">squad</span> ={' '}
                      <span className="text-[#FF007F] font-bold">await</span>{' '}
                      <span className="text-black font-black tracking-wide">Wampire</span>.
                      <span className="text-[#FF007F] font-bold">deploy</span>({`{`}
                    </div>
                    <div className="pl-4 text-neutral-600">
                      track: <span className="text-black font-medium">'NextGen Autonomous Engineering'</span>,
                    </div>
                    <div className="pl-4 text-neutral-600">
                      squadCap: <span className="text-[#FF007F] font-bold">5</span>,
                    </div>
                    <div className="pl-4 text-neutral-600">
                      architecture: <span className="text-black font-medium">'MERN + Cloud Microservices'</span>,
                    </div>
                    <div className="pl-4 text-neutral-600">
                      status: <span className="text-[#FF007F] font-semibold">'PRODUCTION_READY'</span>
                    </div>
                    <div>{`});`}</div>
                    <div className="pt-2 flex items-center gap-2 text-black font-mono font-medium border-t border-black/10">
                      <Check className="w-4 h-4 text-[#FF007F]" />
                      <span>Pipeline armed. Hacker sprint live.</span>
                    </div>
                  </div>
                </div>

                {/* Floating Abstract Element 1: Git Branch Node */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3 border border-black/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-float">
                  <div className="w-8 h-8 rounded-xl bg-[#FF007F]/10 text-[#FF007F] flex items-center justify-center border border-[#FF007F]/20">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-black">Sprint Branch</div>
                    <div className="text-[10px] text-neutral-500 font-mono">origin/main → ship</div>
                  </div>
                </div>

                {/* Floating Abstract Element 2: Architecture Node */}
                <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white rounded-2xl p-3 border border-black/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="w-8 h-8 rounded-xl bg-[#FF007F]/10 text-[#FF007F] flex items-center justify-center border border-[#FF007F]/20">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-black">System Core</div>
                    <div className="text-[10px] text-[#FF007F] font-mono flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-pulse" />
                      100% Operational
                    </div>
                  </div>
                </div>

                {/* Floating Abstract Element 3: Collaboration Badge */}
                <div className="absolute top-1/2 -right-5 sm:-right-7 -translate-y-1/2 bg-white rounded-full px-3.5 py-1.5 border border-[#FF007F]/40 shadow-sm hidden sm:flex items-center gap-2 animate-float" style={{ animationDelay: '4s' }}>
                  <Zap className="w-3.5 h-3.5 text-[#FF007F]" />
                  <span className="text-[11px] font-mono font-bold text-black">48-Hr Sprint</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
