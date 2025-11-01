'use client'

import { VSCodeLayout } from '@/components/vscode-layout'
import { WelcomeTab } from '@/components/tabs/welcome-tab'

export default function Home() {
  return (
    <VSCodeLayout>
      <WelcomeTab />
    </VSCodeLayout>
  )
}

