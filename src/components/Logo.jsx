export default function Logo({ size = 32, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
        <rect width="44" height="44" rx="10" fill="#C8F135" />
        <path
          d="M12 13h5v12c0 3.866 2.239 7 5 7s5-3.134 5-7V13h5v12c0 6.075-4.477 11-10 11S12 31.075 12 25V13z"
          fill="#0D0D0D"
        />
      </svg>
      <span className="font-display font-extrabold tracking-tight text-bone" style={{ fontSize: size * 0.6 }}>
        Limit <span className="font-serif italic text-lime font-normal">U</span>
      </span>
    </div>
  );
}
