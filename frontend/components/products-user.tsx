"use client";

import { useEffect, useState } from "react";

import { fetcher } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductsUser() {
  const [products, setProducts] = useState<Product[]>([]);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    fetcher("/products")
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Produits disponibles</h1>

      <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p>{product.description}</p>
            <p className="font-bold">{product.price} €</p>
            <Button
              onClick={() => addToCart({ ...product, quantity: 1 })}
              disabled={product.stock <= 0}
              className="mt-2"
            >
              {product.stock > 0 ? "Ajouter au panier" : "En rupture"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
