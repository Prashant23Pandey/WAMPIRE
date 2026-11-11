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
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-xl border-b border-black/10 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 lg:hidden cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <p className="text-xs uppercase tracking-widest font-mono text-neutral-500 font-bold">
            [ CONTROL CENTER // ACTIVE ]
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
            className="relative p-2 rounded-xl text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer border border-black/10"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF007F] rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-black/10 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-black/10 mb-2">
                <span className="text-xs font-mono font-bold text-black">Notifications</span>
                <span className="text-[10px] font-mono font-bold text-[#FF007F] bg-[#FF007F]/10 border border-[#FF007F]/30 px-2 py-0.5 rounded-full">
                  2 updates
                </span>
              </div>

              <div className="space-y-1.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-xl hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-black">{n.title}</p>
                      <span className="text-[10px] text-neutral-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug font-sans">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-black/10">
          <div className="w-8 h-8 rounded-full bg-[#FF007F]/10 border border-[#FF007F]/30 flex items-center justify-center text-[#FF007F] font-mono font-bold text-xs shadow-sm">
            {initials}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-mono font-bold text-black leading-tight truncate max-w-[140px]">
              {user?.fullName || 'Participant'}
            </span>
            <span className="text-[10px] text-[#FF007F] font-mono flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3" />
              Verified Builder
            </span>
          </div>
        </div>

        {/* Quick Sign Out Button */}
        <button
          type="button"
          onClick={onLogout}
          title="Sign out of Wampire"
          className="p-2 rounded-xl text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
