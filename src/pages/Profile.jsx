import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import Mascot from '../components/Mascot';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 1, 0.5, 1] } }),
};

export default function Profile() {
  const { profile, updateProfile, dailyLimit } = useApp();
  const [form, setForm] = useState({
    monthlyAllowance: profile.monthlyAllowance,
    fixedExpenses: profile.fixedExpenses,
    weekendPref: profile.weekendPref,
  });
  const [saved, setSaved] = useState(false);
  const [limMessage, setLimMessage] = useState('');

  const update = (field) => (e) => {
    const val = field === 'weekendPref' ? e.target.value : parseInt(e.target.value, 10) || 0;
    setForm((p) => ({ ...p, [field]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    const diff = form.monthlyAllowance - profile.monthlyAllowance;
    if (diff > 0) {
      setLimMessage(`Nice! Your allowance went up by \u20B9${diff}. Your daily limit will increase accordingly.`);
    } else if (diff < 0) {
      setLimMessage(`Your allowance decreased by \u20B9${Math.abs(diff)}. I'll adjust your daily limits \u2014 we'll make it work!`);
    } else if (form.fixedExpenses !== profile.fixedExpenses) {
      setLimMessage('Fixed expenses updated. Your daily limit has been recalculated.');
    } else if (form.weekendPref !== profile.weekendPref) {
      setLimMessage(`Weekend preference updated! ${form.weekendPref === 'more' ? 'Weekends will have higher limits.' : form.weekendPref === 'less' ? 'Weekends will have tighter limits.' : 'Budget evenly spread.'}`);
    } else {
      setLimMessage('Settings saved! No changes to your daily limit.');
    }
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = 'w-full bg-bone/[0.03] border border-bone/[0.06] rounded-[14px] px-4 py-3.5 font-mono text-[13px] text-bone placeholder:text-bone/20 outline-none focus:border-lime/30 focus:bg-bone/[0.05] transition-all';

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 grain">
      <motion.div initial="hidden" animate="visible" className="max-w-2xl mx-auto">
        <motion.div variants={fadeUp} custom={0} className="mb-10">
          <h1 className="font-display font-extrabold text-[clamp(1.6rem,4vw,2.2rem)] text-bone tracking-tight">Profile Settings</h1>
          <p className="font-mono text-[11px] text-bone/25 tracking-wider mt-1">Update your financial preferences</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={fadeUp} custom={1} className="card p-8 mb-5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-lime/[0.06] border border-lime/[0.12] flex items-center justify-center">
              <Mascot size={32} expression="happy" />
            </div>
            <div>
              <h2 className="font-display font-bold text-[16px] text-bone tracking-tight">{profile.name}</h2>
              <p className="font-mono text-[11px] text-bone/25">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="font-mono text-[10px] tracking-[0.25em] text-bone/25 uppercase block mb-2">Monthly Allowance ({'\u20B9'})</label>
              <input type="number" value={form.monthlyAllowance} onChange={update('monthlyAllowance')} min="0" className={inputClass} />
              <p className="font-mono text-[10px] text-bone/15 mt-1.5 ml-1">Total amount you receive each month</p>
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-[0.25em] text-bone/25 uppercase block mb-2">Fixed Expenses ({'\u20B9'})</label>
              <input type="number" value={form.fixedExpenses} onChange={update('fixedExpenses')} min="0" className={inputClass} />
              <p className="font-mono text-[10px] text-bone/15 mt-1.5 ml-1">Rent, subscriptions, bills — deducted before daily limits</p>
            </div>

            <div>
              <label className="font-mono text-[10px] tracking-[0.25em] text-bone/25 uppercase block mb-2">Weekend Preference</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'less', label: 'Less', desc: 'Tighter weekends' },
                  { value: 'equal', label: 'Equal', desc: 'Same every day' },
                  { value: 'more', label: 'More', desc: 'Flexible weekends' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setForm((p) => ({ ...p, weekendPref: opt.value })); setSaved(false); }}
                    className={`p-4 rounded-[14px] border text-center transition-all cursor-pointer ${
                      form.weekendPref === opt.value
                        ? 'bg-lime/[0.06] border-lime/[0.15] text-lime'
                        : 'bg-bone/[0.02] border-bone/[0.06] text-bone/40 hover:border-bone/10'
                    }`}
                  >
                    <span className="font-display font-bold text-[13px] block">{opt.label}</span>
                    <span className="font-mono text-[10px] opacity-50 block mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-lime text-ink font-display font-bold text-[13px] py-3.5 rounded-[14px] hover:shadow-[0_8px_32px_rgba(200,241,53,0.15)] transition-all cursor-pointer"
            >
              {saved ? '\u2713 Saved' : 'Save Changes'}
            </button>
          </div>
        </motion.div>

        {/* LIM AI Explanation */}
        {limMessage && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="flex items-start gap-3">
              <Mascot size={28} expression="happy" className="shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-lime/40 uppercase block mb-2">LIM says</span>
                <p className="font-mono text-[12px] text-bone/40 leading-[1.8]">{limMessage}</p>
                <p className="font-mono text-[11px] text-bone/20 mt-3">New daily limit: {'\u20B9'}{dailyLimit}</p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
