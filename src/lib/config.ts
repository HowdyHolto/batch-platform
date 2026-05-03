// All media is served from Cloudflare R2 bucket: batch-web-bulk
// Bucket: pub-fc99d0d4ba6a43348a5f3ea7fccc705b.r2.dev
// Future: swap VITE_R2_PUBLIC_URL for a custom domain (e.g. media.batchmade.studio)
const R2 = import.meta.env.VITE_R2_PUBLIC_URL
const SQ = 'https://images.squarespace-cdn.com/content/v1/6491c4a356e427689408a4a4'

const r2 = (path: string) => R2 ? `${R2}/${path}` : null

// Homepage hero images
export const PHOTOS = {
  pod1:   r2('products/magnetic-pod/pod-01.jpg')   ?? `${SQ}/a877da42-dfa1-4b8a-9696-9f611f082191/DSC08393-Enhanced-NR.jpg`,
  pod2:   r2('products/magnetic-pod/pod-02.jpg')   ?? `${SQ}/3534d676-f749-4cf1-a4fc-3ee4a733da73/DSC08432-Enhanced-NR.jpg`,
  pod3:   r2('products/magnetic-pod/pod-03.jpg')   ?? `${SQ}/ffe7d0bd-522a-4a63-980d-cc2ecca1f7ca/DSC08458-Enhanced-NR.jpg`,
  pod4:   r2('products/magnetic-pod/pod-04.jpg')   ?? `${SQ}/9268dc7d-a01e-4b53-8d21-13bb0ba41c72/DSC09837-Enhanced-NR.jpg`,
  pod5:   r2('products/magnetic-pod/pod-05.jpg')   ?? `${SQ}/04070da9-3252-4b07-9b89-2848a5d2fc52/DSC08572-Enhanced-NR.jpg`,
  pod6:   r2('products/magnetic-pod/pod-06.jpg')   ?? `${SQ}/cf12af3a-f214-42a3-b5c8-deb6df836351/DSC08385-Enhanced-NR.jpg`,
  sketch: r2('products/general/dowel-side-table-sketch.jpg') ?? `${SQ}/1728468672260-O6IHK7XE9MG71XGCPQVW/Dowel+Side+Table+Sketch.jpeg`,
}

// Typed helper so any feature can resolve an R2 path with Squarespace fallback
export const cdnUrl = (r2Path: string, squarespacePath?: string): string =>
  R2 ? `${R2}/${r2Path}` : squarespacePath ?? `${R2}/${r2Path}`

// External links — one place to update if URLs change
export const LINKS = {
  shop: 'https://www.batchmade.studio',
  instagram: 'https://www.instagram.com/batch_research_lab',
  youtube: 'https://www.youtube.com/@batchresearchlab',
  email: 'mailto:hello@batchmade.studio',
}
