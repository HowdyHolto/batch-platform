import { LogoImage, LogoAnimated } from '../../components/Logo'
import GridBlock from '../../components/GridBlock'
import { DotMatrix, PATTERNS } from '../../components/DotMatrix'
import {
  BRONZE, CHOCOLATE, SAFFRON, MINT, LINEN, DIM,
  GRID_BORDER, DIVIDER,
  FS_XL, FS_LG, FS_MD, FS_STAT,
  R1, R2,
} from '../../lib/theme'
import { PHOTOS, LINKS } from '../../lib/config'

function Hl({ accent, children }: { accent: string; children: string }) {
  return (
    <>
      <span style={{ color: accent }}>{children[0]}</span>
      {children.slice(1)}
    </>
  )
}

export default function HomePage() {
  return (
    <div className="grid grid-cols-3" style={{ borderTop: GRID_BORDER, borderLeft: GRID_BORDER }}>

      {/* ZONE 1 — Hero */}
      <GridBlock className="col-span-3 overflow-hidden" style={R2} accent="bronze" tag="01 — Handmade Studio">
        <div className="flex h-full" style={{ minHeight: 'inherit' }}>
          <div
            className="flex-shrink-0 flex items-start justify-center pt-20"
            style={{ width: 'clamp(160px, 18vw, 260px)' }}
          >
            <LogoAnimated size="xl" color={BRONZE} />
          </div>
          <div className="flex-1 flex flex-col justify-between px-12 md:px-16 pt-20 pb-14">
            <div>
              <h1 className="font-light leading-[1.02] mb-8" style={{ ...FS_XL, color: LINEN }}>
                <span className="block hero-line" style={{ animationDelay: '2.8s' }}>
                  <Hl accent={BRONZE}>Truly</Hl>
                </span>
                <span className="block hero-line" style={{ animationDelay: '3.15s' }}>Handmade</span>
                <span className="block hero-line" style={{ animationDelay: '3.5s' }}>by Humans</span>
              </h1>
              <p className="hero-line text-base font-light leading-relaxed max-w-md" style={{ color: DIM, animationDelay: '3.75s' }}>
                Every product made by hand, one at a time, only when you order it. No inventory. No waste. Just craft.
              </p>
            </div>
            <div className="hero-line flex flex-wrap gap-4 mt-10" style={{ animationDelay: '4.05s' }}>
              <a
                href={LINKS.shop}
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-75"
                style={{ background: BRONZE, color: LINEN }}
                onMouseEnter={e => (e.currentTarget.style.background = SAFFRON)}
                onMouseLeave={e => (e.currentTarget.style.background = BRONZE)}
              >
                Shop Products
              </a>
              <a
                href="#about"
                className="px-10 py-4 text-xs tracking-[0.2em] uppercase border border-dashed transition-all duration-75"
                style={{ borderColor: DIM, color: DIM }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(239,237,230,0.4)'
                  e.currentTarget.style.color = LINEN
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = DIM
                  e.currentTarget.style.color = DIM
                }}
              >
                Our Process
              </a>
            </div>
          </div>
        </div>
      </GridBlock>

      {/* ZONE 2 — Stat + workshop photo */}
      <GridBlock className="col-span-1 p-10 flex flex-col justify-between" style={R1} accent="mint" tag="Production">
        <div className="pt-6">
          <div className="font-light leading-none" style={{ ...FS_STAT, color: MINT }}>1</div>
          <div className="text-xs mt-2 tracking-[0.18em] uppercase" style={{ color: DIM }}>at a time</div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: DIM }}>
          No pre-made inventory. Every piece made individually, start to finish.
        </p>
      </GridBlock>

      <GridBlock href={LINKS.shop} spanClass="col-span-2" style={R1} accent="chocolate" tag="Workshop">
        <div className="relative overflow-hidden h-full" style={R1}>
          <img src={PHOTOS.pod5} alt="Batch workshop" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-200" />
          <div className="relative z-10 flex flex-col justify-end p-10 h-full">
            <h2 className="font-light leading-tight" style={{ ...FS_LG, color: LINEN }}>Made to Order</h2>
          </div>
        </div>
      </GridBlock>

      {/* ZONE 3 — Sketch + two stats */}
      <GridBlock href={LINKS.shop} spanClass="col-span-2 row-span-2" style={R2} accent="bronze">
        <div className="relative overflow-hidden h-full" style={R2}>
          <img src={PHOTOS.sketch} alt="Dowel Side Table Sketch" className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-65 transition-opacity duration-200" />
          <div className="relative z-10 flex flex-col justify-end p-12 h-full">
            <div className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: DIM }}>Process</div>
            <h2 className="font-light leading-tight" style={{ ...FS_LG, color: LINEN }}>
              Designed from<br />first principles
            </h2>
          </div>
        </div>
      </GridBlock>

      <GridBlock href={LINKS.shop} spanClass="col-span-1" className="p-10 flex flex-col justify-between" style={R1} accent="mint" tag="Ships within">
        <div className="pt-6">
          <div className="font-light leading-none flex items-baseline gap-2">
            <span style={{ ...FS_STAT, color: MINT }}>2</span>
            <span className="text-2xl font-light" style={{ color: DIM }}>wks</span>
          </div>
          <div className="text-xs tracking-[0.15em] uppercase mt-2 mb-5" style={{ color: DIM }}>Most orders</div>
          <DotMatrix pattern={PATTERNS.barChart} color={MINT} dotRadius={2.5} gap={8} className="w-24 h-16" />
        </div>
        <div className="text-xs leading-relaxed" style={{ color: DIM }}>
          Individual product pages list specific timelines.
        </div>
      </GridBlock>

      <GridBlock href={LINKS.email} spanClass="col-span-1" className="p-10 flex flex-col justify-between" style={R1} accent="bronze" tag="Custom Orders">
        <div className="pt-6">
          <h2 className="font-light leading-tight mb-5" style={{ ...FS_MD, color: LINEN }}>
            Custom &amp;<br />Personalized
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: DIM }}>
            Need something specific? We accept custom orders. Each one handled with care.
          </p>
        </div>
        <div className="text-xs tracking-[0.18em] uppercase" style={{ color: BRONZE }}>
          hello@batchmade.studio →
        </div>
      </GridBlock>

      {/* ZONE 4 — Process banner */}
      <GridBlock
        className="col-span-3 px-10 flex items-center justify-between overflow-hidden"
        style={{ minHeight: 'clamp(80px, 10vw, 130px)' }}
        tag="02 — Process"
        id="process"
      >
        <div className="font-light" style={{ fontSize: 'clamp(1.4rem, 3vw, 3rem)', letterSpacing: '-0.02em', color: DIM }}>
          Design&ensp;|&ensp;Make&ensp;|&ensp;Ship&ensp;|&ensp;Enjoy
        </div>
        <DotMatrix pattern={PATTERNS.arrowRight} color={CHOCOLATE} dotRadius={3} gap={10} className="w-16 h-10 flex-shrink-0 ml-6 opacity-60" />
      </GridBlock>

      {/* ZONE 5 — Product grid */}
      {([
        { src: PHOTOS.pod1, label: 'Magnetic Pod' },
        { src: PHOTOS.pod2, label: 'Digital Files' },
        { src: PHOTOS.pod3, label: 'Handmade' },
      ] as const).map(({ src, label }) => (
        <GridBlock key={label} href={LINKS.shop} spanClass="col-span-1" style={R1} accent="none">
          <div className="relative overflow-hidden h-full" style={R1}>
            <img src={src} alt={label} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity duration-200" />
            <div className="relative z-10 flex flex-col justify-end p-8 h-full">
              <div className="text-xs tracking-[0.15em] uppercase" style={{ color: `${LINEN}99` }}>{label}</div>
            </div>
          </div>
        </GridBlock>
      ))}

      {/* ZONE 6 — Brand sidebar + About */}
      <GridBlock className="col-span-1 row-span-2 flex flex-col items-center justify-around p-10" style={R2} accent="none">
        <LogoImage size="xl" />
        <div className="w-full h-px" style={DIVIDER} />
        <DotMatrix pattern={PATTERNS.cncBit} color={CHOCOLATE} dotRadius={3} gap={9} className="w-32 h-32 opacity-60" />
      </GridBlock>

      <GridBlock className="col-span-2 row-span-2 p-12 flex flex-col justify-between" style={R2} accent="none" tag="03 — About" id="about">
        <div className="pt-6">
          <h2 className="font-light leading-tight mb-8" style={{ ...FS_LG, color: LINEN }}>Small Studio</h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <p className="text-sm leading-relaxed" style={{ color: DIM }}>
              Batch is a small studio. All products are truly handmade by humans, one at a time, and only when you order them.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: DIM }}>
              No overstock, no waste, no shortcuts. Every piece gets our full attention from start to finish. Based in Cary, North Carolina.
            </p>
          </div>
        </div>
        <div className="flex gap-10 pt-8 mt-8" style={{ borderTop: GRID_BORDER }}>
          {([
            { label: 'Production', value: 'Made-to-order', color: BRONZE },
            { label: 'Materials', value: 'Thoughtfully sourced', color: MINT },
            { label: 'Packaging', value: 'Minimal waste', color: CHOCOLATE },
          ] as const).map(({ label, value, color }) => (
            <div key={label}>
              <div className="text-xs uppercase tracking-wider mb-1" style={{ color: DIM }}>{label}</div>
              <div className="text-sm font-light" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      </GridBlock>

      {/* ZONE 7 — Community / Contact strip */}
      <GridBlock
        className="col-span-3 flex items-stretch overflow-hidden"
        style={{ minHeight: 'clamp(180px, 20vw, 260px)' }}
        tag="04 — Community"
        id="contact"
      >
        <div
          className="flex flex-col justify-center px-10 py-8 flex-shrink-0"
          style={{ width: 'clamp(200px, 22vw, 300px)', borderRight: GRID_BORDER }}
        >
          <h2 className="font-light leading-tight mb-3" style={{ ...FS_MD, color: LINEN }}>Research Lab</h2>
          <p className="text-xs leading-relaxed" style={{ color: DIM }}>
            Follow the process, experiments, and new work as it happens.
          </p>
        </div>
        <div className="flex flex-1 items-stretch">
          {([
            { handle: '@batch_research_lab', href: LINKS.instagram, label: 'Instagram' },
            { handle: '@batchresearchlab', href: LINKS.youtube, label: 'YouTube' },
            { handle: 'hello@batchmade.studio', href: LINKS.email, label: 'Email' },
          ] as const).map(({ handle, href, label }, i) => (
            <div
              key={label}
              className="flex-1 px-8 flex flex-col justify-center"
              style={i < 2 ? { borderRight: GRID_BORDER } : undefined}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: DIM }}>{label}</div>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light transition-colors duration-75"
                style={{ color: `${LINEN}66` }}
                onMouseEnter={e => (e.currentTarget.style.color = SAFFRON)}
                onMouseLeave={e => (e.currentTarget.style.color = `${LINEN}66`)}
              >
                {handle}
              </a>
            </div>
          ))}
        </div>
      </GridBlock>

      {/* ZONE 8 — Final CTA */}
      <GridBlock className="col-span-3 overflow-hidden" style={R2} accent="bronze" tag="Shop">
        <div className="flex h-full" style={{ minHeight: 'inherit' }}>
          <div className="flex-[2] flex flex-col justify-between px-12 md:px-16 pt-20 pb-14">
            <div>
              <h2
                className="font-light leading-none mb-8"
                style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', letterSpacing: '-0.045em', color: LINEN }}
              >
                Order Something<br />Handmade
              </h2>
              <p className="text-base font-light max-w-lg leading-relaxed" style={{ color: DIM }}>
                Everything on batchmade.studio is made by hand, one at a time, only when you order it.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href={LINKS.shop}
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-75"
                style={{ background: BRONZE, color: LINEN }}
                onMouseEnter={e => (e.currentTarget.style.background = SAFFRON)}
                onMouseLeave={e => (e.currentTarget.style.background = BRONZE)}
              >
                Visit the Shop
              </a>
              <a
                href={LINKS.email}
                className="px-12 py-4 text-xs tracking-[0.2em] uppercase border border-dashed transition-all duration-75"
                style={{ borderColor: BRONZE, color: BRONZE }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = BRONZE
                  e.currentTarget.style.color = LINEN
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = BRONZE
                }}
              >
                Custom Order
              </a>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden" style={{ borderLeft: GRID_BORDER }}>
            <img src={PHOTOS.pod4} alt="Batch product" className="absolute inset-0 w-full h-full object-cover opacity-55" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(34,31,29,0.7), transparent)' }} />
          </div>
        </div>
      </GridBlock>

    </div>
  )
}
