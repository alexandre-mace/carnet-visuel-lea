import { cookies } from "next/headers"
import { logout } from "./actions"
import { getPhotosFromBlob } from "@/lib/blob-store"
import { AdminAddPhotoForm } from "@/components/admin-add-photo-form"
import { AdminLoginForm } from "@/components/admin-login-form"
import { AdminDeleteForm } from "@/components/admin-delete-form"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminPage() {
  const isAuthed = (await cookies()).get("admin_session")?.value === "true"

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <AdminLoginForm />
      </div>
    )
  }

  const list = (await getPhotosFromBlob()) ?? []
  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      <header className="mx-auto max-w-3xl flex items-center justify-between">
        <div>
          <h1 className="text-base font-medium">Admin – Carnet visuel</h1>
          <p className="text-xs text-white/60">Gestion des photos et réglages</p>
        </div>
        <form action={logout}>
          <button className="text-xs text-white/70 hover:text-white cursor-pointer">Se déconnecter</button>
        </form>
      </header>

      <main className="mx-auto max-w-3xl mt-6 space-y-6">
        <section className="border border-white/10 p-3">
          <h2 className="text-sm font-medium mb-3">Ajouter une photo</h2>
          <AdminAddPhotoForm />
        </section>

        <section>
          <h2 className="text-sm font-medium">Photos</h2>
          <ul className="mt-3 divide-y divide-white/10 border border-white/10">
            {list.map((p) => (
              <li key={p.id} className="p-3">
                <div className="flex items-start gap-3">
                  <img src={p.src} alt="" className="w-16 h-16 object-cover flex-none" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">{p.alt}</div>
                    <div className="text-xs text-white/60">{p.location}</div>
                    <div className="text-xs text-white/50">
                      {[p.focalLength, p.aperture, p.shutter, p.iso && `ISO ${p.iso}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                  <AdminDeleteForm id={p.id} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
