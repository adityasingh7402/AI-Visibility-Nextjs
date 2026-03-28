'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'

export function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Google login error:', error.message)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      variant="outline"
      className="w-full h-12 rounded-xl font-bold border-slate-200 dark:border-white/10 dark:text-white"
    >
      <span className="mr-2 h-4 w-4 bg-slate-100 dark:bg-slate-800 rounded-full" />
      Google
    </Button>
  )
}

export function GitHubLoginButton() {
  const handleGitHubLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('GitHub login error:', error.message)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleGitHubLogin}
      variant="outline"
      className="w-full h-12 rounded-xl font-bold border-slate-200 dark:border-white/10 dark:text-white"
    >
      GitHub
    </Button>
  )
}
