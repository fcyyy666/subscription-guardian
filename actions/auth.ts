'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/db';
import { users } from '@/db/schema';

/**
 * Login action
 * Authenticates user with email and password
 */
/**
 * Login action
 * Authenticates user with email and password
 */
export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Signup action
 * Creates new user in Supabase Auth and syncs to public.users table
 */
export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
  };

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return { error: authError.message };
  }

  // Sync user data to public.users table
  if (authData.user) {
    try {
      await db.insert(users).values({
        id: authData.user.id,
        email: data.email,
        fullName: data.fullName || null,
        currencyPreference: 'CNY',
      });
    } catch (dbError) {
      console.error('Failed to sync user to database:', dbError);
      return { error: 'Failed to create user profile. Please contact support.' };
    }
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

/**
 * Logout action
 * Signs out the current user
 */
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}
