"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function authenticate(
  _previousState: string | null,
  formData: FormData,
): Promise<string | null> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return "Unable to sign in. Check your credentials or try again later.";
      }

      return "Sign-in is temporarily unavailable. Please try again.";
    }

    throw error;
  }

  return null;
}
