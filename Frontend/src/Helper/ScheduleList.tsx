import { useParams } from "react-router-dom";
import { ScheduleList } from "../Pages/Painel/Schedules/ScheduleList";

export const useMedicationId = (): number | null => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  // parseInt é suficiente para IDs long no front
  const parsedId = parseInt(id, 10);
  return isNaN(parsedId) ? null : parsedId;
};

// Wrapper para passar a prop para o componente
export const ScheduleListWrapper = () => {
  const medicationId = useMedicationId();
  if (medicationId === null) return <div>Medicamento não encontrado</div>;

  return <ScheduleList medicationId={medicationId} />;
};
