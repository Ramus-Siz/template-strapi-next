"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BaseUrl, homeUrl } from "@/lib/utils";
import useUserStore from "@/lib/userStore";

export default function Header({ onLogout }) {
    const { user } = useUserStore();
  return (
    <header className="sticky top-0 container mx-auto p-6 bg-primary border-b-4 border-accent/10 z-50 flex justify-between items-center">
      <Link href="/">
        <div>
          <h1 className="text-3xl font-bold text-white">Strapi Blog</h1>
          <p className="pl-8 text-white/60">With next js for frontend</p>
        </div>
      </Link>
      <div>
        {user ? (
          // Afficher le bouton Logout si l'utilisateur est connecté
          <Button onClick={onLogout} className="border border-accent/90 bg-accent hover:bg-accent/90">
            Logout
          </Button>
        ) : (
          // Afficher le lien Login si l'utilisateur n'est pas connecté
          <div className="flex gap-4">
                <Link href={`${homeUrl()}`}>
                    <Button className="border border-accent/90 bg-accent hover:bg-accent/90 focus:bg-accent/20">Login</Button>
                </Link>
                <Link href="/register">
                    <Button className="border border-accent/90 bg-accent/20 hover:bg-accent/90">Register</Button>
                </Link>

          </div>
          
        )}
      </div>
    </header>
  );
}
