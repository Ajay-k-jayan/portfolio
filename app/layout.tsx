import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'Ajay K J - Software Engineer | VS Code Portfolio',
  description: 'Front-End Developer | Angular | UI Design | Web Performance - Portfolio showcasing 2+ years of experience in building scalable web applications',
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
          {children}
        </Providers>
      </body>
    </html>
  )
}

