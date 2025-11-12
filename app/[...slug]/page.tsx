import { notFound } from 'next/navigation'

// Catch-all route for unmatched paths
export default function CatchAllRoute() {
  // This will trigger the not-found.tsx page
  notFound()
}

// Generate metadata for 404 pages
export function generateMetadata() {
  return {
    title: '404 - Page Not Found | Ajay K J Portfolio',
    description: 'The page you are looking for does not exist.',
  }
}

