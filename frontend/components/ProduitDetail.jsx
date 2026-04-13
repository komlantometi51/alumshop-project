'use client';

import { useCart } from '@/components/CartContext';

export default function ProduitDetail({ produit }) {
  const { dispatch } = useCart();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-sm text-gray-500">Prix</p>
        <p className="text-3xl font-semibold text-blue-700">
          {produit.prix_ht.toLocaleString('fr-FR')} FCFA HT
        </p>
        <p className="text-sm text-gray-500 mt-3">Stock : {produit.stock}</p>
        <button
          onClick={() => dispatch({ type: 'ADD', produit })}
          className="mt-6 w-full bg-blue-700 text-white py-3 rounded-2xl hover:bg-blue-800"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
