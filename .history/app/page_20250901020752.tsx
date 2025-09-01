import { PhotoCard } from "@/components/photo-card";
import { photos as fallback, type Photo } from "@/lib/photos";
import { getPhotosFromBlob } from "@/lib/blob-store";

export const revalidate = 0
export const dynamic = "force-dynamic"

export default async function Home() {
  const fromBlob = await getPhotosFromBlob()
  const photos: Photo[] = fromBlob ?? fallback
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-10 bg-black/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-1 sm:py-1.5">
          <h1 className="text-sm sm:text-base font-medium tracking-tight">Carnet visuel</h1>
          <p className="text-[11px] text-white/60">Journal photographique — images en grand et réglages.</p>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
        <div className="columns-1 md:columns-2 [column-gap:1.5rem] [column-fill:balance] [orphans:1] [widows:1]">
          {photos.map((p) => (
            <div key={p.id} className="mb-6 break-inside-avoid">
              <PhotoCard photo={p} />
            </div>
          ))}
        </div>
      </main>
      
    </div>
  );
}
