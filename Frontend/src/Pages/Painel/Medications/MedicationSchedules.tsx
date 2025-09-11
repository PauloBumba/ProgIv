// Pages/Medications/MedicationSchedules.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { Timeline } from 'primereact/timeline';
import { Badge } from 'primereact/badge';

import { 
  medicationService, 
  type Medication, 
  type MedicationSchedule, 
  type CreateScheduleDto 
} from '../../../Services/medicationService';

interface ScheduleFormData {
  timeOfDay: string;
  enabled: boolean;
}

export const MedicationSchedules = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  
  const [medication, setMedication] = useState<Medication | null>(null);
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<ScheduleFormData>({
    timeOfDay: '',
    enabled: true
  });
  
  const [formErrors, setFormErrors] = useState<{ timeOfDay?: string }>({});

  useEffect(() => {
    if (id) {
      loadMedication();
    } else {
      navigate('/medications');
    }
  }, [id]);

  const loadMedication = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await medicationService.getById(id);
      if (response.success) {
        setMedication(response.data);
        setSchedules(response.data.schedules || []);
      } else {
        showToast('error', 'Erro', 'Medicamento não encontrado');
        navigate('/medications');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
      navigate('/medications');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail });
  };

  const openDialog = () => {
    setFormData({ timeOfDay: '', enabled: true });
    setFormErrors({});
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setFormData({ timeOfDay: '', enabled: true });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { timeOfDay?: string } = {};
    
    if (!formData.timeOfDay.trim()) {
      errors.timeOfDay = 'Horário é obrigatório';
    } else {
      // Validar formato HH:MM
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.timeOfDay)) {
        errors.timeOfDay = 'Formato inválido. Use HH:MM (ex: 08:30)';
      } else {
        // Verificar se já existe um horário igual
        const timeExists = schedules.some(s => s.timeOfDay === formData.timeOfDay);
        if (timeExists) {
          errors.timeOfDay = 'Já existe um horário configurado para este horário';
        }
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !id) return;
    
    setSubmitting(true);
    try {
      const scheduleData: CreateScheduleDto = {
        timeOfDay: formData.timeOfDay,
        enabled: formData.enabled
      };
      
      const response = await medicationService.addSchedule(id, scheduleData);
      if (response.success) {
        showToast('success', 'Sucesso', 'Horário adicionado com sucesso');
        closeDialog();
        loadMedication(); // Recarregar dados
      } else {
        showToast('error', 'Erro', 'Falha ao adicionar horário');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const markAsTaken = async (scheduleId: string) => {
    try {
      const response = await medicationService.markTaken(scheduleId);
      if (response.success) {
        showToast('success', 'Sucesso', 'Medicamento marcado como tomado');
        // Aqui você poderia atualizar algum histórico local se necessário
      } else {
        showToast('error', 'Erro', 'Falha ao marcar como tomado');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
    }
  };

  // Templates das colunas
  const timeTemplate = (rowData: MedicationSchedule) => {
    const [hours, minutes] = rowData.timeOfDay.split(':');
    return (
      <div className="flex align-items-center gap-2">
        <i className="pi pi-clock text-blue-500"></i>
        <span className="font-medium text-lg">
          {hours.padStart(2, '0')}:{minutes.padStart(2, '0')}
        </span>
      </div>
    );
  };

  const statusTemplate = (rowData: MedicationSchedule) => (
    <Tag 
      value={rowData.enabled ? 'Ativo' : 'Inativo'} 
      severity={rowData.enabled ? 'success' : 'secondary'}
      icon={`pi ${rowData.enabled ? 'pi-check-circle' : 'pi-times-circle'}`}
    />
  );

  const actionsTemplate = (rowData: MedicationSchedule) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-check"
        size="small"
        tooltip="Marcar como tomado"
        tooltipOptions={{ position: 'top' }}
        style={{ backgroundColor: '#00C896', borderColor: '#00C896' }}
        onClick={() => markAsTaken(rowData.id)}
      />
      <Button
        icon="pi pi-pencil"
        size="small"
        outlined
        tooltip="Editar horário"
        tooltipOptions={{ position: 'top' }}
        style={{ borderColor: '#0062A8', color: '#0062A8' }}
        // Implementar edição se necessário
      />
    </div>
  );

  // Dados para a timeline (horários do dia)
  const getTimelineEvents = () => {
    if (!schedules.length) return [];
    
    return schedules
      .filter(s => s.enabled)
      .sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay))
      .map(schedule => ({
        status: 'Programado',
        date: schedule.timeOfDay,
        icon: 'pi pi-clock',
        color: '#00C896'
      }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
        <Card className="text-center p-4">
          <ProgressSpinner aria-setsize={50} strokeWidth="4" />
          <p className="mt-3 text-gray-600">Carregando horários...</p>
        </Card>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
        <Card className="text-center p-4">
          <i className="pi pi-exclamation-triangle text-4xl text-orange-500 mb-3"></i>
          <h3>Medicamento não encontrado</h3>
          <Button 
            label="Voltar" 
            icon="pi pi-arrow-left"
            onClick={() => navigate('/medications')}
          />
        </Card>
      </div>
    );
  }

  const header = (
    <div className="flex align-items-center justify-content-between">
      <div className="flex align-items-center gap-3">
        <div className="w-4rem h-4rem border-circle flex align-items-center justify-content-center"
             style={{ backgroundColor: '#0062A8', color: 'white' }}>
          <i className="pi pi-clock text-xl"></i>
        </div>
        <div>
          <h1 className="m-0 text-2xl" style={{ color: '#003F7D' }}>
            Horários - {medication.name}
          </h1>
          <p className="m-0 text-gray-600">
            <i className="pi pi-tag mr-2"></i>
            {medication.strength}
          </p>
        </div>
      </div>
      <div className="flex align-items-center gap-2">
        <Badge 
          value={schedules.length} 
          severity={schedules.length > 0 ? 'success' : 'secondary'}
        />
        <Button
          icon="pi pi-arrow-left"
          label="Voltar"
          outlined
          onClick={() => navigate(`/medications/${medication.id}`)}
          style={{ borderColor: '#666', color: '#666' }}
        />
      </div>
    </div>
  );

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={closeDialog}
        disabled={submitting}
      />
      <Button
        label="Adicionar"
        icon="pi pi-check"
        onClick={handleSubmit}
        loading={submitting}
        style={{ backgroundColor: '#00C896', borderColor: '#00C896' }}
      />
    </div>
  );

  return (
    <div className="min-h-screen p-4" 
         style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="shadow-3 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          {header}
        </Card>

        <div className="grid">
          {/* Lista de Horários */}
          <div className="col-12 lg:col-8">
            <Card className="shadow-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <div className="flex justify-content-between align-items-center mb-4">
                <h3 className="m-0 text-xl" style={{ color: '#003F7D' }}>
                  <i className="pi pi-list mr-2"></i>
                  Horários Configurados
                </h3>
                <Button
                  label="Novo Horário"
                  icon="pi pi-plus"
                  onClick={openDialog}
                  style={{ backgroundColor: '#00C896', borderColor: '#00C896' }}
                />
              </div>

              {schedules.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 border-round">
                  <i className="pi pi-clock text-4xl text-gray-400 mb-3"></i>
                  <h4 className="text-gray-600 mb-3">Nenhum horário configurado</h4>
                  <p className="text-gray-500 mb-4">
                    Configure os horários para tomar este medicamento
                  </p>
                  <Button
                    label="Adicionar Primeiro Horário"
                    icon="pi pi-plus"
                    onClick={openDialog}
                    style={{ backgroundColor: '#00C896', borderColor: '#00C896' }}
                  />
                </div>
              ) : (
                <DataTable
                  value={schedules}
                  dataKey="id"
                  className="p-datatable-sm"
                  stripedRows
                  showGridlines
                  sortField="timeOfDay"
                  sortOrder={1}
                >
                  <Column
                    field="timeOfDay"
                    header="Horário"
                    body={timeTemplate}
                    sortable
                    style={{ width: '40%' }}
                  />
                  
                  <Column
                    field="enabled"
                    header="Status"
                    body={statusTemplate}
                    style={{ width: '30%' }}
                  />
                  
                  <Column
                    body={actionsTemplate}
                    header="Ações"
                    style={{ width: '30%' }}
                  />
                </DataTable>
              )}
            </Card>
          </div>

          {/* Timeline do Dia */}
          <div className="col-12 lg:col-4">
            <Card className="shadow-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <h3 className="text-xl mb-4" style={{ color: '#003F7D' }}>
                <i className="pi pi-calendar mr-2"></i>
                Cronograma do Dia
              </h3>

              {getTimelineEvents().length === 0 ? (
                <div className="text-center p-4 bg-gray-50 border-round">
                  <i className="pi pi-calendar-times text-3xl text-gray-400 mb-2"></i>
                  <p className="text-gray-600 mb-3">Nenhum horário ativo</p>
                  <small className="text-gray-500">
                    Configure horários para visualizar o cronograma
                  </small>
                </div>
              ) : (
                <Timeline 
                  value={getTimelineEvents()} 
                  align="left" 
                  className="customized-timeline"
                  marker={(item) => (
                    <span className="custom-marker p-2 border-circle shadow-2"
                          style={{ backgroundColor: item.color, color: 'white' }}>
                      <i className={item.icon}></i>
                    </span>
                  )}
                  content={(item) => (
                    <Card className="p-2 shadow-1">
                      <div className="flex align-items-center gap-2">
                        <i className="pi pi-clock text-blue-500"></i>
                        <span className="font-bold text-lg">{item.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 m-0 mt-1">{medication.name}</p>
                    </Card>
                  )}
                />
              )}
            </Card>

            {/* Resumo */}
            <Card className="shadow-3 mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <h4 className="mb-3" style={{ color: '#003F7D' }}>Resumo</h4>
              
              <div className="grid text-center">
                <div className="col-6">
                  <div className="p-3 bg-green-50 border-round">
                    <div className="text-2xl font-bold text-green-600">
                      {schedules.filter(s => s.enabled).length}
                    </div>
                    <div className="text-sm text-green-700">Ativos</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-gray-50 border-round">
                    <div className="text-2xl font-bold text-gray-600">
                      {schedules.length}
                    </div>
                    <div className="text-sm text-gray-700">Total</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog para Adicionar Horário */}
      <Dialog
        header="Novo Horário"
        visible={dialogVisible}
        style={{ width: '450px' }}
        footer={dialogFooter}
        onHide={closeDialog}
        modal
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="timeOfDay" className="block font-medium mb-2">
              <i className="pi pi-clock mr-2"></i>
              Horário *
            </label>
            <InputText
              id="timeOfDay"
              value={formData.timeOfDay}
              onChange={(e) => setFormData(prev => ({ ...prev, timeOfDay: e.target.value }))}
              placeholder="08:30"
              className={formErrors.timeOfDay ? 'p-invalid' : ''}
              maxLength={5}
            />
            {formErrors.timeOfDay && (
              <small className="p-error">{formErrors.timeOfDay}</small>
            )}
            <small className="text-gray-500">Formato: HH:MM (ex: 08:30, 14:15)</small>
          </div>

          <div className="field mt-3">
            <Checkbox
              inputId="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.checked || false }))}
            />
            <label htmlFor="enabled" className="ml-2">Ativo</label>
          </div>
        </div>
      </Dialog>

      <Toast ref={toast} />
    </div>
  );
};
