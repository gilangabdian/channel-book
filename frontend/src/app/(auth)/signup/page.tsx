import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col w-full text-center">
      <div className="mb-6">
        <h1 className="text-4xl w-full font-black font-weight-700 text-gray-900 mb-1">Create an account</h1>
      </div>

      {/* Form Logikanya dipisah ke Client Component */}
      <SignupForm />

      <div className="mt-8 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
