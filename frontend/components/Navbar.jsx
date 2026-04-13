'use client';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useCart } from '@/components/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-lg text-slate-900">
          AlumShop
        </Link>
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <Link href="/panier" className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200">
            Panier ({count})
          </Link>
          {user ? (
            <button onClick={logout} className="px-3 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600">
              Déconnexion
            </button>
          ) : (
            <Link href="/login" className="px-3 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
