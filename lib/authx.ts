// lib/auth.ts
import { supabase } from "@/utils/supabase"

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('❌ Login error:', error.message)
    throw error
  }

  console.log('✅ Login success:', data.session)
  return data
}
