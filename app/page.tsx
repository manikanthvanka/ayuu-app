"use client"
import { Stethoscope } from "lucide-react"
import { SignInForm } from "@/components/auth/sign-in-form"
import Lottie from "lottie-react"
import { useEffect, useState } from "react"

export default function SignInPage() {
   const [lottieData, setLottieData] = useState<any>(null)

  // Load Lottie animation
  useEffect(() => {
    fetch("/lottie/signin-animation.json")
      .then((res) => res.json())
      .then(setLottieData)
      .catch((error) => {
        console.error("Failed to load Lottie animation:", error)
        setLottieData(null)
      })
  }, [])


  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center items-center gap-2 w-full">
  <a href="/" className="flex items-center gap-2 font-medium">
    <div className="bg-primary text-primary-foreground flex h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 items-center justify-center rounded-md">
      <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
    </div>
    <span className="text-lg sm:text-xl md:text-2xl">Ayuu</span>
  </a>
</div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignInForm />
          </div>
        </div>
      </div>
    {/* Right side: Lottie illustration */}
      <div className="bg-gradient-to-br from-primary to-primary-hover relative hidden lg:flex items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          {lottieData ? (
            <Lottie animationData={lottieData} loop={true} className="h-64 w-64 mx-auto" />
          ) : (
            <div className="h-64 w-64 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <Stethoscope className="h-32 w-32 text-white/80" />
            </div>
          )}

          <h2 className="text-4xl font-bold mt-6 mb-4">Welcome to Ayuu</h2>
          <p className="text-xl text-white/90 mb-6">
            Your comprehensive healthcare management solution
          </p>
        </div>
        </div>
    </div>
  )
}
