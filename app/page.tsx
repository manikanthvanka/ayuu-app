"use client"
import { Stethoscope } from "lucide-react"
import { SignInForm } from "@/components/auth/sign-in-form"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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
       <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <div className="w-64 h-64 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center">
              <Stethoscope className="w-32 h-32 text-blue-800" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold underline text-white mb-4"
          >
            HealthCare Pro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl text-white  max-w-md mx-auto"
          >
            Complete Patient Management System for Modern Healthcare
          </motion.p>
        </motion.div>
        </div>
    </div>
  )
}
