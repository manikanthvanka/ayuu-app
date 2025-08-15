// app/api/auth/sign-up/route.ts (Next.js 13+ app router)
import { supabase } from "@/utils/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password, username, fullName, role, phone } = await req.json()

  // 1️⃣ Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  const userId = authData.user.id;

  try {
    // 2️⃣ Insert profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        username,
        email,
        phone,
        full_name: fullName,
        role_id: role,
      })
      .single()

    if (profileError) throw profileError

    return NextResponse.json({ user: authData, profile: profileData })
  } catch (err) {
    // 3️⃣ Rollback auth user if profile creation fails
    await supabase.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: "Sign up failed. Rolled back user creation." }, { status: 500 })
  }
}
