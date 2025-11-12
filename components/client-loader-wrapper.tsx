'use client'

import { InitialLoader } from './ui/initial-loader'

export function ClientLoaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <InitialLoader>
      {children}
    </InitialLoader>
  )
}

