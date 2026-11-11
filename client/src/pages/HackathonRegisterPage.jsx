import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Rocket,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Layers,
  FolderGit2,
  FileText,
  Video,
  Users2,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import hackathonService from '../services/hackathonService.js';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';
import Badge from '../components/common/Badge.jsx';

// Predefined Colleges with 'Other' option
export const PREDEFINED_COLLEGES = [
  'Indian Institute of Technology (IIT) Bombay',
  'Indian Institute of Technology (IIT) Delhi',
  'Indian Institute of Technology (IIT) Madras',
  'Birla Institute of Technology and Science (BITS) Pilani',
  'National Institute of Technology (NIT) Trichy',
  'Vellore Institute of Technology (VIT) Vellore',
  'Delhi Technological University (DTU)',
  'SRM Institute of Science and Technology',
  'Netaji Subhas University of Technology (NSUT)',
  'Manipal Institute of Technology (MIT)',
  'Other',
];

// Predefined Courses
export const COURSES = ['B.Tech', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'Other'];

// Predefined Branches
export const BRANCHES = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'Other'];

// Predefined Years of Study
export const YEARS_OF_STUDY = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

// Predefined Domains / Tracks
export const DOMAINS = [
  'AI/ML',
  'Web Development',
  'IoT',
  'Cyber Security',
  'Blockchain',
  'Other',
];

