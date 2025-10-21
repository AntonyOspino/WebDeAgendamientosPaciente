"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getEspecialidades, getMedicosPorEspecialidad, reservarCita } from "@/utils/Request";

export default function ReservasClient({especialidadesProps}) {
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState("");
  const [doctor, setDoctor] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [especialidades, setEspecialidades] = useState(especialidadesProps || []);
  const [medicos, setMedicos] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [cargandoEspecialidades, setCargandoEspecialidades] = useState(true);
  const [cargandoMedicos, setCargandoMedicos] = useState(false);

  const router = useRouter();

  // Cargar especialidades al montar el componente
  useEffect(() => {
    cargarEspecialidades();
  }, []);

  // Cargar médicos cuando cambie la especialidad
  useEffect(() => {
    if (especialidad) {
      cargarMedicos(especialidad);
    } else {
      setMedicos([]);
      setDoctor("");
    }
  }, [especialidad]);

  const cargarEspecialidades = async () => {
    try {
      setCargandoEspecialidades(true);
      const data = await getEspecialidades();
      setEspecialidades(data);
    } catch (error) {
      console.error('Error cargando especialidades:', error);
      setMensaje("❌ Error al cargar las especialidades");
    } finally {
      setCargandoEspecialidades(false);
    }
  };

  const cargarMedicos = async (especialidadId) => {
    try {
      setCargandoMedicos(true);
      console.log('Cargando médicos para especialidad:', especialidadId); // ← Debug
      const data = await getMedicosPorEspecialidad(especialidadId);
      setMedicos(data);
    } catch (error) {
      console.error('Error cargando médicos:', error);
      setMensaje("❌ Error al cargar los médicos");
    } finally {
      setCargandoMedicos(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Archivos seleccionados:', files);
    console.log('Número de archivos:', files.length);
    console.log('Nombres:', files.map(f => f.name));
    setImagenes(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    // Validaciones básicas
    if (!fecha || !hora || !doctor || !especialidad) {
      setMensaje("❌ Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    // Validar que la fecha no sea en el pasado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fecha < hoy) {
      setMensaje("❌ La fecha no puede ser en el pasado.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Agregar datos de la cita
      formData.append("medico_id", doctor);
      formData.append("especialidad_id", especialidad);
      formData.append("fecha", fecha.toISOString().split("T")[0]);
      formData.append("hora", hora);
      
      // Agregar imágenes si las hay
      if (imagenes.length > 0) {
        imagenes.forEach((img) => {
          formData.append("imagenes", img);
        });
      }

       // Debug: ver qué se está enviando
    console.log('Datos a enviar:', {
      medico_id: doctor,
      especialidad_id: especialidad,
      fecha: fecha.toISOString().split("T")[0], // ← Cambiado
      hora: hora, // ← Cambiado
      num_imagenes: imagenes.length
    });

    // También debug del FormData
    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} = ${value}`);
    }

      const resultado = await reservarCita(formData);

      if (resultado.ok) {
        setMensaje("✅ Tu cita fue registrada y está pendiente de aprobación.");
        
        // Limpiar formulario
        setFecha(null);
        setHora("");
        setDoctor("");
        setEspecialidad("");
        setImagenes([]);
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setMensaje(`❌ Error: ${resultado.error}`);
      }
    } catch (error) {
      setMensaje("❌ Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 mt-8">
        <h2 className="text-2xl font-semibold text-blue-500 mb-6 text-center">
          Reserva de Cita Médica
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Especialidad */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Especialidad:</label>
            <select
              value={especialidad}
              onChange={(e) => setEspecialidad(e.target.value)}
              required
              disabled={cargandoEspecialidades}
              className="border border-blue-700 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {cargandoEspecialidades ? "Cargando especialidades..." : "Selecciona una especialidad"}
              </option>
              {especialidades.map((esp) => (
                <option key={esp.id} value={esp.id}>
                  {esp.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Médico */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Médico:</label>
            <select
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              required
              disabled={!especialidad || cargandoMedicos}
              className="border border-blue-700 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                {cargandoMedicos ? "Cargando médicos..." : 
                 !especialidad ? "Primero selecciona una especialidad" : 
                 "Selecciona un médico"}
              </option>
              {medicos.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.nombre_completo}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Fecha:</label>
            <DatePicker
              selected={fecha}
              onChange={(date) => setFecha(date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Selecciona una fecha"
              className="border border-blue-700 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Hora */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">Hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              className="border border-blue-700 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Imágenes */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Imágenes de referencia (opcional):
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-blue-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              Puedes subir fotos de tu afección (máximo 5 imágenes)
            </p>
            {imagenes.length > 0 && (
              <p className="text-sm text-green-600 mt-1">
                {imagenes.length} imagen(es) seleccionada(s)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="block mx-auto bg-green-600 text-white w-50 py-2 rounded-full hover:bg-green-700 transition font-medium disabled:opacity-50"
          >
            {loading ? "Creando cita..." : "Reservar Cita"}
          </button>

          {mensaje && (
            <p className={`text-center mt-3 font-medium ${
              mensaje.includes("✅") ? "text-green-600" : "text-red-600"
            }`}>
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}