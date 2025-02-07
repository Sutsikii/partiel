"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetcher } from "@/lib/api";
import Navbar from "@/components/navbar";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await fetcher(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (isLogin) {
        const payload = JSON.parse(atob(res.access_token.split(".")[1]));
        const role = payload.role; 

        login(res.access_token, role);

        toast.success("Connexion réussie !");
        
        window.location.href = role === "ADMIN" ? "/products-admin" : "/products";
      } else {
        toast.success("Inscription réussie, connectez-vous !");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error("Échec de l'authentification");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto text-center py-20">
        <h1 className="text-3xl font-bold mb-6">{isLogin ? "Connexion" : "Inscription"}</h1>
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4"
          />
          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button onClick={handleSubmit} className="w-full">
            {isLogin ? "Se Connecter" : "S'inscrire"}
          </Button>
          <p className="mt-4 text-gray-600">
            {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "S'inscrire" : "Se Connecter"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
