import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Terminal, ArrowLeft } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FFFFFF] text-[#000000] tech-grid-light overflow-hidden">
      {/* Background ambient pink glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-brand-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Return home link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-neutral-700 hover:text-black transition-all bg-white px-4 py-2 rounded-full border border-black/10 hover:border-[#FF007F] shadow-sm backdrop-blur-md group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-[#FF007F]" />
          <span>Back to Arena</span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-white border border-[#FF007F]/40 flex items-center justify-center text-[#FF007F] shadow-glow-pink-sm group-hover:border-[#FF007F] transition-all duration-300">
            <Terminal className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-display font-black text-2xl tracking-tight text-black group-hover:text-[#FF007F] transition-colors">
            WAMPIRE
          </span>
        </Link>
        <p className="mt-2 text-[11px] uppercase tracking-widest text-neutral-500 font-mono">
          [ AUTH GATEWAY // BUILDER SYSTEM ]
        </p>
      </div>

      {/* Card Content Container */}
      <div className="w-full sm:max-w-md z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.07)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF007F] to-transparent opacity-80" />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
