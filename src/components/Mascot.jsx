export default function Mascot({ size = 60, expression = 'neutral', className = '' }) {
  const w = size;
  const h = size * 1.18;

  const eyes = {
    neutral: (
      <>
        <circle cx="17" cy="22" r="4" fill="#0D0D0D" />
        <circle cx="37" cy="22" r="4" fill="#0D0D0D" />
      </>
    ),
    happy: (
      <>
        <path d="M13,23 Q17,18 21,23" stroke="#0D0D0D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M33,23 Q37,18 41,23" stroke="#0D0D0D" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
    thinking: (
      <>
        <circle cx="17" cy="22" r="4" fill="#0D0D0D" />
        <path d="M33,23 Q37,19 41,23" stroke="#0D0D0D" strokeWidth="3" fill="none" strokeLinecap="round" />
      </>
    ),
    alert: (
      <>
        <circle cx="17" cy="22" r="5" fill="#0D0D0D" />
        <circle cx="37" cy="22" r="5" fill="#0D0D0D" />
      </>
    ),
  };

  const mouth = {
    neutral: <path d="M17,34 h6 v10 c0,3 1.5,5.5 5,5.5 s5,-2.5 5,-5.5 V34 h6 v10 c0,5 -4.5,9 -11,9 S17,49 17,44 V34z" fill="#0D0D0D" />,
    happy: <path d="M17,34 h6 v10 c0,3 1.5,5.5 5,5.5 s5,-2.5 5,-5.5 V34 h6 v10 c0,5 -4.5,9 -11,9 S17,49 17,44 V34z" fill="#0D0D0D" />,
    thinking: <rect x="19" y="38" width="16" height="5" rx="2.5" fill="#0D0D0D" />,
    alert: <ellipse cx="27" cy="40" rx="6" ry="4" fill="#0D0D0D" />,
  };

  return (
    <svg width={w} height={h} viewBox="0 0 54 64" fill="none" className={className}>
      <rect x="3" y="3" width="48" height="58" rx="12" fill="#C8F135" />
      {eyes[expression] || eyes.neutral}
      {mouth[expression] || mouth.neutral}
    </svg>
  );
}
