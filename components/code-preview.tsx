'use client'

import { X, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function CodePreview({ projectId, code, onClose }: { projectId: string; code: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-vscode-border">
          <h2 className="text-lg font-semibold text-vscode-text">Code Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-vscode-bg p-4">
          <pre className="text-xs text-vscode-orange font-mono whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
