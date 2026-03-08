import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const ease = [0.25, 1, 0.5, 1];

/* ───── Input with floating label ───── */
const Field = ({ label, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  const filled = props.value?.length > 0;
  const active = focused || filled;

  return (
    <div className="relative">
      <div className="relative">
        <input
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={`peer w-full bg-transparent border-b ${error ? 'border-rust/50' : focused ? 'border-lime/40' : 'border-bone/[0.08]'
            } pt-6 pb-2.5 px-0 font-mono text-[14px] text-bone outline-none transition-all duration-300 placeholder-transparent`}
          placeholder={label}
        />
        <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-mono ${active
          ? 'top-0.5 text-[10px] tracking-[0.15em] uppercase ' + (error ? 'text-rust/60' : focused ? 'text-lime/50' : 'text-bone/25')
          : 'top-[18px] text-[13px] text-bone/20'
          }`}>
          {label}
        </label>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="font-mono text-[10px] text-rust/60 mt-1.5 overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Valid email required');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1400);
  };

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease }}
          >
            {/* Heading */}
            <div className="mb-6">
              <h2 className="font-display font-bold text-[26px] text-bone tracking-tight leading-[1.15] mb-1.5">
                Reset your<br />password
              </h2>
              <p className="font-mono text-[11px] text-bone/30 tracking-wider leading-relaxed">
                Enter your email to receive a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                error={error}
              />

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-lime text-ink font-display font-bold text-[13px] py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 cursor-pointer relative overflow-hidden hover:shadow-[0_8px_40px_rgba(200,241,53,0.2)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full" />
                      <span>Sending...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send reset link
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  )}
                </button>
              </div>

              {/* Back to sign in */}
              <div className="flex justify-center mt-4">
                <Link to="/signin" className="font-mono text-[11px] text-bone/30 hover:text-bone/60 transition-colors flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                  Back to Sign In
                </Link>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2, ease }}
            className="text-center py-2"
          >
            {/* Checkmark */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                className="w-14 h-14 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center"
              >
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="w-6 h-6 text-lime"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </motion.svg>
              </motion.div>
            </div>

            <h2 className="font-display font-bold text-[22px] text-bone tracking-tight mb-2">
              Check your email
            </h2>
            <p className="font-mono text-[11px] text-bone/30 leading-relaxed mb-1">
              We sent a reset link to
            </p>
            <p className="font-mono text-[12px] text-lime/60 mb-8">
              {email}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="w-full border border-bone/[0.08] rounded-xl py-3 font-mono text-[11px] text-bone/40 hover:border-bone/[0.15] hover:text-bone/60 transition-all duration-300 cursor-pointer"
              >
                Try a different email
              </button>

              <div className="pt-2">
                <Link
                  to="/signin"
                  className="font-mono text-[11px] text-bone/30 hover:text-bone/60 transition-colors inline-block"
                >
                  Back to sign in
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
