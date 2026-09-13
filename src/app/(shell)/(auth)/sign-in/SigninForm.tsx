"use client";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { submitSigninForm } from "@/server/actions/authActions/signin-actions";
import { PasswordInput } from "@/components/formComponents/PasswordInput";
import { useSession } from "@/lib/auth-client";

const signinFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, { message: "Password is required" }),
});

export const SigninForm = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const { refetch } = useSession();

  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: z.infer<typeof signinFormSchema>) => {
    setServerError("");

    const result = await submitSigninForm(data);

    if (!result.success) {
      setServerError(result.errorMessage);
      return;
    }

    await refetch();
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form
      className={cn("flex flex-col gap-6")}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        {serverError && (
          <div className="bg-red-950/40 border border-red-800/40 text-red-200 text-sm p-4 rounded-xl font-medium">
            {serverError}
          </div>
        )}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="m@example.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <PasswordInput control={form.control} name="password" />
        <Field>
          <Button type="submit">Login</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don't have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
};
{
  /*   <a */
}
{
  /*     href="#" */
}
{
  /*     className="ml-auto text-sm underline-offset-4 hover:underline" */
}
{
  /*   > */
}
{
  /*     Forgot your password? */
}
{
  /*   </a> */
}
{
  /* </div> */
}
