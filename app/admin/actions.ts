"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getPhotosFromBlob, savePhotosToBlob, uploadImageToBlob, setLocalPhotosCache } from "@/lib/blob-store"
import type { Photo } from "@/lib/photos"
import { randomUUID } from "node:crypto"

async function requireAuth() {
  const isAuthed = (await cookies()).get("admin_session")?.value === "true"
  if (!isAuthed) throw new Error("Non autorisé")
}

export async function loginWithPassword(formData: FormData) {
  const pwd = formData.get("password")?.toString() || ""
  const expected = process.env.ADMIN_PASSWORD || ""
  if (!expected) {
    throw new Error("ADMIN_PASSWORD non configuré")
  }
  if (pwd !== expected) {
    throw new Error("Mot de passe incorrect")
  }
  (await cookies()).set("admin_session", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  })
  redirect("/admin")
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
  if (pwd !== expected) {
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
    location,
    camera,
    lens,
    focalLength,
    aperture,
    shutter,
    iso,
  }
  const next = [newPhoto, ...current]
  await savePhotosToBlob(next)
  setLocalPhotosCache(next)
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/api/photos")
  redirect("/admin")
}

export async function deletePhoto(formData: FormData) {
  await requireAuth()
  const id = formData.get("id")?.toString()
  if (!id) throw new Error("id manquant")
  const current = (await getPhotosFromBlob()) ?? []
  const next = current.filter((p) => p.id !== id)
  await savePhotosToBlob(next)
  setLocalPhotosCache(next)
  revalidatePath("/")
  revalidatePath("/admin")
  revalidatePath("/api/photos")
  redirect("/admin")
}
