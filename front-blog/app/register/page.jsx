// app/register/page.js
"use client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; // Importer useRouter de Next.js
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BaseUrl } from "@/lib/utils";
import useUserStore from "@/lib/userStore"; // Importer le store Zustand
import Header from "@/components/header";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const { setUser } = useUserStore(); // Utiliser Zustand pour définir l'utilisateur
  const router = useRouter(); // Initialiser le hook useRouter pour la navigation

  // Utiliser useMutation pour gérer l'inscription
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${BaseUrl()}/api/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      return response.json();
    },
    onSuccess: (data) => {
      
      router.push("/"); // Rediriger l'utilisateur vers la page d'accueil après l'inscription réussie
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  // Fonction pour gérer la soumission du formulaire
  const onSubmit = (data) => {
    setErrorMessage(null); // Réinitialiser les erreurs
    mutation.mutate(data); // Lancer la mutation avec les données du formulaire
  };

  return (

    <>
    <Header/>
    <div className="container mx-auto flex justify-center">
      <div className="p-12 rounded-xl mt-10 w-full xl:w-[50%] h-[500px] flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-white/90">Register</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <Input
            type="text"
            {...register("username", { required: "Username is required" })}
            placeholder="Username"
            className="border border-accent/10"
          />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}
          
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="border border-accent/10"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          
          <Input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="border border-accent/10"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          
          <div>
            <Button type="submit" className="bg-accent/10 hover:bg-accent/90 w-full text-white/80">
              {mutation.isLoading ? "Registering..." : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </div>
    
    </>
    
  );
}
