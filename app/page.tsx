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
      <header>
        <div className="mx-auto px-4 py-1 sm:py-1.5">
          <h1 className="text-sm sm:text-base font-medium tracking-tight">Carnet visuel</h1>
          <p className="text-sm text-white/60">Journal photographique — grandes images et réglages.</p>
        </div>
      </header>
      <main className="mx-auto px-4 pt-1.5 pb-6 sm:pt-2 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((p) => (
            <div key={p.id}>
              <PhotoCard photo={p} />
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
