import { getHistorialPaciente } from '@/utils/Request';
import HistorialClient from "./HistorialClient";

export default async function HistorialPage() {
  const response = await getHistorialPaciente();
  
  if (!response.ok) {
    return (
      <div>
        <div className="max-w-5xl mx-auto p-8">
          <h2 className="text-2xl font-semibold text-yellow-600 mb-6">
            Historial Médico
          </h2>
          <p className="text-red-500 text-center mb-4">{response.error}</p>
        </div>
      </div>
    );
  }

  return (
    <HistorialClient
      initialHistorial={response.historial}
      getHistorialPaciente={getHistorialPaciente}
    />
  );
}