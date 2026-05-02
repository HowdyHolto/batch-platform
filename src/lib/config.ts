// All media is served from Cloudflare R2.
// Set VITE_R2_PUBLIC_URL in your .env once the bucket has a public domain.
// Until then, falls back to Squarespace CDN (temporary).
const R2 = import.meta.env.VITE_R2_PUBLIC_URL
const SQ = 'https://images.squarespace-cdn.com/content/v1/6491c4a356e427689408a4a4'
const CDN = R2 || SQ

// When images are uploaded to R2, update the filenames below.
// R2 key format: /images/<filename>
export const PHOTOS = {
  pod1: R2 ? `${CDN}/images/pod1.jpg` : `${SQ}/a877da42-dfa1-4b8a-9696-9f611f082191/DSC08393-Enhanced-NR.jpg`,
  pod2: R2 ? `${CDN}/images/pod2.jpg` : `${SQ}/3534d676-f749-4cf1-a4fc-3ee4a733da73/DSC08432-Enhanced-NR.jpg`,
  pod3: R2 ? `${CDN}/images/pod3.jpg` : `${SQ}/ffe7d0bd-522a-4a63-980d-cc2ecca1f7ca/DSC08458-Enhanced-NR.jpg`,
  pod4: R2 ? `${CDN}/images/pod4.jpg` : `${SQ}/9268dc7d-a01e-4b53-8d21-13bb0ba41c72/DSC09837-Enhanced-NR.jpg`,
  pod5: R2 ? `${CDN}/images/pod5.jpg` : `${SQ}/04070da9-3252-4b07-9b89-2848a5d2fc52/DSC08572-Enhanced-NR.jpg`,
  pod6: R2 ? `${CDN}/images/pod6.jpg` : `${SQ}/cf12af3a-f214-42a3-b5c8-deb6df836351/DSC08385-Enhanced-NR.jpg`,
  sketch: R2 ? `${CDN}/images/sketch.jpg` : `${SQ}/1728468672260-O6IHK7XE9MG71XGCPQVW/Dowel+Side+Table+Sketch.jpeg`,
}

// External links — one place to update if URLs change
export const LINKS = {
  shop: 'https://www.batchmade.studio',
  instagram: 'https://www.instagram.com/batch_research_lab',
  youtube: 'https://www.youtube.com/@batchresearchlab',
  email: 'mailto:hello@batchmade.studio',
}
