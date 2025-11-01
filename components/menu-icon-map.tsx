'use client'

import {
  Home,
  Code,
  FolderOpen,
  Trophy,
  Briefcase,
  Award,
  BookOpen,
  Share2,
  MessageSquare,
  Folder,
  LucideIcon,
} from 'lucide-react'

export const menuIconMap: Record<string, LucideIcon> = {
  'welcome': Home,
  'skills': Code,
  'project': FolderOpen,
  'achievement': Trophy,
  'experience': Briefcase,
  'certifications': Award,
  'blogs': BookOpen,
  'social-medias': Share2,
  'recommendation': MessageSquare,
  'file-explore': Folder,
}

export const menuLabelMap: Record<string, string> = {
  'welcome': 'Welcome',
  'skills': 'Skills',
  'project': 'Project',
  'achievement': 'Achievement',
  'experience': 'Experience',
  'certifications': 'Certifications',
  'blogs': 'Blogs',
  'social-medias': 'Social Medias',
  'recommendation': 'Recommendation',
  'file-explore': 'File Explorer',
}

