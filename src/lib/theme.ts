import { CSSProperties } from 'react'

// Brand palette
export const BRONZE = '#cc5803'
export const CHOCOLATE = '#e2711d'
export const SAFFRON = '#ff9505'
export const MINT = '#87E9B1'
export const LINEN = '#efede6'
export const DIM = '#68625c'
export const BG = '#221f1d'

// Grid chrome
export const GRID_BORDER = '1px dashed rgba(239,237,230,0.08)'
export const DIVIDER: CSSProperties = { background: 'rgba(239,237,230,0.08)' }

// Fluid type scales
export const FS_XL: CSSProperties = { fontSize: 'clamp(3.2rem, 7vw, 6rem)', letterSpacing: '-0.045em' }
export const FS_LG: CSSProperties = { fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', letterSpacing: '-0.04em' }
export const FS_MD: CSSProperties = { fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', letterSpacing: '-0.035em' }
export const FS_STAT: CSSProperties = { fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', letterSpacing: '-0.05em' }

// Grid row heights
export const R1: CSSProperties = { minHeight: 'clamp(260px, 30vw, 380px)' }
export const R2: CSSProperties = { minHeight: 'clamp(520px, 60vw, 760px)' }
