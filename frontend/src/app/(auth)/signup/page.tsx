"use client";

import { useState } from "react";
import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="flex flex-col w-full items-center">
      {/* Heading — hanya tampil di step 1 */}
      {step === 1 && (
        <div className="mb-6 w-full max-w-xs">
          <h1 className="text-4xl font-black text-gray-900 mb-1 text-center leading-tight">
            Sign up to start discover book
          </h1>
        </div>
      )}

      {/* Form — selalu tampil, menerima callback step */}
      <SignupForm onStepChange={setStep} />

      {/* Footer — hanya tampil di step 1 */}
      {step === 1 && (
        <div className="mt-8 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Log in
          </Link>
        </div>
      )}
    </div>
  );
}
