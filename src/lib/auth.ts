import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'default-secret-key-ganti-ini'
);

// Interface untuk data user di JWT
interface UserJWTPayload extends Record<string, any> {
  id: string;
  email: string;
  nama: string;
  role: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verifikasi password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Buat JWT token
export async function createToken(user: UserJWTPayload): Promise<string> {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // Token berlaku 7 hari
    .sign(SECRET_KEY);
}

// Verifikasi JWT token
export async function verifyToken(token: string): Promise<UserJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as UserJWTPayload;
  } catch (error) {
    return null;
  }
}

// Ambil user dari cookie session
export async function getUserFromSession(): Promise<UserJWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) return null;
  
  return verifyToken(token);
}

// Set session cookie
export async function setSession(user: UserJWTPayload) {
  const token = await createToken(user);
  const cookieStore = await cookies();
  
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: '/',
  });
}

// Hapus session cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// Fungsi login
export async function login(email: string, password: string) {
  try {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: 'Email atau password salah' };
    }

    // Verifikasi password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Email atau password salah' };
    }

    // Buat session
    await setSession({
      id: user.id,
      email: user.email,
      nama: user.nama,
      role: user.role,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Terjadi kesalahan saat login' };
  }
}

// Fungsi register (untuk user biasa)
export async function register(nama: string, email: string, password: string) {
  try {
    // Cek koneksi database
    await prisma.$connect();
    
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'Email sudah terdaftar' };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        nama,
        email,
        password: hashedPassword,
        role: 'user', // Default role adalah user
      },
    });

    // Buat session
    await setSession({
      id: user.id,
      email: user.email,
      nama: user.nama,
      role: user.role,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        nama: user.nama,
        role: user.role,
      },
    };
  } catch (error: any) {
    console.error('Register error:', error);
    
    // Error handling yang lebih spesifik
    if (error.code === 'P2002') {
      return { success: false, error: 'Email sudah terdaftar' };
    }
    
    if (error.message?.includes('connect') || error.message?.includes('database')) {
      return { success: false, error: 'Gagal terhubung ke database. Silakan coba lagi.' };
    }
    
    return { success: false, error: `Terjadi kesalahan: ${error.message || 'Unknown error'}` };
  }
}

// Fungsi logout
export async function logout() {
  await deleteSession();
  return { success: true };
}

// Proteksi route - cek apakah user sudah login
export async function requireAuth() {
  const user = await getUserFromSession();
  if (!user) {
    redirect('/login');
  }
  return user;
}

// Proteksi route admin - cek apakah user adalah admin
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }
  return user;
}
