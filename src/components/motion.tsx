"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
} from "motion/react";

import {
  defaultTransition,
  fadeIn,
  fadeInUp,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type MotionDivProps = HTMLMotionProps<"div">;

function useMotionTransition(overrides?: Partial<Transition>): Transition {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return { duration: 0 };
  }

  return { ...defaultTransition, ...overrides };
}

export function FadeIn({
  className,
  children,
  delay = 0,
  ...props
}: MotionDivProps & { delay?: number }) {
  const transition = useMotionTransition({ delay });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInView({
  className,
  children,
  delay = 0,
  ...props
}: MotionDivProps & { delay?: number }) {
  const transition = useMotionTransition({ delay });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={prefersReducedMotion ? undefined : viewportOnce}
      variants={fadeInUp}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  className,
  children,
  ...props
}: MotionDivProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={prefersReducedMotion ? undefined : viewportOnce}
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ className, children, ...props }: MotionDivProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? fadeIn : staggerItem}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PageEnter({ className, children, ...props }: MotionDivProps) {
  const transition = useMotionTransition();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transition}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MotionFade({
  className,
  children,
  ...props
}: MotionDivProps) {
  const transition = useMotionTransition();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
