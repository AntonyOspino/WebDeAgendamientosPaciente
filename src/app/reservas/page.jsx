"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function ReservasPage() {
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("");
  const [doctor, setDoctor] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Fecha simulada de última cita (luego vendrá desde la BD)
  const ultimaCita = new Date("2025-10-10");

  const handleFileChange = (e) => {
    setImagenes([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar fecha mínima de 15 días después
    if (!fecha) return setMensaje("Selecciona una fecha válida.");
    const diferenciaDias = (fecha - ultimaCita) / (1000 * 60 * 60 * 24);
    if (diferenciaDias < 15) {
      return setMensaje("Debe haber al menos 15 días entre citas.");
    }

    const formData = new FormData();
    formData.append("fecha", fecha.toISOString().split("T")[0]);
    formData.append("hora", hora);
    formData.append("doctor", doctor);
    formData.append("especialidad", especialidad);
    imagenes.forEach((img) => formData.append("imagenes", img));

    try {
      // Simulamos envío a la API (más adelante conectaremos backend)
      console.log("Datos enviados:", {
        fecha,
        hora,
        doctor,
        especialidad,
        imagenes,
      });

      setMensaje("✅ Tu cita fue registrada y está pendiente de aprobación.");
    } catch (error) {
      setMensaje("❌ Error al enviar la solicitud.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-130 mx-auto bg-white shadow-md rounded-xl p-8 mt-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-4 text-center">
          Reserva de Cita Médica
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha */}
          <div>
            <label className="block mb-1 font-small">Fecha:</label>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              className="border border-blue-700 p-2 rounded-full w-full"
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block mb-1 font-small">Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              className="border border-blue-700 p-2 rounded-full w-full"
            />
          </div>

          {/* Doctor */}
          <div>
            <label className="block mb-1 font-small">Medico:</label>
            <input
              type="text"
              placeholder="Ej: Dra. Juanna Ruiz"
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              required
              className="border border-blue-700 p-2 rounded-full w-full"
            />
          </div>

          {/* Especialidad */}
          <div>
            <label className="block mb-1 font-small">Especialidad:</label>
            <select
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              required
              className="border border-blue-700 p-2 rounded-full w-full"
            >
              <option value="">Selecciona una especialidad</option>
              <option value="Sistema respiratorio">Sistema respiratorio</option>
              <option value="Sistema digestivo">Sistema digestivo</option>
              <option value="Sistema endocrino">Sistema endocrino</option>
              <option value="Sistema nervioso">Sistema nervioso</option>
            </select>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block mb-1 font-small">Imágenes (mínimo 1):</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-blue-700 p-2 rounded-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Puedes subir fotos de tu afección (ej: lesiones, radiografías).
            </p>
          </div>

          <button
            type="submit"
            className="block mx-auto bg-green-600 text-white w-50 py-2 rounded-full hover:bg-green-700"
          >
            Reservar Cita
          </button>

          {mensaje && (
            <p
              className={`text-center mt-3 font-medium ${
                mensaje.includes("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
