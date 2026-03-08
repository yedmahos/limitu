import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(form.email, form.name || undefined);
      navigate('/dashboard');
    }, 1200);
  };

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const pwType = showPw ? 'text' : 'password';

  return (
    <AuthLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key="signin"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.2, ease }}
        >
          {/* Heading */}
          <div className="mb-6">
            <h2 className="font-display font-bold text-[26px] text-bone tracking-tight leading-[1.15] mb-1.5">
              Welcome<br />back
            </h2>
            <p className="font-mono text-[11px] text-bone/30 tracking-wider leading-relaxed">
              Sign in to continue where you left off.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email address" type="email" value={form.email} onChange={update('email')} autoComplete="email" error={errors.email} />

            <div className="relative">
              <Field label="Password" type={pwType} value={form.password} onChange={update('password')} autoComplete="current-password" error={errors.password} />
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

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link to="/forgot-password" className="font-mono text-[10px] text-bone/20 hover:text-lime/50 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="group w-full bg-lime text-ink font-display font-bold text-[13px] py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 cursor-pointer relative overflow-hidden hover:shadow-[0_8px_40px_rgba(200,241,53,0.2)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-ink/15 border-t-ink rounded-full" />
                    <span>Signing in...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Continue
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-bone/[0.05]" />
            <span className="font-mono text-[9px] text-bone/15 tracking-[0.2em] uppercase">or</span>
            <div className="flex-1 h-px bg-bone/[0.05]" />
          </div>

          {/* Social hint */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 bg-bone/[0.02] border border-bone/[0.06] rounded-2xl py-3 font-mono text-[12px] text-bone/40 hover:bg-bone/[0.04] hover:border-bone/[0.12] hover:text-bone/60 transition-all duration-300 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>
        </motion.div>
      </AnimatePresence>
    </AuthLayout>
  );
}
