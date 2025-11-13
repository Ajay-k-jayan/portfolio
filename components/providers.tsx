'use client'

import { useEffect } from 'react'
import { EnhancedThemeProvider } from '@/contexts/enhanced-theme-context'
import { LanguageProvider } from '@/contexts/language-context'
import { useAppStore } from '@/lib/store'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  const { initializeApp, isInitialized } = useAppStore()

  useEffect(() => {
    // Initialize app on mount - mark old notifications as read
    if (!isInitialized) {
      initializeApp()
    }
  }, [isInitialized, initializeApp])

  return (
    <EnhancedThemeProvider>
      <LanguageProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: 'var(--theme-sidebar, #252526)',
              color: 'var(--theme-text, #cccccc)',
              border: '1px solid var(--theme-border, #3e3e42)',
            },
          }}
        />
        {children}
      </LanguageProvider>
    </EnhancedThemeProvider>
  )
}

