import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Github, Twitter, MessageSquare, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { EVENT_DETAILS } from '../../utils/constants.js';
import CrowdCanvas from '../common/CrowdCanvas.jsx';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="bg-white border-t border-black/10 text-neutral-600 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Column 1: Branding & Ethos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-[#FF007F]/40 flex items-center justify-center text-[#FF007F] shadow-glow-pink-sm">
                <Terminal className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-display font-black text-lg text-black tracking-wider">
                WAMPIRE
              </span>
            </div>

            <p className="text-xs text-neutral-600 max-w-sm leading-relaxed">
              {EVENT_DETAILS.subtitle} An arena engineered for builders, designers, and innovators to ship software that makes a mark.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Community"
                className="w-8 h-8 rounded-full bg-neutral-100 border border-black/10 hover:border-[#FF007F] text-neutral-700 hover:text-white hover:bg-[#FF007F] flex items-center justify-center transition-all"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter/X Updates"
                className="w-8 h-8 rounded-full bg-neutral-100 border border-black/10 hover:border-[#FF007F] text-neutral-700 hover:text-white hover:bg-[#FF007F] flex items-center justify-center transition-all"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord Server"
                className="w-8 h-8 rounded-full bg-neutral-100 border border-black/10 hover:border-[#FF007F] text-neutral-700 hover:text-white hover:bg-[#FF007F] flex items-center justify-center transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Professional Network"
                className="w-8 h-8 rounded-full bg-neutral-100 border border-black/10 hover:border-[#FF007F] text-neutral-700 hover:text-white hover:bg-[#FF007F] flex items-center justify-center transition-all"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Dedicated Pages */}
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  The Story of Wampire
                </Link>
              </li>
              <li>
                <Link to="/events" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  Tracks & Challenges
                </Link>
              </li>
              <li>
                <Link to="/timeline" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  5-Phase Timeline
                </Link>
              </li>
              <li>
                <Link to="/prizes" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  Prize Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Portal */}
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">
              Portal Access
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  Create Hacker Account
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  Builder Sign In
                </Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  Squad Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/register" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  Register Hackathon Squad
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={scrollToTop} className="hover:text-[#FF007F] transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Contact */}
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-black">
              Official Channels
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF007F]" />
                <a href={`mailto:${EVENT_DETAILS.contactEmail}`} className="hover:text-[#FF007F] transition-colors">
                  {EVENT_DETAILS.contactEmail}
                </a>
              </li>
              <li>
                <span className="text-neutral-500">Dates:</span> {EVENT_DETAILS.date}
              </li>
              <li>
                <span className="text-neutral-500">Format:</span> {EVENT_DETAILS.mode}
              </li>
              <li>
                <span className="text-neutral-500">Response SLA:</span> &lt; 24h guaranteed
              </li>
            </ul>
          </div>

        </div>

        {/* Reco Labs Open Peeps Animated Crowd Canvas */}
        <div className="relative w-full h-[260px] sm:h-[340px] md:h-[400px] lg:h-[440px] my-6 overflow-hidden pointer-events-none select-none border-y border-black/5 bg-gradient-to-b from-white via-neutral-50/40 to-white">
          <CrowdCanvas className="w-full h-full" id="crowd-canvas-footer" />
          <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <p className="text-neutral-500 text-center sm:text-left">
            © {new Date().getFullYear()} WAMPIRE ARCHITECTURE. All rights reserved. Built for engineering excellence.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-black/10 hover:border-[#FF007F] hover:text-[#FF007F] text-neutral-700 transition-all text-[11px] uppercase tracking-wider"
            aria-label="Scroll to top of page"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
