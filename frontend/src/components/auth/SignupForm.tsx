"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import AuthGoogleButton from "./AuthGoogleButton";
import {
  signupEmailSchema,
  signupCredentialsSchema,
  type SignupEmailInput,
  type SignupCredentialsInput,
} from "@/lib/validations/auth.schema";


export default function SignupForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Form Step 1: Email ──
  const emailForm = useForm<SignupEmailInput>({
    resolver: zodResolver(signupEmailSchema),
    mode: "onSubmit",
  });

  // ── Form Step 2: Credentials ──
  const credentialsForm = useForm<SignupCredentialsInput>({
    resolver: zodResolver(signupCredentialsSchema),
    mode: "onSubmit",
  });

  // Klik "Next" di step 1
  const handleEmailNext = emailForm.handleSubmit((data) => {
    setEmail(data.email);
    setStep(2);
  });

  // Klik "Create Account" di step 2
  const handleSignup = credentialsForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // TODO: panggil supabase.auth.signUp({ email, password: data.password })
      // dan simpan data.username ke tabel profiles
      console.log("Signup payload:", { email, ...data });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="flex flex-col items-center gap-3 text-left w-full">
      <div className="w-full max-w-xs flex flex-col gap-3 overflow-hidden">

        {/* Google Button — selalu tampil */}
        <AuthGoogleButton text="Sign up with Google" />

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-200" />
          <span className="flex-shrink-0 mx-3 text-xs text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* ── Steps ── */}
        {step === 1 && (
          <form onSubmit={handleEmailNext} className="flex flex-col gap-3">
            <Input
              type="email"
              label="Email"
              {...emailForm.register("email")}
              error={emailForm.formState.errors.email?.message}
            />
            <Button type="submit" className="py-2.5 text-sm">
              Next
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors self-start"
            >
              <span>←</span>
              <span>{email}</span>
            </button>

            <Input
              type="text"
              label="Username"
              {...credentialsForm.register("username")}
              error={credentialsForm.formState.errors.username?.message}
            />
            <Input
              type="password"
              label="Password"
              {...credentialsForm.register("password")}
              error={credentialsForm.formState.errors.password?.message}
            />
            <Input
              type="password"
              label="Confirm Password"
              {...credentialsForm.register("confirmPassword")}
              error={credentialsForm.formState.errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="py-2.5 text-sm"
            >
              Create Account
            </Button>
          </form>
        )}

      </div>
    </div>
  );
}
