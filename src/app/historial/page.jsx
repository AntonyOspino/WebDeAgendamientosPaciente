"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HistorialPage() {
  const [historial, setHistorial] = useState([]);
  const [filtroInicio, setFiltroInicio] = useState(null);
  const [filtroFin, setFiltroFin] = useState(null);
  const [resultados, setResultados] = useState([]);

  // Simulación de datos (luego se traerán desde la API)
  useEffect(() => {
    const dataSimulada = [
      {
        id: 1,
        fecha: "2025-08-12",
        doctor: "Dra. Yackelin Ruiz",
        especialidad: "Sistema respiratorio",
        diagnostico:
          "El paciente presenta episodios leves de asma. Se recomienda evitar el polvo y ambientes fríos.",
        recomendaciones: "Usar inhalador según necesidad y realizar control en 30 días.",
      },
      {
        id: 2,
        fecha: "2025-05-20",
        doctor: "Dr. Andrés Pérez",
        especialidad: "Sistema digestivo",
        diagnostico:
          "Gastritis leve detectada. Paciente manifiesta dolor epigástrico recurrente.",
        recomendaciones:
          "Dieta blanda, evitar comidas irritantes y realizar endoscopia en próxima cita.",
      },
    ];
    setHistorial(dataSimulada);
    setResultados(dataSimulada);
  }, []);

  // Filtrar por fecha o rango
  const filtrar = () => {
    if (!filtroInicio && !filtroFin) {
      setResultados(historial);
      return;
    }

    const inicio = filtroInicio ? new Date(filtroInicio) : new Date("2000-01-01");
    const fin = filtroFin ? new Date(filtroFin) : new Date("2100-01-01");

    const filtrados = historial.filter((item) => {
      const fechaCita = new Date(item.fecha);
      return fechaCita >= inicio && fechaCita <= fin;
    });

    setResultados(filtrados);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-semibold text-yellow-600 mb-6">
          Historial Médico
        </h2>

        {/* Filtros por fecha */}
        <div className="w-200 bg-white p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-15 items-center">
          <div>
            <label className="ml-15 block text-sm font-medium mb-1 text-gray-700">
              Desde:
            </label>
            <DatePicker
              selected={filtroInicio}
              onChange={(date) => setFiltroInicio(date)}
              dateFormat="yyyy-MM-dd"
              className="ml-15 flex-1 border border-blue-700 p-2 rounded-full "
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
              className="flex-full border border-blue-700 p-2 rounded-full "
            />
          </div>

          <button
            onClick={filtrar}
            className=" bg-green-300 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition mt-2 md:mt-6"
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
                  <th className="border px-3 py-2 text-left">Doctor</th>
                  <th className="border px-3 py-2 text-left">Especialidad</th>
                  <th className="border px-3 py-2 text-left">Diagnóstico</th>
                  <th className="border px-3 py-2 text-left">Recomendaciones</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2">{item.fecha}</td>
                    <td className="border px-3 py-2">{item.doctor}</td>
                    <td className="border px-3 py-2">{item.especialidad}</td>
                    <td className="border px-3 py-2">{item.diagnostico}</td>
                    <td className="border px-3 py-2">{item.recomendaciones}</td>
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
