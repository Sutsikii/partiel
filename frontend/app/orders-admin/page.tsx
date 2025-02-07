"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetcher } from "@/lib/api";
import Navbar from "@/components/navbar";
import PrivateRoute from "@/components/private-route";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";

interface OrderItem {
  product: { name: string };
  quantity: number;
}

interface Order {
  id: number;
  status: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesData, setSalesData] = useState<{ name: string; value: number }[]>([]);
  const { token } = useAuthStore(); 

  useEffect(() => {
    fetcher("/orders")
      .then((data: Order[]) => {
        setOrders(data);

        const salesMap: Record<string, number> = {};
        data.forEach((order) => {
          order.items.forEach((item) => {
            salesMap[item.product.name] = (salesMap[item.product.name] || 0) + item.quantity;
          });
        });

        setSalesData(Object.entries(salesMap).map(([name, value]) => ({ name, value })));
      })
      .catch(console.error);
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetcher(`/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.id) {
        toast.success(`Commande #${orderId} mise à jour en "${newStatus}"`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        throw new Error("Mise à jour échouée");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold mb-6 text-center">🛒 Gestion des Commandes</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Produits les plus vendus</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={salesData} dataKey="value" nameKey="name" outerRadius={120} fill="#4F46E5">
                    {salesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={["#4F46E5", "#06B6D4", "#F59E0B", "#EF4444"][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle>Commande #{order.id}</CardTitle>
                  <div className="text-sm">
                    <label className="mr-2">Statut :</label>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="En cours">En cours</option>
                      <option value="Expédiée">Expédiée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  {order.items.map((item, index) => (
                    <p key={index} className="text-gray-600">
                      {item.product.name} - <strong>{item.quantity}x</strong>
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
