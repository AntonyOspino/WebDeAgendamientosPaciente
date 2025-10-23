"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { loginHandler } from "@/utils/Request";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Verificar si hay errores en la URL (desde middleware)
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
        
        // Limpiar parámetros de la URL después de leerlos
        if (errorParam) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validación básica en cliente
        if (!username.trim() || !password) {
            setError("Por favor, completa todos los campos");
            setLoading(false);
            return;
        }

        const result = await loginHandler(username, password);

        if (result.ok) {
            // ✅ Login exitoso
            setError("");
            router.push("/dashboard");
            router.refresh();
        } else {
            // ❌ Mostrar error específico
            setError(result.error || "Error desconocido");
            
            // Limpiar campos si es error de credenciales
            if (result.status === 401 || result.status === 404) {
                setPassword("");
            }
        }
        
        setLoading(false);
    };

    const getErrorColor = () => {
        if (error.includes('correctos') || error.includes('registrado')) {
            return 'text-red-600 bg-red-50 border-red-200';
        } else if (error.includes('no autorizado')) {
            return 'text-orange-600 bg-orange-50 border-orange-200';
        } else {
            return 'text-red-600 bg-red-50 border-red-200';
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-gray-50 p-4"
        style={{backgroundImage: "url('/fondo.jpeg')"}}>
            <form
                onSubmit={handleLogin}
                className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200"
            >
                <div className="text-center mb-6">
                    <Image
                        src="/logo.png" 
                        alt="Logo Fundación"
                        width={130}
                        height={120}
                        className="mx-auto mb-4"
                        priority
                    />
                    <h2 className="text-2xl font-semibold text-gray-800">
                        Bienvenido
                    </h2>
                    <p className="text-gray-600 text-sm mt-2">
                        Portal del Paciente
                    </p>
                </div>

                {error && (
                    <div className={`mb-4 p-3 rounded-lg border ${getErrorColor()} text-sm`}>
                        <div className="flex items-center">
                            <span className="mr-2">⚠️</span>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Nombre de Usuario
                        </label>
                        <input
                            type="text"
                            placeholder="Ingresa tu usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700">
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 pr-10"
                                required
                            />
                            {/* <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button> */}
                        </div>
                    </div>
                </div>
                <div className="text-center">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-50 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6 cursor-pointer px-6 flex items-center justify-center mx-auto"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Verificando...
                        </div>
                    ) : (
                        "Iniciar Sesión"
                    )}
                </button>
                  </div>
                {/* Información de ayuda */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 text-center">
                        <strong>¿Problemas para acceder?</strong><br />
                        Contacta al administrador del sistema.
                    </p>
                </div>
            </form>
        </div>
    );
}