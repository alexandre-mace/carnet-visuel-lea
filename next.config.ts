import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Le quota Hobby est de 5 000 transformations par mois, partagé par tout le compte.
    // Sans borne, chaque image accepte 15 largeurs et toute qualité de 1 à 100.
    // Ces 3 largeurs couvrent les `sizes` du site en 2x (vignette admin 64 px → 128,
    // galerie → 640 et 1200, le grand côté des envois Blob) et sont un sous-ensemble
    // des défauts, donc les variantes déjà en cache resservent.
    imageSizes: [128],
    deviceSizes: [640, 1200],
    qualities: [75],
    // 31 jours, le plafond de cache Vercel pour les images locales (60 s par défaut).
    minimumCacheTTL: 2678400,
    // Seules les photos de secours de `public/photos` passent par l'optimiseur.
    localPatterns: [{ pathname: "/photos/**" }],
    remotePatterns: [
      {
        // Le store Blob de ce projet, pas n'importe quel store Vercel.
        protocol: "https",
        hostname: "rw3zug3z3clvzdxx.public.blob.vercel-storage.com",
        pathname: "/photos/images/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Limit uploads to 2 MB for Server Actions
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
