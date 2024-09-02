"use client";
import Posts from "./posts/page";
import Header from "@/components/Header";
import { BaseUrl } from "@/lib/utils";
import { useEffect } from "react";

import useUserStore from "@/lib/userStore"; // Importer le store Zustand
import Login from "@/components/login";

export default function Home() {
  const { user, setUser, clearUser } = useUserStore(); // Utiliser le store Zustand

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser(token);
    }
  }, []);

  const fetchUser = async (token) => {
    const response = await fetch(`${BaseUrl()}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data); // Mettre à jour l'utilisateur dans le store Zustand
    } else {
      localStorage.removeItem("authToken");
    }
  };

  const handleLogin = (userData) => {
    setUser(userData); // Mettre à jour l'utilisateur dans le store Zustand
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    clearUser(); // Réinitialiser l'utilisateur dans le store Zustand
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      {user ? (
        <section className="h-full py-10">
          <div className="container mx-auto border border-[#27272c] flex flex-col p-12 bg-[#27272c] rounded-lg">
            <h2 className="text-3xl font-bold">Welcome to your blog</h2>
            <p className="text-lg text-white/60">The practice of strapi and Next Js</p>
          </div>
          <div className="container mx-auto h-full">
            <Posts />
          </div>
        </section>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
}
