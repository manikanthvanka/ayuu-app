"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Stethoscope, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { signIn } from "@/lib/auth"
import { useGlobalLoading } from "@/components/ui/GlobalLoadingProvider"

export function SignInForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { isLoading, setLoading } = useGlobalLoading()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const user = signIn(username, password, role)

      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        router.push("/dashboard")
      } else {
        setError("Invalid credentials or role")
      }
    } catch (err) {
      setError("An error occurred during sign in")
    } finally {
      setLoading(false)
    }
  }

  const roles = [
    { value: "staff", label: "Staff", description: "Manage patients and appointments" },
    { value: "doctor", label: "Doctor", description: "Conduct consultations and treatments" },
    { value: "admin", label: "Admin", description: "Full system administration access" },
  ]

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Ayuu Logo and Title */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-ayuu-lg">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayuu</h1>
        <p className="text-gray-600 text-lg">Healthcare Management System</p>
      </div>
      <Card className="shadow-ayuu-lg border-0 bg-white">
        <CardHeader className="text-center space-y-2 pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
          <CardDescription className="text-gray-600">Enter your username/email and password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-900">
                Username or Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 h-12 bg-blue-50 border-gray-300 focus:border-primary focus:ring-primary/20"
                  placeholder="admin@ayuu.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-primary focus:ring-primary/20"
                  placeholder="123123"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">Select Your Role</Label>
              <div className="grid gap-3">
                {roles.map((roleOption) => (
                  <div
                    key={roleOption.value}
                    className={cn(
                      "relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 hover:shadow-md",
                      role === roleOption.value
                        ? "border-primary bg-blue-50 shadow-md ring-2 ring-primary/20"
                        : "border-gray-200 bg-white hover:border-gray-300",
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
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{roleOption.label}</h3>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{roleOption.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-hover text-white font-medium shadow-ayuu-lg hover:shadow-ayuu transition-all duration-200 rounded-lg"
              disabled={isLoading || !role}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-medium text-gray-900 mb-3">Demo Credentials:</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Staff:</span>
                <span>staff1 / password123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Doctor:</span>
                <span>doctor1 / password123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Admin:</span>
                <span>admin1 / password123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
