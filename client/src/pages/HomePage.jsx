import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Code2, Trophy, Clock, Shield } from 'lucide-react';
import HeroSection from '../components/landing/HeroSection.jsx';
import MetricsSection from '../components/landing/MetricsSection.jsx';
import CommunitySection from '../components/landing/CommunitySection.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const HomePage = () => {
  return (
    <div className="flex flex-col w-full bg-white text-black">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Metrics / Our Existence in Numbers Grid */}
      <MetricsSection />

      {/* 3. Quick Feature Arena Overview Teaser */}
      <section className="py-24 bg-white border-b border-black/10 relative tech-grid-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Badge variant="pink" size="md">
              THE BUILDER ECOSYSTEM
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
              DESIGNED FOR THE{' '}
              <span className="gradient-text-neon italic">RELENTLESS.</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
              Navigate the dedicated arenas engineered to test your team's grit, product vision, and code velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Arena Card 1 */}
            <div className="bg-white rounded-3xl p-8 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center text-[#FF007F] mb-6 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-black mb-3 group-hover:text-[#FF007F] transition-colors">
                  5 Specialization Tracks
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-6">
                  From Autonomous AI Agents and Web3 Protocols to Cloud Microservices and FinTech, build in the domain that drives you.
                </p>
              </div>
              <Link to="/events" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black group-hover:text-[#FF007F] transition-colors pt-4 border-t border-black/10">
                <span>Explore All Tracks</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Arena Card 2 */}
            <div className="bg-white rounded-3xl p-8 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center text-[#FF007F] mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-black mb-3 group-hover:text-[#FF007F] transition-colors">
                  5-Phase Roadmap
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-6">
                  A high-velocity sprint structured into 5 clear phases: registration, problem release, 48h live build, freeze, and finale.
                </p>
              </div>
              <Link to="/timeline" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black group-hover:text-[#FF007F] transition-colors pt-4 border-t border-black/10">
                <span>View Timeline</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Arena Card 3 */}
            <div className="bg-white rounded-3xl p-8 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center text-[#FF007F] mb-6 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-black mb-3 group-hover:text-[#FF007F] transition-colors">
                  ₹1,50,000 Bounty
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-6">
                  Configurable cash awards for Grand Champion and Runner Ups, plus special track prizes, cloud credits, and swag.
                </p>
              </div>
              <Link to="/prizes" className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black group-hover:text-[#FF007F] transition-colors pt-4 border-t border-black/10">
                <span>Inspect Prizes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Animated Builders / Community Section (Monochrome Illustrations & Marquee with Pink Wipe) */}
      <CommunitySection />
    </div>
  );
};

export default HomePage;
