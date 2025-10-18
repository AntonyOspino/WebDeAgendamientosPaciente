"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si hay token, va directo al dashboard; si no, al login
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <h1 className="text-blue-700 text-xl font-semibold animate-pulse">
        Cargando aplicación...
      </h1>
    </div>
  );
}