export const HackathonRegisterPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Guard against unauthenticated visitors
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobileNumber: '',
    collegeName: PREDEFINED_COLLEGES[0],
    customCollege: '',
    course: COURSES[0],
    customCourse: '',
    branch: BRANCHES[0],
    customBranch: '',
    yearOfStudy: YEARS_OF_STUDY[2], // Default to 3rd Year
    domain: DOMAINS[0],
    customDomain: '',
    projectName: '',
    pptLink: '',
    prototypeLink: '',
    demoVideoLink: '',
    teamSize: 1,
    teamMembers: [],
  });

  // UI States
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(true);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync authenticated user info
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: user.email || prev.email || '',
      }));
    }
  }, [user]);

  // Check if user already submitted a registration (prevent duplicate entries)
  useEffect(() => {
    const checkExisting = async () => {
      try {
        const res = await hackathonService.getMyEntry();
        if (res.data?.registration) {
          setExistingRegistration(res.data.registration);
        }
      } catch (_) {
        // No registration yet or fetch failed
      } finally {
        setIsCheckingExisting(false);
      }
    };

    if (isAuthenticated) {
      checkExisting();
    }
  }, [isAuthenticated]);

  // Handle Team Size change (1 to 5)
  const handleTeamSizeChange = (newSize) => {
    const targetSize = Math.max(1, Math.min(5, parseInt(newSize, 10)));
    const neededAdditionalMembers = targetSize - 1;
    const currentMembers = [...formData.teamMembers];

    if (currentMembers.length < neededAdditionalMembers) {
      for (let i = currentMembers.length; i < neededAdditionalMembers; i++) {
        currentMembers.push({ name: '', email: '' });
      }
    } else if (currentMembers.length > neededAdditionalMembers) {
      currentMembers.splice(neededAdditionalMembers);
    }

    setFormData((prev) => ({
      ...prev,
      teamSize: targetSize,
      teamMembers: currentMembers,
    }));

    // Clear team errors
    const nextErrors = { ...errors };
    Object.keys(nextErrors).forEach((key) => {
      if (key.startsWith('member_')) delete nextErrors[key];
    });
    setErrors(nextErrors);
  };

  // Dynamically add a member button
  const handleAddMember = () => {
    if (formData.teamSize < 5) {
      handleTeamSizeChange(formData.teamSize + 1);
    }
  };

  // Dynamically remove a member button
  const handleRemoveMember = (indexToRemove) => {
    if (formData.teamSize > 1) {
      const updated = formData.teamMembers.filter((_, idx) => idx !== indexToRemove);
      setFormData((prev) => ({
        ...prev,
        teamSize: prev.teamSize - 1,
        teamMembers: updated,
      }));
    }
  };

  // Member field change handler
  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, teamMembers: updated }));

    // Clear specific error
    const errorKey = `member_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: null }));
    }
  };

  // Field validation logic (14 rules)
  const validateForm = () => {
    const errs = {};

    // 1. Full Name: letters & spaces, min 3 chars
    const nameRegex = /^[a-zA-Z\s]{3,100}$/;
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    } else if (!nameRegex.test(formData.fullName.trim())) {
      errs.fullName = 'Full Name must contain only letters and spaces (minimum 3 characters).';
    }

    // 2. Email: valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = 'Email Address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    // 3. Mobile Number: Indian 10 digits starting with 6,7,8,9
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile Number is required.';
    } else if (!mobileRegex.test(formData.mobileNumber.trim())) {
      errs.mobileNumber = 'Please provide a valid 10-digit Indian mobile number starting with 6-9.';
    }

    // 4. College Name
    if (!formData.collegeName) {
      errs.collegeName = 'Please select your college/university.';
    } else if (formData.collegeName === 'Other' && !formData.customCollege.trim()) {
      errs.customCollege = 'Please specify your college/university name.';
    }

    // 5. Course
    if (!formData.course) {
      errs.course = 'Please select your course.';
    } else if (formData.course === 'Other' && !formData.customCourse.trim()) {
      errs.customCourse = 'Please specify your course.';
    }

    // 6. Branch
    if (!formData.branch) {
      errs.branch = 'Please select your branch.';
    } else if (formData.branch === 'Other' && !formData.customBranch.trim()) {
      errs.customBranch = 'Please specify your branch.';
    }

    // 7. Year of Study
    if (!formData.yearOfStudy) {
      errs.yearOfStudy = 'Please select your year of study.';
    }

    // 8. Domain
    if (!formData.domain) {
      errs.domain = 'Please select a problem domain / track.';
    } else if (formData.domain === 'Other' && !formData.customDomain.trim()) {
      errs.customDomain = 'Please specify your custom domain track.';
    }

    // 9. Project Name: min 5 chars
    if (!formData.projectName.trim()) {
      errs.projectName = 'Project Name is required.';
    } else if (formData.projectName.trim().length < 5) {
      errs.projectName = 'Project Name must be at least 5 characters long.';
    }

    // 10. PPT Link: valid URL
    const urlRegex = /^https?:\/\/.+/i;
    if (!formData.pptLink.trim()) {
      errs.pptLink = 'Presentation/PPT link is required.';
    } else if (!urlRegex.test(formData.pptLink.trim())) {
      errs.pptLink = 'Please enter a valid presentation URL (e.g. Google Drive, OneDrive).';
    }

    // 11. Prototype Link: valid URL
    if (!formData.prototypeLink.trim()) {
      errs.prototypeLink = 'Prototype or repository link is required.';
    } else if (!urlRegex.test(formData.prototypeLink.trim())) {
      errs.prototypeLink = 'Please enter a valid prototype URL (e.g. GitHub repo, Figma demo).';
    }

    // 12. Demo Video Link: optional, but if entered must be valid URL
    if (formData.demoVideoLink.trim() && !urlRegex.test(formData.demoVideoLink.trim())) {
      errs.demoVideoLink = 'Please enter a valid video URL (e.g. YouTube, Google Drive).';
    }

    // 13 & 14. Team Members Validation
    if (formData.teamSize > 1) {
      formData.teamMembers.forEach((member, idx) => {
        if (!member.name.trim()) {
          errs[`member_${idx}_name`] = `Member #${idx + 2} name is required.`;
        } else if (!nameRegex.test(member.name.trim())) {
          errs[`member_${idx}_name`] = `Member #${idx + 2} name must contain only letters and spaces.`;
        }

        if (!member.email.trim()) {
          errs[`member_${idx}_email`] = `Member #${idx + 2} email is required.`;
        } else if (!emailRegex.test(member.email.trim())) {
          errs[`member_${idx}_email`] = `Member #${idx + 2} email format is invalid.`;
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix all form validation errors before submitting.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);

    const resolvedCollege =
      formData.collegeName === 'Other' ? formData.customCollege.trim() : formData.collegeName;
    const resolvedCourse =
      formData.course === 'Other' ? formData.customCourse.trim() : formData.course;
    const resolvedBranch =
      formData.branch === 'Other' ? formData.customBranch.trim() : formData.branch;
    const resolvedDomain =
      formData.domain === 'Other' ? formData.customDomain.trim() : formData.domain;

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobileNumber: formData.mobileNumber.trim(),
      collegeName: resolvedCollege,
      course: resolvedCourse,
      branch: resolvedBranch,
      yearOfStudy: formData.yearOfStudy,
      domain: resolvedDomain,
      projectName: formData.projectName.trim(),
      pptLink: formData.pptLink.trim(),
      prototypeLink: formData.prototypeLink.trim(),
      demoVideoLink: formData.demoVideoLink.trim(),
      teamSize: formData.teamSize,
      teamMembers: formData.teamMembers.map((m) => ({
        name: m.name.trim(),
        email: m.email.trim().toLowerCase(),
      })),
    };

    try {
      const res = await hackathonService.register(payload);
      if (res.data?.registration) {
        toast.success('Your hackathon squad registration has been locked in!', 'Registration Confirmed');
        setSubmissionSuccess({
          registration: res.data.registration,
          registrationId:
            res.data.registrationId ||
            `WAM-REG-${res.data.registration._id.toString().slice(-8).toUpperCase()}`,
        });
      }
    } catch (err) {
      toast.error(
        err.message || 'Failed to submit registration. Please try again.',
        'Registration Failed'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    toast.info('Registration ID copied to clipboard.');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Loading state
  if (authLoading || isCheckingExisting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black tech-grid-light">
        <div className="flex flex-col items-center gap-3 font-mono">
          <div className="w-10 h-10 border-2 border-[#FF007F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
            Preparing Registration Module...
          </p>
        </div>
      </div>
    );
  }

  // SCREEN 1: ALREADY REGISTERED NOTICE (Prevents duplicate submissions)
  if (existingRegistration && !submissionSuccess) {
    const formattedId = `WAM-REG-${existingRegistration._id.toString().slice(-8).toUpperCase()}`;

    return (
      <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center tech-grid-light">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <Badge variant="pink" size="md" className="mb-2">Already Registered</Badge>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-black tracking-tight">
              You Have Already Submitted Your Entry
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-lg mx-auto leading-relaxed font-sans">
              Each authenticated hacker account is permitted exactly one hackathon registration. Your squad entry is locked in under registration ID:
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-50 border border-[#FF007F]/40 font-mono font-bold text-[#FF007F] text-sm">
              <span>{formattedId}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-black/10 text-left space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Project Name:</span>
              <span className="font-bold text-black font-sans">{existingRegistration.projectName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Domain Track:</span>
              <span className="font-bold text-[#FF007F]">{existingRegistration.domain}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Team Squad:</span>
              <span className="font-bold text-black">
                {existingRegistration.teamSize} {existingRegistration.teamSize > 1 ? 'Builders' : 'Solo Builder'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Status:</span>
              <span className="font-bold uppercase tracking-wider text-[#FF007F]">
                {existingRegistration.registrationStatus}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/dashboard')}
              className="font-mono text-xs uppercase tracking-wider font-bold"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 2: SUCCESSFUL REGISTRATION SCREEN
  if (submissionSuccess) {
    const { registration: reg, registrationId: regId } = submissionSuccess;

    return (
      <div className="min-h-screen bg-white text-black py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center tech-grid-light">
        <div className="max-w-3xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Confirmed Icon */}
          <div className="w-20 h-20 rounded-3xl bg-neutral-100 border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007F]/10 border border-[#FF007F]/30 text-[#FF007F] text-xs font-mono font-bold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>[ CONFIRMATION DISPATCH ]</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-black text-black tracking-tight">
              Registration Successfully Confirmed!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed font-sans">
              Welcome to <strong>WAMPIRE 2026</strong>. A confirmation email with your project credential details has been dispatched to{' '}
              <span className="font-bold text-[#FF007F] font-mono">{reg.email}</span>.
            </p>
          </div>

          {/* Unique Registration ID Banner */}
          <div className="p-5 rounded-2xl bg-neutral-50 border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                Official Registration Credential ID
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-[#FF007F]">{regId}</span>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(regId)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-black/10 text-xs font-mono font-bold text-black hover:border-[#FF007F] transition-colors cursor-pointer shadow-sm"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-[#FF007F]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          {/* Registration Summary Card */}
          <div className="bg-neutral-50 rounded-2xl p-6 border border-black/10 text-left space-y-4 text-xs font-mono">
            <h3 className="font-bold text-black uppercase tracking-wider text-xs">
              Project & Squad Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-500 block text-[11px]">Project Title</span>
                <span className="font-serif font-bold text-black text-sm">{reg.projectName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Domain Track</span>
                <span className="font-bold text-[#FF007F] text-sm">{reg.domain}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Institution</span>
                <span className="font-bold text-neutral-800">{reg.collegeName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[11px]">Squad Size</span>
                <span className="font-bold text-black">
                  {reg.teamSize} {reg.teamSize > 1 ? 'Builders' : 'Solo Builder'}
                </span>
              </div>
            </div>

            {/* Team Members List */}
            {reg.teamMembers && reg.teamMembers.length > 0 && (
              <div className="pt-3 border-t border-black/10">
                <span className="text-neutral-500 block text-[11px] mb-2 font-bold uppercase tracking-wider">
                  Squad Members
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-black/10">
                    <span className="font-bold text-black">{reg.fullName} (Lead)</span>
                    <span className="font-mono text-neutral-600">{reg.email}</span>
                  </div>
                  {reg.teamMembers.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white p-2 rounded-xl border border-black/10"
                    >
                      <span className="font-bold text-neutral-800">{m.name}</span>
                      <span className="font-mono text-neutral-600">{m.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Rocket className="w-4 h-4" />}
              onClick={() => navigate('/dashboard')}
              className="font-mono text-xs uppercase tracking-wider font-bold"
            >
              Go to Participant Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 3: HACKATHON REGISTRATION FORM
  return (
    <div className="min-h-screen bg-white text-black py-16 px-4 sm:px-6 lg:px-8 text-left tech-grid-light">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-neutral-700 hover:text-black transition-all bg-white px-4 py-2 rounded-full border border-black/10 hover:border-[#FF007F] shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FF007F]" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-neutral-500">
            <span>Portal</span> / <span className="text-[#FF007F]">Registration</span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] relative overflow-hidden">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007F]/10 border border-[#FF007F]/30 text-[#FF007F] text-xs font-mono font-bold shadow-sm">
              <Rocket className="w-3.5 h-3.5" />
              <span>[ WAMPIRE 2026 // SPRINT ]</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-black text-black tracking-tight">
              Official Hackathon Registration Module
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed">
              Submit your team credentials, problem track, and prototype links. All details are saved directly in MongoDB and confirmed via automated email dispatch.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* SECTION 1: LEAD PARTICIPANT DETAILS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] space-y-6">
            <div className="pb-4 border-b border-black/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                01
              </div>
              <h2 className="text-base font-serif font-bold text-black tracking-tight">
                Team Leader Personal Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  Full Name <span className="text-[#FF007F]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (errors.fullName) setErrors({ ...errors, fullName: null });
                    }}
                    placeholder="Ada Lovelace"
                    className={`w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 text-sm border outline-none font-sans transition-all ${
                      errors.fullName
                        ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                        : 'border-black/20 hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 font-medium mt-1">{errors.fullName}</p>}
                <p className="text-[11px] font-mono text-neutral-500">Letters and permitted spaces only, minimum 3 characters</p>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  Email Address <span className="text-[#FF007F]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-neutral-100 text-neutral-600 rounded-xl pl-10 pr-4 py-3 text-sm border border-black/10 cursor-not-allowed font-mono"
                  />
                </div>
                <p className="text-[11px] font-mono text-neutral-500">Pre-filled from your authenticated account</p>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  Mobile Number (India) <span className="text-[#FF007F]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.mobileNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, mobileNumber: val });
                      if (errors.mobileNumber) setErrors({ ...errors, mobileNumber: null });
                    }}
                    placeholder="9876543210"
                    className={`w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 text-sm border outline-none font-sans transition-all ${
                      errors.mobileNumber
                        ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                        : 'border-black/20 hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.mobileNumber}</p>
                )}
                <p className="text-[11px] font-mono text-neutral-500">Exactly 10 digits starting with 6, 7, 8, or 9</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC INSTITUTION & PROGRAM */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] space-y-6">
            <div className="pb-4 border-b border-black/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                02
              </div>
              <h2 className="text-base font-serif font-bold text-black tracking-tight">
                Academic Institution Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* College Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  College / University <span className="text-[#FF007F]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.collegeName}
                    onChange={(e) => {
                      setFormData({ ...formData, collegeName: e.target.value });
                      if (errors.customCollege) setErrors({ ...errors, customCollege: null });
                    }}
                    className="w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 text-sm border border-black/20 hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20 outline-none font-sans"
                  >
                    {PREDEFINED_COLLEGES.map((c) => (
                      <option key={c} value={c} className="bg-white text-black">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom College Input if 'Other' */}
              {formData.collegeName === 'Other' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                    Specify College / University Name <span className="text-[#FF007F]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customCollege}
                    onChange={(e) => {
                      setFormData({ ...formData, customCollege: e.target.value });
                      if (errors.customCollege) setErrors({ ...errors, customCollege: null });
                    }}
                    placeholder="Enter your university name"
                    className={`w-full bg-white text-black rounded-xl px-4 py-3 text-sm border outline-none font-sans ${
                      errors.customCollege
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-black/20 focus:border-[#FF007F]'
                    }`}
                  />
                  {errors.customCollege && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.customCollege}</p>
                  )}
                </div>
              )}

              {/* Course, Branch, and Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Course */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                    Course <span className="text-[#FF007F]">*</span>
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-white text-black rounded-xl px-4 py-3 text-sm border border-black/20 outline-none focus:border-[#FF007F] font-sans"
                  >
                    {COURSES.map((crs) => (
                      <option key={crs} value={crs} className="bg-white text-black">
                        {crs}
                      </option>
                    ))}
                  </select>
                  {formData.course === 'Other' && (
                    <input
                      type="text"
                      placeholder="Specify Course"
                      value={formData.customCourse}
                      onChange={(e) => setFormData({ ...formData, customCourse: e.target.value })}
                      className="w-full bg-white text-black rounded-xl px-3 py-2 text-xs border border-black/20 mt-1 font-sans"
                    />
                  )}
                </div>

                {/* Branch */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                    Branch <span className="text-[#FF007F]">*</span>
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-white text-black rounded-xl px-4 py-3 text-sm border border-black/20 outline-none focus:border-[#FF007F] font-sans"
                  >
                    {BRANCHES.map((br) => (
                      <option key={br} value={br} className="bg-white text-black">
                        {br}
                      </option>
                    ))}
                  </select>
                  {formData.branch === 'Other' && (
                    <input
                      type="text"
                      placeholder="Specify Branch"
                      value={formData.customBranch}
                      onChange={(e) => setFormData({ ...formData, customBranch: e.target.value })}
                      className="w-full bg-white text-black rounded-xl px-3 py-2 text-xs border border-black/20 mt-1 font-sans"
                    />
                  )}
                </div>

                {/* Year of Study */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                    Year of Study <span className="text-[#FF007F]">*</span>
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full bg-white text-black rounded-xl px-4 py-3 text-sm border border-black/20 outline-none focus:border-[#FF007F] font-sans"
                  >
                    {YEARS_OF_STUDY.map((yr) => (
                      <option key={yr} value={yr} className="bg-white text-black">
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: DOMAIN TRACK & PROJECT DELIVERABLES */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] space-y-6">
            <div className="pb-4 border-b border-black/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-neutral-100 border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                03
              </div>
              <h2 className="text-base font-serif font-bold text-black tracking-tight">
                Domain Track & Project Submission Links
              </h2>
            </div>

            <div className="space-y-4">
              {/* Domain Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  Domain / Track <span className="text-[#FF007F]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <Layers className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 text-sm border border-black/20 hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20 outline-none font-sans"
                  >
                    {DOMAINS.map((dom) => (
                      <option key={dom} value={dom} className="bg-white text-black">
                        {dom}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.domain === 'Other' && (
                  <input
                    type="text"
                    placeholder="Specify Custom Domain"
                    value={formData.customDomain}
                    onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                    className="w-full bg-white text-black rounded-xl px-4 py-3 text-sm border border-black/20 mt-2 font-sans"
                  />
                )}
              </div>

              {/* Project Name (Min 5 chars) */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  Project Name <span className="text-[#FF007F]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => {
                      setFormData({ ...formData, projectName: e.target.value });
                      if (errors.projectName) setErrors({ ...errors, projectName: null });
                    }}
                    placeholder="e.g. NeuroShield: Real-time Autonomous Threat Defense"
                    className={`w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 text-sm border outline-none font-sans transition-all ${
                      errors.projectName
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-black/20 hover:border-black/30 focus:border-[#FF007F]'
                    }`}
                  />
                </div>
                {errors.projectName && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.projectName}</p>
                )}
                <p className="text-[11px] font-mono text-neutral-500">Minimum 5 characters</p>
              </div>

              {/* PPT Link */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  PPT / Pitch Deck Link <span className="text-[#FF007F]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={formData.pptLink}
                    onChange={(e) => {
                      setFormData({ ...formData, pptLink: e.target.value });
                      if (errors.pptLink) setErrors({ ...errors, pptLink: null });
                    }}
                    placeholder="https://drive.google.com/file/d/..."
                    className={`w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 text-sm border outline-none font-mono transition-all ${
                      errors.pptLink
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-black/20 hover:border-black/30 focus:border-[#FF007F]'
                    }`}
                  />
                </div>
                {errors.pptLink && <p className="text-xs text-red-500 font-medium mt-1">{errors.pptLink}</p>}
                <p className="text-[11px] font-mono text-neutral-500">Valid Google Drive or OneDrive presentation URL</p>
              </div>

              {/* Prototype Link */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  Prototype Link <span className="text-[#FF007F]">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={formData.prototypeLink}
                    onChange={(e) => {
                      setFormData({ ...formData, prototypeLink: e.target.value });
                      if (errors.prototypeLink) setErrors({ ...errors, prototypeLink: null });
                    }}
                    placeholder="https://github.com/org/repo or https://figma.com/..."
                    className={`w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 text-sm border outline-none font-mono transition-all ${
                      errors.prototypeLink
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-black/20 hover:border-black/30 focus:border-[#FF007F]'
                    }`}
                  />
                </div>
                {errors.prototypeLink && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.prototypeLink}</p>
                )}
                <p className="text-[11px] font-mono text-neutral-500">Valid GitHub repository, Figma design, or live demo URL</p>
              </div>

              {/* Demo Video Link (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  Demo Video Link <span className="text-neutral-500 font-normal">(Optional)</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-neutral-400 pointer-events-none">
                    <Video className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={formData.demoVideoLink}
                    onChange={(e) => {
                      setFormData({ ...formData, demoVideoLink: e.target.value });
                      if (errors.demoVideoLink) setErrors({ ...errors, demoVideoLink: null });
                    }}
                    placeholder="https://youtube.com/watch?v=... or Google Drive URL"
                    className={`w-full bg-white text-black rounded-xl pl-10 pr-4 py-3 text-sm border outline-none font-mono transition-all ${
                      errors.demoVideoLink
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-black/20 hover:border-black/30 focus:border-[#FF007F]'
                    }`}
                  />
                </div>
                {errors.demoVideoLink && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.demoVideoLink}</p>
                )}
                <p className="text-[11px] font-mono text-neutral-500">Optional valid YouTube or Google Drive walkthrough video</p>
              </div>
            </div>
          </div>

          {/* SECTION 4: DYNAMIC TEAM MANAGEMENT (1 to 5 members) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] space-y-6">
            <div className="pb-4 border-b border-black/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-100 border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center font-mono font-bold text-xs shadow-sm">
                  04
                </div>
                <div>
                  <h2 className="text-base font-serif font-bold text-black tracking-tight">
                    Dynamic Team Management
                  </h2>
                  <p className="text-xs font-mono text-neutral-500">Supports squad sizes from 1 up to 5 members</p>
                </div>
              </div>

              {formData.teamSize < 5 && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-[#FF007F]/50 text-[#FF007F] text-xs font-mono font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              )}
            </div>

            {/* Team Size Selector Buttons (1 to 5) */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                Selected Squad Size: <span className="text-[#FF007F]">{formData.teamSize} Member{formData.teamSize > 1 ? 's' : ' (Solo)'}</span>
              </label>

              <div className="grid grid-cols-5 gap-2 font-mono">
                {[1, 2, 3, 4, 5].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleTeamSizeChange(size)}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.teamSize === size
                        ? 'bg-[#FF007F] text-white border-[#FF007F] shadow-glow-pink scale-[1.02]'
                        : 'bg-neutral-50 text-neutral-700 border-black/10 hover:border-black/30 hover:text-black'
                    }`}
                  >
                    {size} {size === 1 ? 'Solo' : 'Hackers'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Additional Member Forms */}
            {formData.teamSize === 1 ? (
              <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 text-xs font-mono text-neutral-600 text-center">
                Solo participant entry. You will compete individually without additional team members.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <p className="text-xs font-mono font-bold text-black uppercase tracking-wider">
                  Additional Squad Members ({formData.teamMembers.length} of {formData.teamSize - 1})
                </p>

                {formData.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-50 border border-black/10 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#FF007F] flex items-center gap-1.5">
                        <Users2 className="w-3.5 h-3.5" />
                        Squad Member #{idx + 2}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-neutral-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Remove member"
                        aria-label={`Remove Member ${idx + 2}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Member Name */}
                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="Member Full Name"
                          value={member.name}
                          onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                          className={`w-full bg-white text-black rounded-xl px-3.5 py-2.5 text-xs border outline-none font-sans ${
                            errors[`member_${idx}_name`]
                              ? 'border-red-500 focus:border-red-400'
                              : 'border-black/20 focus:border-[#FF007F]'
                          }`}
                        />
                        {errors[`member_${idx}_name`] && (
                          <p className="text-[11px] text-red-500 font-medium">
                            {errors[`member_${idx}_name`]}
                          </p>
                        )}
                      </div>

                      {/* Member Email */}
                      <div className="space-y-1">
                        <input
                          type="email"
                          placeholder="Member Email Address"
                          value={member.email}
                          onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                          className={`w-full bg-white text-black rounded-xl px-3.5 py-2.5 text-xs border outline-none font-mono ${
                            errors[`member_${idx}_email`]
                              ? 'border-red-500 focus:border-red-400'
                              : 'border-black/20 focus:border-[#FF007F]'
                          }`}
                        />
                        {errors[`member_${idx}_email`] && (
                          <p className="text-[11px] text-red-500 font-medium">
                            {errors[`member_${idx}_email`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="p-6 bg-white rounded-3xl border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-neutral-600">
              <span className="font-bold text-black block">Ready to compete in the arena?</span>
              Registration triggers confirmation email and locks your participant spot.
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              leftIcon={<Rocket className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto font-mono text-xs uppercase tracking-wider font-bold"
            >
              {isSubmitting ? 'Locking in Registration...' : 'Submit Hackathon Registration'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HackathonRegisterPage;
