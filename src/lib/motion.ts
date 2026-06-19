/** Shared motion presets — subtle, smooth, consistent across the app. */

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const;

export const MOTION_DURATION = {
  fast: 0.35,
  normal: 0.45,
  slow: 0.55,
} as const;

export const defaultTransition = {
  duration: MOTION_DURATION.normal,
  ease: MOTION_EASE,
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

export const viewportOnce = {
  once: true,
  margin: "-64px",
} as const;
