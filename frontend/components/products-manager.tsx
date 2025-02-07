"use client";

import { useEffect, useState } from "react";
import { fetcher } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { toast } from "sonner";
import { Label } from "./ui/label";

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Product>({ name: "", description: "", price: 0, stock: 0, imageUrl: "" });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetcher("/products").then(setProducts).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vous devez être connecté pour ajouter un produit !");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (editingProduct) {
        await fetcher(`/products/${editingProduct.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(form),
        });
        toast.success("Produit mis à jour avec succès !");
      } else {
        await fetcher("/products", {
          method: "POST",
          headers,
          body: JSON.stringify(form),
        });
        toast.success("Produit ajouté avec succès !");
      }

      setOpen(false); // Ferme le modal après l'ajout/modification
      setEditingProduct(null);
      setForm({ name: "", description: "", price: 0, stock: 0, imageUrl: "" });
      fetcher("/products").then(setProducts).catch(console.error); // Rafraîchir la liste des produits
    } catch (error) {
      toast.error("Erreur lors de l'ajout/modification du produit");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce produit ?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vous devez être connecté pour supprimer un produit !");
      return;
    }

    try {
      await fetcher(`/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Produit supprimé avec succès !");
      fetcher("/products").then(setProducts).catch(console.error); // Rafraîchir la liste
    } catch (error) {
      toast.error("Erreur lors de la suppression du produit");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">📦 Gestion des Produits</h1>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">➕ Ajouter un Produit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>{editingProduct ? "Modifier" : "Ajouter"} un produit</DialogTitle>
          <Label>Nom article</Label>
          <Input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Label>Description</Label>
          <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Label>Prix</Label>
          <Input type="number" placeholder="Prix" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          <Label>Quantité</Label>
          <Input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          <Label>Url image</Label>
          <Input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <Button onClick={handleSubmit}>{editingProduct ? "Modifier" : "Ajouter"}</Button>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.price} €</TableCell>
              <TableCell>
                <Button onClick={() => { setEditingProduct(product); setForm(product); setOpen(true); }}>✏️ Modifier</Button>
                <Button onClick={() => handleDelete(product.id!)} className="bg-red-500 ml-2">🗑️ Supprimer</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
