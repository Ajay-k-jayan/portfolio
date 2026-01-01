'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Hook to trigger animations when element scrolls into view
 */
export function useScrollAnimation(options?: {
  once?: boolean
  amount?: number
  margin?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: options?.once ?? true,
    amount: options?.amount ?? 0.2,
    margin: options?.margin ?? '0px',
  })

  return { ref, isInView }
}


