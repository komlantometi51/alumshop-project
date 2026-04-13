'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import { createCommande } from '@/lib/api';

export default function PanierPage() {
  const { items, total, dispatch } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function validerCommande() {
    if (!user?.token) {
      setError('Vous devez vous connecter pour commander.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const commande = await createCommande(
        {
          lignes: items.map(i => ({ produit_id: i.id, quantite: i.quantite })),
        },
        user.token
      );
      if (commande.error) throw new Error(commande.error);

      dispatch({ type: 'CLEAR' });
      router.push(`/commandes/${commande.id}/confirmation`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Votre panier est vide.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Mon panier</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4 mb-8">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 border rounded-xl p-4 bg-white">
            <img
              src={item.images?.[0] ?? 'https://via.placeholder.com/80x80?text=Image'}
              className="w-16 h-16 object-cover rounded-lg"
              alt={item.nom}
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{item.nom}</p>
              <p className="text-xs text-gray-400 font-mono">{item.reference}</p>
              <p className="text-sm text-blue-700 font-semibold mt-1">
                {(item.prix_ht * item.quantite).toLocaleString('fr-FR')} FCFA HT
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, quantite: Math.max(1, item.quantite - 1) })}
                className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100"
              >−</button>
              <span className="w-6 text-center text-sm">{item.quantite}</span>
              <button
                onClick={() => dispatch({ type: 'UPDATE_QTY', id: item.id, quantite: item.quantite + 1 })}
                className="w-7 h-7 rounded-full border text-gray-600 hover:bg-gray-100"
              >+</button>
            </div>
            <button
              onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
              className="text-red-400 hover:text-red-600 text-sm ml-2"
            >Retirer</button>
          </div>
        ))}
      </div>
      <div className="border-t pt-6 flex items-center justify-between bg-white p-6 rounded-3xl">
        <div>
          <p className="text-gray-500 text-sm">Total HT</p>
          <p className="text-2xl font-bold text-blue-800">
            {total.toLocaleString('fr-FR')} FCFA
          </p>
        </div>
        <button
          onClick={validerCommande}
          disabled={loading}
          className="bg-blue-700 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? 'Traitement...' : 'Valider la commande'}
        </button>
      </div>
    </main>
  );
}
