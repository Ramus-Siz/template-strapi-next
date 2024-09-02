"use client";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BaseUrl } from "@/lib/utils";
import useUserStore from "@/lib/userStore"; // Importer le store Zustand

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = useState(null);
  const setUser = useUserStore((state) => state.setUser); // Utiliser la fonction setUser du store Zustand

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${BaseUrl()}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.jwt);
      setUser(data.user); // Mettre à jour l'utilisateur dans le store Zustand
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const onSubmit = (data) => {
    setErrorMessage(null); // Réinitialiser les erreurs
    mutation.mutate(data); // Lancer la mutation avec les données du formulaire
  };

  return (
    <div className="container mx-auto flex justify-center">
      <div className="p-12 rounded-xl mt-10 w-full xl:w-[50%] h-[400px] flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-white/90">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
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
              {mutation.isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
