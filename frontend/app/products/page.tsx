'use client'

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetcher } from "@/lib/api";
import Navbar from "@/components/navbar";
import ProductManager from "@/components/products-manager";
import ProductsUser from "@/components/products-user";

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
      <ProductsUser />
    </div>
  );
}
