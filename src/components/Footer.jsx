import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="relative mt-12 mx-6 md:mx-12 lg:mx-20 mb-6 rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-lime/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link to="/"><Logo size={18} /></Link>

          </div>

          <div className="flex items-center gap-1">
            {['Privacy', 'Terms'].map((l) => (
              <span key={l} className="font-mono text-[10px] text-bone/40 hover:text-lime/60 px-3 py-1.5 rounded-lg hover:bg-lime/[0.04] cursor-pointer transition-all duration-200 tracking-wider">{l}</span>
            ))}
            <Link to="/contact" className="font-mono text-[10px] text-bone/40 hover:text-lime/60 px-3 py-1.5 rounded-lg hover:bg-lime/[0.04] transition-all duration-200 tracking-wider">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-bone/[0.08] flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-mono text-[10px] text-bone/30 tracking-wider">&copy; 2026 Limit U</p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <a href="mailto:team.limitu@gmail.com" className="flex items-center gap-1.5 group">
              <svg className="w-3 h-3 text-bone/35 group-hover:text-lime/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" /></svg>
              <span className="font-mono text-[10px] text-bone/35 group-hover:text-bone/55 transition-colors tracking-wider">team.limitu@gmail.com</span>
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}
