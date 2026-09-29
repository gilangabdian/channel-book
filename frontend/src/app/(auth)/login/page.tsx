import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col w-full text-center">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">Welcome Back</h1>
      </div>

      {/* Form Logikanya dipisah ke Client Component */}
      <LoginForm />

      <div className="mt-8 text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary font-bold hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
