import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function RouteProgressBar() {
  const location = useLocation();
  const [state, setState] = useState('idle'); // idle | loading | done
  const timeout = useRef(null);

  useEffect(() => {
    // Start filling
    setState('loading');

    // After the bar fills, hold briefly then hide
    timeout.current = setTimeout(() => {
      setState('done');
      timeout.current = setTimeout(() => setState('idle'), 300);
    }, 600);

    return () => clearTimeout(timeout.current);
  }, [location.pathname]);

  if (state === 'idle') return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-[2px]">
      <motion.div
        className="h-full bg-lime origin-left"
        style={{ boxShadow: '0 0 12px rgba(200,241,53,0.4), 0 0 4px rgba(200,241,53,0.6)' }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={
          state === 'loading'
            ? { scaleX: 1, opacity: 1 }
            : { scaleX: 1, opacity: 0 }
        }
        transition={
          state === 'loading'
            ? { duration: 0.6, ease: [0, 0, 0.2, 1], delay: 0 }
            : { duration: 0.3, ease: 'easeOut' }
        }
      />
    </div>
  );
}

export function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1], delay: 0.15 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
