"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { checkUsernameAvailability, signUp, getRoles, checkEmailAvailability } from "@/lib/authx"
import { Role } from "@/lib/types"
import { cn } from "@/lib/utils"

export function SignUpForm() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "",
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [mounted, setMounted] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null)
  const [apiResponse, setApiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await getRoles()
        setRoles(fetchedRoles)
      } catch (err: any) {
        console.error("❌ Failed to fetch roles:", err.message)
        setApiResponse("Failed to load roles")
      } finally {
        setMounted(true)
      }
    }

    fetchRoles()
  }, [])

  if (!mounted) return null // prevents SSR/client mismatch

  const checkUsername = async (username: string) => {
    if (username.length >= 3) {
      const available = await checkUsernameAvailability(username)
      setUsernameAvailable(available)
    } else {
      setUsernameAvailable(null)
    }
  }

  const checkEmail = async (email: string) => {
    if (email && email.includes("@") && email.length > 5) {
      try {
        const available = await checkEmailAvailability(email)
        setEmailAvailable(available)
      } catch (err) {
        console.error("Email check failed", err)
        setEmailAvailable(null)
      }
    } else {
      setEmailAvailable(null)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "username") checkUsername(value)
    if (field === "email") checkEmail(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setApiResponse("")

    if (formData.password !== formData.confirmPassword) {
      setApiResponse("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!usernameAvailable) {
      setApiResponse("Username is not available")
      setIsLoading(false)
      return
    }

    if (!emailAvailable) {
      setApiResponse("Email is already in use")
      setIsLoading(false)
      return
    }

    try {
      console.log("Submitting sign up form with data:", formData)
      const response = await signUp(formData)
      setApiResponse(response.id ? "Sign up successful. Please check your email to confirm" : "Sign up failed");
    } catch (err) {
      console.error(err)
      setApiResponse(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account to access the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
         

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="pl-10 pr-10"
              />
              {emailAvailable !== null && (
                <div className="absolute right-2 top-2">
                  {emailAvailable ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {emailAvailable !== null && (
              <p className={`text-sm ${emailAvailable ? "text-green-600" : "text-red-600"}`}>
                {emailAvailable ? "Email is available" : "Email is already in use"}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
                className="pr-10"
              />
              {usernameAvailable !== null && (
                <div className="absolute right-2 top-2">
                  {usernameAvailable ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {usernameAvailable !== null && (
              <p className={`text-sm ${usernameAvailable ? "text-green-600" : "text-red-600"}`}>
                {usernameAvailable ? "Username is available" : "Username is not available"}
              </p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((roleOption) => (
                  <SelectItem key={roleOption.id} value={roleOption.id}>
                    {roleOption.role_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="pl-10 pr-10"
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                className="pl-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-sm text-red-600">Passwords do not match</p>
            )}
          </div>
 {apiResponse && (
            <Alert variant={apiResponse.includes("success") ? "success" : "destructive"}>
              <AlertDescription>{apiResponse}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading || !usernameAvailable || !emailAvailable}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
