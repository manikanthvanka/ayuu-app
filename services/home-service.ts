import { supabase } from "@/utils/supabase"

export async function fetchUserAccess(userId: string) {
  const { data, error } = await supabase
    .rpc("get_user_full_access", { user_uuid: userId })

  if (error) {
    console.error("Error fetching user access:", error)
    return null
  }

  return data
}