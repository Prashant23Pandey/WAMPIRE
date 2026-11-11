import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, MessageSquare, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { EVENT_DETAILS } from '../../utils/constants.js';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

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
    <footer className="bg-white border-t border-slate-200/90 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Column 1: Branding & Ethos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-electric">
                <Code2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                CODE-A-NOVA
              </span>
            </div>

            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              {EVENT_DETAILS.subtitle} A high-standard arena bringing together top builders to create solutions that matter.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Community"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter/X Updates"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Discord Server"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn Professional Network"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('home')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  About Initiative
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('event')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Event Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('highlights')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Event Highlights
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Roadmap & Awards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Program
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection('timeline')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Hackathon Timeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('prizes')}
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Prize Tiers
                </button>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-600 transition-colors text-left"
                >
                  Contact Organizers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Portal Gateway */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Portal Access
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="hover:text-blue-600 transition-colors">
                  Participant Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600 transition-colors">
                  Hacker Registration
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href={`mailto:${EVENT_DETAILS.contactEmail}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {EVENT_DETAILS.contactEmail}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CODE-A-NOVA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for Builders</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors font-semibold"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
