import React from 'react';
import { User, Mail, ShieldCheck, Calendar, Edit3 } from 'lucide-react';
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
    <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] space-y-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF007F]" />
            <h3 className="text-xs font-mono font-bold text-black tracking-widest uppercase">[ BUILDER PROFILE ]</h3>
          </div>
          <Badge variant="pink" size="sm">
            <ShieldCheck className="w-3 h-3 mr-1 inline text-[#FF007F]" />
            {user?.isVerified ? 'VERIFIED' : 'PENDING OTP'}
          </Badge>
        </div>

        {/* User Info Avatar & Name */}
        <div className="flex items-center gap-4 mt-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/30 flex items-center justify-center text-[#FF007F] font-mono font-black text-xl shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 text-left">
            <h4 className="font-serif font-bold text-base text-black truncate">
              {user?.fullName || 'Wampire Hacker'}
            </h4>
            <p className="text-xs text-neutral-500 truncate flex items-center gap-1.5 mt-0.5 font-mono">
              <Mail className="w-3.5 h-3.5 flex-shrink-0 text-neutral-400" />
              {user?.email}
            </p>
          </div>
        </div>

        {/* Field Specifications */}
        <div className="space-y-3 pt-5 text-xs text-left font-mono">
          <div className="flex items-center justify-between py-2 border-b border-black/5">
            <span className="text-neutral-500">Full Name</span>
            <span className="font-bold text-black font-sans">{user?.fullName}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-black/5">
            <span className="text-neutral-500">Email Address</span>
            <span className="text-neutral-700 truncate max-w-[180px]">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-black/5">
            <span className="text-neutral-500">Verification Status</span>
            <span className="font-bold text-[#FF007F] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {user?.isVerified ? 'Confirmed' : 'Unverified'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-neutral-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              Member Since
            </span>
            <span className="font-bold text-black">{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <Button
        variant="outline"
        size="sm"
        onClick={onEditProfile}
        className="w-full mt-2 font-mono text-xs uppercase tracking-wider text-black bg-white border border-black/15 hover:border-[#FF007F] hover:text-[#FF007F]"
        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
      >
        Edit Profile
      </Button>
    </div>
  );
};

export default ProfileCard;
