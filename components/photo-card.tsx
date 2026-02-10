import { cn } from "@/lib/utils"
import type { Photo } from "@/lib/photos"
import { PhotoLightbox } from "@/components/photo-lightbox"

type Props = {
  photo: Photo
  className?: string
}

export function PhotoCard({ photo, className }: Props) {
  return (
    <article className={cn("w-full break-inside-avoid", className)}>
      <PhotoLightbox photo={photo} />
      <div className="px-1.5 sm:px-0">
        <h3 className="mt-2 text-base font-medium text-white/95">{photo.alt}</h3>
        <div className="mt-0.5 text-base text-white/65">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {photo.location && (
              <span className="inline-flex items-center">{photo.location}</span>
            )}
            {photo.camera && (
              <span className="inline-flex items-center font-mono">{photo.camera}</span>
            )}
            {photo.lens && (
              <span className="inline-flex items-center font-mono">{photo.lens}</span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-white/55">
            {photo.focalLength && <span>{photo.focalLength}</span>}
            {photo.aperture && <span>{photo.aperture}</span>}
            {photo.shutter && <span>{photo.shutter}</span>}
            {photo.iso && <span>ISO {photo.iso}</span>}
          </div>
        </div>
      </div>
    </article>
  )
}
