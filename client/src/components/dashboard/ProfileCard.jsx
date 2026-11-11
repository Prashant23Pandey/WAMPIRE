import React from 'react';
import { User, Mail, ShieldCheck, Calendar, Edit3, Award } from 'lucide-react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

export const ProfileCard = ({ user, onEditProfile }) => {
  const initials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'H';

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Active';

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft-sm space-y-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Participant Profile</h3>
          </div>
          <Badge variant="success" className="text-[10px]">
            <ShieldCheck className="w-3 h-3 mr-1 inline" />
            {user?.isVerified ? 'Verified' : 'Pending OTP'}
          </Badge>
        </div>

        {/* User Info Avatar & Name */}
        <div className="flex items-center gap-4 mt-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl shadow-electric">
            {initials}
          </div>
          <div className="min-w-0 text-left">
            <h4 className="font-extrabold text-base text-slate-900 truncate">
              {user?.fullName || 'Code-a-Nova Hacker'}
            </h4>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Field Specifications */}
        <div className="space-y-3 pt-5 text-xs text-left">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Full Name</span>
            <span className="font-bold text-slate-900">{user?.fullName}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Email Address</span>
            <span className="font-mono text-slate-700 truncate max-w-[180px]">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Verification Status</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {user?.isVerified ? 'Active & Confirmed' : 'Unverified'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Account Created
            </span>
            <span className="font-bold text-slate-800 font-mono">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Button
        variant="outline"
        size="sm"
        onClick={onEditProfile}
        className="w-full mt-2"
        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileCard;

