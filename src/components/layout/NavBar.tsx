import { useEffect, useState } from 'react'
import { LogoImage } from '../Logo'
import { SAFFRON, DIM, GRID_BORDER } from '../../lib/theme'
import { LINKS } from '../../lib/config'

const NAV_LINKS = [
  { label: 'Shop', href: LINKS.shop },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-[#221f1d]/95 backdrop-blur-sm' : ''
      }`}
      style={scrolled ? { borderBottom: GRID_BORDER } : undefined}
    >
      <div className="px-6 md:px-10 py-5 flex items-center justify-between">
        <a href="/" className="relative flex items-center group">
          <LogoImage size="sm" />
          <span
            className="pointer-events-none absolute left-0 top-full mt-3 px-3 py-1.5 text-xs tracking-[0.14em] uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            style={{ background: '#2e2a27', color: DIM, border: '1px dashed ' + DIM }}
          >
            batch studios
          </span>
        </a>

        <nav className="hidden md:flex gap-10 text-xs tracking-[0.18em] uppercase">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="transition-colors duration-75"
              style={{ color: DIM }}
              onMouseEnter={e => (e.currentTarget.style.color = SAFFRON)}
              onMouseLeave={e => (e.currentTarget.style.color = DIM)}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href={LINKS.shop}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block text-xs tracking-[0.18em] uppercase px-6 py-2.5 border border-dashed transition-all duration-75"
          style={{ borderColor: DIM, color: DIM }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = SAFFRON
            e.currentTarget.style.color = SAFFRON
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = DIM
            e.currentTarget.style.color = DIM
          }}
        >
          Shop Now
        </a>
      </div>
    </header>
  )
}
