import { NextResponse } from "next/server"
import { photos as fallback } from "@/lib/photos"
import { getPhotosFromBlob } from "@/lib/blob-store"

export async function GET() {
  const fromBlob = await getPhotosFromBlob()
  const data = fromBlob ?? fallback
  return NextResponse.json({ photos: data })
}
