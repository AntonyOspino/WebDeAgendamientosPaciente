// components/DashboardClient.js
"use client";

import Navbar from "@/components/Navbar";
// import ChatWidget from "@/components/ChatWidget";
import Link from "next/link";
import { useState } from "react";
import {
  FaCalendarAlt,
  FaUserMd,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { logoutHandler } from "@/utils/Request";

export default function DashboardClient({
  initialPaciente,
  initialProximaCita,
}) {
  const [paciente, setPaciente] = useState(initialPaciente);
  const [proximaCita, setProximaCita] = useState(initialProximaCita);

  const router = useRouter();

  const handleLogout = async () => {
    // Elimina el token del almacenamiento local
    await logoutHandler();
    // Redirige al usuario a la página de login
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        {/* Título */}
        {paciente ? (
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
            Bienvenido, {paciente.rol} {paciente.nombre} {paciente.apellido} 👋
          </h2>
        ) : (
          <h2 className="text-2xl font-semibold text-yellow-400 mb-6">
            Bienvenido, visitante 👋
          </h2>
        )}

        {/* Información personal y médica */}
        {paciente ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-200 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                Información Personal
              </h3>
              <p>
                <strong>Edad:</strong> {paciente.edad} años
              </p>
              <p>
                <strong>Ubicación:</strong> {paciente.ubicacion}
              </p>
              <p>
                <strong>Tipo de Paciente:</strong>{" "}
                {paciente.datos_especificos.tipo_paciente}
              </p>
            </div>

            <div className="bg-red-200 p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                Información Médica
              </h3>
              <p>
                <strong>Enfermedades:</strong>{" "}
                {paciente.datos_especificos.enfermedades}
              </p>
              <p>
                <strong>Peso:</strong> {paciente.datos_especificos.peso}{" "}
              </p>
              <p>
                <strong>Talla:</strong> {paciente.datos_especificos.talla}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-100 p-6 rounded-xl shadow-md mb-6">
            <p className="text-gray-700">
              No se pudo cargar tu información personal. Por favor, asegúrate de
              estar correctamente autenticado.
            </p>
          </div>
        )}

        {/* Próxima cita */}
        <div className="bg-green-200 p-6 rounded-xl shadow-md mt-6">
          <h3 className="text-lg font-bold text-blue-600 mb-3 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" /> Próxima Cita
          </h3>
          {proximaCita ? (
            <div>
              <p>
                <strong>Fecha:</strong> {proximaCita.fecha_cita}
              </p>
              <p>
                <strong>Hora:</strong> {proximaCita.hora_cita}
              </p>
              <p>
                <strong>Doctor:</strong> {proximaCita.medico}
              </p>
              <p>
                <strong>Especialidad:</strong> {proximaCita.especialidad}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={`font-medium ${
                    proximaCita.estado === "Aprobada"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {proximaCita.estado}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              No tienes citas agendadas. Reserva una para comenzar.
            </p>
          )}
        </div>

        {/* Enlaces rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Link
            href="/reservas"
            className="flex flex-col items-center justify-center bg-blue-600 text-white p-6 rounded-xl shadow hover:bg-blue-700 transition"
          >
            <FaUserMd size={30} className="mb-2" />
            <span>Reservar Cita</span>
          </Link>

          <Link
            href="/historial"
            className="flex flex-col items-center justify-center bg-green-600 text-white p-6 rounded-xl shadow hover:bg-green-700 transition"
          >
            <FaHistory size={30} className="mb-2" />
            <span>Ver Historial</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center bg-red-500 text-white p-6 rounded-xl shadow hover:bg-red-600 transition cursor-pointer"
          >
            <FaSignOutAlt size={30} className="mb-2" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* Chat flotante */}
      {/* <ChatWidget /> */}
    </div>
  );
}
