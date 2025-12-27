'use server';

import { login as authLogin, register as authRegister, logout as authLogout } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Server action untuk login
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email dan password harus diisi' };
  }

  const result = await authLogin(email, password);

  if (result.success && result.user) {
    // Redirect berdasarkan role
    if (result.user.role === 'admin') {
      redirect('/admin/dashboard');
    } else {
      redirect('/dashboard');
    }
  }

  return result;
}

// Server action untuk register
export async function registerAction(formData: FormData) {
  const nama = formData.get('nama') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  // Validasi
  if (!nama || !email || !password || !confirmPassword) {
    return { success: false, error: 'Semua field harus diisi' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Password dan konfirmasi password tidak sama' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password minimal 6 karakter' };
  }

  const result = await authRegister(nama, email, password);

  if (result.success) {
    redirect('/dashboard');
  }

  return result;
}

// Server action untuk logout
export async function logoutAction() {
  await authLogout();
  redirect('/login');
}
