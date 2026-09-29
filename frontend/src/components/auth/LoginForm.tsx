"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import AuthGoogleButton from "./AuthGoogleButton";
import {
  loginEmailSchema,
  loginOtpSchema,
  type LoginEmailInput,
  type LoginOtpInput,
} from "@/lib/validations/auth.schema";


export default function LoginForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Form Email ──
  const emailForm = useForm<LoginEmailInput>({
    resolver: zodResolver(loginEmailSchema),
    mode: "onSubmit",
  });

  // ── Form OTP ──
  const otpForm = useForm<LoginOtpInput>({
    resolver: zodResolver(loginOtpSchema),
    mode: "onSubmit",
  });

  // Klik "Next" di step email
  const handleEmailNext = emailForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // TODO: panggil supabase.auth.signInWithOtp({ email: data.email })
      setEmail(data.email);
      setStep("otp");
    } finally {
      setIsLoading(false);
    }
  });

  // Klik "Verify Code"
  const handleOtpVerify = otpForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // TODO: panggil supabase.auth.verifyOtp({ email, token: data.otp, type: 'email' })
      console.log("OTP verify payload:", { email, otp: data.otp });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="flex flex-col items-center gap-3 text-left w-full">
      <div className="w-full max-w-xs flex flex-col gap-3 overflow-hidden">

        {/* Google Button — selalu tampil */}
        <AuthGoogleButton text="Sign in with Google" />

        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-200" />
          <span className="flex-shrink-0 mx-3 text-xs text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* ── Steps ── */}
        {step === "email" && (
          <form onSubmit={handleEmailNext} className="flex flex-col gap-3">
            <Input
              type="email"
              label="Email"
              {...emailForm.register("email")}
              error={emailForm.formState.errors.email?.message}
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="py-2.5 text-sm"
            >
              Next
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors self-start"
            >
              <span>←</span>
              <span>{email}</span>
            </button>

            <p className="text-xs text-gray-500">
              We sent a 6-digit code to your email. Enter it below.
            </p>

            <Input
              type="text"
              label="6-digit code"
              maxLength={6}
              inputMode="numeric"
              {...otpForm.register("otp")}
              error={otpForm.formState.errors.otp?.message}
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="py-2.5 text-sm"
            >
              Verify Code
            </Button>
          </form>
        )}

      </div>
    </div>
  );
}
