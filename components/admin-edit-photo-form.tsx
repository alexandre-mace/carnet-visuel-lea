"use client"

import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { editPhoto } from "@/app/admin/actions"
import { FormSubmitButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Photo } from "@/lib/photos"

const schema = z.object({
  alt: z.string().min(1, "Titre requis"),
  location: z.string().optional(),
  camera: z.string().optional(),
  lens: z.string().optional(),
  focalLength: z.string().optional(),
  aperture: z.string().optional(),
  shutter: z.string().optional(),
  iso: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function AdminEditPhotoForm({ photo }: { photo: Photo }) {
  const [open, setOpen] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)
  const submittingRef = useRef(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      alt: photo.alt,
      location: photo.location ?? "",
      camera: photo.camera ?? "",
      lens: photo.lens ?? "",
      focalLength: photo.focalLength ?? "",
      aperture: photo.aperture ?? "",
      shutter: photo.shutter ?? "",
      iso: photo.iso ?? "",
    },
    mode: "onChange",
  })

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-white/60 hover:text-white cursor-pointer"
      >
        Modifier
      </button>
    )
  }

  const submitValidated = form.handleSubmit(() => {
    submittingRef.current = true
    formRef.current?.requestSubmit()
  })

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <Form {...form}>
        <form
          ref={formRef}
          action={async (formData) => {
            await editPhoto(formData)
            setOpen(false)
          }}
          onSubmitCapture={(e) => {
            if (submittingRef.current) {
              submittingRef.current = false
              return
            }
            e.preventDefault()
            submitValidated()
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          <input type="hidden" name="id" value={photo.id} />
          <FormField control={form.control} name="alt" render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Titre / alt</FormLabel>
              <FormControl><Input placeholder="Titre/alt" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu</FormLabel>
              <FormControl><Input placeholder="Lieu" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="camera" render={({ field }) => (
            <FormItem>
              <FormLabel>Appareil</FormLabel>
              <FormControl><Input placeholder="Appareil" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="lens" render={({ field }) => (
            <FormItem>
              <FormLabel>Objectif</FormLabel>
              <FormControl><Input placeholder="Objectif" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="focalLength" render={({ field }) => (
            <FormItem>
              <FormLabel>Focale</FormLabel>
              <FormControl><Input placeholder="ex: 35mm" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="aperture" render={({ field }) => (
            <FormItem>
              <FormLabel>Ouverture</FormLabel>
              <FormControl><Input placeholder="ex: f/2" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="shutter" render={({ field }) => (
            <FormItem>
              <FormLabel>Vitesse</FormLabel>
              <FormControl><Input placeholder="ex: 1/125s" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="iso" render={({ field }) => (
            <FormItem>
              <FormLabel>ISO</FormLabel>
              <FormControl><Input placeholder="ex: 400" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <div className="sm:col-span-2 flex items-center gap-2">
            <FormSubmitButton>Enregistrer</FormSubmitButton>
            <button
              type="button"
              onClick={() => { form.reset(); setOpen(false) }}
              className="text-xs text-white/60 hover:text-white cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}
