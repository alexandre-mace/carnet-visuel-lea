"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type FieldValues,
  type FieldPath,
  type Control,
  type ControllerProps,
} from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = FormProvider

type FormFieldContextValue = {
  name: string
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

type FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  name: TName
  control: Control<TFieldValues>
  render: ControllerProps<TFieldValues, TName>["render"]
}

function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: FormFieldProps<TFieldValues, TName>
) {
  const { name, control, render } = props
  return (
    <FormFieldContext.Provider value={{ name: name as string }}>
      <Controller control={control} name={name} render={render} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const { formState, getFieldState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name as unknown as FieldPath<FieldValues>, formState)
  return { id: fieldContext.name, name: fieldContext.name, formItemId: fieldContext.name, ...fieldState }
}

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("grid gap-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    const { error } = useFormField()
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none",
          error && "text-red-400",
          className
        )}
        {...props}
      />
    )
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
      <p ref={ref} className={cn("mt-1 text-[0.8rem] text-red-400", className)} {...props}>
        {body}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export { Form, FormItem, FormLabel, FormControl, FormMessage, FormField, FormFieldContext }
