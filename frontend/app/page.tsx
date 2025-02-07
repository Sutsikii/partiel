import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto text-center py-20">
        <h1 className="text-5xl font-bold mb-6">Bienvenue sur 🛍️ E-Shop</h1>
        <p className="text-lg text-gray-600 mb-8">
          Achetez vos vêtements préférés en un clic. Découvrez notre collection et passez commande facilement !
        </p>
        <div className="space-x-4">
          <Link href="/products">
            <Button className="bg-blue-500 hover:bg-blue-700 text-white text-lg px-6 py-3">Voir les Produits</Button>
          </Link>
          <Link href="/auth">
            <Button className="bg-green-500 hover:bg-green-700 text-white text-lg px-6 py-3">Se Connecter</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
