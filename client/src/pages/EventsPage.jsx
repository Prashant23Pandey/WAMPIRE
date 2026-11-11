import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Coins, Server, Wallet, Globe, ArrowRight, CheckCircle, Sparkles, Layers } from 'lucide-react';
import EventOverview from '../components/landing/EventOverview.jsx';
import EventHighlights from '../components/landing/EventHighlights.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';

export const EventsPage = () => {
  const tracks = [
    {
      id: 'ai-agents',
      num: '01',
      title: 'Generative AI & Autonomous Agents',
      icon: <Bot className="w-6 h-6 text-[#FF007F]" />,
      tags: ['LLM Orchestration', 'Multi-Agent Swarms', 'RAG Pipelines', 'Vector DBs'],
      description:
        'Architect intelligent autonomous agents capable of multi-step reasoning, dynamic tool usage, and real-time environment interaction. Push past simple chatbot wrappers to build production-grade cognitive workflows.',
      problemFocus:
        'Context-aware agents for automated codebase audits, self-healing developer pipelines, or intelligent decision-support engines.',
      deliverables: 'Functional agent pipeline, tool bindings, benchmark validation, and interactive UI.',
    },
    {
      id: 'web3-defi',
      num: '02',
      title: 'Decentralized Protocols & Web3',
      icon: <Coins className="w-6 h-6 text-black" />,
      tags: ['Smart Contracts', 'DeFi Primitives', 'Account Abstraction', 'ZK Proofs'],
      description:
        'Engineer trust-minimized protocols, cross-chain messaging mechanisms, or algorithmic financial primitives. Build decentralized infrastructure that emphasizes security, auditability, and verifiable execution.',
      problemFocus:
        'Gas-efficient decentralized state machines, privacy-preserving credential verification, or automated micro-liquidity engines.',
      deliverables: 'Tested smart contract suite, deployed testnet contracts, and responsive dApp frontend.',
    },
    {
      id: 'cloud-systems',
      num: '03',
      title: 'Cloud-Native Distributed Infrastructure',
      icon: <Server className="w-6 h-6 text-[#FF007F]" />,
      tags: ['Microservices', 'Message Queues', 'Docker & K8s', 'Real-time WebSockets'],
      description:
        'Construct resilient, high-throughput distributed systems that handle bursty concurrency with sub-100ms latency. Demonstrate fault-tolerant architectures and observability-first engineering.',
      problemFocus:
        'Event-driven asynchronous stream processors, distributed lock managers, or edge caching proxies for global APIs.',
      deliverables: 'Containerized service architecture, docker-compose orchestration, stress test load metrics, and API specs.',
    },
    {
      id: 'fintech-commerce',
      num: '04',
      title: 'FinTech & Next-Gen Commerce',
      icon: <Wallet className="w-6 h-6 text-black" />,
      tags: ['Payment Gateways', 'Fraud Detection', 'Open Banking', 'Algorithmic Escrow'],
      description:
        'Reimagine transaction execution, automated reconciliation, and identity-bound payments. Build secure financial tooling that mitigates fraud while delivering frictionless merchant and consumer experiences.',
      problemFocus:
        'Zero-latency invoice factoring, automated recurring subscription escrow, or anomaly detection in high-volume transaction feeds.',
      deliverables: 'Secure backend with idempotency keys, payment simulation harness, and role-based client dashboard.',
    },
    {
      id: 'open-innovation',
      num: '05',
      title: 'Open Innovation & Social Tech',
      icon: <Globe className="w-6 h-6 text-[#FF007F]" />,
      tags: ['Public Goods', 'Accessibility', 'GovTech', 'Open Source'],
      description:
        'Harness the modern full stack to solve acute public welfare friction points. From accessible assistive interfaces to emergency logistics and public data transparency, ship software with real societal impact.',
      problemFocus:
        'Decentralized disaster aid routing, offline-first medical intake forms, or transparent open-data civic dashboards.',
      deliverables: 'Fully open-source repository, accessible WCAG-compliant interface, and comprehensive deployment documentation.',
    },
  ];

  return (
    <div className="flex flex-col w-full bg-white text-black pt-24">
      {/* 1. Tracks Header */}
      <section className="py-20 bg-white border-b border-black/10 relative tech-grid-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Badge variant="pink" size="md">
              SPECIALIZATION ARENAS
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-serif font-black text-black tracking-tight">
              FIVE TRACKS. ONE{' '}
              <span className="gradient-text-neon italic">STAGE.</span>
            </h1>
            <p className="text-neutral-600 text-sm sm:text-lg leading-relaxed font-sans">
              Choose your specialization track. Each domain is vetted by industry architects and judged on technical complexity, user experience, and deployment readiness.
            </p>
          </div>

          {/* 5 Track Cards Grid */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 relative overflow-hidden group"
              >
                {/* Top pink accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {track.icon}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-[#FF007F] uppercase tracking-widest">
                        [ TRACK {track.num} ]
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-black mt-0.5 group-hover:text-[#FF007F] transition-colors">
                        {track.title}
                      </h2>
                    </div>
                  </div>

                  <Link to="/register">
                    <Button variant="secondary" size="sm" className="font-mono text-xs uppercase tracking-wider text-black bg-white border border-black/15 hover:border-[#FF007F] hover:text-[#FF007F] shrink-0">
                      Register in this Track
                    </Button>
                  </Link>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-6">
                  {track.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-neutral-50 border border-black/10 mb-6 text-xs">
                  <div>
                    <span className="font-mono font-bold text-black uppercase tracking-wider block mb-1">
                      Problem Focus:
                    </span>
                    <span className="text-neutral-600 font-sans leading-relaxed">
                      {track.problemFocus}
                    </span>
                  </div>
                  <div>
                    <span className="font-mono font-bold text-black uppercase tracking-wider block mb-1">
                      Expected Deliverable:
                    </span>
                    <span className="text-neutral-600 font-sans leading-relaxed">
                      {track.deliverables}
                    </span>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-black/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mr-2">
                    Key Stacks:
                  </span>
                  {track.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-white border border-black/10 text-xs font-mono text-neutral-700 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Event Foundations */}
      <EventOverview />

      {/* 3. Event Highlights */}
      <EventHighlights />

      {/* 4. Action Banner */}
      <section className="py-20 bg-neutral-50 border-b border-black/10 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-black">
            Have a squad and an ambitious concept?
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto">
            Assemble your team of 1 to 5 members and submit your entry. Registration takes under 3 minutes.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button variant="primary" size="lg" className="font-mono text-xs uppercase tracking-wider font-bold shadow-glow-pink">
                Start Squad Registration
              </Button>
            </Link>
            <Link to="/timeline">
              <Button variant="secondary" size="lg" className="font-mono text-xs uppercase tracking-wider text-black bg-white border border-black/15">
                Check Sprint Timeline
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;

