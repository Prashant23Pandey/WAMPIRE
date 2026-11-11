import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Terminal, Code2, Cpu, GitBranch, Layers, CheckCircle } from 'lucide-react';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';

export const HeroSection = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden tech-grid">
      {/* Background radial glow accents (Light theme subtle electric blue & violet) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-blue-200/40 via-violet-200/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 bg-blue-100/50 rounded-full blur-2xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-violet-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-8">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-soft-sm text-xs font-bold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent uppercase tracking-wider">
                Registration Phase Active
              </span>
              <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
              INNOVATE TODAY. <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                BUILD TOMORROW.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Where bold ideas meet brilliant minds. Build, collaborate and create solutions that matter.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto shadow-electric"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Register Now
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => scrollToSection('event')}
                className="w-full sm:w-auto"
              >
                Explore Event
              </Button>
            </div>

            {/* Value Indicators */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Environment</p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">High Energy</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Collaboration</p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">Squad Matching</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Outcomes</p>
                <p className="text-sm font-extrabold text-slate-800 mt-0.5">Real Impact</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visually Attractive Hackathon Abstract 3D Tech Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Outer Decorative Gradient Frame */}
              <div className="relative rounded-3xl bg-gradient-to-tr from-blue-500/10 via-violet-500/10 to-indigo-500/20 p-4 sm:p-6 backdrop-blur-xl border border-white/80 shadow-soft-xl">
                
                {/* Central Code Terminal Card */}
                <div className="bg-white rounded-2xl shadow-soft-md border border-slate-200/80 overflow-hidden">
                  
                  {/* Terminal Header */}
                  <div className="bg-slate-50/90 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                    </div>
                    <div className="text-[11px] font-mono font-medium text-slate-500 flex items-center gap-1">
                      <Terminal className="w-3.5 h-3.5 text-blue-600" />
                      <span>code-a-nova-build.sh</span>
                    </div>
                    <span className="w-8" />
                  </div>

                  {/* Terminal Code Snippet Preview */}
                  <div className="p-5 font-mono text-xs leading-relaxed text-slate-800 space-y-2 bg-gradient-to-b from-white to-slate-50/50">
                    <div className="text-slate-400">// Assembling project squad & pipeline</div>
                    <div>
                      <span className="text-violet-600 font-semibold">const</span>{' '}
                      <span className="text-blue-600 font-semibold">solution</span> ={' '}
                      <span className="text-violet-600 font-semibold">await</span>{' '}
                      <span className="text-slate-900 font-bold">CodeANova</span>.
                      <span className="text-blue-600">ignite</span>({`{`}
                    </div>
                    <div className="pl-4 text-slate-600">
                      track: <span className="text-emerald-600 font-medium">'NextGen Engineering'</span>,
                    </div>
                    <div className="pl-4 text-slate-600">
                      squadSize: <span className="text-blue-600 font-medium">4</span>,
                    </div>
                    <div className="pl-4 text-slate-600">
                      focus: <span className="text-emerald-600 font-medium">'Scalable Real-World Impact'</span>,
                    </div>
                    <div className="pl-4 text-slate-600">
                      status: <span className="text-emerald-600 font-medium">'Ready to Deploy'</span>
                    </div>
                    <div>{`});`}</div>
                    <div className="pt-2 flex items-center gap-2 text-emerald-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Pipeline ready. Hacking initialized.</span>
                    </div>
                  </div>
                </div>

                {/* Floating Abstract Element 1: Git Branch Node */}
                <div className="absolute -top-5 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-soft-xl flex items-center gap-3 animate-float">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Sprint Branch</div>
                    <div className="text-[10px] text-slate-500 font-mono">main → production</div>
                  </div>
                </div>

                {/* Floating Abstract Element 2: Architectural AI Engine */}
                <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-soft-xl flex items-center gap-3 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">System Architecture</div>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Full Stack Synced
                    </div>
                  </div>
                </div>

                {/* Floating Abstract Element 3: Collaboration Badge */}
                <div className="absolute top-1/2 -right-6 sm:-right-8 -translate-y-1/2 bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 border border-slate-200 shadow-soft-xl hidden sm:flex items-center gap-2 animate-float" style={{ animationDelay: '4s' }}>
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-extrabold text-slate-800">48-Hr Sprint</span>
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
