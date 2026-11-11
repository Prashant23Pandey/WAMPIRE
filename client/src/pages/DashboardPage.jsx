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
  Check,
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
      const msg = err.message || 'Unable to sync dashboard state with server.';
      setApiError(msg);
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
    navigate('/');
  };

  // Handle Support Ticket Submit
  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    setSupportSending(true);
    try {
      await contactService.submitContact({
        name: userProfile?.fullName || authUser?.fullName || 'Participant',
        email: userProfile?.email || authUser?.email,
        message: `[Dashboard Support Request] ${supportMessage.trim()}`,
      });
      setSupportSuccess(true);
      setSupportMessage('');
      toast.success('Your message has been delivered to hackathon organizers.', 'Support Request Sent');
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch message.');
    } finally {
      setSupportSending(false);
    }
  };

  // Handle Withdraw Registration
  const handleConfirmWithdraw = async () => {
    if (!registration) return;
    setIsWithdrawing(true);

    try {
      await hackathonService.withdraw();
      toast.success('Your hackathon registration has been withdrawn.', 'Registration Withdrawn');
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
      <div className="min-h-screen flex items-center justify-center bg-white text-black tech-grid-light">
        <div className="flex flex-col items-center gap-3 font-mono">
          <div className="w-10 h-10 border-2 border-[#FF007F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-neutral-600 uppercase tracking-widest">
            Validating Hackathon Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black flex tech-grid-light">
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
                  <div className="relative rounded-3xl p-6 sm:p-10 bg-white border border-black/10 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] text-black overflow-hidden text-left">
                    <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#FF007F]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-2xl space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF007F]/10 text-xs font-mono font-bold text-[#FF007F] border border-[#FF007F]/30 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>[ SYSTEM CORE // ACTIVE ]</span>
                      </div>
                      <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight text-black">
                        Welcome back, <span className="text-[#FF007F] italic">{activeUser?.fullName || 'Hacker'}</span>!
                      </h1>
                      <p className="text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed max-w-xl">
                        Your participant portal is armed. Monitor your hackathon squad, review registered project tracks, and prepare for round 1 evaluation.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        {!registration ? (
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => setIsRegisterModalOpen(true)}
                            leftIcon={<Rocket className="w-4 h-4" />}
                            className="font-mono text-xs uppercase tracking-wider font-bold"
                          >
                            Register Squad Now
                          </Button>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-50 border border-[#FF007F]/40 text-xs font-mono text-black">
                            <span className="w-2 h-2 rounded-full bg-[#FF007F] animate-pulse" />
                            <span>Entry Locked: {registration.projectName}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={fetchDashboardData}
                          className="p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-black/10 transition-colors text-black text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-[#FF007F]" />
                          <span>Sync Data</span>
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
                  <div className="pb-4 border-b border-black/10">
                    <h2 className="text-xl font-serif font-black text-black tracking-tight">Participant Profile</h2>
                    <p className="text-xs text-neutral-600 mt-1 font-sans">
                      Manage your official credentials and security settings on WAMPIRE.
                    </p>
                  </div>

                  <ProfileCard
                    user={activeUser}
                    onEditProfile={() => setIsEditProfileOpen(true)}
                  />

                  <div className="p-6 rounded-3xl bg-white border border-black/10 shadow-sm space-y-4">
                    <h3 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
                      [ SECURITY & AUTHENTICATION ]
                    </h3>
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-mono font-bold text-black">Password Encryption</p>
                        <p className="text-neutral-600 font-sans">Hashed with bcrypt standard salt rounds</p>
                      </div>
                      <Badge variant="pink" size="sm">SECURED</Badge>
                    </div>
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-mono font-bold text-black">JWT Token Session</p>
                        <p className="text-neutral-600 font-sans">Cryptographically signed bearer token</p>
                      </div>
                      <Badge variant="pink" size="sm">ACTIVE</Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: HACKATHON REGISTRATION */}
              {activeTab === 'registration' && (
                <div className="space-y-6 text-left">
                  <div className="pb-4 border-b border-black/10 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-serif font-black text-black tracking-tight">
                        Hackathon Registration Details
                      </h2>
                      <p className="text-xs text-neutral-600 mt-1 font-sans">
                        Review your registered entry, college verification, and project domain.
                      </p>
                    </div>

                    {!registration && (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/dashboard/register')}
                        leftIcon={<Rocket className="w-4 h-4" />}
                        className="text-xs font-mono font-bold uppercase tracking-wider"
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
                    <div className="p-6 rounded-3xl bg-white border border-black/10 shadow-sm space-y-4 text-xs">
                      <h3 className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-widest">
                        [ ACADEMIC INSTITUTION & TRACK ]
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
                          <span className="text-neutral-500 font-mono font-bold block mb-1 uppercase tracking-wider text-[10px]">
                            College Name
                          </span>
                          <span className="font-serif font-bold text-black">{registration.collegeName}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
                          <span className="text-neutral-500 font-mono font-bold block mb-1 uppercase tracking-wider text-[10px]">
                            Course & Branch
                          </span>
                          <span className="font-mono font-bold text-black">
                            {registration.course} - {registration.branch}
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
                          <span className="text-neutral-500 font-mono font-bold block mb-1 uppercase tracking-wider text-[10px]">
                            Year of Study
                          </span>
                          <span className="font-mono font-bold text-[#FF007F]">{registration.yearOfStudy}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10">
                          <span className="text-neutral-500 font-mono font-bold block mb-1 uppercase tracking-wider text-[10px]">
                            Mobile Contact
                          </span>
                          <span className="font-mono font-bold text-black">
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
                  <div className="pb-4 border-b border-black/10">
                    <h2 className="text-xl font-serif font-black text-black tracking-tight">Team Squad</h2>
                    <p className="text-xs text-neutral-600 mt-1 font-sans">
                      Collaborate with your squad members on your hackathon build.
                    </p>
                  </div>

                  {!registration ? (
                    <div className="p-8 rounded-3xl bg-white border border-black/10 shadow-sm text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-black/10 text-[#FF007F] flex items-center justify-center mx-auto">
                        <Users2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-black">No Squad Registered Yet</h3>
                      <p className="text-xs text-neutral-600 max-w-md mx-auto font-sans">
                        Submit your hackathon registration to invite squad members and assign development tracks.
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/dashboard/register')}
                        leftIcon={<Rocket className="w-4 h-4" />}
                        className="font-mono text-xs uppercase tracking-wider font-bold"
                      >
                        Register Squad
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Team Lead Card */}
                      <div className="p-5 rounded-3xl bg-white border border-black/10 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-neutral-100 border border-[#FF007F]/40 text-[#FF007F] flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                            {registration.fullName ? registration.fullName.charAt(0) : 'L'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-sm text-black">
                                {registration.fullName}
                              </span>
                              <Badge variant="pink" size="sm">
                                Team Lead
                              </Badge>
                            </div>
                            <span className="text-xs font-mono text-neutral-500">
                              {registration.email}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#FF007F]">CAPTAIN</span>
                      </div>

                      {/* Additional Members */}
                      {registration.teamMembers && registration.teamMembers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {registration.teamMembers.map((member, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-white border border-black/10 shadow-sm flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-black/10 text-black flex items-center justify-center font-mono font-bold text-xs">
                                  #{idx + 2}
                                </div>
                                <div>
                                  <p className="font-serif font-bold text-xs text-black">{member.name}</p>
                                  <p className="text-[11px] font-mono text-neutral-500">{member.email}</p>
                                </div>
                              </div>
                              <Badge variant="neutral" size="sm">
                                {member.role || 'Builder'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-neutral-50 border border-black/10 text-xs font-mono text-neutral-600 text-center">
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
                  <div className="pb-4 border-b border-black/10">
                    <h2 className="text-xl font-serif font-black text-black tracking-tight">Project Deliverables</h2>
                    <p className="text-xs text-neutral-600 mt-1 font-sans">
                      Links for jury evaluation, source repository, and demo media.
                    </p>
                  </div>

                  {!registration ? (
                    <div className="p-8 rounded-3xl bg-white border border-black/10 shadow-sm text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 border border-black/10 text-[#FF007F] flex items-center justify-center mx-auto">
                        <Send className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-serif font-bold text-black">Register to Submit Links</h3>
                      <p className="text-xs text-neutral-600 max-w-md mx-auto font-sans">
                        Once registered, you can update your deck, prototype repo, and demo video before final judging.
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => setIsRegisterModalOpen(true)}
                        className="font-mono text-xs uppercase tracking-wider font-bold"
                      >
                        Register Project
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Presentation Link */}
                      <div className="p-6 rounded-3xl bg-white border border-black/10 shadow-sm space-y-3">
                        <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                          Slide Deck / Pitch PPT
                        </span>
                        {registration.pptLink ? (
                          <a
                            href={registration.pptLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#FF007F] font-mono font-bold text-xs hover:underline"
                          >
                            Open Presentation <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <p className="text-xs text-neutral-500 font-mono italic">No link provided</p>
                        )}
                      </div>

                      {/* Prototype Link */}
                      <div className="p-6 rounded-3xl bg-white border border-black/10 shadow-sm space-y-3">
                        <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                          GitHub / Live Prototype
                        </span>
                        {registration.prototypeLink ? (
                          <a
                            href={registration.prototypeLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#FF007F] font-mono font-bold text-xs hover:underline"
                          >
                            Launch Prototype <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <p className="text-xs text-neutral-500 font-mono italic">No link provided</p>
                        )}
                      </div>

                      {/* Demo Video */}
                      <div className="p-6 rounded-3xl bg-white border border-black/10 shadow-sm space-y-3">
                        <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
                          Demo Walkthrough Video
                        </span>
                        {registration.demoVideoLink ? (
                          <a
                            href={registration.demoVideoLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#FF007F] font-mono font-bold text-xs hover:underline"
                          >
                            Watch Video <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <p className="text-xs text-neutral-500 font-mono italic">No link provided</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: HELP & SUPPORT */}
              {activeTab === 'support' && (
                <div className="space-y-6 text-left max-w-3xl">
                  <div className="pb-4 border-b border-black/10">
                    <h2 className="text-xl font-serif font-black text-black tracking-tight">Participant Support</h2>
                    <p className="text-xs text-neutral-600 mt-1 font-sans">
                      Have a query regarding submissions, mentors, or event guidelines? Reach out directly.
                    </p>
                  </div>

                  {supportSuccess && (
                    <Alert
                      type="success"
                      title="Message Received"
                      message="Thank you! The WAMPIRE coordination committee will review your query and respond shortly."
                      onClose={() => setSupportSuccess(false)}
                    />
                  )}

                  <form onSubmit={handleSupportSubmit} className="p-6 rounded-3xl bg-white border border-black/10 shadow-sm space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                        How can we help you? <span className="text-[#FF007F]">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Describe your technical query or mentor request..."
                        required
                        className="w-full bg-neutral-50 text-black placeholder-neutral-400 rounded-xl p-3.5 text-sm border border-black/20 hover:border-black/30 focus:border-[#FF007F] focus:ring-2 focus:ring-[#FF007F]/20 outline-none font-sans"
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={supportSending}
                        leftIcon={<HelpCircle className="w-4 h-4" />}
                        className="font-mono text-xs uppercase tracking-wider font-bold"
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
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-sans">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p>
              Are you sure you want to withdraw your registration for <strong className="text-black font-bold">{registration?.projectName || 'this project'}</strong>? This action cannot be undone.
            </p>
          </div>

          <p className="text-xs text-neutral-600 font-sans leading-relaxed">
            Withdrawing your entry will relinquish your Registration ID (<span className="font-mono text-[#FF007F] font-bold">{registration?._id ? `WAM-REG-${registration._id.slice(-8).toUpperCase()}` : ''}</span>) and remove your squad roster from evaluation round 1.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10 font-mono">
            <button
              type="button"
              disabled={isWithdrawing}
              onClick={() => setIsWithdrawModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-black rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Keep Registration
            </button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isWithdrawing}
              onClick={handleConfirmWithdraw}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              className="text-xs uppercase tracking-wider font-bold"
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
