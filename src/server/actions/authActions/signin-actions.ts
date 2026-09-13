"use server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ServerActionResponse } from "../types";


const signinFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const submitSigninForm = async (data: z.infer<typeof signinFormSchema>): Promise<ServerActionResponse> => {
  const validatedFormFields = signinFormSchema.safeParse(data)

  if (!validatedFormFields.success || !validatedFormFields.data) {
    return {
      success: false,
      errorMessage: validatedFormFields.error.message
    };
  }

  const { email, password } = validatedFormFields.data;

  try {

    await auth.api.signInEmail({
      body: {
        email,
        password
      },
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
