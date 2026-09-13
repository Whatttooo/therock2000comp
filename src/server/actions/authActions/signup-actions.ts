"use server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ServerActionResponse } from "../types";


const signupFormSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})

export const submitSignupForm = async (data: z.infer<typeof signupFormSchema>): Promise<ServerActionResponse> => {
  const validatedFormFields = signupFormSchema.safeParse(data)

  if (!validatedFormFields.success || !validatedFormFields.data) {
    return {
      success: false,
      errorMessage: validatedFormFields.error.message
    };
  }

  const { name, email, password } = validatedFormFields.data;

  try {

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password
      },
      headers: await headers()
    })

    return { success: true }

  } catch (error) {
    console.warn("Something went wrong", error)
    return {
      success: false,
      errorMessage: "Something went wrong with the server - please try again soon"
    }
  }

}
