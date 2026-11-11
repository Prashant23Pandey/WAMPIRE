import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Code2, ArrowLeft } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8fafc] tech-grid overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-blue-200/40 via-violet-200/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Return home link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-soft-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-electric group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            CODE-A-NOVA
          </span>
        </Link>
        <p className="mt-2 text-xs uppercase tracking-widest text-slate-500 font-mono font-semibold">
          Hackathon Portal Gateway
        </p>
      </div>

      {/* Card Content Container */}
      <div className="w-full sm:max-w-md z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft-xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
