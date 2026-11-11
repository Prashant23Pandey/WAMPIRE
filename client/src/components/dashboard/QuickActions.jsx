import React from 'react';
import { FileCheck2, UserCheck, HelpCircle, ArrowRight } from 'lucide-react';

export const QuickActions = ({ onViewRegistration, onEditProfile, onContactSupport }) => {
  const actions = [
    {
      title: 'View Registration',
      desc: 'Inspect your registered team squad, project domain, and status.',
      icon: FileCheck2,
      onClick: onViewRegistration,
    },
    {
      title: 'Edit Profile',
      desc: 'Update your display name, contact preference, and hacker information.',
      icon: UserCheck,
      onClick: onEditProfile,
    },
    {
      title: 'Contact Support',
      desc: 'Get in touch with hackathon organizers for mentoring and assistance.',
      icon: HelpCircle,
      onClick: onContactSupport,
    },
  ];

  return (
    <div className="space-y-3 text-left">
      <h3 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
        [ QUICK ACTIONS ]
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              onClick={item.onClick}
              className="p-5 rounded-3xl bg-white border border-black/10 hover:border-[#FF007F] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_-5px_rgba(255,0,127,0.15)] transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F] flex items-center justify-center mb-3 group-hover:scale-105 group-hover:border-[#FF007F] transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-serif font-bold text-sm text-black group-hover:text-[#FF007F] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-600 mt-1 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-mono font-bold text-[#FF007F]">
                <span>Execute</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
