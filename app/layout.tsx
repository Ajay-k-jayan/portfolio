import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { ClientLoaderWrapper } from '@/components/client-loader-wrapper'

export const metadata: Metadata = {
  title: 'Ajay K J - Software Engineer | VS Code Portfolio',
  description: 'Front-End Developer | Angular | UI Design | Web Performance - Portfolio showcasing 2+ years of experience in building scalable web applications',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-mono antialiased">
        <Providers>
          <ClientLoaderWrapper>
          {children}
          </ClientLoaderWrapper>
        </Providers>
      </body>
    </html>
  )
}

