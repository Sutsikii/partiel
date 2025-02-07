"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuthInitializer, useAuthStore } from "@/lib/auth-store";

export default function Navbar() {
  useAuthInitializer(); 

  const { isAuthenticated, role, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <div className="text-xl font-bold">🛍️ E-Shop</div>
      <div className="flex space-x-4">
        <Link href="/" className="hover:text-gray-400">Accueil</Link>
        <Link href="/products" className="hover:text-gray-400">Produits</Link>
        <Link href="/cart" className="hover:text-gray-400">Panier</Link>

        {isAuthenticated && role === "admin" && (
          <>
            <Link href="/orders-admin" className="hover:text-gray-400">Commandes Admin</Link>
            <Link href="/products-admin" className="hover:text-gray-400">Gestion Produit</Link>
          </>
        )}

        {!isAuthenticated ? (
          <Link href="/auth" className="hover:text-gray-400">Connexion</Link>
        ) : (
          <Button onClick={logout} className="bg-red-500 hover:bg-red-700">Déconnexion</Button>
        )}
      </div>
    </nav>
  );
}
