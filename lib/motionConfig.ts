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
 * Advanced Page Transition with Blur
 * Smooth fade with blur effect for page changes
 */
export const advancedPageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 30,
    scale: 0.96,
    filter: 'blur(10px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...baseTransition,
      duration: 0.6,
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    filter: 'blur(8px)',
    transition: {
      ...fastTransition,
      duration: 0.3,
    },
  },
}

/**
 * Magnetic Hover Effect
 * For interactive elements that respond to mouse
 */
export const magneticHover: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.05,
    rotate: [0, -2, 2, -2, 0],
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.95,
  },
}

/**
 * Glow Pulse Animation
 * For elements that need a glowing effect
 */
export const glowPulse: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Shimmer Effect
 * For loading states and highlights
 */
export const shimmer: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: [0, 1, 0],
    x: [0, 200, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

/**
 * Advanced Stagger Container with Enhanced Timing
 */
export const advancedStaggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
      when: 'beforeChildren',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

/**
 * Advanced Stagger Item with Multiple Properties
 */
export const advancedStaggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      ...baseTransition,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: {
      ...fastTransition,
      duration: 0.2,
    },
  },
}

/**
 * Parallax Effect
 * For depth and layering
 */
export const parallax: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...slowTransition,
      duration: 0.8,
    },
  },
}

/**
 * Glassmorphism Fade
 * For glass-like effects
 */
export const glassmorphism: Variants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(10px)',
    scale: 1,
    transition: {
      ...baseTransition,
      duration: 0.6,
    },
  },
}

/**
 * Smooth Fade Transition
 * Ultra-smooth fade with scale
 */
export const smoothFade: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.55, 0.06, 0.68, 0.19],
    },
  },
}

/**
 * Elastic Bounce
 * Playful bounce effect
 */
export const elasticBounce: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    y: -50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
      mass: 1,
    },
  },
}

/**
 * Slide Fade with Rotation
 * Advanced slide with subtle rotation
 */
export const slideFadeRotate: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      ...baseTransition,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    rotateX: 15,
    transition: fastTransition,
  },
}

/**
 * Zoom Fade
 * Zoom in with fade
 */
export const zoomFade: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ...baseTransition,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.1,
    transition: fastTransition,
  },
}

/**
 * Flip Animation
 * 3D flip effect
 */
export const flip: Variants = {
  hidden: {
    opacity: 0,
    rotateY: -90,
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    transition: {
      ...baseTransition,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    rotateY: 90,
    transition: fastTransition,
  },
}

/**
 * Wave Animation
 * For sequential reveal
 */
export const wave: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
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

