"use client"

import { useEffect, useRef } from "react"
import { useActionState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginWithPasswordState } from "@/app/admin/actions"
import { FormSubmitButton } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from "next/navigation"

const schema = z.object({
  password: z.string().min(1, "Mot de passe requis"),
})

type FormValues = z.infer<typeof schema>

export function AdminLoginForm() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const submittingRef = useRef(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
    mode: "onChange",
  })

  const [state, formAction] = useActionState(loginWithPasswordState, undefined as
    | { success: true }
    | { success: false; error: string }
    | undefined)

  useEffect(() => {
    if (state && "success" in state && state.success) {
      router.replace("/admin")
    }
  }, [state, router])

  const submitValidated = form.handleSubmit(() => {
    submittingRef.current = true
    formRef.current?.requestSubmit()
  })

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmitCapture={(e) => {
          if (submittingRef.current) {
            submittingRef.current = false
            return
          }
          e.preventDefault()
          submitValidated()
        }}
        className="w-full max-w-sm space-y-3"
      >
        <h1 className="text-lg font-medium">Admin – Connexion</h1>
        <p className="text-white/60 text-sm">Entrez le mot de passe admin.</p>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mot de passe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormSubmitButton className="w-full">Se connecter</FormSubmitButton>
        {state && "success" in state && !state.success && (
          <div className="text-xs text-red-400" role="alert">{state.error}</div>
        )}
        <p className="text-xs text-white/50">
          Définissez la variable d&apos;env ADMIN_PASSWORD sur Vercel.
        </p>
      </form>
    </Form>
  )
}
