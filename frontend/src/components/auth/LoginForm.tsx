"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginWithOtpAction, verifyOtpAction, loginWithPasswordAction } from "@/app/actions/auth";
import Link from "next/link";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import AuthGoogleButton from "./AuthGoogleButton";
import {
  loginEmailSchema,
  loginOtpSchema,
  loginCredentialsSchema,
  type LoginEmailInput,
  type LoginOtpInput,
  type LoginCredentialsInput,
} from "@/lib/validations/auth.schema";

export default function LoginForm() {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
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

  // ── Form Password ──
  const passwordForm = useForm<LoginCredentialsInput>({
    resolver: zodResolver(loginCredentialsSchema),
    mode: "onSubmit",
  });

  const handleEmailNext = emailForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const result = await loginWithOtpAction(data.email);
      if (result?.error) {
        alert("Failed to send code: " + result.error);
        return;
      }
      setEmail(data.email);
      setStep("otp");
    } finally {
      setIsLoading(false);
    }
  });

  const handleOtpVerify = otpForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const result = await verifyOtpAction(email, data.otp);
      if (result?.error) {
        alert("Verification failed: " + result.error);
      }
    } finally {
      setIsLoading(false);
    }
  });

  const handlePasswordSubmit = passwordForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const result = await loginWithPasswordAction(data);
      if (result?.error) {
        alert("Login failed: " + result.error);
      }
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
            <Button type="submit" isLoading={isLoading} className="py-2.5 text-sm">
              Next
            </Button>
            <button
              type="button"
              onClick={() => setStep("password")}
              className="cursor-pointer text-xs text-gray-500 hover:text-primary transition-colors mt-1">
              Log in with password
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpVerify} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary transition-colors self-start">
              <span>←</span>
              <span>{email}</span>
            </button>

            <p className="text-xs text-gray-500">We sent a 6-digit code to your email. Enter it below.</p>

            <Input
              type="text"
              label="6-digit code"
              maxLength={6}
              inputMode="numeric"
              {...otpForm.register("otp")}
              error={otpForm.formState.errors.otp?.message}
            />
            <Button type="submit" isLoading={isLoading} className="py-2.5 text-sm">
              Verify Code
            </Button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              label="Email"
              {...passwordForm.register("email")}
              error={passwordForm.formState.errors.email?.message}
            />
            <div className="flex flex-col gap-1">
              <Input
                type="password"
                label="Password"
                {...passwordForm.register("password")}
                error={passwordForm.formState.errors.password?.message}
              />
              <Link
                href="/forgot-password"
                className="text-[11px] text-gray-400 hover:text-primary transition-colors self-end pr-1">
                Forgot Password?
              </Link>
            </div>
            <Button type="submit" isLoading={isLoading} className="py-2.5 text-sm mt-1">
              Log in
            </Button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="cursor-pointer text-xs text-gray-500 hover:text-primary transition-colors mt-1">
              Log in with email code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
