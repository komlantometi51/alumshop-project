import { getProduit } from '@/lib/api';
import ProduitDetail from '@/components/ProduitDetail';

export const dynamic = 'force-dynamic';

export default async function ProduitPage({ params }) {
  let produit = null;
  try {
    produit = await getProduit(params.id);
  } catch (error) {
    produit = null;
  }

  if (!produit || produit.error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Produit introuvable.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <img
          src={produit.images?.[0] ?? 'https://via.placeholder.com/640x480?text=Produit'}
          alt={produit.nom}
          className="w-full rounded-3xl object-cover"
        />
        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <p className="text-gray-400 text-sm font-mono mb-2">{produit.reference}</p>
          <h1 className="text-3xl font-semibold">{produit.nom}</h1>
          <p className="text-gray-600 mt-4">{produit.description}</p>
        </div>
      </div>
      <ProduitDetail produit={produit} />
    </div>
  );
}
