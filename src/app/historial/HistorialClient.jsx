"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HistorialClient({ initialHistorial, getHistorialPaciente }) {
  const [filtroInicio, setFiltroInicio] = useState(null);
  const [filtroFin, setFiltroFin] = useState(null);
  const [resultados, setResultados] = useState(initialHistorial);
  console.log(initialHistorial);
  const [error, setError] = useState(null);

  // Formatear fecha para la API (YYYY-MM-DD)
  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split("T")[0];
  };

  // Filtrar historial
  const filtrar = async () => {
    try {
      let response;
      if (filtroInicio && filtroFin) {
        if (filtroInicio > filtroFin) {
          setError("La fecha de inicio no puede ser mayor que la fecha de fin.");
          return;
        }
        const rango = `${formatDate(filtroInicio)} al ${formatDate(filtroFin)}`;
        response = await getHistorialPaciente(null, rango);
      } else if (filtroInicio) {
        response = await getHistorialPaciente(formatDate(filtroInicio));
      } else {
        response = await getHistorialPaciente();
      }

      if (!response.ok) {
        throw new Error(response.error);
      }

      setResultados(response.historial);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResultados([]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-semibold text-yellow-600 mb-6">
          Historial Médico
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* Filtros por fecha */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Desde:
            </label>
            <DatePicker
              selected={filtroInicio}
              onChange={(date) => setFiltroInicio(date)}
              dateFormat="yyyy-MM-dd"
              className="border border-blue-700 p-2 rounded-full w-full"
              placeholderText="Selecciona fecha"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Hasta:
            </label>
            <DatePicker
              selected={filtroFin}
              onChange={(date) => setFiltroFin(date)}
              dateFormat="yyyy-MM-dd"
              className="border border-blue-700 p-2 rounded-full w-full"
              placeholderText="Selecciona fecha"
            />
          </div>

          <button
            onClick={filtrar}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition mt-2 md:mt-0"
          >
            Buscar
          </button>
        </div>

        {/* Tabla de resultados */}
        {resultados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-blue-200">
                <tr>
                  <th className="border px-3 py-2 text-left">Fecha</th>
                  <th className="border px-3 py-2 text-left">Hora</th>
                  <th className="border px-3 py-2 text-left">Médico</th>
                  <th className="border px-3 py-2 text-left">Especialidad</th>
                  <th className="border px-3 py-2 text-left">Sistema</th>
                  <th className="border px-3 py-2 text-left">Diagnóstico</th>
                  <th className="border px-3 py-2 text-left">Recomendaciones</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{item.fecha}</td>
                    <td className="border px-3 py-2">{item.hora_cita}</td>
                    <td className="border px-3 py-2">{item.medico}</td>
                    <td className="border px-3 py-2">{item.especialidad}</td>
                    <td className="border px-3 py-2">{item.sistema}</td>
                    <td className="border px-3 py-2">
                      {item.diagnostico}
                    </td>
                    <td className="border px-3 py-2">
                      {item.recomendaciones}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            No se encontraron registros en el rango seleccionado.
          </p>
        )}
      </div>

      <ChatWidget />
    </div>
  );
}