"use client"
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { useState } from "react"
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { Control, FieldPath, FieldValues, useController } from "react-hook-form";

interface PasswordInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
}

export const PasswordInput = <TFieldValues extends FieldValues>({ control, name }: PasswordInputProps<TFieldValues>) => {
  const { field, fieldState } = useController({ control, name });
  const [showPassword, setShowPassword] = useState(false)
  return (
    <Field>
      <FieldLabel htmlFor="password">Password</FieldLabel>
      <div className="relative">
        <Input {...field} id="password" type={showPassword ? "text" : "password"} aria-invalid={fieldState.invalid} />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
      <FieldDescription>
        Must be at least 8 characters long.
      </FieldDescription>
      {fieldState.invalid && (
        <FieldError errors={[fieldState.error]} />
      )}
    </Field>
  )
}
