"use client"

import { cn } from "@/lib/utils"
import type { Photo } from "@/lib/photos"

type Props = {
  photo: Photo
  className?: string
}

export function PhotoCard({ photo, className }: Props) {
  return (
    <article className={cn("w-full break-inside-avoid", className)}>
      <div className="overflow-hidden bg-neutral-900/60 ring-1 ring-white/10">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="px-1.5 sm:px-0">
        <h3 className="mt-3 text-base font-medium text-white/95">{photo.alt}</h3>
        <div className="mt-2 text-sm text-white/65">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {photo.location && (
              <span className="inline-flex items-center">{photo.location}</span>
            )}
            {photo.camera && (
              <span className="inline-flex items-center">{photo.camera}</span>
            )}
            {photo.lens && (
              <span className="inline-flex items-center">{photo.lens}</span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-white/55">
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
