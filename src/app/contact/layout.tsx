// app/contact/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Cameron Brady',
  description: 'Get in touch with Cameron Brady for research collaborations, consulting projects, or to discuss AI applications in healthcare and neuroscience.',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
