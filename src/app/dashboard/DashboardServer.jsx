// app/dashboard/DashboardServer.js
import DashboardClient from './DashboardClient';
import { getUserProfile, getProximaCita } from '@/utils/Request';

export default async function DashboardServer() {
  try {
    const [pacienteData, proximaCita] = await Promise.all([
      getUserProfile(),
      getProximaCita()
    ]);

    // El middleware ya maneja la autenticación, solo mostramos datos
    return (
      <DashboardClient 
        initialPaciente={pacienteData.ok ? pacienteData.profile : null}
        initialProximaCita={proximaCita}
      />
    );
  } catch (error) {
    console.error('Error en DashboardServer:', error);
    // Mostrar error en lugar de redirigir (el middleware ya bloquea acceso no autorizado)
    return (
      <div className="p-8">
        <h2 className="text-red-500">Error al cargar los datos</h2>
        <p>{error.message}</p>
      </div>
    );
  }
}