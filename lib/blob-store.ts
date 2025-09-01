import { list, put } from "@vercel/blob"
import { randomUUID } from "node:crypto"
import type { Photo } from "@/lib/photos"

const JSON_KEY = "photos/photos.json"

export async function getPhotosFromBlob(): Promise<Photo[] | null> {
  try {
    const { blobs } = await list({ prefix: "photos/" })
    const entry = blobs.find((b) => b.pathname === JSON_KEY)
    if (!entry) return null
    const res = await fetch(entry.url, { cache: "no-store" })
    if (!res.ok) return null
    const data = (await res.json()) as { photos: Photo[] } | Photo[]
    return Array.isArray(data) ? data : data.photos
  } catch {
    return null
  }
}

export async function savePhotosToBlob(photos: Photo[]) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  await put(JSON_KEY, JSON.stringify({ photos }), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    token,
  })
}

export async function uploadImageToBlob(file: File) {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  const ext = file.type.includes("png") ? "png" : file.type.includes("webp") ? "webp" : "jpg"
  const key = `photos/images/${randomUUID()}.${ext}`
  const res = await put(key, file, { access: "public", token })
  return res.url
}
