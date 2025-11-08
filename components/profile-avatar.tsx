'use client'

import { useState, useEffect } from 'react'

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showBorder?: boolean
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
}

// Try multiple image formats
const imageFormats = [
  '/profile-photo.jpg',
  '/profile-photo.jpeg',
  '/profile-photo.png',
  '/profile-photo.webp',
]

export function ProfileAvatar({ size = 'md', className = '', showBorder = true }: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState('/profile-photo.jpg')
  const [currentFormatIndex, setCurrentFormatIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const sizeClass = sizeClasses[size]

  // Try different image formats if one fails
  const handleImageError = () => {
    const nextIndex = currentFormatIndex + 1
    if (nextIndex < imageFormats.length) {
      setCurrentFormatIndex(nextIndex)
      setImageSrc(imageFormats[nextIndex])
      setImageLoaded(false)
    } else {
      setImageError(true)
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  // Reset when component mounts
  useEffect(() => {
    setImageError(false)
    setCurrentFormatIndex(0)
    setImageSrc('/profile-photo.jpg')
    setImageLoaded(false)
  }, [])

  // Show fallback with initials
  if (imageError) {
    return (
      <div className={`${sizeClass} bg-vscode-blue rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 ${showBorder ? 'border-2 border-vscode-blue/30 shadow-lg' : ''} ${className}`}>
        <span className={size === 'sm' ? 'text-sm' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-3xl'}>
          AKJ
        </span>
      </div>
    )
  }

  return (
    <div className={`${sizeClass} rounded-full flex-shrink-0 overflow-hidden relative ${showBorder ? 'border-2 border-vscode-blue/30 shadow-lg' : ''} ${className}`}>
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-vscode-blue/10 animate-pulse flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-vscode-blue/20 rounded-full"></div>
        </div>
      )}
      
      {/* Profile image */}
      <img 
        src={imageSrc} 
        alt="Ajay K J"
        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

