import { cookies } from "next/headers"
import { loginWithPassword, logout, addPhoto, deletePhoto } from "./actions"
import { getPhotosFromBlob } from "@/lib/blob-store"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const isAuthed = (await cookies()).get("admin_session")?.value === "true"

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <form action={loginWithPassword} className="w-full max-w-sm space-y-3">
          <h1 className="text-lg font-medium">Admin – Connexion</h1>
          <p className="text-white/60 text-sm">Entrez le mot de passe admin.</p>
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            className="w-full bg-black text-white border border-white/20 rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-black px-3 py-2 font-medium"
          >
            Se connecter
          </button>
          <p className="text-xs text-white/50">
            Définissez la variable d&apos;env ADMIN_PASSWORD sur Vercel.
          </p>
        </form>
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
          <button className="text-xs text-white/70 hover:text-white">Se déconnecter</button>
        </form>
      </header>

      <main className="mx-auto max-w-3xl mt-6 space-y-6">
        <section className="border border-white/10 p-3">
          <h2 className="text-sm font-medium mb-3">Ajouter une photo</h2>
          <form action={addPhoto} className="grid grid-cols-1 sm:grid-cols-2 gap-3" encType="multipart/form-data">
            <div className="sm:col-span-2">
              <input type="file" name="file" accept="image/*" required className="block w-full text-xs file:bg-white file:text-black file:px-2 file:py-1 file:mr-2" />
            </div>
            <input name="alt" placeholder="Titre/alt" className="bg-black border border-white/20 px-2 py-1 text-sm" />
            <input name="location" placeholder="Lieu" className="bg-black border border-white/20 px-2 py-1 text-sm" />
            <input name="camera" placeholder="Appareil" className="bg-black border border-white/20 px-2 py-1 text-sm" />
            <input name="lens" placeholder="Objectif" className="bg-black border border-white/20 px-2 py-1 text-sm" />
            <input name="focalLength" placeholder="Focale (ex: 35mm)" className="bg-black border border-white/20 px-2 py-1 text-sm" />
            <input name="aperture" placeholder="Ouverture (ex: f/2)" className="bg-black border border-white/20 px-2 py-1 text-sm" />
            <input name="shutter" placeholder="Vitesse (ex: 1/125s)" className="bg-black border border-white/20 px-2 py-1 text-sm" />
            <input name="iso" placeholder="ISO (ex: 400)" className="bg-black border border-white/20 px-2 py-1 text-sm" />
            <div className="sm:col-span-2">
              <button type="submit" className="bg-white text-black px-3 py-1.5 text-sm">Ajouter</button>
            </div>
          </form>
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
                  <form action={deletePhoto} className="ml-auto">
                    <input type="hidden" name="id" value={p.id} />
                    <button className="text-xs text-white/60 hover:text-white">Supprimer</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
