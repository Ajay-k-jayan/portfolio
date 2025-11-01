'use client'

import { ThemeProvider } from '@/contexts/theme-context'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#252526',
            color: '#cccccc',
            border: '1px solid #3e3e42',
          },
        }}
      />
      {children}
    </ThemeProvider>
  )
}

