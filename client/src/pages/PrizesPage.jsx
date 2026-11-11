import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Award, Gift, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import PrizesSection from '../components/landing/PrizesSection.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';

export const PrizesPage = () => {
  const categoryPrizes = [
    {
      title: 'Best AI Innovation',
      reward: '₹15,000',
      tag: 'COGNITIVE EXCELLENCE',
      description: 'Awarded to the squad demonstrating the most sophisticated LLM orchestration, agentic tooling, or autonomous workflow.',
    },
    {
      title: 'Best UI/UX Architecture',
      reward: '₹10,000',
      tag: 'AESTHETIC MASTERY',
      description: 'Awarded to the squad that ships the most polished, responsive, and delightful frontend user experience with zero layout glitches.',
    },
    {
      title: 'Best Web3 & Distributed Architecture',
      reward: '₹10,000',
      tag: 'SYSTEM INTEGRITY',
      description: 'Awarded to the project demonstrating superior decentralized system design, contract gas optimization, and fault tolerance.',
    },
  ];

  const participantPerks = [
    {
      title: 'Cryptographic Digital Credential',
      desc: 'Every participant receives an authenticated, verifiable certificate detailing their specialization track and submission status.',
    },
    {
      title: '$5,000+ Partner Cloud Credits',
      desc: 'Free access to enterprise cloud compute, GPU inference quotas, and managed databases from our hackathon infrastructure partners.',
    },
    {
      title: 'Exclusive Wampire Swag Kit',
      desc: 'Curated merchandise kit including developer hoodies, enamel pins, keyboard desk mats, and high-quality vinyl stickers.',
    },
    {
      title: 'Direct Guild Fast-Track',
      desc: 'Opportunity to pitch your prototype directly to active angel syndicates and partner engineering guilds for follow-on grants.',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-white text-black pt-24">
      {/* 1. Main Prize Tiers */}
      <PrizesSection />

      {/* 2. Special Category Bounties */}
      <section className="py-24 bg-neutral-50/70 border-b border-black/10 relative tech-grid-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Badge variant="pink" size="md">
              DOMAIN CATEGORY BOUNTIES
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
              TARGETED AWARDS FOR{' '}
              <span className="gradient-text-neon italic">SPECIALIZED CRAFT.</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
              Beyond the overall podium, top-performing squads in individual engineering domains compete for focused category purses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {categoryPrizes.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
                      {cat.tag}
                    </span>
                    <span className="text-lg font-serif font-black text-[#FF007F]">
                      {cat.reward}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-black mb-2 group-hover:text-[#FF007F] transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs font-mono text-neutral-500">
                  <span>Award Track</span>
                  <span className="text-black font-semibold">Active</span>
                </div>
              </div>
            ))}
          </div>

          {/* 3. Universal Perks for Every Builder */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-black/10 max-w-5xl mx-auto shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="pink" size="md">
                FOR EVERY PARTICIPATING SQUAD
              </Badge>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-black mt-2">
                No Builder Leaves Empty-Handed.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-sans">
                Every verified participant who completes the 48-hour build receives our full digital and physical perk package.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-black/10">
              {participantPerks.map((perk, pIdx) => (
                <div key={pIdx} className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 border border-black/10">
                  <div className="w-8 h-8 rounded-xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center text-[#FF007F] shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-mono font-bold text-black">{perk.title}</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link to="/register">
                <Button variant="primary" size="lg" className="font-mono text-xs uppercase tracking-wider font-bold shadow-glow-pink">
                  Register Your Squad Today
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default PrizesPage;

