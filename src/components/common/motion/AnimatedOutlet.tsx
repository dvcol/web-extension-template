import { AnimatePresence, motion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router';

const scaleTransition = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
  transition: { duration: 0.25, ease: 'easeInOut' },
} as const;

/**
 * Animated route outlet — replicates Vue's `<Transition name="scale" mode="out-in">`.
 *
 * Uses `useOutlet()` instead of `<Outlet />` so the rendered element is baked into
 * the React tree. AnimatePresence caches the old child element on key change,
 * preserving old content during exit. Lazy resolution still updates normally
 * within the same key since no manual freezing occurs.
 */
export function AnimatedOutlet() {
  const { pathname } = useLocation();
  const outlet = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} style={{ width: '100%', height: '100%' }} {...scaleTransition}>
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
