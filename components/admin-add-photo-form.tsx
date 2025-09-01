"use client"

import { useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addPhoto } from "@/app/admin/actions"
import { FormSubmitButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const MAX_BYTES = 2 * 1024 * 1024 // 2 MB

const schema = z.object({
  file: z
    .instanceof(File, { message: "Fichier requis" })
    .refine((f) => f.size <= MAX_BYTES, "Fichier trop lourd (max 2 MB)")
    .refine((f) => f.type.startsWith("image/"), "Format non supporté"),
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

export function AdminAddPhotoForm() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const submittingRef = useRef(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      alt: "",
      location: "",
      camera: "",
      lens: "",
      focalLength: "",
      aperture: "",
      shutter: "",
      iso: "",
    },
    mode: "onChange",
  })

  const submitValidated = form.handleSubmit(() => {
    submittingRef.current = true
    formRef.current?.requestSubmit()
  })

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={addPhoto}
        onSubmitCapture={(e) => {
          if (submittingRef.current) {
            submittingRef.current = false
            return
          }
          e.preventDefault()
          submitValidated()
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Fichier image</FormLabel>
              <FormControl>
                <Input
                  name={field.name}
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                />
              </FormControl>
              <div className="mt-1 text-[11px] text-white/60">Taille max: 2 MB</div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre / alt</FormLabel>
              <FormControl>
                <Input placeholder="Titre/alt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>Lieu</FormLabel>
            <FormControl>
              <Input placeholder="Lieu" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="camera" render={({ field }) => (
          <FormItem>
            <FormLabel>Appareil</FormLabel>
            <FormControl>
              <Input placeholder="Appareil" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="lens" render={({ field }) => (
          <FormItem>
            <FormLabel>Objectif</FormLabel>
            <FormControl>
              <Input placeholder="Objectif" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="focalLength" render={({ field }) => (
          <FormItem>
            <FormLabel>Focale</FormLabel>
            <FormControl>
              <Input placeholder="Focale (ex: 35mm)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="aperture" render={({ field }) => (
          <FormItem>
            <FormLabel>Ouverture</FormLabel>
            <FormControl>
              <Input placeholder="Ouverture (ex: f/2)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="shutter" render={({ field }) => (
          <FormItem>
            <FormLabel>Vitesse</FormLabel>
            <FormControl>
              <Input placeholder="Vitesse (ex: 1/125s)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="iso" render={({ field }) => (
          <FormItem>
            <FormLabel>ISO</FormLabel>
            <FormControl>
              <Input placeholder="ISO (ex: 400)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="sm:col-span-2">
          <FormSubmitButton>Ajouter</FormSubmitButton>
        </div>
      </form>
    </Form>
  )
}
