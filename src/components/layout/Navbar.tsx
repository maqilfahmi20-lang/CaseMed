// ============================================
// NAVBAR COMPONENT - Reusable across pages
// ============================================

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

interface NavbarProps {
  user?: User | null;
  showAuth?: boolean;
  title?: string;
}

export default function Navbar({ user, showAuth = true, title = 'CaseMed' }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Call authService.logout() when backend is ready
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href={user ? '/dashboard' : '/'}>
            <h1 className="text-2xl font-bold text-primary-600 cursor-pointer hover:text-primary-700 transition">
              {title}
            </h1>
          </Link>
          
          {showAuth && (
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-gray-700 hidden sm:inline">Halo, {user.name}</span>
                  {user.isPremium && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ⭐ Premium
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800 transition"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link 
                  href="/login"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
                >
                  Masuk
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
