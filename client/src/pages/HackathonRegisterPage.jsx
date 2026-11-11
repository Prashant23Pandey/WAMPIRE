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

  // Update member field
  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, teamMembers: updated }));

    // Clear inline error
    const key = `member_${index}_${field}`;
    if (errors[key]) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n[key];
        return n;
      });
    }
  };

  // URL validators
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isGoogleDriveOrOneDrive = (url) => {
    if (!isValidUrl(url)) return false;
    const lower = url.toLowerCase();
    return (
      lower.includes('drive.google.com') ||
      lower.includes('docs.google.com') ||
      lower.includes('onedrive.live.com') ||
      lower.includes('1drv.ms') ||
      lower.includes('sharepoint.com')
    );
  };

  const isGitHubFigmaOrDemo = (url) => {
    if (!isValidUrl(url)) return false;
    const lower = url.toLowerCase();
    return (
      lower.includes('github.com') ||
      lower.includes('figma.com') ||
      lower.includes('vercel.app') ||
      lower.includes('netlify.app') ||
      lower.includes('render.com') ||
      lower.includes('herokuapp.com') ||
      lower.startsWith('http://') ||
      lower.startsWith('https://')
    );
  };

  const isYouTubeOrDrive = (url) => {
    if (!url) return true; // Optional
    if (!isValidUrl(url)) return false;
    const lower = url.toLowerCase();
    return (
      lower.includes('youtube.com') ||
      lower.includes('youtu.be') ||
      lower.includes('drive.google.com') ||
      lower.includes('docs.google.com')
    );
  };

  // Validate entire form
  const validateForm = () => {
    const newErrors = {};

    // 1. Full Name
    const nameTrim = formData.fullName.trim();
    if (!nameTrim) {
      newErrors.fullName = 'Full Name is required.';
    } else if (nameTrim.length < 3) {
      newErrors.fullName = 'Full Name must be at least 3 characters.';
    } else if (!/^[a-zA-Z\s]{3,100}$/.test(nameTrim)) {
      newErrors.fullName = 'Full Name must contain letters and permitted spaces only.';
    }

    // 2. Email Address
    const emailTrim = formData.email.trim();
    if (!emailTrim || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) {
      newErrors.email = 'A valid email address is required.';
    }

    // 3. Mobile Number (Exactly 10 digits Indian mobile)
    const mobileTrim = formData.mobileNumber.trim();
    if (!mobileTrim) {
      newErrors.mobileNumber = 'Mobile Number is required.';
    } else if (!/^[6-9]\d{9}$/.test(mobileTrim)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    // 4. College Name
    if (formData.collegeName === 'Other') {
      const customCollegeTrim = formData.customCollege.trim();
      if (!customCollegeTrim) {
        newErrors.customCollege = 'Please specify your College / University name.';
      } else if (customCollegeTrim.length < 3) {
        newErrors.customCollege = 'College name must be at least 3 characters.';
      }
    }

    // 5. Course
    if (formData.course === 'Other' && !formData.customCourse.trim()) {
      newErrors.customCourse = 'Please specify your degree / course name.';
    }

    // 6. Branch
    if (formData.branch === 'Other' && !formData.customBranch.trim()) {
      newErrors.customBranch = 'Please specify your academic branch / department.';
    }

    // 7. Domain
    if (formData.domain === 'Other' && !formData.customDomain.trim()) {
      newErrors.customDomain = 'Please specify your custom domain track.';
    }

    // 8. Project Name (Minimum 5 characters)
    const projectTrim = formData.projectName.trim();
    if (!projectTrim) {
      newErrors.projectName = 'Project Name is required.';
    } else if (projectTrim.length < 5) {
      newErrors.projectName = 'Project Name must be at least 5 characters long.';
    }

    // 9. PPT Link (Valid Google Drive or OneDrive URL)
    const pptTrim = formData.pptLink.trim();
    if (!pptTrim) {
      newErrors.pptLink = 'Presentation deck link is required.';
    } else if (!isGoogleDriveOrOneDrive(pptTrim)) {
      newErrors.pptLink = 'Must be a valid Google Drive or OneDrive presentation URL.';
    }

    // 10. Prototype Link (Valid GitHub, Figma, or live demonstration URL)
    const protoTrim = formData.prototypeLink.trim();
    if (!protoTrim) {
      newErrors.prototypeLink = 'Prototype or repository link is required.';
    } else if (!isGitHubFigmaOrDemo(protoTrim)) {
      newErrors.prototypeLink = 'Must be a valid GitHub, Figma, or live demonstration URL.';
    }

    // 11. Demo Video (Optional valid YouTube or Drive URL)
    const videoTrim = formData.demoVideoLink.trim();
    if (videoTrim && !isYouTubeOrDrive(videoTrim)) {
      newErrors.demoVideoLink = 'If provided, demo video must be a valid YouTube or Google Drive URL.';
    }

    // 12. Additional Team Members Validation
    if (formData.teamSize > 1) {
      const leadEmail = formData.email.trim().toLowerCase();
      const seenEmails = new Set();

      formData.teamMembers.forEach((member, idx) => {
        const mName = (member.name || '').trim();
        const mEmail = (member.email || '').trim().toLowerCase();

        if (!mName) {
          newErrors[`member_${idx}_name`] = `Member #${idx + 2} name is required.`;
        } else if (mName.length < 3 || !/^[a-zA-Z\s]{3,100}$/.test(mName)) {
          newErrors[`member_${idx}_name`] = `Member #${idx + 2} name must be at least 3 letters.`;
        }

        if (!mEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mEmail)) {
          newErrors[`member_${idx}_email`] = `Member #${idx + 2} email is invalid.`;
        } else if (mEmail === leadEmail) {
          newErrors[`member_${idx}_email`] = `Cannot use team leader's email for a squad member.`;
        } else if (seenEmails.has(mEmail)) {
          newErrors[`member_${idx}_email`] = `Duplicate email among squad members: ${mEmail}`;
        } else {
          seenEmails.add(mEmail);
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please resolve the errors highlighted on the registration form.', 'Validation Error');
      return;
    }

    setIsSubmitting(true);

    // Resolve College, Course, Branch, and Domain
    const finalCollege =
      formData.collegeName === 'Other' ? formData.customCollege.trim() : formData.collegeName;
    const finalCourse =
      formData.course === 'Other' ? formData.customCourse.trim() : formData.course;
    const finalBranch =
      formData.branch === 'Other' ? formData.customBranch.trim() : formData.branch;
    const finalDomain =
      formData.domain === 'Other' ? formData.customDomain.trim() : formData.domain;

    const payload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobileNumber: formData.mobileNumber.trim(),
      collegeName: finalCollege,
      course: finalCourse,
      branch: finalBranch,
      yearOfStudy: formData.yearOfStudy,
      domain: finalDomain,
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
            `CAN-REG-${res.data.registration._id.toString().slice(-8).toUpperCase()}`,
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
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Preparing Registration Module...
          </p>
        </div>
      </div>
    );
  }

  // SCREEN 1: ALREADY REGISTERED NOTICE (Prevents duplicate submissions)
  if (existingRegistration && !submissionSuccess) {
    const formattedId = `CAN-REG-${existingRegistration._id.toString().slice(-8).toUpperCase()}`;

    return (
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <Badge variant="success" className="mb-2">Already Registered</Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              You Have Already Submitted Your Entry
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
              Each authenticated hacker account is permitted exactly one hackathon registration. Your squad entry is locked in under registration ID:
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 font-mono font-extrabold text-blue-600 text-sm">
              <span>{formattedId}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Project Name:</span>
              <span className="font-bold text-slate-900">{existingRegistration.projectName}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Domain Track:</span>
              <span className="font-bold text-violet-700">{existingRegistration.domain}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Team Squad:</span>
              <span className="font-bold text-slate-900">
                {existingRegistration.teamSize} {existingRegistration.teamSize > 1 ? 'Hackers' : 'Hacker (Solo)'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold uppercase tracking-wider text-emerald-600">
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
      <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-soft-xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
          {/* Confirmed Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-soft-lg">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Confirmation Dispatch</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Registration Successfully Confirmed!
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
              Welcome to <strong>CODE-A-NOVA 2026</strong>. A confirmation email with your project credential details has been dispatched to{' '}
              <span className="font-bold text-slate-800">{reg.email}</span>.
            </p>
          </div>

          {/* Unique Registration ID Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Official Registration Credential ID
              </span>
              <span className="font-mono text-xl font-extrabold text-blue-700">{regId}</span>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(regId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors cursor-pointer shadow-soft-sm"
            >
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
            </button>
          </div>

          {/* Registration Summary Card */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Project & Squad Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block text-[11px]">Project Title</span>
                <span className="font-bold text-slate-900 text-sm">{reg.projectName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Domain Track</span>
                <span className="font-bold text-violet-700 text-sm">{reg.domain}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Institution</span>
                <span className="font-bold text-slate-800">{reg.collegeName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Squad Size</span>
                <span className="font-bold text-slate-800">
                  {reg.teamSize} {reg.teamSize > 1 ? 'Hackers' : 'Hacker (Solo)'}
                </span>
              </div>
            </div>

            {/* Team Members List */}
            {reg.teamMembers && reg.teamMembers.length > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <span className="text-slate-400 block text-[11px] mb-2 font-bold uppercase tracking-wider">
                  Squad Members
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-900">{reg.fullName} (Lead)</span>
                    <span className="font-mono text-slate-500">{reg.email}</span>
                  </div>
                  {reg.teamMembers.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200"
                    >
                      <span className="font-bold text-slate-800">{m.name}</span>
                      <span className="font-mono text-slate-500">{m.email}</span>
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 py-10 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-soft-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-400">
            <span>Portal</span> / <span className="text-blue-600">Registration</span>
          </div>
        </div>

        {/* Header Hero */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-soft-sm relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-3">
              <Rocket className="w-3.5 h-3.5" />
              <span>CODE-A-NOVA 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Official Hackathon Registration Module
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Submit your team credentials, problem track, and prototype links. All details are saved directly in MongoDB and confirmed via automated email dispatch.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* SECTION 1: LEAD PARTICIPANT DETAILS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-sm space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                1
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Team Leader Personal Credentials
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                    className={`w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm border outline-none shadow-soft-sm transition-all ${
                      errors.fullName
                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-red-600 font-medium mt-1">{errors.fullName}</p>}
                <p className="text-[11px] text-slate-400">Letters and permitted spaces only, minimum 3 characters</p>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Email Address <span className="text-blue-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-slate-100 text-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-200 cursor-not-allowed font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">Pre-filled from your authenticated account</p>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mobile Number (India) <span className="text-blue-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                    className={`w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm border outline-none shadow-soft-sm transition-all ${
                      errors.mobileNumber
                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50'
                    }`}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.mobileNumber}</p>
                )}
                <p className="text-[11px] text-slate-400">Exactly 10 digits starting with 6, 7, 8, or 9</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC INSTITUTION & PROGRAM */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-sm space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                2
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Academic Institution Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* College Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  College / University <span className="text-blue-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.collegeName}
                    onChange={(e) => {
                      setFormData({ ...formData, collegeName: e.target.value });
                      if (errors.customCollege) setErrors({ ...errors, customCollege: null });
                    }}
                    className="w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none shadow-soft-sm"
                  >
                    {PREDEFINED_COLLEGES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom College Input if 'Other' */}
              {formData.collegeName === 'Other' && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Specify College / University Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customCollege}
                    onChange={(e) => {
                      setFormData({ ...formData, customCollege: e.target.value });
                      if (errors.customCollege) setErrors({ ...errors, customCollege: null });
                    }}
                    placeholder="Enter your university name"
                    className={`w-full bg-white text-slate-900 rounded-xl px-4 py-3 text-sm border outline-none shadow-soft-sm ${
                      errors.customCollege
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200 focus:border-blue-600'
                    }`}
                  />
                  {errors.customCollege && (
                    <p className="text-xs text-red-600 font-medium mt-1">{errors.customCollege}</p>
                  )}
                </div>
              )}

              {/* Course, Branch, and Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Course */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Course <span className="text-blue-600">*</span>
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 text-sm border border-slate-200 outline-none focus:border-blue-600 shadow-soft-sm"
                  >
                    {COURSES.map((crs) => (
                      <option key={crs} value={crs}>
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
                      className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 text-xs border border-slate-200 mt-1"
                    />
                  )}
                </div>

                {/* Branch */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Branch <span className="text-blue-600">*</span>
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 text-sm border border-slate-200 outline-none focus:border-blue-600 shadow-soft-sm"
                  >
                    {BRANCHES.map((br) => (
                      <option key={br} value={br}>
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
                      className="w-full bg-white text-slate-900 rounded-xl px-3 py-2 text-xs border border-slate-200 mt-1"
                    />
                  )}
                </div>

                {/* Year of Study */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Year of Study <span className="text-blue-600">*</span>
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 text-sm border border-slate-200 outline-none focus:border-blue-600 shadow-soft-sm"
                  >
                    {YEARS_OF_STUDY.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: DOMAIN TRACK & PROJECT DELIVERABLES */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-sm space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                3
              </div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Domain Track & Project Submission Links
              </h2>
            </div>

            <div className="space-y-4">
              {/* Domain Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Domain / Track <span className="text-blue-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <Layers className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none shadow-soft-sm"
                  >
                    {DOMAINS.map((dom) => (
                      <option key={dom} value={dom}>
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
                    className="w-full bg-white text-slate-900 rounded-xl px-4 py-3 text-sm border border-slate-200 mt-2"
                  />
                )}
              </div>

              {/* Project Name (Min 5 chars) */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Project Name <span className="text-blue-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                    className={`w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm border outline-none shadow-soft-sm transition-all ${
                      errors.projectName
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600'
                    }`}
                  />
                </div>
                {errors.projectName && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.projectName}</p>
                )}
                <p className="text-[11px] text-slate-400">Minimum 5 characters</p>
              </div>

              {/* PPT Link */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  PPT / Pitch Deck Link <span className="text-blue-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                    className={`w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm border outline-none shadow-soft-sm transition-all ${
                      errors.pptLink
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600'
                    }`}
                  />
                </div>
                {errors.pptLink && <p className="text-xs text-red-600 font-medium mt-1">{errors.pptLink}</p>}
                <p className="text-[11px] text-slate-400">Valid Google Drive or OneDrive presentation URL</p>
              </div>

              {/* Prototype Link */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Prototype Link <span className="text-blue-600">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                    className={`w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm border outline-none shadow-soft-sm transition-all ${
                      errors.prototypeLink
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600'
                    }`}
                  />
                </div>
                {errors.prototypeLink && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.prototypeLink}</p>
                )}
                <p className="text-[11px] text-slate-400">Valid GitHub repository, Figma design, or live demo URL</p>
              </div>

              {/* Demo Video Link (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Demo Video Link <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-400 pointer-events-none">
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
                    className={`w-full bg-white text-slate-900 rounded-xl pl-10 pr-4 py-3 text-sm border outline-none shadow-soft-sm transition-all ${
                      errors.demoVideoLink
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200 hover:border-slate-300 focus:border-blue-600'
                    }`}
                  />
                </div>
                {errors.demoVideoLink && (
                  <p className="text-xs text-red-600 font-medium mt-1">{errors.demoVideoLink}</p>
                )}
                <p className="text-[11px] text-slate-400">Optional valid YouTube or Google Drive walkthrough video</p>
              </div>
            </div>
          </div>

          {/* SECTION 4: DYNAMIC TEAM MANAGEMENT (1 to 5 members) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft-sm space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Dynamic Team Management
                  </h2>
                  <p className="text-xs text-slate-400">Supports squad sizes from 1 up to 5 members</p>
                </div>
              </div>

              {formData.teamSize < 5 && (
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              )}
            </div>

            {/* Team Size Selector Buttons (1 to 5) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Selected Squad Size: <span className="text-blue-600">{formData.teamSize} Member{formData.teamSize > 1 ? 's' : ' (Solo)'}</span>
              </label>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleTeamSizeChange(size)}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.teamSize === size
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white border-transparent shadow-soft-md shadow-blue-500/20 scale-[1.02]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {size} {size === 1 ? 'Solo' : 'Hackers'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Additional Member Forms */}
            {formData.teamSize === 1 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center">
                Solo participant entry. You will compete individually without additional team members.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Additional Squad Members ({formData.teamMembers.length} of {formData.teamSize - 1})
                </p>

                {formData.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                        <Users2 className="w-3.5 h-3.5" />
                        Squad Member #{idx + 2}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
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
                          className={`w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-xs border outline-none shadow-soft-sm ${
                            errors[`member_${idx}_name`]
                              ? 'border-red-400 focus:border-red-500'
                              : 'border-slate-200 focus:border-blue-600'
                          }`}
                        />
                        {errors[`member_${idx}_name`] && (
                          <p className="text-[11px] text-red-600 font-medium">
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
                          className={`w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-xs border outline-none shadow-soft-sm ${
                            errors[`member_${idx}_email`]
                              ? 'border-red-400 focus:border-red-500'
                              : 'border-slate-200 focus:border-blue-600'
                          }`}
                        />
                        {errors[`member_${idx}_email`] && (
                          <p className="text-[11px] text-red-600 font-medium">
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
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-soft-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <span className="font-bold text-slate-800 block">Ready to compete?</span>
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
              className="w-full sm:w-auto"
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

