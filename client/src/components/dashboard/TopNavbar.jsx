import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, LogOut, User, ShieldCheck, Check, Sparkles } from 'lucide-react';

export const TopNavbar = ({ user, onToggleSidebar, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Email Verified',
      desc: 'Your account email was successfully verified via OTP.',
      time: 'Recently',
      read: true,
    },
    {
      id: 2,
      title: 'Portal Live Access',
      desc: 'Round 1 problem domains and submission tracks are active.',
      time: 'Live',
      read: false,
    },
  ];

  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'H';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold">
            Portal Control Center
          </p>
        </div>
      </div>

      {/* Right Actions: Notifications, Avatar, Logout */}
      <div className="flex items-center gap-3">
        {/* Notification Area */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-soft-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  2 updates
                </span>
              </div>

              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xs shadow-soft-sm">
            {initials}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[140px]">
              {user?.fullName || 'Participant'}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Hacker
            </span>
          </div>
        </div>

        {/* Quick Sign Out Button */}
        <button
          type="button"
          onClick={onLogout}
          title="Sign out of Code-a-Nova"
          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;

