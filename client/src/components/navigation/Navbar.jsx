import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';
import Badge from '../common/Badge.jsx';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', targetId: 'home', to: '/' },
    { label: 'About', targetId: 'about', to: '/#about' },
    { label: 'Event', targetId: 'event', to: '/#event' },
    { label: 'Timeline', targetId: 'timeline', to: '/#timeline' },
    { label: 'Prizes', targetId: 'prizes', to: '/#prizes' },
    { label: 'Contact', targetId: 'contact', to: '/contact' },
  ];

  const handleNavClick = (e, item) => {
    setMobileMenuOpen(false);

    if (item.targetId === 'contact' || item.to === '/contact') {
      e.preventDefault();
      navigate('/contact');
      return;
    }

    if (location.pathname !== '/') {
      navigate(`/#${item.targetId}`);
      return;
    }

    e.preventDefault();
    const element = document.getElementById(item.targetId);
    if (element) {
      const navOffset = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft-sm border-b border-slate-200/90 py-3'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Code-a-Nova Brand Logo */}
        <Link
          to="/"
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-2.5 group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-electric group-hover:scale-105 transition-transform duration-200">
            <Code2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              CODE-A-NOVA
            </span>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-500 -mt-1">
              Tech Hackathon
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((item) => {
            const isActive =
              (item.to === '/contact' && location.pathname === '/contact') ||
              (item.targetId === 'home' && location.pathname === '/' && !location.hash);

            return (
              <a
                key={item.label}
                href={item.to || `#${item.targetId}`}
                onClick={(e) => handleNavClick(e, item)}
                className={`text-sm font-semibold transition-colors py-1 relative hover:after:w-full after:transition-all after:duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 ${
                  isActive ? 'text-blue-600 after:w-full font-bold' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Auth CTA Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  {user?.fullName || user?.name || 'Hacker'}
                </span>
                <Badge variant="primary" size="sm">
                  {user?.role || 'Participant'}
                </Badge>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-bold">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Signup
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          {!isAuthenticated && (
            <Link to="/register" className="md:hidden">
              <Button variant="primary" size="sm">
                Signup
              </Button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 lg:hidden bg-white border-b border-slate-200 shadow-soft-xl px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-1">
              {navLinks.map((item) => {
                const isActive =
                  (item.to === '/contact' && location.pathname === '/contact') ||
                  (item.targetId === 'home' && location.pathname === '/' && !location.hash);

                return (
                  <a
                    key={item.label}
                    href={item.to || `#${item.targetId}`}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors"
                >
                  <span className="text-sm font-bold text-slate-800">
                    {user?.fullName || user?.name || 'Hacker'}
                  </span>
                  <Badge variant="primary" size="sm">
                    {user?.role || 'Participant'}
                  </Badge>
                </Link>
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full"
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="secondary" size="md" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" size="md" className="w-full">
                    Signup
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
