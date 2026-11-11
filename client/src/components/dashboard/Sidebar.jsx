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
  Code2,
  X,
  Sparkles,
} from 'lucide-react';

export const SIDEBAR_TABS = [
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
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-electric group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  CODE-A-NOVA
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400 -mt-1">
                  Participant Hub
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-soft-md shadow-blue-500/20 translate-x-1'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                      }`}
                    />
                    <span>{tab.label}</span>
                  </div>

                  {tab.id === 'registration' && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : isRegistered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
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
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-50/50 to-violet-50/50 border border-blue-100/60">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Hackathon Live</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Submissions close soon. Keep project links updated.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
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

