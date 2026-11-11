import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../common/Button.jsx';

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

  // Dedicated multi-page navigation routes (no hash scrolling)
  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Events', to: '/events' },
    { label: 'Timeline', to: '/timeline' },
    { label: 'Prizes', to: '/prizes' },
    { label: 'Contact', to: '/contact' },
  ];

  const handleNavClick = (to) => {
    setMobileMenuOpen(false);
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl transition-all duration-300">
      <div
        className={`rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-2xl border-black/15 shadow-[0_12px_40px_rgba(0,0,0,0.08)]'
            : 'bg-white/80 backdrop-blur-xl border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.05)]'
        }`}
      >
        {/* Wampire Brand Logo */}
        <Link
          to="/"
          onClick={() => handleNavClick('/')}
          className="flex items-center gap-2.5 group select-none pl-1"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-[#FF007F]/40 flex items-center justify-center text-[#FF007F] shadow-glow-pink-sm group-hover:border-[#FF007F] group-hover:scale-105 transition-all duration-300">
            <Terminal className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base sm:text-lg tracking-wider text-black group-hover:text-[#FF007F] transition-colors">
              WAMPIRE
            </span>
          </div>
        </Link>

        {/* Desktop Multi-Page Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-100/90 p-1 rounded-full border border-black/5">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-xs uppercase tracking-wider font-mono px-4 py-1.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-[#FF007F] text-white font-bold shadow-[0_0_15px_rgba(255,0,127,0.35)]'
                    : 'text-neutral-700 hover:text-black hover:bg-black/5 font-medium'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs (Right Side) */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs uppercase tracking-wider font-mono flex items-center gap-2 bg-white text-black border border-black/15 hover:border-black/30"
                >
                  <div className="w-4 h-4 rounded-full bg-[#FF007F]/10 text-[#FF007F] flex items-center justify-center text-[10px] font-bold">
                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span>Dashboard</span>
                </Button>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-neutral-600 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs uppercase tracking-wider font-mono font-medium text-neutral-800 hover:text-black bg-white border border-black/15 hover:border-black/30 px-4"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs uppercase tracking-wider font-mono font-bold shadow-glow-pink-sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center gap-2">
          {isAuthenticated && (
            <Link to="/dashboard">
              <div className="w-8 h-8 rounded-full bg-[#FF007F]/10 border border-[#FF007F]/30 text-[#FF007F] flex items-center justify-center text-xs font-bold font-mono">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-700 hover:text-black rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 rounded-3xl bg-white border border-black/10 p-5 shadow-2xl backdrop-blur-2xl animate-fade-in text-black">
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => handleNavClick(item.to)}
                  className={`text-sm uppercase tracking-wider font-mono px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#FF007F] text-white font-bold shadow-[0_0_15px_rgba(255,0,127,0.35)]'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 pt-4 border-t border-black/10 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="secondary" size="md" className="w-full text-xs uppercase tracking-wider font-mono bg-white text-black border border-black/15">
                    Open Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-xs uppercase tracking-wider font-mono text-red-600 border-red-200 hover:bg-red-50"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full text-xs uppercase tracking-wider font-mono bg-white text-black border border-black/15">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full text-xs uppercase tracking-wider font-mono font-bold">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
