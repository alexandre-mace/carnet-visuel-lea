"use client"

import { useState } from "react"
import { deletePhoto } from "@/app/admin/actions"
import { FormSubmitButton } from "@/components/ui/button"

export function AdminDeleteForm({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="ml-auto text-xs text-white/60 hover:text-white cursor-pointer"
      >
        Supprimer
      </button>
    )
  }

  return (
    <div className="ml-auto flex items-center gap-2">
      <form action={deletePhoto} className="inline-flex">
        <input type="hidden" name="id" value={id} />
        <FormSubmitButton variant="ghost" size="sm" className="text-xs text-red-400 hover:text-red-300">
          Confirmer
        </FormSubmitButton>
      </form>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-xs text-white/60 hover:text-white cursor-pointer"
      >
        Annuler
      </button>
    </div>
  )
}
