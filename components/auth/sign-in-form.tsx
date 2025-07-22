"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Stethoscope, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { signIn } from "@/lib/auth"
import { useGlobalLoading } from "@/components/ui/GlobalLoadingProvider"
import { useAuth } from "@/components/auth/AuthProvider"

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [lottieData, setLottieData] = useState<any>(null)
  const router = useRouter()
  const { setLoading } = useGlobalLoading()
  const { setUser } = useAuth()

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = signIn(username, password, role)

      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        setUser(user) // update context immediately
        router.push("/dashboard")
      } else {
        setError("Invalid credentials or role")
        setLoading(false)
      }
    } catch (err) {
      setError("An error occurred during sign in")
      setLoading(false)
    }
  }

  const roles = [
    { value: "staff", label: "Staff", description: "Manage patients and appointments" },
    { value: "doctor", label: "Doctor", description: "Conduct consultations and treatments" },
    { value: "admin", label: "Admin", description: "Full system administration access" },
  ]

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
    {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username or Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-10"
              placeholder="admin@ayuu.com"
            />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 pr-10"
              placeholder="123123"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          <Label>Select Your Role</Label>
          <div className="grid gap-2">
            {roles.map((roleOption) => (
              <div
                key={roleOption.value}
                className={cn(
                  "relative flex cursor-pointer rounded-lg border p-3 transition-all duration-200 hover:shadow-sm",
                  role === roleOption.value
                    ? "border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20"
                    : "border-border bg-background hover:border-border/50",
                )}
                onClick={() => setRole(roleOption.value)}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value={roleOption.value}
                    checked={role === roleOption.value}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-4 w-4 text-primary focus:ring-primary border-border"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{roleOption.label}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{roleOption.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={!role}>
          Sign In
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/auth/sign-up" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
