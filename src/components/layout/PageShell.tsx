import { ReactNode } from 'react'
import NavBar from './NavBar'
import Footer from './Footer'
import { BG, LINEN } from '../../lib/theme'

interface PageShellProps {
  children: ReactNode
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div
      className="min-h-screen [&_h1]:break-words [&_h2]:break-words"
      style={{ background: BG, color: LINEN }}
    >
      <NavBar />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}
