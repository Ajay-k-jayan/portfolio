'use client'

import { Variants, Transition } from 'framer-motion'

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get animation duration based on user preferences and settings
 */
export const getAnimationDuration = (baseDuration: number, animationSpeed?: 'fast' | 'normal' | 'slow'): number => {
  if (prefersReducedMotion()) return 0
  
  const speedMultiplier = {
    fast: 0.5,
    normal: 1,
    slow: 1.5,
  }
  
  return baseDuration * (speedMultiplier[animationSpeed || 'normal'] || 1)
}

/**
 * Base transition configuration
 */
export const baseTransition: Transition = {
  type: 'tween',
  ease: [0.16, 1, 0.3, 1], // Custom easing curve
  duration: 0.5,
}

/**
 * Fast transition for micro-interactions
 */
export const fastTransition: Transition = {
  ...baseTransition,
  duration: 0.2,
}

/**
 * Slow transition for dramatic effects
 */
export const slowTransition: Transition = {
  ...baseTransition,
  duration: 0.8,
}

/**
 * Spring transition for natural movement
 */
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
}

/**
 * Fade In Animation
 * Uses: opacity transform
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    transition: fastTransition,
  },
}

/**
 * Slide Up Animation
 * Uses: opacity, translateY (GPU-friendly)
 */
export const slideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30, // Using translateY (GPU-friendly)
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: fastTransition,
  },
}

/**
 * Slide Down Animation
 * Uses: opacity, translateY
 */
export const slideDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    y: 30,
    transition: fastTransition,
  },
}

/**
 * Slide Left Animation
 * Uses: opacity, translateX (GPU-friendly)
 */
export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    x: -30,
    transition: fastTransition,
  },
}

/**
 * Slide Right Animation
 * Uses: opacity, translateX
 */
export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: fastTransition,
  },
}

/**
 * Scale In Animation
 * Uses: opacity, scale (GPU-friendly)
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: fastTransition,
  },
}

/**
 * Scale Up Animation (for hover effects)
 */
export const scaleUp: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: fastTransition,
  },
  tap: {
    scale: 0.95,
    transition: fastTransition,
  },
}

/**
 * Stagger Container
 * Parent container for staggered children animations
 */
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

/**
 * Stagger Item
 * Child item for staggered animations
 */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
}

/**
 * Stagger Item with Slide Left
 */
export const staggerItemLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: baseTransition,
  },
}

/**
 * Stagger Item with Slide Right
 */
export const staggerItemRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: baseTransition,
  },
}

/**
 * Page Transition
 * For route/page changes
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...baseTransition,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: fastTransition,
  },
}

/**
 * Fade In with Blur
 * Uses: opacity, filter (blur)
 */
export const fadeInBlur: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: slowTransition,
  },
}

/**
 * Rotate In Animation
 * Uses: opacity, rotate, scale
 */
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotate: -10,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: baseTransition,
  },
}

/**
 * Bounce In Animation
 * Uses: opacity, scale with spring physics
 */
export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
}

/**
 * Slide and Fade
 * Combined slide and fade animation
 */
export const slideFade: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    x: 0,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: baseTransition,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: fastTransition,
  },
}

/**
 * Get reduced motion variants (no animations)
 */
export const getReducedMotionVariants = (): Variants => ({
  hidden: {},
  visible: {},
  exit: {},
})

/**
 * Get animation variants with reduced motion support
 */
export const getVariants = (
  variants: Variants,
  enableAnimations: boolean = true
): Variants => {
  if (!enableAnimations || prefersReducedMotion()) {
    return getReducedMotionVariants()
  }
  return variants
}

/**
 * Hook to get animation configuration
 */
export const useMotionConfig = (animationSpeed?: 'fast' | 'normal' | 'slow') => {
  const reducedMotion = prefersReducedMotion()
  
  return {
    reducedMotion,
    duration: (base: number) => getAnimationDuration(base, animationSpeed),
    variants: (variants: Variants, enabled: boolean = true) => 
      getVariants(variants, enabled),
  }
}

