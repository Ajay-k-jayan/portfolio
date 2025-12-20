'use client'

import { useState } from 'react'
import { Calendar, Clock, Sparkles, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Tooltip } from './ui/tooltip'
import { ViewSwitcher } from './ui/view-switcher'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  readTime: string
  tags: string[]
  aiSummary?: string
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Modern Web Applications with Next.js 14',
    slug: 'building-modern-web-apps-nextjs-14',
    excerpt: 'Exploring the latest features in Next.js 14 and how they revolutionize web development.',
    content: `# Building Modern Web Applications with Next.js 14

Next.js 14 brings exciting new features that make building web applications easier and more efficient.

## Server Components

Server Components allow you to build apps that leverage the best of React's server and client capabilities.

\`\`\`typescript
async function ServerComponent() {
  const data = await fetch('https://api.example.com/data')
  return <div>{/* Render data */}</div>
}
\`\`\`

## Improved Performance

With improved caching strategies and optimizations, Next.js 14 delivers faster page loads and better user experiences.`,
    publishedAt: '2024-01-15',
    readTime: '5 min read',
    tags: ['Next.js', 'React', 'Web Development'],
    aiSummary: 'This article explores Next.js 14 features including Server Components, improved performance optimizations, and best practices for building scalable web applications.',
  },
  {
    id: '2',
    title: 'Mastering TypeScript: Advanced Patterns and Techniques',
    slug: 'mastering-typescript-advanced-patterns',
    excerpt: 'Deep dive into advanced TypeScript patterns that every developer should know.',
    content: `# Mastering TypeScript: Advanced Patterns

TypeScript provides powerful features for building robust applications.

## Advanced Types

Learn about conditional types, mapped types, and template literal types.`,
    publishedAt: '2024-02-20',
    readTime: '8 min read',
    tags: ['TypeScript', 'Programming'],
    aiSummary: 'A comprehensive guide to advanced TypeScript patterns including conditional types, utility types, and design patterns that enhance code quality and maintainability.',
  },
]

type BlogViewMode = 'grid' | 'list'

export function BlogSystem() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [viewMode, setViewMode] = useState<BlogViewMode>('grid')

  return (
    <div className="h-full p-6 overflow-auto">
      {!selectedPost ? (
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-vscode-text flex items-center gap-2 mb-1">
                <BookOpen className="text-vscode-blue" size={20} />
                Blog
              </h1>
              <p className="text-sm text-vscode-text-secondary">Articles and insights on web development and technology</p>
            </div>
            <ViewSwitcher
              viewMode={viewMode}
              onViewChange={(mode) => setViewMode(mode as BlogViewMode)}
              options="grid-list"
            />
          </div>

          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
            {blogPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`bg-vscode-sidebar border border-vscode-border rounded-lg hover:border-vscode-blue transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'p-6' : 'p-4 flex items-start gap-4'
                }`}
              >
                {viewMode === 'list' && (
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-vscode-active border border-vscode-border flex items-center justify-center">
                      <BookOpen size={20} className="text-vscode-blue" />
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className={`font-semibold text-vscode-text hover:text-vscode-blue transition-colors ${
                      viewMode === 'grid' ? 'text-xl' : 'text-lg'
                    }`}>
                      {post.title}
                    </h2>
                    {post.aiSummary && (
                      <Tooltip content="AI Summary Available">
                        <div className="flex items-center gap-1 text-vscode-purple flex-shrink-0 ml-2">
                          <Sparkles size={16} />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <p className={`text-vscode-text-secondary mb-4 ${
                    viewMode === 'grid' ? 'text-sm' : 'text-xs line-clamp-2'
                  }`}>
                    {post.excerpt}
                  </p>
                  <div className={`flex items-center gap-4 text-xs text-vscode-text-secondary mb-4 ${
                    viewMode === 'list' ? 'flex-wrap' : ''
                  }`}>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-vscode-active text-vscode-green text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {post.aiSummary && viewMode === 'grid' && (
                    <div className="mt-4 p-3 bg-vscode-active rounded border-l-2 border-vscode-purple">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} className="text-vscode-purple" />
                        <span className="text-xs font-semibold text-vscode-text">AI Summary</span>
                      </div>
                      <p className="text-xs text-vscode-text-secondary">{post.aiSummary}</p>
                    </div>
                  )}
                  {post.aiSummary && viewMode === 'list' && (
                    <div className="mt-2 p-2 bg-vscode-active rounded border-l-2 border-vscode-purple">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={12} className="text-vscode-purple" />
                        <span className="text-xs font-semibold text-vscode-text">AI Summary</span>
                      </div>
                      <p className="text-xs text-vscode-text-secondary line-clamp-1">{post.aiSummary}</p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 text-vscode-blue hover:text-blue-400 text-sm"
          >
            ← Back to Blog
          </button>
          <article className="bg-vscode-sidebar border border-vscode-border rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-vscode-text mb-4">{selectedPost.title}</h1>
                <div className="flex items-center gap-4 text-sm text-vscode-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(selectedPost.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="prose prose-invert prose-headings:text-vscode-text prose-p:text-vscode-text prose-strong:text-vscode-text prose-code:text-vscode-orange prose-pre:bg-vscode-active max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedPost.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      )}
    </div>
  )
}

