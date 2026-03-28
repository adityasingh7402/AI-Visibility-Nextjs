'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Use the correct site URL: prefer explicit NEXT_PUBLIC_SITE_URL, fall back to Vercel's auto URL
function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Surface a cleaner message for unconfirmed emails
    const message = error.message.includes('Email not confirmed')
      ? 'Please confirm your email before logging in. Check your inbox.'
      : 'Invalid email or password.'
    return redirect(`/login?message=${encodeURIComponent(message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${firstName} ${lastName}`.trim(),
      }
    }
  })

  if (error) {
    return redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')

  // If email confirmation is disabled in Supabase, a session is created immediately.
  // If confirmation IS required, data.session will be null – redirect to a holding page.
  if (data.session) {
    redirect('/dashboard')
  } else {
    redirect('/signup?message=Check your email to confirm your account before logging in.')
  }
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  })
  if (data.url) {
    redirect(data.url)
  }
}

export async function loginWithGithub() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  })
  if (data.url) {
    redirect(data.url)
  }
}
