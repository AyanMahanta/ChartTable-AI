"use client";

import { supabase } from "@/utils/supabase";

export default function Auth() {
  async function handleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error("Auth Error:", error.message);
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-blue-500">Sign In</h1>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSignIn}
      >
        Sign in with Google
      </button>
    </div>
  );
}
