"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, CheckCircle } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import AuthGoogleButton from "./AuthGoogleButton";
import {
  signupEmailSchema,
  signupCredentialsSchema,
  signupTermsSchema,
  type SignupEmailInput,
  type SignupCredentialsInput,
  type SignupTermsInput,
} from "@/lib/validations/auth.schema";

// Total steps setelah email (untuk progress bar)
const TOTAL_STEPS = 2;

interface SignupFormProps {
  onStepChange: (step: 1 | 2 | 3) => void;
}

export default function SignupForm({ onStepChange }: SignupFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [credentials, setCredentials] = useState<Partial<SignupCredentialsInput>>({});
  const [isLoading, setIsLoading] = useState(false);

  const goToStep = (s: 1 | 2 | 3) => {
    setStep(s);
    onStepChange(s);
  };

  const emailForm = useForm<SignupEmailInput>({
    resolver: zodResolver(signupEmailSchema),
    mode: "onSubmit",
  });

  const credentialsForm = useForm<SignupCredentialsInput>({
    resolver: zodResolver(signupCredentialsSchema),
    mode: "onSubmit",
  });

  const passwordValue = credentialsForm.watch("password") || "";
  const hasTypedPassword = passwordValue.length > 0;

  const passwordRules = [
    { label: "At least 8 characters", met: passwordValue.length >= 8 },
    { label: "One uppercase letter (A–Z)", met: /[A-Z]/.test(passwordValue) },
    { label: "One number (0–9) or special character (!@#$%...)", met: /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(passwordValue) },
  ];

  const termsForm = useForm<SignupTermsInput>({
    resolver: zodResolver(signupTermsSchema),
    mode: "onSubmit",
  });

  const handleEmailNext = emailForm.handleSubmit((data) => {
    setEmail(data.email);
    goToStep(2);
  });

  const handleCredentialsNext = credentialsForm.handleSubmit((data) => {
    setCredentials(data);
    goToStep(3);
  });

  const handleSignup = termsForm.handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      // TODO: supabase.auth.signUp({ email, password: credentials.password })
      console.log("Signup payload:", { 
        email, 
        ...credentials, 
        termsAccepted: data.termsAccepted 
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="flex flex-col items-center gap-3 text-left w-full">
      <div className="w-full max-w-xs flex flex-col gap-3">
        {/* ── STEP 1: Email ── */}
        {step === 1 && (
          <>
            <AuthGoogleButton text="Sign up with Google" />
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="flex-shrink-0 mx-3 text-xs text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>
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
          </>
        )}

        {/* ── STEP 2 & 3: Progress Bar & Header ── */}
        {step > 1 && (
          <div className="flex flex-col gap-2 mb-1">
            {/* Progress Info & Bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-end">
                <span className="text-xs text-gray-400 font-medium">Step {step - 1} of {TOTAL_STEPS}</span>
              </div>
              <div className="h-[3px] w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((step - 1) / TOTAL_STEPS) * 100}%` }}
                />
              </div>
            </div>

            {/* Back icon + Heading */}
            <div className="flex items-center relative mt-1">
              <button
                type="button"
                onClick={() => goToStep((step - 1) as 1 | 2)}
                aria-label="Go back"
                className="absolute -left-7 text-gray-400 hover:text-primary transition-colors flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 cursor-pointer" />
              </button>
              <p className="text-base font-semibold text-gray-800">
                {step === 2 ? "Complete your profile" : "Terms & Privacy"}
              </p>
            </div>
          </div>
        )}

        {/* ── STEP 2: Credentials Form ── */}
        {step === 2 && (
          <form onSubmit={handleCredentialsNext} className="flex flex-col gap-3">
            <Input
              type="text"
              label="Username"
              {...credentialsForm.register("username")}
              error={credentialsForm.formState.errors.username?.message}
            />
            <div className="flex flex-col gap-1">
              <Input
                type="password"
                label="Password"
                {...credentialsForm.register("password")}
                error={credentialsForm.formState.errors.password?.message}
              />
              <ul className="ml-1 flex flex-col gap-0.5">
                {passwordRules.map((rule, idx) => {
                  const isMet = rule.met;
                  const isError = hasTypedPassword && !isMet;
                  return (
                    <li 
                      key={idx} 
                      className={[
                        "flex items-center gap-1.5 text-[11px] transition-colors",
                        isMet ? "text-gray-800 font-medium" : isError ? "text-red-500" : "text-gray-400"
                      ].join(" ")}
                    >
                      {isMet ? (
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                      ) : (
                        <div className={`w-[12px] h-[12px] rounded-full border ${isError ? 'border-red-500' : 'border-gray-300'} shrink-0`} />
                      )}
                      <span>{rule.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <Input
              type="password"
              label="Confirm Password"
              {...credentialsForm.register("confirmPassword")}
              error={credentialsForm.formState.errors.confirmPassword?.message}
            />
            <Button type="submit" className="py-2.5 text-sm">
              Next
            </Button>
          </form>
        )}

        {/* ── STEP 3: Terms Form ── */}
        {step === 3 && (
          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 py-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 flex items-center justify-center relative w-5 h-5 shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    {...termsForm.register("termsAccepted")}
                  />
                  {/* Unchecked state (Empty circle) */}
                  <div className="absolute inset-0 m-0.5 rounded-full border-[1.5px] border-gray-300 peer-checked:opacity-0 transition-opacity" />
                  
                  {/* Checked state (CheckCircle) */}
                  <CheckCircle className="absolute inset-0 w-5 h-5 text-primary opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>.
                </span>
              </label>
              {termsForm.formState.errors.termsAccepted && (
                <span className="text-xs text-red-500 ml-8 mt-1">
                  {termsForm.formState.errors.termsAccepted.message}
                </span>
              )}
            </div>

            <Button type="submit" isLoading={isLoading} className="py-2.5 text-sm">
              Sign up
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
