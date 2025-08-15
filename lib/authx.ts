// lib/auth.ts
import { supabase } from "@/utils/supabase"
import { LoginFormData } from "@/lib/types"
export async function signIn(loginFormData: LoginFormData) {
  // Step 1: Get email from profiles
  const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select(`
    email,
    role_id,
    full_name
    `)
  .eq("username", loginFormData.username)
  .eq("role_id", loginFormData.role) // ✅ direct filter
  .single();


  if (profileError || !profile) {
    throw new Error("Invalid credentials or role");
  }
  // Step 2: Authenticate
  const { data, error } = await supabase.auth.signInWithPassword({
    email: profile.email, // ✅ fixed
    password: loginFormData.password,
  });

  if (error) {
    console.error("❌ Login error:", error.message);
    throw error;
  }
  data.user.role = profile.role_id; 
  data.user.user_metadata.full_name = profile.full_name; // ✅ attach full_name manually
  return data;
}


export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("❌ Sign out error:", error.message);
    throw error;
  }
  return true;
} ;

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error("❌ Get current user error:", error.message);
    throw error;
  }
  return user;
}
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("❌ Get user profile error:", error.message);
    throw error;
  }
  return data;
}

export async function getRoles() {
  const { data, error } = await supabase
    .from("roles")
    .select("*");

  if (error) {
    console.error("❌ Get roles error:", error.message);
    throw error;
  }
  return data;
} 

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();
  if (error && error.code === 'PGRST116') return true; // no data

  if (error) {
    console.error("❌ Check username availability error:", error.message);
    throw error;
  }

  return !data; // If no data is returned, the username is available
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("email")
    .eq("email", email)
    .single(); // <- single() will throw if no match or multiple matches
  if (error && error.code === 'PGRST116') return true; // no data
  return !data; // If no data is returned, the email is available
}

export async function signUp(userData: {
  email: string;
  phone: string;
  username: string;
  fullName: string;
  password: string;
  role: string;
}) {
  // Step 1: Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
  });

  if (authError) {
    console.error("❌ Sign up error:", authError.message);
    throw authError;
  }

  if (!authData.user) {
    throw new Error("User data missing after sign up.");
  }
  const userId = authData.user.id;
console.log(userId)
  try {
    // Step 2: Insert profile in `profiles` table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        full_name: userData.fullName,
        role_id: userData.role,
      })
      .single();

    if (profileError) throw profileError;

    // Both Auth user and profile created successfully
    return { ...(authData.user ? authData.user : {}), ...(profileData ? profileData : {}) };
  } catch (err) {
    throw new Error("Sign up failed.");
  }
}