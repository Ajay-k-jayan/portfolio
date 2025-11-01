'use client'

import { EnhancedThemeProvider } from '@/contexts/enhanced-theme-context'
import { LanguageProvider } from '@/contexts/language-context'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EnhancedThemeProvider>
      <LanguageProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
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

