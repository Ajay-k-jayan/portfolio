'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeViewerProps {
  language: string
  code: string
}

export function CodeViewer({ language, code }: CodeViewerProps) {
  const [displayedCode, setDisplayedCode] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  // Format code based on language
  const formatCode = () => {
    if (language === 'json') {
      try {
        const parsed = typeof code === 'string' ? JSON.parse(code) : code
        return JSON.stringify(parsed, null, 2)
      } catch {
        return typeof code === 'string' ? code : JSON.stringify(code, null, 2)
      }
    }
    return typeof code === 'string' ? code : JSON.stringify(code, null, 2)
  }

  const formattedCode = formatCode()
  const lines = formattedCode.split('\n')

  // Typing animation effect
  useEffect(() => {
    setDisplayedCode('')
    setIsTyping(true)

    let currentIndex = 0
    const typingSpeed = 8 // Characters per interval

    const typingInterval = setInterval(() => {
      if (currentIndex < formattedCode.length) {
        setDisplayedCode(formattedCode.substring(0, currentIndex + typingSpeed))
        currentIndex += typingSpeed
      } else {
        setDisplayedCode(formattedCode)
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 30) // Update every 30ms

    return () => clearInterval(typingInterval)
  }, [code, formattedCode])

  // Syntax highlighting function
  const highlightLine = (line: string): React.ReactNode => {
    let className = 'text-vscode-text'
    const parts: Array<{ text: string; className: string }> = []

    if (language === 'json') {
      // JSON syntax highlighting
      const jsonRegex = /(".*?"|\d+|true|false|null)/g
      let lastIndex = 0
      let match

      while ((match = jsonRegex.exec(line)) !== null) {
        // Add text before match
        if (match.index > lastIndex) {
          const beforeText = line.substring(lastIndex, match.index)
          if (beforeText.includes(':')) {
            parts.push({ text: beforeText, className: 'text-yellow-400' })
          } else {
            parts.push({ text: beforeText, className: 'text-vscode-text' })
          }
        }

        // Add matched part with appropriate color
        const matchedText = match[0]
        if (matchedText.startsWith('"')) {
          parts.push({ text: matchedText, className: 'text-blue-400' })
        } else if (/^\d+$/.test(matchedText)) {
          parts.push({ text: matchedText, className: 'text-purple-400' })
        } else if (matchedText === 'true' || matchedText === 'false') {
          parts.push({ text: matchedText, className: 'text-green-400' })
        } else {
          parts.push({ text: matchedText, className: 'text-vscode-text' })
        }

        lastIndex = jsonRegex.lastIndex
      }

      // Add remaining text
      if (lastIndex < line.length) {
        const remainingText = line.substring(lastIndex)
        if (remainingText.includes(':')) {
          parts.push({ text: remainingText, className: 'text-yellow-400' })
        } else {
          parts.push({ text: remainingText, className: 'text-vscode-text' })
        }
      }

      if (parts.length === 0) {
        parts.push({ text: line, className: line.includes(':') ? 'text-yellow-400' : 'text-vscode-text' })
      }
    } else if (language === 'markdown' || language === 'md') {
      // Markdown syntax highlighting
      if (line.trim().startsWith('#')) {
        parts.push({ text: line, className: 'text-blue-400 font-semibold' })
      } else if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
        parts.push({ text: line, className: 'text-yellow-400' })
      } else if (line.includes('`')) {
        parts.push({ text: line, className: 'text-green-400' })
      } else {
        parts.push({ text: line, className: 'text-vscode-text' })
      }
    } else {
      parts.push({ text: line, className: 'text-vscode-text' })
    }

    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx} className={part.className}>
            {part.text}
          </span>
        ))}
      </>
    )
  }

  const displayedLines = displayedCode.split('\n')
  const showCursor = isTyping && displayedCode.length < formattedCode.length

  return (
    <div className="h-full w-full flex flex-col bg-vscode-bg">
      {/* Code Content */}
      <div className="flex-1 overflow-auto relative">
        <div className="flex">
          {/* Line Numbers */}
          <div className="bg-vscode-sidebar border-r border-vscode-border px-4 py-4 text-right text-xs text-vscode-text-secondary font-mono select-none">
            {lines.map((_, index) => (
              <div key={index} className="leading-6">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code with typing animation */}
          <div className="flex-1 px-4 py-4 overflow-auto">
            <pre className="text-sm font-mono leading-6 text-vscode-text whitespace-pre">
              <code>
                <AnimatePresence>
                  {displayedLines.map((line, index) => {
                    const isLastLine = index === displayedLines.length - 1
                    const isComplete = !isTyping || index < displayedLines.length - 1 || displayedCode.endsWith('\n')

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="leading-6"
                      >
                        {highlightLine(line)}
                        {showCursor && isLastLine && isComplete && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              repeatType: 'reverse',
                            }}
                            className="inline-block w-0.5 h-4 bg-vscode-blue ml-0.5 align-middle"
                          />
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}