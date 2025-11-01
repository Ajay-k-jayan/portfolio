'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Play, RotateCcw, Copy, Check } from 'lucide-react'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-vscode-text-secondary">Loading editor...</div>
})

export function CodePlayground() {
  const [code, setCode] = useState(`// Welcome to the Code Playground!
// Try writing some JavaScript code and run it.

function greet(name) {
  return \`Hello, \${name}! Welcome to my portfolio.\`;
}

console.log(greet("Developer"));

// Fibonacci example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));`)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const runCode = () => {
    try {
      const logs: string[] = []
      const originalConsoleLog = console.log
      console.log = (...args: any[]) => {
        logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '))
        originalConsoleLog(...args)
      }

      // Create a safe execution context
      const result = eval(code)
      console.log = originalConsoleLog

      if (result !== undefined) {
        logs.push(String(result))
      }

      setOutput(logs.join('\n') || 'Code executed successfully!')
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const resetCode = () => {
    setCode(`// Welcome to the Code Playground!
// Try writing some JavaScript code and run it.

function greet(name) {
  return \`Hello, \${name}! Welcome to my portfolio.\`;
}

console.log(greet("Developer"));`)
    setOutput('')
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col bg-vscode-bg">
      <div className="flex items-center justify-between p-4 border-b border-vscode-border bg-vscode-sidebar">
        <h2 className="text-lg font-semibold text-vscode-text">Code Playground</h2>
        <div className="flex gap-2">
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-active hover:bg-vscode-hover text-vscode-text text-sm rounded transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>Copy</span>
          </button>
          <button
            onClick={resetCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-active hover:bg-vscode-hover text-vscode-text text-sm rounded transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
          <button
            onClick={runCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-blue hover:bg-blue-600 text-white text-sm rounded transition-colors"
          >
            <Play size={16} />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col border border-vscode-border rounded-lg overflow-hidden">
          <div className="bg-vscode-sidebar px-4 py-2 border-b border-vscode-border">
            <h3 className="text-sm font-semibold text-vscode-text">Editor</h3>
          </div>
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col border border-vscode-border rounded-lg overflow-hidden">
          <div className="bg-vscode-sidebar px-4 py-2 border-b border-vscode-border">
            <h3 className="text-sm font-semibold text-vscode-text">Output</h3>
          </div>
          <div className="flex-1 bg-vscode-active p-4 overflow-auto">
            <pre className="text-sm text-vscode-text font-mono whitespace-pre-wrap">
              {output || '// Output will appear here after running code...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

