import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ease = [0.25, 1, 0.5, 1];

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
          className={`peer w-full bg-transparent border-b ${
            error ? 'border-rust/50' : focused ? 'border-lime/40' : 'border-bone/[0.08]'
          } pt-6 pb-2.5 px-0 font-mono text-[14px] text-bone outline-none transition-all duration-300 placeholder-transparent`}
          placeholder={label}
        />
        <label className={`absolute left-0 transition-all duration-300 pointer-events-none font-mono ${
          active
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
    <div className="min-h-screen flex items-center justify-center relative bg-ink grain">
      {/* Ambient glows */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-lime/[0.03] rounded-full blur-[160px]" />
      <div className="absolute bottom-[15%] right-[20%] w-[300px] h-[300px] bg-rust/[0.02] rounded-full blur-[120px]" />

      {/* Back to sign in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed top-5 left-5 z-20"
      >
        <Link to="/auth" className="flex items-center gap-2 font-mono text-[11px] text-bone/25 hover:text-bone/50 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back to sign in
        </Link>
      </motion.div>

      <div className="w-full max-w-[380px] px-6 relative z-10">
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
            >
              {/* Icon */}
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-bone/[0.04] border border-bone/[0.06] flex items-center justify-center mb-8">
                  <svg className="w-5 h-5 text-lime/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>

                <h2 className="font-display font-bold text-[28px] text-bone tracking-tight leading-[1.15] mb-2">
                  Reset your<br />password
                </h2>
                <p className="font-mono text-[11px] text-bone/20 tracking-wider leading-relaxed max-w-[300px]">
                  Enter your email and we'll send you a link to get back into your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <Field
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  error={error}
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-lime text-ink font-display font-bold text-[13px] py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 cursor-pointer relative overflow-hidden hover:shadow-[0_8px_40px_rgba(200,241,53,0.2)] hover:-translate-y-0.5 active:translate-y-0"
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
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="text-center"
            >
              {/* Checkmark */}
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-lime/10 border border-lime/20 flex items-center justify-center"
                >
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="w-7 h-7 text-lime"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </motion.svg>
                </motion.div>
              </div>

              <h2 className="font-display font-bold text-[24px] text-bone tracking-tight mb-3">
                Check your email
              </h2>
              <p className="font-mono text-[12px] text-bone/25 leading-relaxed mb-2">
                We sent a reset link to
              </p>
              <p className="font-mono text-[13px] text-lime/60 mb-10">
                {email}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="w-full border border-bone/[0.06] rounded-2xl py-3.5 font-mono text-[12px] text-bone/30 hover:border-bone/[0.12] hover:text-bone/50 transition-all duration-300 cursor-pointer"
                >
                  Try a different email
                </button>

                <Link
                  to="/auth"
                  className="block w-full text-center font-mono text-[11px] text-bone/20 hover:text-bone/40 transition-colors py-2"
                >
                  Back to sign in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
