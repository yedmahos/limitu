import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.42, ease: [0.25, 1, 0.5, 1] },
  }),
};

export default function VerifyContact() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const requiresEmail = Boolean(state.requiresEmailVerification);
  const requiresPhone = Boolean(state.requiresPhoneVerification);

  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const canSubmit = useMemo(() => {
    const emailOk = !requiresEmail || emailVerified;
    const phoneOk = !requiresPhone || phoneVerified;
    return emailOk && phoneOk;
  }, [requiresEmail, requiresPhone, emailVerified, phoneVerified]);

  const verifyEmail = () => {
    if (emailOtp.trim().length < 4) return;
    setEmailVerified(true);
  };

  const verifyPhone = () => {
    if (phoneOtp.trim().length < 4) return;
    setPhoneVerified(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 grain text-bone">
      <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-4">
        <motion.section variants={fadeUp} custom={0} className="card p-5 sm:p-6">
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-bone/25 mb-2">Security Check</p>
          <h1 className="font-display font-extrabold text-[clamp(1.5rem,3.5vw,2.2rem)] tracking-tight leading-none">Verify Updated Contact</h1>
          <p className="font-mono text-[11px] text-bone/35 mt-2">
            You changed your email or phone in profile. Verify the updated contact to continue.
          </p>
        </motion.section>

        {!requiresEmail && !requiresPhone && (
          <motion.section variants={fadeUp} custom={1} className="card p-5 sm:p-6">
            <p className="font-mono text-[11px] text-bone/40">No pending contact verification found.</p>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="mt-4 h-10 px-4 rounded-xl border border-bone/[0.1] text-bone/70 hover:text-bone hover:border-bone/[0.16] transition font-mono text-[11px]"
            >
              Back to Profile
            </button>
          </motion.section>
        )}

        {requiresEmail && (
          <motion.section variants={fadeUp} custom={1} className="card p-5 sm:p-6">
            <SectionHeader title="Email Verification" subtitle={`New email: ${state.newEmail || '-'}`} />

            <div className="grid sm:grid-cols-[1fr_auto] gap-2 mt-4">
              <input
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                placeholder="Enter email OTP"
                className="w-full h-11 rounded-xl bg-bone/[0.015] border border-bone/[0.08] px-3.5 text-bone text-[14px] outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15 transition"
              />
              <button
                type="button"
                onClick={() => setEmailSent(true)}
                className="h-11 px-4 rounded-xl border border-bone/[0.1] text-bone/70 hover:text-bone hover:border-bone/[0.16] transition font-mono text-[11px]"
              >
                {emailSent ? 'Resend' : 'Send OTP'}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={verifyEmail}
                className="h-10 px-4 rounded-xl bg-lime text-ink hover:brightness-95 transition font-mono text-[11px]"
              >
                Verify Email
              </button>
              <StatusPill success={emailVerified} text={emailVerified ? 'Verified' : emailSent ? 'OTP sent' : 'Pending'} />
            </div>
          </motion.section>
        )}

        {requiresPhone && (
          <motion.section variants={fadeUp} custom={2} className="card p-5 sm:p-6">
            <SectionHeader title="Phone Verification" subtitle={`New phone: ${state.newPhone || '-'}`} />

            <div className="grid sm:grid-cols-[1fr_auto] gap-2 mt-4">
              <input
                value={phoneOtp}
                onChange={(e) => setPhoneOtp(e.target.value)}
                placeholder="Enter phone OTP"
                className="w-full h-11 rounded-xl bg-bone/[0.015] border border-bone/[0.08] px-3.5 text-bone text-[14px] outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15 transition"
              />
              <button
                type="button"
                onClick={() => setPhoneSent(true)}
                className="h-11 px-4 rounded-xl border border-bone/[0.1] text-bone/70 hover:text-bone hover:border-bone/[0.16] transition font-mono text-[11px]"
              >
                {phoneSent ? 'Resend' : 'Send OTP'}
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={verifyPhone}
                className="h-10 px-4 rounded-xl bg-lime text-ink hover:brightness-95 transition font-mono text-[11px]"
              >
                Verify Phone
              </button>
              <StatusPill success={phoneVerified} text={phoneVerified ? 'Verified' : phoneSent ? 'OTP sent' : 'Pending'} />
            </div>
          </motion.section>
        )}

        {(requiresEmail || requiresPhone) && (
          <motion.section variants={fadeUp} custom={3} className="card p-5 sm:p-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="font-mono text-[11px] text-bone/35">
              Complete all required verifications to proceed.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="h-10 px-4 rounded-xl border border-bone/[0.1] text-bone/70 hover:text-bone hover:border-bone/[0.16] transition font-mono text-[11px]"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => navigate('/profile')}
                className="h-10 px-5 rounded-xl bg-lime text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95 transition font-mono text-[11px]"
              >
                Finish
              </button>
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="font-display font-bold text-[1.2rem] tracking-tight">{title}</h2>
      <p className="font-mono text-[11px] text-bone/30 mt-1">{subtitle}</p>
    </div>
  );
}

function StatusPill({ success, text }) {
  return (
    <span className={`h-8 px-3 rounded-full inline-flex items-center font-mono text-[10px] ${success ? 'bg-lime/15 text-lime border border-lime/35' : 'bg-bone/[0.02] text-bone/45 border border-bone/[0.1]'}`}>
      {text}
    </span>
  );
}
