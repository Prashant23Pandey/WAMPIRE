import React from 'react';
import {
  Rocket,
  FileCheck2,
  Users2,
  FolderGit2,
  ExternalLink,
  Clock,
  Check,
  XCircle,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

export const RegistrationStatusCard = ({
  registration,
  onOpenRegister,
  onViewRegistration,
  onWithdrawRegistration,
}) => {
  // Scenario A: User has not registered yet
  if (!registration) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] flex flex-col justify-between text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-[#FF007F]/5 rounded-bl-full pointer-events-none blur-3xl" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007F]/10 border border-[#FF007F]/30 text-[#FF007F] text-xs font-mono font-bold mb-4">
            <Rocket className="w-3.5 h-3.5" />
            <span>[ REGISTRATION PHASE ACTIVE ]</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif font-black text-black tracking-tight">
            Your hackathon journey starts here.
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
            You haven't submitted your squad registration entry yet. Select your domain, define your problem statement, assemble your squad (1-5 builders), and launch your build.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-black/10 flex flex-wrap items-center gap-3 relative z-10">
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenRegister}
            leftIcon={<Rocket className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="font-mono text-xs uppercase tracking-wider font-bold shadow-glow-pink"
          >
            Register for Hackathon
          </Button>
          <span className="text-xs text-neutral-500 font-mono">
            Requires 1 to 5 squad members
          </span>
        </div>
      </div>
    );
  }

  // Scenario B: User is registered
  const formattedRegId = registration._id
    ? `WAM-REG-${registration._id.toString().slice(-8).toUpperCase()}`
    : 'WAM-REG-PENDING';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="pink" size="sm">
            <Check className="w-3 h-3 mr-1 inline text-white" />
            APPROVED
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="danger" size="sm">
            <XCircle className="w-3 h-3 mr-1 inline" />
            REJECTED
          </Badge>
        );
      default:
        return (
          <Badge variant="primary" size="sm">
            <Clock className="w-3 h-3 mr-1 inline text-[#FF007F]" />
            PENDING REVIEW
          </Badge>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-black/10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] text-left space-y-6">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FF007F]/10 border border-[#FF007F]/20 text-[#FF007F] flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-mono font-bold text-black tracking-wider uppercase">
              Hackathon Registration Entry
            </h3>
            <p className="text-xs font-mono text-[#FF007F] font-bold">{formattedRegId}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div>{getStatusBadge(registration.registrationStatus)}</div>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Project Name */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Project Name
          </span>
          <span className="font-serif font-bold text-sm text-black line-clamp-1">
            {registration.projectName}
          </span>
        </div>

        {/* Domain */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Domain Track
          </span>
          <span className="font-mono font-bold text-xs text-[#FF007F] line-clamp-1">
            {registration.domain}
          </span>
        </div>

        {/* Team Size */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-1">
            Squad Size
          </span>
          <span className="font-mono font-bold text-xs text-black flex items-center gap-1.5">
            <Users2 className="w-3.5 h-3.5 text-[#FF007F]" />
            {registration.teamSize}{' '}
            {registration.teamSize > 1 ? 'Builders' : 'Solo Builder'}
          </span>
        </div>
      </div>

      {/* Submission Information Area */}
      <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#FF007F]" />
            <h4 className="text-xs font-mono font-bold text-black uppercase tracking-wider">
              Submission Deliverables
            </h4>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 uppercase">Screening Deck</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
          {/* Presentation Link */}
          <div className="p-2.5 rounded-xl bg-white border border-black/10 flex items-center justify-between">
            <span className="text-neutral-500">PPT / Slides</span>
            {registration.pptLink ? (
              <a
                href={registration.pptLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#FF007F] hover:underline flex items-center gap-1"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-neutral-400 italic">Not set</span>
            )}
          </div>

          {/* Prototype Link */}
          <div className="p-2.5 rounded-xl bg-white border border-black/10 flex items-center justify-between">
            <span className="text-neutral-500">Prototype</span>
            {registration.prototypeLink ? (
              <a
                href={registration.prototypeLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#FF007F] hover:underline flex items-center gap-1"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-neutral-400 italic">Not set</span>
            )}
          </div>

          {/* Demo Video Link */}
          <div className="p-2.5 rounded-xl bg-white border border-black/10 flex items-center justify-between">
            <span className="text-neutral-500">Demo Video</span>
            {registration.demoVideoLink ? (
              <a
                href={registration.demoVideoLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#FF007F] hover:underline flex items-center gap-1"
              >
                Watch <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-neutral-400 italic">Not set</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-black/10">
        {onWithdrawRegistration ? (
          <button
            type="button"
            onClick={onWithdrawRegistration}
            disabled={registration.registrationStatus === 'approved'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono text-neutral-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            title={
              registration.registrationStatus === 'approved'
                ? 'Approved entries cannot be withdrawn'
                : 'Withdraw this registration entry'
            }
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Withdraw Entry</span>
          </button>
        ) : (
          <div />
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={onViewRegistration}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="text-xs font-mono text-black bg-white border border-black/15 hover:border-black/30"
        >
          View Full Registration & Squad
        </Button>
      </div>
    </div>
  );
};

export default RegistrationStatusCard;
