import ReservasClient from "./ReservasClient";
import { getEspecialidades } from "@/utils/Request";

export default async function ReservasPage(){
  const especialidades = await getEspecialidades();

  return (
    <div>
      <ReservasClient especialidades={especialidades} />
    </div>
  );
}