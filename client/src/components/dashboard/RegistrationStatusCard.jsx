import React from 'react';
import {
  Rocket,
  FileCheck2,
  Users2,
  Layers,
  FolderGit2,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

export const RegistrationStatusCard = ({
  registration,
  onOpenRegister,
  onViewRegistration,
}) => {
  // Scenario A: User has not registered yet
  if (!registration) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-sm flex flex-col justify-between text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-bl from-blue-100/50 via-violet-100/30 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-4">
            <Rocket className="w-3.5 h-3.5" />
            <span>Registration Portal Open</span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Your hackathon journey starts here.
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            You haven't submitted your squad registration entry yet. Select your domain, define your problem statement, invite your squad members, and submit your project to compete.
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3 relative z-10">
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenRegister}
            leftIcon={<Rocket className="w-4 h-4" />}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Register for Hackathon
          </Button>
          <span className="text-xs text-slate-400 font-medium">
            Requires 1 to 5 squad members
          </span>
        </div>
      </div>
    );
  }

  // Scenario B: User is registered
  const formattedRegId = registration._id
    ? `CAN-REG-${registration._id.toString().slice(-8).toUpperCase()}`
    : 'CAN-REG-PENDING';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="success" className="text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="danger" className="text-xs">
            <XCircle className="w-3.5 h-3.5 mr-1 inline" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="warning" className="text-xs">
            <Clock className="w-3.5 h-3.5 mr-1 inline" />
            Pending Review
          </Badge>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-soft-sm text-left space-y-6">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Hackathon Registration Entry
            </h3>
            <p className="text-xs font-mono text-blue-600 font-extrabold">{formattedRegId}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div>{getStatusBadge(registration.registrationStatus)}</div>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Project Name */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Project Name
          </span>
          <span className="font-extrabold text-sm text-slate-900 line-clamp-1">
            {registration.projectName}
          </span>
        </div>

        {/* Domain */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Domain Track
          </span>
          <span className="font-extrabold text-sm text-violet-700 line-clamp-1">
            {registration.domain}
          </span>
        </div>

        {/* Team Size */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Team Squad Size
          </span>
          <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <Users2 className="w-4 h-4 text-blue-600" />
            {registration.teamSize}{' '}
            {registration.teamSize > 1 ? 'Hackers' : 'Hacker (Solo)'}
          </span>
        </div>
      </div>

      {/* Submission Information Area */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Submission Deliverables
            </h4>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Round 1 Screening</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          {/* Presentation Link */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
            <span className="font-medium text-slate-600">PPT / Slides</span>
            {registration.pptLink ? (
              <a
                href={registration.pptLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-slate-400 italic">Not attached</span>
            )}
          </div>

          {/* Prototype Link */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
            <span className="font-medium text-slate-600">Prototype</span>
            {registration.prototypeLink ? (
              <a
                href={registration.prototypeLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                View <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-slate-400 italic">Not attached</span>
            )}
          </div>

          {/* Demo Video Link */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
            <span className="font-medium text-slate-600">Demo Video</span>
            {registration.demoVideoLink ? (
              <a
                href={registration.demoVideoLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Watch <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <span className="text-slate-400 italic">Not attached</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={onViewRegistration}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Full Registration & Squad
        </Button>
      </div>
    </div>
  );
};

export default RegistrationStatusCard;

