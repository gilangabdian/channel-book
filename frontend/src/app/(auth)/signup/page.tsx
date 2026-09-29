import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex flex-col w-full text-center">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create an Account</h1>
        <p className="text-gray-500">Join Channel to discover and discuss books</p>
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
