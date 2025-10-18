"use client";
import Link from "next/link";
import Image from "next/image";
import { Courgette } from "next/font/google";
const courgette = Courgette({ subsets: ["latin"], weight: ["400"] });


export default function Navbar() {
  return (
    <nav className="bg-write text-black px-6 py-2 flex justify-between items-center shadow-md">
       <div className="flex items-center space-x-2">
    <Image
      src="/logo.png"
      alt="Logo Fundación"
      width={60}
      height={60}
      className="object-contain"
      priority
    />
  </div>
      <h1 className={`${courgette.className} text-2xl text-black`}>Fundación Amigos de los Niños</h1>
      <div className="flex space-x-4">
        <Link href="/dashboard" className="bg-blue-200 w-auto p-3 rounded-full text-center text-white">Inicio</Link>
        <Link href="/reservas" className="bg-blue-200 w-auto p-3 rounded-full text-center text-white">Reservar Cita</Link>
        <Link href="/historial" className="bg-blue-200 w-auto p-3 rounded-full text-center text-white">Historial</Link>
      </div>
    </nav>
  );
}
