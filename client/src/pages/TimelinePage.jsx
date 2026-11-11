import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, AlertCircle, FileText, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import TimelineSection from '../components/landing/TimelineSection.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import { EVENT_DETAILS } from '../utils/constants.js';

export const TimelinePage = () => {
  const phases = [
    {
      phase: 'PHASE 01',
      title: 'Squad Registration & Verification',
      date: 'Current – Registration Deadline',
      status: 'ACTIVE NOW',
      statusColor: 'text-[#FF007F] bg-[#FF007F]/10 border-[#FF007F]/30',
      description:
        'Create your builder account, verify your email with the 6-digit OTP security code, and assemble your team of 1 to 5 members through the registration portal.',
      checkpoints: [
        'Individual hacker account creation & OTP verification',
        'Lead builder details, college, course, branch & contact info',
        'Dynamic addition of 0 to 4 team members with verified emails',
        'Selection of primary specialization domain track',
      ],
    },
    {
      phase: 'PHASE 02',
      title: 'Problem Statements & Track Deep-Dive',
      date: 'Day 00 // 6:00 PM IST',
      status: 'UPCOMING',
      statusColor: 'text-neutral-700 bg-neutral-100 border-black/10',
      description:
        'Official briefing session. Curated challenge problem statements and judging rubrics are revealed across all 5 specialization tracks.',
      checkpoints: [
        'Live technical briefing and rules clarification',
        'Detailed architectural guidelines and API keys issued',
        'Official mentor roster and office hour schedules announced',
        'Repository initialization and team check-in',
      ],
    },
    {
      phase: 'PHASE 03',
      title: '48-Hour Continuous Build Sprint',
      date: 'Day 01 – Day 02 // 48 Hours Live',
      status: 'SCHEDULED',
      statusColor: 'text-neutral-700 bg-neutral-100 border-black/10',
      description:
        'The heart of WAMPIRE. Non-stop coding, agile iterations, git commits, and architectural execution under high-intensity sprint conditions.',
      checkpoints: [
        'Sprint checkpoint 1: Architecture review with domain mentors',
        'Sprint checkpoint 2: Middleware & backend validation',
        'Sprint checkpoint 3: UI/UX polishing & end-to-end integration',
        'Continuous commit tracking and automated build integrity',
      ],
    },
    {
      phase: 'PHASE 04',
      title: 'Code Freeze & Submission Finalization',
      date: 'Day 02 // 6:00 PM IST Strict',
      status: 'SCHEDULED',
      statusColor: 'text-neutral-700 bg-neutral-100 border-black/10',
      description:
        'Strict deadline for locking all commits and submitting project deliverables through the participant dashboard.',
      checkpoints: [
        'Submission of shareable presentation (Google Drive / OneDrive)',
        'Submission of public GitHub / Figma / Prototype deployment URL',
        'Submission of 2-3 minute recorded demonstration video link',
        'Automated receipt and cryptographic registration ID generation',
      ],
    },
    {
      phase: 'PHASE 05',
      title: 'Grand Finale, Pitches & Award Ceremony',
      date: 'Day 03 // 10:00 AM IST',
      status: 'FINALE',
      statusColor: 'text-[#FF007F] bg-[#FF007F]/10 border-[#FF007F]/30',
      description:
        'Top shortlisted squads pitch live before the industry jury. Technical Q&A, deliberation, and crowning of the WAMPIRE Grand Champions.',
      checkpoints: [
        'Live demonstration of running software and edge cases',
        'Jury evaluation across technical complexity, polish & utility',
        'Public announcement of Grand Champion & Runners Up',
        'Distribution of ₹1,50,000 cash bounty & incubation offers',
      ],
    },
  ];

  return (
    <div className="flex flex-col w-full bg-white text-black pt-24">
      {/* 1. Header & Quick Roadmap Overview */}
      <TimelineSection />

      {/* 2. In-Depth Phase Breakdown */}
      <section className="py-24 bg-neutral-50/70 border-b border-black/10 relative tech-grid-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <Badge variant="pink" size="md">
              PHASE-BY-PHASE SPRINT SPECIFICATION
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
              PRECISION SCHEDULE.{' '}
              <span className="gradient-text-neon italic">ZERO DELAYS.</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-sans">
              Every phase operates on strict deadlines to guarantee an authentic, pressure-tested engineering contest.
            </p>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            {phases.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_35px_-5px_rgba(255,0,127,0.15)] transition-all duration-300 relative overflow-hidden group"
              >
                {/* Header line with badge and timing */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#FF007F] tracking-widest">
                      {item.phase}
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-3 py-0.5 rounded-full border font-bold ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                    <Clock className="w-3.5 h-3.5 text-[#FF007F]" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-bold text-black mb-3 group-hover:text-[#FF007F] transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-neutral-600 leading-relaxed font-sans mb-6">
                  {item.description}
                </p>

                {/* Checkpoints Checklist */}
                <div className="pt-4 border-t border-black/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-black font-bold block mb-3">
                    Key Phase Deliverables & Checkpoints:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {item.checkpoints.map((cp, cIdx) => (
                      <div key={cIdx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                        <CheckCircle2 className="w-4 h-4 text-[#FF007F] shrink-0 mt-0.5" />
                        <span>{cp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submission Guidelines Summary Card */}
          <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-black/10 max-w-4xl mx-auto shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 flex items-center justify-center text-[#FF007F]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xl font-serif font-bold text-black">
                  Required Submission Artifacts
                </h4>
                <p className="text-xs text-neutral-500 font-mono">
                  All 3 links are mandatory on the registration form
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-black/10 text-xs text-neutral-700">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
                <span className="font-mono font-bold text-black block mb-1">1. Presentation (PPT)</span>
                <p className="text-neutral-600">Valid Google Drive or OneDrive shareable link containing problem, architecture & demo flow.</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
                <span className="font-mono font-bold text-black block mb-1">2. Prototype URL</span>
                <p className="text-neutral-600">Public GitHub repository link, live hosted Vercel/Render URL, or interactive Figma mockup.</p>
              </div>
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
                <span className="font-mono font-bold text-black block mb-1">3. Demo Video Link</span>
                <p className="text-neutral-600">2-3 minute YouTube or Loom video link demonstrating the live features and code execution.</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link to="/register">
                <Button variant="primary" size="lg" className="font-mono text-xs uppercase tracking-wider font-bold shadow-glow-pink">
                  Register Your Squad Now
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default TimelinePage;
