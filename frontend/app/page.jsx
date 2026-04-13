import ProductCard from "@/components/ProductCard";
import { getProduits } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  let produits = [];
  const query = searchParams.q || "";

  try {
    const response = await getProduits({ page: 1, limit: 20, q: query });
    produits = response.data ?? [];
  } catch (error) {
    produits = [];
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="rounded-[32px] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-10 mb-10 shadow-xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Aluminium & fournitures industrielles
          </p>
          <h1 className="mt-4 text-4xl font-bold">
            Construisez vos projets avec des matériaux de qualité.
          </h1>
          <p className="mt-4 text-slate-200 leading-7">
            Découvrez un catalogue complet de produits aluminium, accessoires et
            équipements professionnels, avec gestion des stocks, commandes et
            paiements en ligne.
          </p>
          <form action="/" className="mt-6 flex gap-3 flex-col sm:flex-row">
            <input
              name="q"
              defaultValue={query}
              placeholder="Rechercher un produit ou une référence"
              className="min-w-0 flex-1 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Rechercher
            </button>
          </form>
        </div>
      </section>

      <section className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Résultats</h2>
          <p className="text-sm text-slate-500">
            {produits.length} produit(s) trouvé(s).
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {produits.length > 0 ? (
          produits.map((produit) => (
            <ProductCard key={produit.id} produit={produit} />
          ))
        ) : (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/80 p-10 text-center text-slate-500">
            Aucun produit trouvé. Essayez une autre recherche.
          </div>
        )}
      </div>
    </div>
  );
}
