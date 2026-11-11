import React from 'react';
import { FileCheck2, UserCheck, HelpCircle, ArrowRight } from 'lucide-react';

export const QuickActions = ({ onViewRegistration, onEditProfile, onContactSupport }) => {
  const actions = [
    {
      title: 'View Registration',
      desc: 'Inspect your registered team squad, project domain, and status.',
      icon: FileCheck2,
      color: 'blue',
      onClick: onViewRegistration,
    },
    {
      title: 'Edit Profile',
      desc: 'Update your display name, contact preference, and hacker information.',
      icon: UserCheck,
      color: 'violet',
      onClick: onEditProfile,
    },
    {
      title: 'Contact Support',
      desc: 'Get in touch with hackathon organizers for mentoring and assistance.',
      icon: HelpCircle,
      color: 'emerald',
      onClick: onContactSupport,
    },
  ];

  return (
    <div className="space-y-3 text-left">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              onClick={item.onClick}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-soft-md transition-all duration-200 text-left flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Access</span>
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

