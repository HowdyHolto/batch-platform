import { LogoImage } from '../Logo'
import { LINEN, DIM, SAFFRON, GRID_BORDER } from '../../lib/theme'
import { LINKS } from '../../lib/config'

const FOLLOW_LINKS = [
  { label: 'Instagram', href: LINKS.instagram },
  { label: 'YouTube', href: LINKS.youtube },
  { label: 'Shop', href: LINKS.shop },
]

export default function Footer() {
  return (
    <footer className="px-10 py-16" style={{ borderTop: GRID_BORDER }}>
      <div className="grid grid-cols-3 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <LogoImage size="sm" />
            <span className="text-sm tracking-[0.18em] uppercase" style={{ color: LINEN }}>batch</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: DIM }}>
            A small studio. All products truly handmade by humans, one at a time, and only when you order them.
          </p>
        </div>

        <div>
          <div className="text-xs tracking-[0.18em] uppercase mb-6" style={{ color: DIM }}>Contact</div>
          <div className="space-y-3 text-sm" style={{ color: DIM }}>
            <div>
              <a
                href={LINKS.email}
                className="transition-colors duration-75"
                onMouseEnter={e => (e.currentTarget.style.color = SAFFRON)}
                onMouseLeave={e => (e.currentTarget.style.color = DIM)}
              >
                hello@batchmade.studio
              </a>
            </div>
            <div>Cary, NC 27518<br />United States</div>
          </div>
        </div>

        <div>
          <div className="text-xs tracking-[0.18em] uppercase mb-6" style={{ color: DIM }}>Follow</div>
          <div className="space-y-3 text-sm">
            {FOLLOW_LINKS.map(({ label, href }) => (
              <div key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-75"
                  style={{ color: DIM }}
                  onMouseEnter={e => (e.currentTarget.style.color = SAFFRON)}
                  onMouseLeave={e => (e.currentTarget.style.color = DIM)}
                >
                  {label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="pt-8 flex justify-between items-center text-xs"
        style={{ borderTop: GRID_BORDER, color: DIM }}
      >
        <span>© {new Date().getFullYear()} Batch Studio, LLC. All rights reserved.</span>
        <span className="tracking-wider">batchmade.studio</span>
      </div>
    </footer>
  )
}
