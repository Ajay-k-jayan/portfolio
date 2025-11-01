'use client'

import { X, ExternalLink } from 'lucide-react'

export function LiveDemo({ projectId, url, onClose }: { projectId: string; url: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg w-full max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-vscode-border">
          <h2 className="text-lg font-semibold text-vscode-text">Live Demo</h2>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-blue hover:bg-blue-600 text-white text-sm rounded transition-colors"
            >
              <ExternalLink size={16} />
              <span>Open in New Tab</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-vscode-hover rounded text-vscode-text-secondary hover:text-vscode-text"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src={url}
            className="w-full h-full border-0"
            title="Live Demo"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  )
}

