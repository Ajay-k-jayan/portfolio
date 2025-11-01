'use client'

import { useState, useEffect } from 'react'

interface TypingAnimationProps {
  text: string
  speed?: number
  className?: string
}

export function TypingAnimation({ text, speed = 100, className = '' }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse text-vscode-blue">|</span>}
    </span>
  )
}

