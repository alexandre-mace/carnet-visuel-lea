"use client"

import { deletePhoto } from "@/app/admin/actions"
import { FormSubmitButton } from "@/components/ui/button"

export function AdminDeleteForm({ id }: { id: string }) {
  return (
    <form action={deletePhoto} className="ml-auto inline-flex">
      <input type="hidden" name="id" value={id} />
      <FormSubmitButton variant="ghost" size="sm" className="text-xs text-white/60 hover:text-white">
        Supprimer
      </FormSubmitButton>
    </form>
  )
}

