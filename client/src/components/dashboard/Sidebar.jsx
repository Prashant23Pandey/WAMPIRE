import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileCheck2,
  Users2,
  Send,
  HelpCircle,
  LogOut,
  Terminal,
  X,
  Sparkles,
} from 'lucide-react';

const SIDEBAR_TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'registration', label: 'Hackathon Registration', icon: FileCheck2 },
  { id: 'team', label: 'My Team', icon: Users2 },
  { id: 'submission', label: 'My Submission', icon: Send },
  { id: 'support', label: 'Help & Support', icon: HelpCircle },
];

export const Sidebar = ({ activeTab, onSelectTab, isRegistered, onLogout, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container on Light Theme */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-black/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="h-16 px-6 border-b border-black/10 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-white border border-[#FF007F]/40 flex items-center justify-center text-[#FF007F] shadow-glow-pink-sm group-hover:scale-105 transition-transform">
                <Terminal className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-lg tracking-wider text-black">
                  WAMPIRE
                </span>
                <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-[#FF007F] -mt-0.5">
                  PARTICIPANT HUB
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-black hover:bg-neutral-100 lg:hidden cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Dashboard Sidebar">
            {SIDEBAR_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(tab.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#FF007F] text-white shadow-glow-pink translate-x-1'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-neutral-500 group-hover:text-[#FF007F]'
                      }`}
                    />
                    <span>{tab.label}</span>
                  </div>

                  {tab.id === 'registration' && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isRegistered
                          ? 'bg-[#FF007F]/10 text-[#FF007F] border border-[#FF007F]/30'
                          : 'bg-neutral-100 text-neutral-600 border border-black/10'
                      }`}
                    >
                      {isRegistered ? 'Active' : 'Pending'}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Area & Logout Button */}
        <div className="p-4 border-t border-black/10 space-y-3">
          <div className="p-3 rounded-2xl bg-neutral-50 border border-black/10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-black mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF007F]" />
              <span>Hackathon Live</span>
            </div>
            <p className="text-[11px] text-neutral-600 font-sans leading-relaxed">
              Submissions close soon. Keep project links updated.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-black/10 text-xs font-mono font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
