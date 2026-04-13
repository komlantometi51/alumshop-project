import Link from 'next/link';

export default function ConfirmationPage({ params }) {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold mb-4">Commande confirmée</h1>
      <p className="text-gray-600 mb-6">
        Votre commande <strong>{params.id}</strong> a bien été enregistrée.
      </p>
      <Link href="/" className="inline-flex px-6 py-3 rounded-xl bg-blue-700 text-white hover:bg-blue-800">
        Retour au catalogue
      </Link>
    </main>
  );
}
