"use client"
import Link from "next/link"
import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <SignInForm/>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/auth/sign-up" className="font-medium text-primary hover:text-primary-hover transition-colors">
              Sign Up
            </Link>
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-600">© 2024 Ayuu Healthcare System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
