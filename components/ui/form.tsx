"use client"

import * as React from "react"
import { Controller, FormProvider, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = FormProvider

type FormFieldContextValue = {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = ({ name, ...props }: React.ComponentProps<typeof Controller>) => {
  return (
    <FormFieldContext.Provider value={{ name: name as string }}>
      {/* @ts-expect-error name is provided above */}
      <Controller name={name} {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const { formState, getFieldState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)
  return { id: fieldContext.name, name: fieldContext.name, formItemId: fieldContext.name, ...fieldState }
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-1", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    const { error } = useFormField()
    return <label ref={ref} className={cn("text-sm", error && "text-red-400", className)} {...props} />
  }
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error } = useFormField()
    const body = error ? String(error.message ?? children) : children
    if (!body) return null
    return (
      <p ref={ref} className={cn("text-xs text-red-400", className)} {...props}>
        {body}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export { Form, FormItem, FormLabel, FormControl, FormMessage, FormField, FormFieldContext }
