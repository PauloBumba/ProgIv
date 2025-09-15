import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { useState } from 'react';

// Função que cria a coluna de schedule
const scheduleBodyTemplate = (rowData: IMedication) => {
  const [time, setTime] = useStateate<Date | null>(null);

  const handleSchedule = () => {
    if (!time) return;

    // Aqui você chamaria seu serviço de schedule passando o id do medicamento
    // ex: scheduleService.create({ medicationId: rowData.id, time })
    Toast.current?.show({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Horário agendado: ${time.toLocaleTimeString()} para ${rowData.name}`
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <Calendar
        value={time}
        onChange={(e) => setTime(e.value as Date)}
        timeOnly
        hourFormat="24"
        placeholder="Selecione o horário"
        showIcon
      />
      <Button
        icon="pi pi-check"
        className="p-button-success p-button-sm"
        onClick={handleSchedule}
        tooltip="Agendar horário"
      />
    </div>
  );
};
