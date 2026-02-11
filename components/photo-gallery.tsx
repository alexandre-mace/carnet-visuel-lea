"use client"

import { useState } from "react"
import Image from "next/image"
import type { Photo } from "@/lib/photos"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

function PhotoMeta({ photo }: { photo: Photo }) {
  return (
    <div className="px-1.5 sm:px-0">
      <h3 className="mt-2 text-base font-medium text-white/95">{photo.alt}</h3>
      <div className="mt-0.5 text-base text-white/65">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {photo.location && <span>{photo.location}</span>}
          {photo.camera && <span className="font-mono">{photo.camera}</span>}
          {photo.lens && <span className="font-mono">{photo.lens}</span>}
        </div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-white/55">
          {photo.focalLength && <span>{photo.focalLength}</span>}
          {photo.aperture && <span>{photo.aperture}</span>}
          {photo.shutter && <span>{photo.shutter}</span>}
          {photo.iso && <span>ISO {photo.iso}</span>}
        </div>
      </div>
    </div>
  )
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selectedPhoto = photos.find((p) => p.id === selectedId)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <article key={photo.id}>
            <div
              onClick={() => setSelectedId(photo.id)}
              className="cursor-pointer overflow-hidden bg-neutral-900/60 ring-1 ring-white/10
                         hover:ring-white/25 transition-[box-shadow]"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="w-full h-auto max-h-[80vh] object-cover"
              />
            </div>
            <PhotoMeta photo={photo} />
          </article>
        ))}
      </div>

      <Dialog open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null) }}>
        <DialogContent
          className="bg-transparent border-none shadow-none p-0 gap-0
                     max-w-[95vw] sm:max-w-[95vw] max-h-[95dvh] w-fit
                     data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100"
        >
          <DialogTitle className="sr-only">
            {selectedPhoto?.alt ?? "Photo"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {[selectedPhoto?.location, selectedPhoto?.camera].filter(Boolean).join(" — ")}
          </DialogDescription>
          {selectedPhoto && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="h-auto w-auto max-h-[95dvh] max-w-[95vw]"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
