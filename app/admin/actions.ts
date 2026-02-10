"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getPhotosFromBlob, savePhotosToBlob, uploadImageToBlob, deleteImageFromBlob, setLocalPhotosCache } from "@/lib/blob-store"
import type { Photo } from "@/lib/photos"
import { randomUUID, timingSafeEqual } from "node:crypto"

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

async function requireAuth() {
  const isAuthed = (await cookies()).get("admin_session")?.value === "true"
  if (!isAuthed) throw new Error("Non autorisé")
}

export async function loginWithPasswordState(
  _prev: { success: true } | { success: false; error: string } | undefined,
  formData: FormData
) {
  const pwd = formData.get("password")?.toString() || ""
  const expected = process.env.ADMIN_PASSWORD || ""
  if (!expected) {
    return { success: false as const, error: "ADMIN_PASSWORD non configuré" }
  }
  if (!safeEqual(pwd, expected)) {
    return { success: false as const, error: "Mot de passe incorrect" }
  }
  ;(await cookies()).set("admin_session", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return { success: true as const }
}

export async function logout() {
  ;(await cookies()).delete("admin_session")
  redirect("/admin")
}

export async function addPhoto(formData: FormData) {
  await requireAuth()
  const file = formData.get("file") as File | null
  const alt = formData.get("alt")?.toString() || ""
  const location = formData.get("location")?.toString() || ""
  const camera = formData.get("camera")?.toString() || ""
  const lens = formData.get("lens")?.toString() || ""
  const focalLength = formData.get("focalLength")?.toString() || ""
  const aperture = formData.get("aperture")?.toString() || ""
  const shutter = formData.get("shutter")?.toString() || ""
  const iso = formData.get("iso")?.toString() || ""
  if (!file) {
    throw new Error("Fichier image manquant")
  }
  const src = await uploadImageToBlob(file)
  const current = (await getPhotosFromBlob()) ?? (await import("@/lib/photos")).photos
  const newPhoto: Photo = {
    id: randomUUID(),
    src,
    alt,
    ...(location && { location }),
    ...(camera && { camera }),
    ...(lens && { lens }),
    ...(focalLength && { focalLength }),
    ...(aperture && { aperture }),
    ...(shutter && { shutter }),
    ...(iso && { iso }),
  }
  const next = [newPhoto, ...current]
  await savePhotosToBlob(next)
  setLocalPhotosCache(next)
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/api/photos")
  redirect("/admin")
}

export async function editPhoto(formData: FormData) {
  await requireAuth()
  const id = formData.get("id")?.toString()
  if (!id) throw new Error("id manquant")
  const alt = formData.get("alt")?.toString() || ""
  const location = formData.get("location")?.toString() || ""
  const camera = formData.get("camera")?.toString() || ""
  const lens = formData.get("lens")?.toString() || ""
  const focalLength = formData.get("focalLength")?.toString() || ""
  const aperture = formData.get("aperture")?.toString() || ""
  const shutter = formData.get("shutter")?.toString() || ""
  const iso = formData.get("iso")?.toString() || ""
  const current = (await getPhotosFromBlob()) ?? []
  const next = current.map((p) =>
    p.id !== id
      ? p
      : {
          ...p,
          alt,
          location: location || undefined,
          camera: camera || undefined,
          lens: lens || undefined,
          focalLength: focalLength || undefined,
          aperture: aperture || undefined,
          shutter: shutter || undefined,
          iso: iso || undefined,
        }
  )
  await savePhotosToBlob(next)
  setLocalPhotosCache(next)
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/api/photos")
}

export async function deletePhoto(formData: FormData) {
  await requireAuth()
  const id = formData.get("id")?.toString()
  if (!id) throw new Error("id manquant")
  const current = (await getPhotosFromBlob()) ?? []
  const photo = current.find((p) => p.id === id)
  const next = current.filter((p) => p.id !== id)
  await savePhotosToBlob(next)
  if (photo) await deleteImageFromBlob(photo.src)
  setLocalPhotosCache(next)
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/api/photos")
  redirect("/admin")
}
