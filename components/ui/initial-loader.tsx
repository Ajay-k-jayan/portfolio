'use client'

import { useState, useEffect } from 'react'
import { LoadingScreen } from './loading-screen'
import { useAppStore } from '@/lib/store'

export function InitialLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const { isInitialized, initializeApp } = useAppStore()

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    if (!isInitialized) {
      initializeApp()
    }

    const minLoadTime = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
      }, 300)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(minLoadTime)
    }
  }, [isInitialized, initializeApp])

  useEffect(() => {
    if (isInitialized && progress >= 100) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isInitialized, progress])

  if (isLoading) {
    return <LoadingScreen message="Initializing portfolio..." showProgress progress={progress} />
  }

  return <>{children}</>
}

