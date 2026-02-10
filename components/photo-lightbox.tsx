"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import type { Photo } from "@/lib/photos"

export function PhotoLightbox({ photo }: { photo: Photo }) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, close])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-pointer overflow-hidden bg-neutral-900/60 ring-1 ring-white/10"
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={1200}
          height={800}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-auto max-h-[80vh] object-cover"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl cursor-pointer z-10"
            aria-label="Fermer"
          >
            &times;
          </button>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={2400}
            height={1600}
            sizes="100vw"
            className="max-h-[95vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
