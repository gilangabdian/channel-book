"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import AuthGoogleButton from "./AuthGoogleButton";

export default function LoginForm() {
  // TODO: Implement state & Supabase logic
  return (
    <div className="flex flex-col gap-4 text-left">
      <AuthGoogleButton text="Continue with Google" />
      
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-sm text-gray-400">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="flex flex-col gap-4">
        <Input 
          type="email" 
          placeholder="Enter your email address" 
        />
        <Button>Send Code</Button>
      </div>
    </div>
  );
}
