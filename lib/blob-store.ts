import { list, put } from "@vercel/blob"
import { randomUUID } from "node:crypto"
import type { Photo } from "@/lib/photos"

const JSON_KEY = "photos/photos.json"

// Local, per-instance hot cache to mitigate eventual consistency of Blob/CDN.
let localPhotosCache: { photos: Photo[]; ts: number } | null = null

export function setLocalPhotosCache(photos: Photo[]) {
  localPhotosCache = { photos, ts: Date.now() }
}

export async function getPhotosFromBlob(): Promise<Photo[] | null> {
  try {
    // Serve from recent local cache first (useful right after writes)
    if (localPhotosCache && Date.now() - localPhotosCache.ts < 60_000) {
      return localPhotosCache.photos
    }
    const token = process.env.BLOB_READ_WRITE_TOKEN
    const { blobs } = await list({ prefix: "photos/", token })
    const entry = blobs.find((b) => b.pathname === JSON_KEY)
    if (!entry) return null
    const base = (entry as any).downloadUrl ?? entry.url
    const url = `${base}${base.includes("?") ? "&" : "?"}v=${Date.now()}`
    const res = await fetch(url, {
      cache: "no-store",
      // Help bust CDN caches if any
      headers: { "cache-control": "no-cache" } as any,
      next: { revalidate: 0 } as any,
    })
    if (!res.ok) return null
    const data = (await res.json()) as { photos: Photo[] } | Photo[]
    return Array.isArray(data) ? data : data.photos
  } catch {
    return null
  }
}

export async function savePhotosToBlob(photos: Photo[]) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN non configuré – ajoutez-le à vos variables d'environnement")
  }
  await put(JSON_KEY, JSON.stringify({ photos }), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    cacheControlMaxAge: 0,
    token,
  })
}

export async function uploadImageToBlob(file: File) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN non configuré – ajoutez-le à vos variables d'environnement")
  }
  const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg"
  const key = `photos/images/${randomUUID()}.${ext}`
  const res = await put(key, file, { access: "public", token })
  return res.url
}
