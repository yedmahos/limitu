import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.42, ease: [0.25, 1, 0.5, 1] },
  }),
};

export default function Profile() {
  const {
    user,
    profile,
    updateProfile,
    remainingBalance,
    spentThisMonth,
    dailyLimit,
    daysLeft,
    habitScore,
    logout,
  } = useApp();
  const navigate = useNavigate();

  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  const initials = useMemo(() => {
    const source = draft.name || user?.name || 'U';
    return source
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [draft.name, user?.name]);

  const hasChanges = useMemo(() => {
    if (!profile) return false;
    const textFields = ['name', 'email', 'phone', 'address', 'weekendPref', 'avatar'];
    const hasTextChanges = textFields.some(key => (draft[key] || '') !== (profile[key] || ''));
    const hasNumChanges = Number(draft.monthlyAllowance || 0) !== Number(profile.monthlyAllowance || 0) ||
                          Number(draft.fixedExpenses || 0) !== Number(profile.fixedExpenses || 0);
    return hasTextChanges || hasNumChanges;
  }, [draft, profile]);

  const netMonthly = Math.max(0, Number(draft.monthlyAllowance || 0) - Number(draft.fixedExpenses || 0));
  const monthlySaved = Math.max(0, netMonthly - spentThisMonth);
  const monthlyProgress = Number(draft.monthlyAllowance) > 0
    ? Math.min(100, Math.round((spentThisMonth / Number(draft.monthlyAllowance)) * 100))
    : 0;

  const onChange = (key, value) => {
    setSaved(false);
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const onAvatarSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please upload an image file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError('Image must be 2MB or smaller.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange('avatar', String(reader.result || ''));
      setAvatarError('');
    };
    reader.readAsDataURL(file);
  };

  const onSave = () => {
    const emailChanged = draft.email?.trim() !== profile.email?.trim();
    const phoneChanged = draft.phone?.trim() !== profile.phone?.trim();

    updateProfile({
      ...draft,
      monthlyAllowance: Number(draft.monthlyAllowance) || 0,
      fixedExpenses: Number(draft.fixedExpenses) || 0,
    });
    setSaved(true);

    if (emailChanged || phoneChanged) {
      navigate('/verify-contact', {
        state: {
          requiresEmailVerification: emailChanged,
          requiresPhoneVerification: phoneChanged,
          previousEmail: profile.email,
          previousPhone: profile.phone,
          newEmail: draft.email,
          newPhone: draft.phone,
        },
      });
    }
  };

  const onReset = () => {
    setDraft(profile);
    setSaved(false);
  };

  return (
    <div className="min-h-screen pt-22 sm:pt-24 pb-28 sm:pb-16 px-4 md:px-8 grain text-bone">
      <motion.div initial="hidden" animate="visible" className="max-w-6xl mx-auto space-y-4">
        {/* Mobile-first redesign */}
        <div className="md:hidden space-y-4">
          <motion.section variants={fadeUp} custom={0} className="card p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <AvatarPicker
                  inputId="mobile-avatar-upload"
                  avatar={draft.avatar}
                  initials={initials}
                  sizeClass="w-12 h-12"
                  textClass="text-base"
                  onAvatarSelect={onAvatarSelect}
                />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25 mb-1">Profile</p>
                  <h1 className="font-display font-extrabold text-[1.2rem] leading-none tracking-tight truncate">{draft.name || 'Unnamed User'}</h1>
                  <p className="font-mono text-[11px] text-bone/35 mt-1 truncate">{draft.email || user?.email}</p>
                </div>
              </div>

            </div>
            {avatarError ? <p className="font-mono text-[10px] text-rust/70 mt-2">{avatarError}</p> : null}
          </motion.section>

          <motion.section variants={fadeUp} custom={1} className="grid grid-cols-2 gap-2.5">
            <MobileStatChip label="Remaining" value={`₹${remainingBalance.toLocaleString()}`} />
            <MobileStatChip label="Daily" value={`₹${dailyLimit.toLocaleString()}`} />
            <MobileStatChip label="Days" value={`${daysLeft}`} />
            <MobileStatChip label="Habit" value={`${habitScore}%`} highlight />
          </motion.section>

          <motion.section variants={fadeUp} custom={2} className="card p-5 space-y-4">
            <SectionLabel title="Personal" subtitle="Identity details" />
            <Field label="Full Name" value={draft.name} onChange={(v) => onChange('name', v)} placeholder="Enter full name" />
            <Field label="Email" type="email" value={draft.email} onChange={(v) => onChange('email', v)} placeholder="name@example.com" />
            <Field label="Phone" value={draft.phone} onChange={(v) => onChange('phone', v)} placeholder="+91 ..." />
            <Field label="Address" value={draft.address} onChange={(v) => onChange('address', v)} placeholder="Your current address" />
          </motion.section>

          <motion.section variants={fadeUp} custom={3} className="card p-5 space-y-4">
            <SectionLabel title="Budget Setup" subtitle="Used by LIM engine" />
            <Field
              label="Monthly Allowance"
              type="number"
              value={draft.monthlyAllowance}
              onChange={(v) => onChange('monthlyAllowance', v)}
              placeholder="0"
            />
            <Field
              label="Fixed Expenses"
              type="number"
              value={draft.fixedExpenses}
              onChange={(v) => onChange('fixedExpenses', v)}
              placeholder="0"
            />

            <div>
              <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25 block mb-2">Weekend Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'equal', title: 'Equal' },
                  { key: 'flex', title: 'Flexible' },
                  { key: 'strict', title: 'Strict' },
                ].map((opt) => {
                  const active = draft.weekendPref === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onChange('weekendPref', opt.key)}
                      className={`h-10 rounded-xl border transition font-mono text-[10px] ${active
                        ? 'bg-lime/12 border-lime/40 text-lime'
                        : 'bg-bone/[0.01] border-bone/[0.08] text-bone/60'
                        }`}
                    >
                      {opt.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.section>

          <motion.section variants={fadeUp} custom={4} className="card p-5">
            <SectionLabel title="This Month" subtitle="Quick financial view" />
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <MiniStat label="Spent" value={`₹${spentThisMonth.toLocaleString()}`} />
              <MiniStat label="Budget Net" value={`₹${netMonthly.toLocaleString()}`} />
              <MiniStat label="Potential Save" value={`₹${monthlySaved.toLocaleString()}`} highlight />
              <MiniStat label="Progress" value={`${monthlyProgress}%`} />
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1.5">
                <span className="font-mono text-[10px] text-bone/30 uppercase tracking-[0.2em]">Budget Used</span>
                <span className="font-mono text-[10px] text-bone/45">{monthlyProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-bone/[0.08] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${monthlyProgress}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                  className="h-full bg-lime"
                />
              </div>
            </div>
          </motion.section>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block space-y-4">
          <motion.section variants={fadeUp} custom={0} className="card p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <AvatarPicker
                  inputId="desktop-avatar-upload"
                  avatar={draft.avatar}
                  initials={initials}
                  sizeClass="w-14 h-14"
                  textClass="text-lg"
                  onAvatarSelect={onAvatarSelect}
                />
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone/25 mb-1">Profile</p>
                  <h1 className="font-display font-extrabold text-[clamp(1.4rem,3vw,2rem)] leading-none tracking-tight truncate">
                    {draft.name || 'Unnamed User'}
                  </h1>
                  <p className="font-mono text-[11px] text-bone/35 mt-2 truncate">{draft.email || user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">

                {hasChanges && (
                <button
                  onClick={onSave}
                  className="h-10 px-5 rounded-xl bg-lime text-ink hover:brightness-95 transition font-mono text-[11px]"
                >
                  Save
                </button>
                )}
              </div>
            </div>
            {avatarError ? <p className="font-mono text-[10px] text-rust/70">{avatarError}</p> : null}
          </motion.section>

          <motion.section variants={fadeUp} custom={1} className="grid lg:grid-cols-4 gap-3">
            <QuickStat label="Remaining" value={`₹${remainingBalance.toLocaleString()}`} />
            <QuickStat label="Daily Limit" value={`₹${dailyLimit.toLocaleString()}`} />
            <QuickStat label="Days Left" value={`${daysLeft}`} />
            <QuickStat label="Habit Score" value={`${habitScore}%`} highlight />
          </motion.section>

          <div className="grid lg:grid-cols-[1fr_280px] gap-4">
            <motion.section variants={fadeUp} custom={2} className="card p-5 sm:p-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <SectionLabel title="Personal" subtitle="Your identity details" />
                  <Field label="Full Name" value={draft.name} onChange={(v) => onChange('name', v)} placeholder="Enter full name" />
                  <Field label="Email" type="email" value={draft.email} onChange={(v) => onChange('email', v)} placeholder="name@example.com" />
                  <Field label="Phone" value={draft.phone} onChange={(v) => onChange('phone', v)} placeholder="+91 ..." />
                  <Field label="Address" value={draft.address} onChange={(v) => onChange('address', v)} placeholder="Your current address" />
                </div>

                <div className="space-y-4">
                  <SectionLabel title="Budget Setup" subtitle="Used by LIM engine" />
                  <Field
                    label="Monthly Allowance"
                    type="number"
                    value={draft.monthlyAllowance}
                    onChange={(v) => onChange('monthlyAllowance', v)}
                    placeholder="0"
                  />
                  <Field
                    label="Fixed Expenses"
                    type="number"
                    value={draft.fixedExpenses}
                    onChange={(v) => onChange('fixedExpenses', v)}
                    placeholder="0"
                  />

                  <div>
                    <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25 block mb-2">Weekend Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: 'equal', title: 'Equal' },
                        { key: 'flex', title: 'Flexible' },
                        { key: 'strict', title: 'Strict' },
                      ].map((opt) => {
                        const active = draft.weekendPref === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => onChange('weekendPref', opt.key)}
                            className={`h-10 rounded-xl border transition font-mono text-[11px] ${active
                              ? 'bg-lime/12 border-lime/40 text-lime'
                              : 'bg-bone/[0.01] border-bone/[0.08] text-bone/60 hover:text-bone hover:border-bone/[0.16]'
                              }`}
                          >
                            {opt.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-xl border border-bone/[0.08] bg-bone/[0.015] p-4">
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25 mb-2">Status</p>
                    <p className="font-mono text-[11px] text-bone/40">{saved ? 'Changes saved successfully.' : 'Make edits and press Save.'}</p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.aside variants={fadeUp} custom={3} className="card p-5 sm:p-6 h-fit lg:sticky lg:top-24">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-bone/25 mb-3">This Month</p>

              <div className="space-y-2.5 mb-4">
                <MiniStat label="Spent" value={`₹${spentThisMonth.toLocaleString()}`} />
                <MiniStat label="Budget Net" value={`₹${netMonthly.toLocaleString()}`} />
                <MiniStat label="Potential Save" value={`₹${monthlySaved.toLocaleString()}`} highlight />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="font-mono text-[10px] text-bone/30 uppercase tracking-[0.2em]">Budget Used</span>
                  <span className="font-mono text-[10px] text-bone/45">{monthlyProgress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-bone/[0.08] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${monthlyProgress}%` }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="h-full bg-lime"
                  />
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
      {hasChanges && (
         <motion.div 
           initial={{ y: 100 }} 
           animate={{ y: 0 }} 
           exit={{ y: 100 }}
           transition={{ ease: [0.25, 1, 0.5, 1], duration: 0.4 }}
           className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-bone/[0.08] bg-ink/90 backdrop-blur-xl px-4 py-3"
         >
           <div className="max-w-6xl mx-auto flex items-center gap-2">
             <button
               type="button"
               onClick={onReset}
               className="h-11 px-4 rounded-xl border border-bone/[0.12] text-bone/70 hover:text-bone hover:border-bone/[0.16] transition font-mono text-[11px]"
             >
               Reset
             </button>
             <button
               type="button"
               onClick={onSave}
               className="h-11 flex-1 rounded-xl bg-lime text-ink font-mono text-[11px] hover:brightness-95 transition"
             >
               Save Changes
             </button>
           </div>
         </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

function MobileStatChip({ label, value, highlight = false }) {
  return (
    <div className={`w-full rounded-xl border px-3 py-2.5 ${highlight ? 'border-lime/35 bg-lime/10' : 'border-bone/[0.08] bg-bone/[0.015]'}`}>
      <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-bone/25">{label}</p>
      <p className={`font-display font-bold text-[1rem] leading-none mt-1.5 ${highlight ? 'text-lime' : 'text-bone'}`}>{value}</p>
    </div>
  );
}

function AvatarPicker({ inputId, avatar, initials, sizeClass, textClass, onAvatarSelect }) {
  return (
    <div className={`relative ${sizeClass} shrink-0`}>
      <input id={inputId} type="file" accept="image/*" onChange={onAvatarSelect} className="hidden" />

      <label
        htmlFor={inputId}
        className="block w-full h-full rounded-2xl border border-lime/30 bg-lime/12 overflow-hidden cursor-pointer"
        title="Upload profile photo"
      >
        {avatar ? (
          <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className={`w-full h-full flex items-center justify-center font-display font-extrabold text-lime ${textClass}`}>
            {initials}
          </span>
        )}
      </label>

      <label
        htmlFor={inputId}
        className="absolute -bottom-1 -right-1 h-5 px-1.5 rounded-md bg-lime text-ink text-[9px] font-mono inline-flex items-center justify-center cursor-pointer"
      >
        Edit
      </label>
    </div>
  );
}

function SectionLabel({ title, subtitle }) {
  return (
    <div className="border-b border-bone/[0.06] pb-3">
      <h2 className="font-display font-bold text-[1.2rem] tracking-tight">{title}</h2>
      <p className="font-mono text-[11px] text-bone/30 mt-1">{subtitle}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25 block mb-2">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl bg-bone/[0.015] border border-bone/[0.08] px-3.5 text-bone text-[14px] outline-none focus:border-lime/45 focus:ring-2 focus:ring-lime/15 transition"
      />
    </label>
  );
}

function QuickStat({ label, value, highlight = false }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-lime/35 bg-lime/10' : 'border-bone/[0.08] bg-bone/[0.015]'}`}>
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-bone/25">{label}</p>
      <p className={`font-display font-extrabold text-[1.25rem] mt-2 leading-none ${highlight ? 'text-lime' : 'text-bone'}`}>{value}</p>
    </div>
  );
}

function MiniStat({ label, value, highlight = false }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? 'border-lime/30 bg-lime/8' : 'border-bone/[0.07] bg-bone/[0.015]'}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/25">{label}</p>
      <p className={`font-display font-bold text-[1.05rem] mt-1 ${highlight ? 'text-lime' : 'text-bone'}`}>{value}</p>
    </div>
  );
}
