import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Mascot from '../components/Mascot';

const ease = [0.25, 1, 0.5, 1];

/* ───── Floating stat pill for left panel ───── */
const FloatingPill = ({ children, delay, x, y }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8, ease }}
    className="absolute"
    style={{ left: x, top: y }}
  >
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' }}
      className="bg-bone/[0.04] backdrop-blur-md border border-bone/[0.06] rounded-2xl px-4 py-3"
    >
      {children}
    </motion.div>
  </motion.div>
);

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

export default function SignIn() {
  const isSignUp = false;
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [phoneVerify, setPhoneVerify] = useState(null); // null | 'number' | 'otp'
  const [phoneForm, setPhoneForm] = useState({ phone: '', otp: '' });
  const [phoneErrors, setPhoneErrors] = useState({});
  const [signedUpName, setSignedUpName] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (isSignUp) {
      if (!form.name.trim()) e.name = 'Name required';
      if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isSignUp) {
        setSignedUpName(form.name);
        setPhoneVerify('number');
      } else {
        login(form.email, form.name || undefined);
        navigate('/dashboard');
      }
    }, 1200);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    const errs = {};
    if (!phoneForm.phone.match(/^[6-9]\d{9}$/)) errs.phone = 'Enter a valid 10-digit mobile number';
    setPhoneErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setPhoneVerify('otp'); }, 1200);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const errs = {};
    if (!phoneForm.otp.match(/^\d{6}$/)) errs.otp = 'Enter the 6-digit OTP';
    setPhoneErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      login(form.email, signedUpName || undefined);
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  const updatePhone = (field) => (e) => setPhoneForm((p) => ({ ...p, [field]: e.target.value }));

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const pwType = showPw ? 'text' : 'password';

  // ── Phone verify overlay ──
  if (phoneVerify) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink grain">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-lime/[0.03] rounded-full blur-[160px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full max-w-[380px] px-6 py-10 relative z-10"
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${phoneVerify === 'number' ? 'bg-lime/40' : 'bg-lime'}`} />
            <div className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${phoneVerify === 'otp' ? 'bg-lime' : 'bg-bone/[0.08]'}`} />
          </div>

          {phoneVerify === 'number' ? (
            <>
              <div className="mb-8">
                <p className="font-mono text-[10px] tracking-[0.3em] text-bone/20 uppercase mb-3">One more step</p>
                <h2 className="font-display font-bold text-[26px] text-bone tracking-tight leading-[1.15] mb-2">
                  Verify your<br />phone number.
                </h2>
                <p className="font-mono text-[11px] text-bone/20 leading-relaxed">
                  We'll send a one-time code to confirm it's you.
                </p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-6">
                <Field label="Mobile number" type="tel" value={phoneForm.phone} onChange={updatePhone('phone')} error={phoneErrors.phone} maxLength={10} inputMode="numeric" />
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-lime text-ink font-display font-bold text-[13px] py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 cursor-pointer relative overflow-hidden hover:shadow-[0_8px_40px_rgba(200,241,53,0.2)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full" />
                      <span>Sending OTP...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send OTP
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-8">
                <p className="font-mono text-[10px] tracking-[0.3em] text-bone/20 uppercase mb-3">Verify OTP</p>
                <h2 className="font-display font-bold text-[26px] text-bone tracking-tight leading-[1.15] mb-2">
                  Enter the code
                </h2>
                <p className="font-mono text-[11px] text-bone/25">
                  Sent to <span className="text-bone/50">+91 {phoneForm.phone}</span>
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <Field label="6-digit OTP" type="text" value={phoneForm.otp} onChange={updatePhone('otp')} error={phoneErrors.otp} maxLength={6} inputMode="numeric" />
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-lime text-ink font-display font-bold text-[13px] py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 cursor-pointer relative overflow-hidden hover:shadow-[0_8px_40px_rgba(200,241,53,0.2)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full" />
                      <span>Verifying...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Verify & Continue
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  )}
                </button>
              </form>
              <button
                type="button"
                onClick={() => { setPhoneVerify('number'); setPhoneForm((p) => ({ ...p, otp: '' })); setPhoneErrors({}); }}
                className="mt-5 block font-mono text-[10px] text-bone/20 hover:text-bone/45 transition-colors cursor-pointer"
              >
                ← Wrong number?
              </button>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex grain">
      {/* ─── LEFT PANEL (desktop only) ─── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-ink">
        {/* Ambient glows */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-lime/[0.04] rounded-full blur-[160px]" />
        <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] bg-lime/[0.025] rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] left-[30%] w-[250px] h-[250px] bg-rust/[0.02] rounded-full blur-[100px]" />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(245,240,232,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,240,232,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Center — Hero text + Mascot */}
          <div className="flex-1 flex flex-col justify-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease }}
              className="max-w-md"
            >
              <h1 className="font-display font-extrabold text-[clamp(2rem,3.5vw,3rem)] text-bone leading-[1.05] tracking-tight mb-5">
                Your money,<br />
                <span className="text-lime">your rules.</span>
              </h1>
              <p className="font-mono text-[13px] text-bone/30 leading-[1.9] max-w-sm">
                Join students who are turning their allowance into a system. AI-powered daily limits, spending insights, and a mentor that never judges.
              </p>
            </motion.div>

            {/* Floating stat pills */}
            <FloatingPill delay={0.8} x="55%" y="10%">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-lime/10 flex items-center justify-center">
                  <span className="text-lime text-[11px] font-bold font-mono">₹</span>
                </div>
                <div>
                  <div className="font-display font-bold text-[13px] text-bone">₹467</div>
                  <div className="font-mono text-[9px] text-bone/25">today's limit</div>
                </div>
              </div>
            </FloatingPill>

            <FloatingPill delay={1.1} x="62%" y="45%">
              <div className="flex items-center gap-2.5">
                <Mascot size={22} expression="happy" />
                <div>
                  <div className="font-mono text-[11px] text-bone/50">You're on track!</div>
                  <div className="font-mono text-[9px] text-lime/40">habit score: 82</div>
                </div>
              </div>
            </FloatingPill>

            <FloatingPill delay={1.4} x="48%" y="75%">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {['#C8F135', '#A8BFA0', '#D4A843'].map((c, i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-card" style={{ background: c }} />
                  ))}
                </div>
                <div className="font-mono text-[10px] text-bone/30">2.4k students</div>
              </div>
            </FloatingPill>
          </div>

          {/* Bottom — Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="border-l-2 border-lime/20 pl-5">
              <p className="font-serif italic text-[15px] text-bone/40 leading-relaxed mb-2">
                "I used to run out by the 15th. Now I actually save."
              </p>
              <p className="font-mono text-[10px] text-bone/20 tracking-wider">— Priya, 2nd Year, BITS Pilani</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT PANEL (form) ─── */}
      <div className="flex-1 flex items-center justify-center relative bg-ink lg:bg-dim">
        {/* Mobile ambient glow */}
        <div className="lg:hidden absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-lime/[0.03] rounded-full blur-[150px]" />

        {/* Mobile back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:hidden fixed top-5 left-5 z-20"
        >
          <Link to="/" className="flex items-center gap-2 font-mono text-[11px] text-bone/25 hover:text-bone/50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Home
          </Link>
        </motion.div>

        <div className="w-full max-w-[380px] px-6 pt-24 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            {/* Mode toggle pills */}
            <div className="flex bg-bone/[0.03] rounded-2xl p-1 mb-10 border border-bone/[0.04]">
              <div className="flex-1 py-2.5 text-center rounded-xl font-display font-bold text-[12px] tracking-wide transition-all duration-300 cursor-default bg-lime text-ink shadow-[0_2px_12px_rgba(200,241,53,0.15)]">
                Sign In
              </div>
              <Link to="/signup" className="flex-1 py-2.5 text-center rounded-xl font-display font-bold text-[12px] tracking-wide transition-all duration-300 cursor-pointer text-bone/30 hover:text-bone/50">
                Sign Up
              </Link>
            </div>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? 's' : 'i'}
                initial={{ opacity: 0, x: isSignUp ? 12 : -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isSignUp ? -12 : 12 }}
                transition={{ duration: 0.2, ease }}
                className="mb-10"
              >
                <h2 className="font-display font-bold text-[28px] text-bone tracking-tight leading-[1.15] mb-2">
                  {isSignUp ? 'Start your\njourney' : 'Welcome\nback'}
                </h2>
                <p className="font-mono text-[11px] text-bone/20 tracking-wider leading-relaxed">
                  {isSignUp ? 'Create an account to begin managing smarter.' : 'Sign in to continue where you left off.'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <Field label="Full name" type="text" value={form.name} onChange={update('name')} error={errors.name} />
                  </motion.div>
                )}
              </AnimatePresence>

              <Field label="Email address" type="email" value={form.email} onChange={update('email')} autoComplete="email" error={errors.email} />

              <div className="relative">
                <Field label="Password" type={pwType} value={form.password} onChange={update('password')} autoComplete={isSignUp ? 'new-password' : 'current-password'} error={errors.password} />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-0 top-4 text-bone/15 hover:text-bone/40 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease }}
                  >
                    <Field label="Confirm password" type={pwType} value={form.confirm} onChange={update('confirm')} autoComplete="new-password" error={errors.confirm} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forgot password */}
              {!isSignUp && (
                <div className="flex justify-end -mt-2">
                  <Link to="/forgot-password" className="font-mono text-[10px] text-bone/20 hover:text-lime/50 transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              {/* Submit */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full bg-lime text-ink font-display font-bold text-[13px] py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 cursor-pointer relative overflow-hidden hover:shadow-[0_8px_40px_rgba(200,241,53,0.2)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full" />
                      <span>{isSignUp ? 'Creating...' : 'Signing in...'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isSignUp ? 'Create Account' : 'Continue'}
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>
                  )}
                </button>
              </div>

              {/* Terms Agreement */}
              {isSignUp && (
                <div className="text-center pt-4">
                  <p className="font-mono text-[9px] text-bone/30 tracking-wide">
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="text-bone/50 hover:text-lime transition-colors underline decoration-bone/20 hover:decoration-lime/50 underline-offset-2">Terms</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-bone/50 hover:text-lime transition-colors underline decoration-bone/20 hover:decoration-lime/50 underline-offset-2">Privacy Policy</Link>.
                  </p>
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-bone/[0.05]" />
              <span className="font-mono text-[9px] text-bone/15 tracking-[0.2em] uppercase">or</span>
              <div className="flex-1 h-px bg-bone/[0.05]" />
            </div>

            {/* Social hint */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 border border-bone/[0.06] rounded-2xl py-3.5 font-mono text-[12px] text-bone/30 hover:border-bone/[0.12] hover:text-bone/50 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Continue with Google
            </button>


          </motion.div>
        </div>
      </div>
    </div>
  );
}
