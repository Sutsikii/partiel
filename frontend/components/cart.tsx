"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { toast } from "sonner";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  
  const handleOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vous devez être connecté pour passer une commande !");
      return;
    }
  
    const orderData = { items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })) };
  
    console.log("Envoi de la commande:", orderData); 
    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData), 
      });
  
      if (response.ok) {
        toast.success("Commande passée avec succès !");
        clearCart();
      } else {
        const error = await response.json();
        toast.error(`Erreur: ${error.message}`);
      }
    } catch (error) {
      toast.error("Impossible de passer la commande.");
    }
  };
  

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Votre Panier</h1>

      {cart.length === 0 ? (
        <p className="text-center">Votre panier est vide.</p>
      ) : (
        <>
          <ul className="mb-6">
            {cart.map((item) => (
              <li key={item.id} className="border p-2 mb-2 flex justify-between">
                <span>
                  {item.name} - {item.quantity} x {item.price} €
                </span>
                <Button onClick={() => removeFromCart(item.id)} className="bg-red-500">
                    Retirer
                </Button>
              </li>
            ))}
          </ul>

          <Button onClick={handleOrder} className="w-full bg-green-500">Passer la commande</Button>
        </>
      )}
    </div>
  );
}
