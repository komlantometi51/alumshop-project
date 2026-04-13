import Link from 'next/link';

export default function ProductCard({ produit }) {
  return (
    <Link href={`/produits/${produit.id}`}>
      <div className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer bg-white">
        <img
          src={produit.images?.[0] ?? 'https://via.placeholder.com/400x300?text=Produit'}
          alt={produit.nom}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <p className="text-xs text-gray-400 font-mono">{produit.reference}</p>
        <h3 className="font-semibold text-gray-800 mt-1">{produit.nom}</h3>
        <p className="text-sm text-gray-500">{produit.categorie_nom}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-blue-700">
            {produit.prix_ht.toLocaleString('fr-FR')} FCFA HT
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            produit.stock > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}>
            {produit.stock > 0 ? `${produit.stock} en stock` : 'Rupture'}
          </span>
        </div>
      </div>
    </Link>
  );
}
