import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Rocket,
  User,
  Users2,
  FileCheck2,
  Send,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  AlertTriangle,
  RefreshCw,
  Mail,
  CheckCircle2,
  Sparkles,
  Award,
  Phone,
  FileText,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useToast } from '../hooks/useToast.js';
import authService from '../services/authService.js';
import hackathonService from '../services/hackathonService.js';
import contactService from '../services/contactService.js';

import Sidebar from '../components/dashboard/Sidebar.jsx';
import TopNavbar from '../components/dashboard/TopNavbar.jsx';
import ProfileCard from '../components/dashboard/ProfileCard.jsx';
import RegistrationStatusCard from '../components/dashboard/RegistrationStatusCard.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import LoadingSkeleton from '../components/dashboard/LoadingSkeleton.jsx';
import EditProfileModal from '../components/dashboard/EditProfileModal.jsx';
import RegistrationModal from '../components/dashboard/RegistrationModal.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import Alert from '../components/common/Alert.jsx';
import Badge from '../components/common/Badge.jsx';

export const DashboardPage = () => {
  const { user: authUser, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // Active Sidebar Tab State
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data States
  const [userProfile, setUserProfile] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Modal States
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Support Form State
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSending, setSupportSending] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);

  // 1. Guard against unauthenticated visitors
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // 2. Fetch Actual Data from MongoDB: GET /api/user/me & GET /api/hackathon/my-entry
  const fetchDashboardData = useCallback(async () => {
    setIsDataLoading(true);
    setApiError(null);

    try {
      // Parallel fetch to both endpoints
      const [userRes, hackathonRes] = await Promise.allSettled([
        authService.getMe(),
        hackathonService.getMyEntry(),
      ]);

      // Handle user profile response
      if (userRes.status === 'fulfilled' && userRes.value?.data?.user) {
        setUserProfile(userRes.value.data.user);
      } else if (authUser) {
        setUserProfile(authUser);
      }

      // Handle registration response
      if (hackathonRes.status === 'fulfilled') {
        const regData = hackathonRes.value?.data?.registration || null;
        setRegistration(regData);
      }
    } catch (err) {
      console.error('[Dashboard Error]:', err);
      setApiError('Unable to refresh dashboard data. Please verify your connection.');
    } finally {
      setIsDataLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, fetchDashboardData]);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    toast.info('You have safely signed out of CODE-A-NOVA.', 'Signed Out');
    navigate('/login');
  };

  // Handle Support message submission
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    setSupportSending(true);
    try {
      await contactService.submitMessage({
        name: activeUser?.fullName || 'Hacker',
        email: activeUser?.email || '',
        message: supportMessage.trim(),
      });
      setSupportSuccess(true);
      setSupportMessage('');
      toast.success('Your support request has been logged. Our mentoring team will reply shortly.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit support request.');
    } finally {
      setSupportSending(false);
    }
  };

  // Handle Withdraw Registration
  const handleConfirmWithdraw = async () => {
    if (!registration?._id) return;
    setIsWithdrawing(true);
    try {
      await hackathonService.deleteRegistration(registration._id);
      toast.success('Your hackathon registration has been safely withdrawn.', 'Registration Withdrawn');
      setRegistration(null);
      setIsWithdrawModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw registration.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const activeUser = userProfile || authUser;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Validating Hackathon Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isRegistered={Boolean(registration)}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main Content Layout (Offset for desktop sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Navigation Bar */}
        <TopNavbar
          user={activeUser}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onLogout={handleLogout}
        />

        {/* Inner Dashboard Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* API Error Notice */}
          {apiError && (
            <Alert
              type="error"
              title="Connection Error"
              message={apiError}
              onClose={() => setApiError(null)}
            />
          )}

          {/* Loading Skeleton Mode */}
          {isDataLoading && <LoadingSkeleton />}

          {/* Render Actual Data Once Loaded */}
          {!isDataLoading && (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* WELCOME SECTION */}
                  <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white shadow-soft-xl overflow-hidden text-left">
                    <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 max-w-2xl">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold mb-3 border border-white/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Innovate Today. Build Tomorrow.</span>
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                        Welcome back, {activeUser?.fullName || 'Hacker'}!
                      </h1>
                      <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl">
                        Your participant portal is online. Monitor your hackathon squad, review registered project tracks, and prepare for round 1 evaluation.
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        {!registration ? (
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={() => setIsRegisterModalOpen(true)}
                            leftIcon={<Rocket className="w-4 h-4 text-blue-600" />}
                          >
                            Register Squad Now
                          </Button>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30">
                            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                            <span>Entry Locked: {registration.projectName}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={fetchDashboardData}
                          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Refresh</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Primary Row: Profile Card + Registration Status */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* PROFILE CARD */}
                    <ProfileCard
                      user={activeUser}
                      onEditProfile={() => setIsEditProfileOpen(true)}
                    />

                    {/* REGISTRATION STATUS */}
                    <div className="lg:col-span-2">
                      <RegistrationStatusCard
                        registration={registration}
                        onOpenRegister={() => navigate('/dashboard/register')}
                        onViewRegistration={() => setActiveTab('registration')}
                        onWithdrawRegistration={() => setIsWithdrawModalOpen(true)}
                      />
                    </div>
                  </div>

                  {/* QUICK ACTIONS */}
                  <QuickActions
                    onViewRegistration={() => {
                      if (!registration) {
                        navigate('/dashboard/register');
                      } else {
                        setActiveTab('registration');
                      }
                    }}
                    onEditProfile={() => setIsEditProfileOpen(true)}
                    onContactSupport={() => setActiveTab('support')}
                  />
                </div>
              )}

              {/* TAB 2: MY PROFILE */}
              {activeTab === 'profile' && (
                <div className="space-y-6 text-left max-w-3xl">
                  <div className="pb-4 border-b border-slate-200">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Participant Profile</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage your official credentials and security settings on CODE-A-NOVA.
                    </p>
                  </div>

                  <ProfileCard
                    user={activeUser}
                    onEditProfile={() => setIsEditProfileOpen(true)}
                  />

                  <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Security & Authentication
                    </h3>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">Password Encryption</p>
                        <p className="text-slate-500">Hashed with bcrypt standard salt rounds</p>
                      </div>
                      <Badge variant="success">Secured</Badge>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">JWT Token Session</p>
                        <p className="text-slate-500">Cryptographically signed bearer token</p>
                      </div>
                      <Badge variant="primary">Active</Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HACKATHON REGISTRATION */}
              {activeTab === 'registration' && (
                <div className="space-y-6 text-left">
                  <div className="pb-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        Hackathon Registration Details
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Review your registered entry, college verification, and project domain.
                      </p>
                    </div>

                    {!registration && (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/dashboard/register')}
                        leftIcon={<Rocket className="w-4 h-4" />}
                      >
                        Register Entry Now
                      </Button>
                    )}
                  </div>

                  <RegistrationStatusCard
                    registration={registration}
                    onOpenRegister={() => navigate('/dashboard/register')}
                    onViewRegistration={() => setActiveTab('team')}
                    onWithdrawRegistration={() => setIsWithdrawModalOpen(true)}
                  />

                  {registration && (
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-4 text-xs">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        Academic Institution & Track
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-3.5 rounded-2xl bg-slate-50">
                          <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                            College Name
                          </span>
                          <span className="font-extrabold text-slate-900">{registration.collegeName}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50">
                          <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                            Course & Branch
                          </span>
                          <span className="font-extrabold text-slate-900">
                            {registration.course} - {registration.branch}
                          </span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50">
                          <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                            Year of Study
                          </span>
                          <span className="font-extrabold text-slate-900">{registration.yearOfStudy}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-slate-50">
                          <span className="text-slate-400 font-bold block mb-1 uppercase tracking-wider text-[10px]">
                            Mobile Contact
                          </span>
                          <span className="font-mono font-extrabold text-slate-900">
                            {registration.mobileNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MY TEAM */}
              {activeTab === 'team' && (
                <div className="space-y-6 text-left">
                  <div className="pb-4 border-b border-slate-200">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Team Squad</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Collaborate with your squad members on your hackathon build.
                    </p>
                  </div>

                  {!registration ? (
                    <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mx-auto">
                        <Users2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">No Squad Registered Yet</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Submit your hackathon registration to invite squad members and assign development tracks.
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/dashboard/register')}
                        leftIcon={<Rocket className="w-4 h-4" />}
                      >
                        Register Squad
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Team Lead Card */}
                      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-soft-sm">
                            {registration.fullName ? registration.fullName.charAt(0) : 'L'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-slate-900">
                                {registration.fullName}
                              </span>
                              <Badge variant="primary" size="sm">
                                Team Lead
                              </Badge>
                            </div>
                            <span className="text-xs font-mono text-slate-500">
                              {registration.email}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-blue-700">Captain</span>
                      </div>

                      {/* Additional Members */}
                      {registration.teamMembers && registration.teamMembers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {registration.teamMembers.map((member, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center font-bold text-xs">
                                  #{idx + 2}
                                </div>
                                <div>
                                  <p className="font-bold text-xs text-slate-900">{member.name}</p>
                                  <p className="text-[11px] font-mono text-slate-500">{member.email}</p>
                                </div>
                              </div>
                              <Badge variant="secondary" size="sm">
                                {member.role || 'Member'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 text-center">
                          Solo hacker entry. No additional squad members registered.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: MY SUBMISSION */}
              {activeTab === 'submission' && (
                <div className="space-y-6 text-left">
                  <div className="pb-4 border-b border-slate-200">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Project Deliverables</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Links for jury evaluation, source repository, and demo media.
                    </p>
                  </div>

                  {!registration ? (
                    <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                        <Send className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Register to Submit Links</h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Once registered, you can update your deck, prototype repo, and demo video before final judging.
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => setIsRegisterModalOpen(true)}
                      >
                        Register Project
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Presentation Link */}
                      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          Slide Deck / Pitch PPT
                        </span>
                        {registration.pptLink ? (
                          <a
                            href={registration.pptLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline"
                          >
                            Open Presentation <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No link provided</p>
                        )}
                      </div>

                      {/* Prototype Link */}
                      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          GitHub / Live Prototype
                        </span>
                        {registration.prototypeLink ? (
                          <a
                            href={registration.prototypeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline"
                          >
                            Launch Prototype <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No link provided</p>
                        )}
                      </div>

                      {/* Demo Video */}
                      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-3">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          Demo Walkthrough Video
                        </span>
                        {registration.demoVideoLink ? (
                          <a
                            href={registration.demoVideoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline"
                          >
                            Watch Video <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No link provided</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: HELP & SUPPORT */}
              {activeTab === 'support' && (
                <div className="space-y-6 text-left max-w-3xl">
                  <div className="pb-4 border-b border-slate-200">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Participant Support</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Have a query regarding submissions, mentors, or event guidelines? Reach out directly.
                    </p>
                  </div>

                  {supportSuccess && (
                    <Alert
                      type="success"
                      title="Message Received"
                      message="Thank you! The Code-a-Nova coordination committee will review your query and respond shortly."
                      onClose={() => setSupportSuccess(false)}
                    />
                  )}

                  <form onSubmit={handleSupportSubmit} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft-sm space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        How can we help you? <span className="text-blue-600">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Describe your technical query or mentor request..."
                        required
                        className="w-full bg-white text-slate-900 placeholder-slate-400 rounded-xl p-3.5 text-sm border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={supportSending}
                        leftIcon={<HelpCircle className="w-4 h-4" />}
                      >
                        Submit Support Query
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. Reusable Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />

      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        user={activeUser}
        onRegistrationCompleted={(newReg) => setRegistration(newReg)}
      />

      {/* Withdraw Registration Confirmation Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => !isWithdrawing && setIsWithdrawModalOpen(false)}
        title="Withdraw Hackathon Registration"
        maxWidth="max-w-md"
      >
        <div className="p-6 space-y-4 text-left">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <p>
              Are you sure you want to withdraw your registration for <strong className="text-white font-bold">{registration?.projectName || 'this project'}</strong>? This action cannot be undone.
            </p>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Withdrawing your entry will relinquish your Registration ID (<span className="font-mono text-blue-400 font-bold">{registration?._id ? `CAN-REG-${registration._id.slice(-8).toUpperCase()}` : ''}</span>) and remove your squad roster from evaluation round 1.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              disabled={isWithdrawing}
              onClick={() => setIsWithdrawModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Keep Registration
            </button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isWithdrawing}
              onClick={handleConfirmWithdraw}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Withdraw Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
