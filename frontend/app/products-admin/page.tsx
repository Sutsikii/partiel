'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetcher } from "@/lib/api";
import Navbar from "@/components/navbar";
import ProductManager from "@/components/products-manager";

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetcher("/products")
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">📦 Gestion des Produits</h1>
        
        {/* 📊 Graphique des Stocks */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Stock des Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={products}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 🛍️ Liste des Produits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Prix: <strong>{product.price}€</strong></p>
                <p className="text-gray-600">Stock: <strong>{product.stock}</strong></p>
                <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <ProductManager />
      </div>
    </div>
  );
}
