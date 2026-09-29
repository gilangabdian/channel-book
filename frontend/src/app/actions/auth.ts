"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signupAction(data: Record<string, string>) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        username: data.username,
      }
    }
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to home page on successful signup
  redirect("/")
}

export async function loginWithOtpAction(email: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function verifyOtpAction(email: string, token: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to home page on successful login
  redirect("/")
}
