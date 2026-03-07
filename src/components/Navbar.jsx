import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useApp } from '../context/AppContext';

const authLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/simulator', label: 'Simulator' },
  { to: '/lim-ai', label: 'LIM AI' },
  { to: '/insights', label: 'Insights' },
  { to: '/profile', label: 'Profile' },
];

const publicLinks = [
  { to: '/team', label: 'Team' },
];

/* Animated nav link with sliding underline + hover lift */
function AnimatedNavLink({ to, children, className }) {
  return (
    <NavLink to={to} className={className}>
      {({ isActive }) => (
        <motion.span
          className="relative inline-flex flex-col items-center"
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15 }}
        >
          {children({ isActive })}
          <motion.span
            className="absolute -bottom-0.5 left-0 h-px bg-lime/60 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isActive ? '100%' : 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          />
        </motion.span>
      )}
    </NavLink>
  );
}

/* Pill-indicator nav link for the auth desktop pill row */
function PillNavLink({ to, label, layoutId }) {
  return (
    <NavLink to={to} className="relative">
      {({ isActive }) => (
        <motion.span
          className="relative z-10 flex items-center"
          whileHover={{ y: -1 }}
          transition={{ duration: 0.15 }}
        >
          {isActive && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-lg bg-lime/10 shadow-[inset_0_1px_0_rgba(200,241,53,0.1)]"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className={`relative z-10 px-3.5 py-1.5 font-mono text-[11px] tracking-wide transition-colors duration-200 ${isActive ? 'text-lime' : 'text-bone/40 hover:text-bone/75'
            }`}>
            {label}
          </span>
        </motion.span>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[10000]">

      {/* ── SIGNED-OUT floating pill ── */}
      {!user && (
        <div className="mx-auto max-w-5xl px-5">
          <motion.div
            className={`mt-4 rounded-2xl px-6 h-14 flex items-center justify-between transition-all duration-300 ${scrolled
                ? 'bg-white/[0.06] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]'
                : 'bg-white/[0.03] backdrop-blur-xl border border-white/[0.07]'
              }`}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          >
            <NavLink to="/">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.16 }}>
                <Logo size={24} />
              </motion.div>
            </NavLink>

            <div className="flex items-center gap-6">
              <AnimatedNavLink to="/about" className="font-mono text-[11px] tracking-wide">
                {({ isActive }) => (
                  <span className={`transition-colors duration-200 ${isActive ? 'text-lime' : 'text-bone/45 hover:text-bone/80'}`}>About</span>
                )}
              </AnimatedNavLink>
              <AnimatedNavLink to="/team" className="font-mono text-[11px] tracking-wide">
                {({ isActive }) => (
                  <span className={`transition-colors duration-200 ${isActive ? 'text-lime' : 'text-bone/45 hover:text-bone/80'}`}>Team</span>
                )}
              </AnimatedNavLink>
              <NavLink to="/auth">
                <motion.span
                  className="inline-block font-display text-[11px] bg-lime text-ink px-5 py-2 rounded-xl tracking-wide font-bold"
                  whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(200,241,53,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                >
                  Get Started
                </motion.span>
              </NavLink>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── SIGNED-IN floating pill ── */}
      {user && (
        <div className="mx-auto max-w-7xl px-5">
          <motion.div
            className={`mt-3 rounded-2xl px-5 h-14 flex items-center justify-between transition-all duration-300 ${scrolled
                ? 'bg-[#141517] backdrop-blur-2xl border border-bone/[0.12] shadow-[0_8px_40px_rgba(0,0,0,0.6),0_1px_0_rgba(245,240,232,0.06)_inset]'
                : 'bg-ink/50 backdrop-blur-xl border border-bone/[0.07]'
              }`}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          >
            {/* Logo */}
            <NavLink to={user ? '/dashboard' : '/'}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                <Logo size={24} />
              </motion.div>
            </NavLink>

            {/* Desktop auth pill links */}
            <div className="hidden md:flex items-center gap-0.5 bg-bone/[0.03] rounded-xl p-1 border border-bone/[0.04]">
              {authLinks.map((link) => (
                <PillNavLink key={link.to} to={link.to} label={link.label} layoutId="auth-pill" />
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => { logout(); navigate('/'); }}
                className="font-mono text-[11px] text-bone/30 hover:text-rust/80 transition-colors tracking-wide cursor-pointer"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                Sign Out
              </motion.button>

              {/* Mobile hamburger */}
              <motion.button
                className="md:hidden flex flex-col gap-1.5 p-1.5 cursor-pointer"
                onClick={() => setMobileOpen((v) => !v)}
                whileTap={{ scale: 0.93 }}
                aria-label="Toggle menu"
              >
                <motion.span
                  className="block h-px w-5 bg-bone/50 rounded-full origin-center"
                  animate={mobileOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22 }}
                />
                <motion.span
                  className="block h-px w-5 bg-bone/50 rounded-full"
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.18 }}
                />
                <motion.span
                  className="block h-px w-5 bg-bone/50 rounded-full origin-center"
                  animate={mobileOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22 }}
                />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile drawer (logged in) */}
      <AnimatePresence>
        {user && mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="md:hidden overflow-hidden px-5 mt-1"
          >
            <div className="bg-ink/80 backdrop-blur-xl border border-bone/[0.07] rounded-2xl p-3 flex flex-col gap-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              {authLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl font-mono text-[12px] tracking-wide transition-all duration-200 ${isActive
                        ? 'bg-lime/10 text-lime'
                        : 'text-bone/40 hover:text-bone/70 hover:bg-bone/[0.03]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-1 pt-2 border-t border-bone/[0.05]">
                <motion.button
                  onClick={() => { logout(); navigate('/'); }}
                  className="w-full text-left px-4 py-2.5 font-mono text-[12px] text-bone/25 hover:text-rust/70 transition-colors cursor-pointer rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: authLinks.length * 0.05 + 0.05 }}
                >
                  Sign Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile scrollable tab bar (logged in, md hidden, no hamburger alternative) */}
      {user && !mobileOpen && (
        <div className="md:hidden px-5 mt-2">
          <div className="flex items-center gap-1 overflow-x-auto bg-bone/[0.03] rounded-xl p-1 no-scrollbar border border-bone/[0.04]">
            {authLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg font-mono text-[10px] tracking-wide whitespace-nowrap transition-all duration-200 ${isActive ? 'bg-lime/10 text-lime' : 'text-bone/35 hover:text-bone/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

