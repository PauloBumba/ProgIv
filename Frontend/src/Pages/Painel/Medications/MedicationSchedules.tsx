import { useEffect, useState, useRef } from 'react';
import { scheduleService } from '../../../Services/scheduleService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { format } from 'date-fns';

interface ISchedule {
  id?: number;
  medicationId: number;
  timeOfDay: string;
  enabled: boolean;
  repeatIntervalDays: number;
  startDate: string;
  endDate: string;
}

interface IScheduleListProps {
  medicationId: number;
}

export const ScheduleList = ({ medicationId }: IScheduleListProps) => {
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ISchedule | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const toast = useRef<Toast>(null);

  // Buscar schedules por medicamento
  const fetchSchedules = async () => {
    try {
      const res = await scheduleService.getByMedication(medicationId);
      setSchedules(res.data.data.filter((s:any) => s.enabled) || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar schedules');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [medicationId]);

  // Confirmar exclusão
  const confirmDelete = (id: number) => {
    confirmDialog({
      message: 'Tem certeza que deseja deletar este schedule?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(id),
    });
  };

  // Deletar schedule
  const handleDelete = async (id: number) => {
    try {
     var deleteSchedule = await scheduleService.delete(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: deleteSchedule.data.message   });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar schedule');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    }
  };

  // Marcar como tomado
  const handleMarkTaken = async (id: number) => {
    try {
     var markSchedule= await scheduleService.markTaken(id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: markSchedule.data.message   });
      fetchSchedules();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao marcar como tomado');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    }
  };

  // Abrir modal criar
  const openCreateModal = () => {
    setSelectedSchedule({ medicationId, timeOfDay: '', enabled: true, repeatIntervalDays: 1, startDate: '', endDate: '' });
    setModalVisible(true);
  };

  // Abrir modal editar
  const openEditModal = (schedule: ISchedule) => {
    setSelectedSchedule(schedule);
    setModalVisible(true);
  };

  // Fechar modal
  const hideModal = () => {
    setModalVisible(false);
    setSelectedSchedule(null);
    setError(null);
  };

  // Salvar schedule
  const handleSave = async () => {
    if (!selectedSchedule) return;

    if (!selectedSchedule.timeOfDay || !selectedSchedule.startDate) {
      setError('Horário e data de início são obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      if (selectedSchedule.id) {
        await scheduleService.update(selectedSchedule.id, selectedSchedule);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Schedule atualizado.' });
      } else {
        await scheduleService.create(selectedSchedule);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Schedule criado.' });
      }
      fetchSchedules();
      hideModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar schedule');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    } finally {
      setSaving(false);
    }
  };

  // Botões ação
  const actionBodyTemplate = (rowData: ISchedule) => {
    return (
      <div className="flex gap-2 justify-content-center">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning" onClick={() => openEditModal(rowData)} tooltip="Editar" type="button"/>
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDelete(rowData.id!)} tooltip="Deletar" type="button"/>
        <Button icon="pi pi-check" className="p-button-rounded p-button-success" onClick={() => handleMarkTaken(rowData.id!)} tooltip="Marcar como tomado" type="button"/>
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h2>Schedules</h2>
      <div className="flex gap-3 align-items-center">
        <InputText
          type="search"
          placeholder="Buscar..."
          onInput={(e: any) => setGlobalFilter(e.target.value)}
          value={globalFilter}
          className="p-input-icon-left"
          style={{ maxWidth: 250 }}
        />
        <Button label="Criar Schedule" icon="pi pi-plus" className="p-button-success" onClick={openCreateModal} type="button"/>
      </div>
    </div>
  );

  const formatDate = (rowData: ISchedule, field: keyof ISchedule) => {
    const date = rowData[field];
    if (!date) return '';
    return format(new Date(date as string), 'dd/MM/yyyy HH:mm');
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      {error && <Message severity="error" text={error} />}
      <ConfirmDialog />
      <DataTable
        value={schedules}
        paginator
        rows={10}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="Nenhum schedule encontrado."
        responsiveLayout="scroll"
        stripedRows
      >
        <Column field="timeOfDay" header="Horário" sortable filter filterPlaceholder="Buscar"/>
        <Column field="enabled" header="Ativo" body={(row) => row.enabled ? 'Sim' : 'Não'} sortable filter filterPlaceholder="Buscar"/>
        <Column field="repeatIntervalDays" header="Intervalo (dias)" sortable filter filterPlaceholder="Buscar"/>
        <Column field="startDate" header="Início" body={(row) => formatDate(row, 'startDate')} sortable filter filterPlaceholder="Buscar"/>
        <Column field="endDate" header="Fim" body={(row) => formatDate(row, 'endDate')} sortable filter filterPlaceholder="Buscar"/>
        <Column body={actionBodyTemplate} header="Ações" style={{ width: '12rem' }}/>
      </DataTable>

      <Dialog
        visible={modalVisible}
        header={selectedSchedule?.id ? 'Editar Schedule' : 'Criar Schedule'}
        modal
        closable
        onHide={hideModal}
        footer={
          <>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideModal} className="p-button-text" disabled={saving} type="button"/>
            <Button label="Salvar" icon="pi pi-check" onClick={handleSave} disabled={saving} loading={saving} type="button"/>
          </>
        }
      >
       <div className="p-fluid">
  {/* Horário */}
  <div className="field">
    <label htmlFor="timeOfDay">Horário</label>
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon">
        <i className="pi pi-clock"></i>
      </span>
      <InputText
        id="timeOfDay"
        placeholder="HH:mm"
        value={selectedSchedule?.timeOfDay || ''}
        onChange={(e) =>
          setSelectedSchedule((prev) =>
            prev ? { ...prev, timeOfDay: e.target.value } : null
          )
        }
        disabled={saving}
      />
    </div>
  </div>

  {/* Intervalo (dias) */}
  <div className="field mt-3">
    <label htmlFor="repeatIntervalDays">Intervalo (dias)</label>
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon">
        <i className="pi pi-refresh"></i>
      </span>
      <InputText
        id="repeatIntervalDays"
        placeholder="Ex: 1"
        value={selectedSchedule?.repeatIntervalDays || 1 || '' || null}
        onChange={(e) =>
          setSelectedSchedule((prev) =>
            prev ? { ...prev, repeatIntervalDays: parseInt(e.target.value) || 1 } : null
          )
        }
        disabled={saving}
      />
    </div>
  </div>

  {/* Data de início */}
  <div className="field mt-3">
    <label htmlFor="startDate">Data de Início</label>
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon">
        <i className="pi pi-calendar"></i>
      </span>
      <InputText
        id="startDate"
        type="date"
        value={selectedSchedule?.startDate || ''}
        onChange={(e) =>
          setSelectedSchedule((prev) =>
            prev ? { ...prev, startDate: e.target.value } : null
          )
        }
        disabled={saving}
      />
    </div>
  </div>

  {/* Data de fim */}
  <div className="field mt-3">
    <label htmlFor="endDate">Data de Fim</label>
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon">
        <i className="pi pi-calendar-times"></i>
      </span>
      <InputText
        id="endDate"
        type="date"
        value={selectedSchedule?.endDate || ''}
        onChange={(e) =>
          setSelectedSchedule((prev) =>
            prev ? { ...prev, endDate: e.target.value } : null
          )
        }
        disabled={saving}
      />
    </div>
  </div>

  {/* Ativo */}
  <div className="field mt-3">
    <label htmlFor="enabled">Ativo</label>
    <div className="p-inputgroup">
      <span className="p-inputgroup-addon">
        <i className={selectedSchedule?.enabled ? 'pi pi-check' : 'pi pi-times'}></i>
      </span>
      <InputText
        id="enabled"
        value={selectedSchedule?.enabled ? 'Sim' : 'Não'}
        disabled
      />
    </div>
  </div>

  {error && <Message severity="error" text={error} />}
</div>
      </Dialog>
    </div>
  );
};