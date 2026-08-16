import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export default function RouteProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setVisible(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(false), 420);
    return () => clearTimeout(timeoutRef.current);
  }, [location.pathname]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={location.pathname}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ transformOrigin: 'left' }}
            className="h-full bg-scan shadow-glow"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
