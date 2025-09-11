// Pages/Medications/MedicationDetails.tsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { medicationService, type Medication, type MedicationSchedule } from '../../../Services/medicationService';

export const MedicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  
  const [medication, setMedication] = useState<Medication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return navigate('/medications');
    loadMedication();
  }, [id]);

  const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail });
  };

  const loadMedication = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await medicationService.getById(id);
      if (response.success) {
        if (!response.data) {
          showToast('error', 'Erro', 'Medicamento não encontrado');
          navigate('/medications');
        } else {
          setMedication(response.data);
        }
      } else {
        showToast('error', 'Erro', 'Falha ao carregar medicamento');
        navigate('/medications');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
      navigate('/medications');
    } finally {
      setLoading(false);
    }
  };

  const markAsTaken = async (scheduleId: string) => {
    try {
      const response = await medicationService.markTaken(scheduleId);
      if (response.success) {
        showToast('success', 'Sucesso', 'Medicamento marcado como tomado');
        loadMedication();
      } else {
        showToast('error', 'Erro', 'Falha ao marcar como tomado');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
    }
  };

  const confirmDelete = () => {
    confirmDialog({
      message: `Tem certeza que deseja excluir o medicamento "${medication?.name}"? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: deleteMedication,
      reject: () => {},
      acceptLabel: 'Sim, Excluir',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger'
    });
  };

  const deleteMedication = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const response = await medicationService.delete(id);
      if (response.success) {
        showToast('success', 'Sucesso', 'Medicamento excluído com sucesso');
        setTimeout(() => navigate('/medications'), 1500);
      } else {
        showToast('error', 'Erro', 'Falha ao excluir medicamento');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const timeTemplate = (rowData: MedicationSchedule) => {
    const time = new Date(`2000-01-01T${rowData.timeOfDay}`);
    return time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const statusTemplate = (rowData: MedicationSchedule) => (
    <Tag 
      value={rowData.enabled ? 'Ativo' : 'Inativo'} 
      severity={rowData.enabled ? 'success' : 'secondary'}
      icon={`pi ${rowData.enabled ? 'pi-check' : 'pi-times'}`}
    />
  );

  const scheduleActionsTemplate = (rowData: MedicationSchedule) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-check"
        size="small"
        tooltip="Marcar como tomado"
        tooltipOptions={{ position: 'top' }}
        style={{ backgroundColor: '#00C896', borderColor: '#00C896' }}
        onClick={() => markAsTaken(rowData.id)}
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex align-items-center justify-content-center" 
           style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
        <Card className="text-center p-4">
          <ProgressSpinner aria-setsize={50} strokeWidth="4" />
          <p className="mt-3 text-gray-600">Carregando medicamento...</p>
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
             style={{ backgroundColor: '#00C896', color: 'white' }}>
          <i className="pi pi-heart text-xl"></i>
        </div>
        <div>
          <h1 className="m-0 text-3xl" style={{ color: '#003F7D' }}>
            {medication.name}
          </h1>
          <p className="m-0 text-gray-600">
            <i className="pi pi-tag mr-2"></i>
            {medication.strength}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          icon="pi pi-arrow-left"
          label="Voltar"
          outlined
          onClick={() => navigate('/medications')}
          style={{ borderColor: '#666', color: '#666' }}
        />
      </div>
    </div>
  );

  const scheduleCount = medication.schedules?.length || 0;
  const activeSchedules = medication.schedules?.filter(s => s.enabled).length || 0;

  return (
    <div className="min-h-screen p-4" 
         style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
      
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-3 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          {header}
        </Card>

        <div className="grid">
          <div className="col-12 lg:col-8">
            <Card className="shadow-3 h-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <h3 className="text-xl mb-4" style={{ color: '#003F7D' }}>
                <i className="pi pi-info-circle mr-2"></i>
                Informações Gerais
              </h3>
              <div className="grid">
                <div className="col-12 md:col-6">
                  <div className="field">
                    <label className="block font-medium mb-2 text-gray-700">Nome:</label>
                    <div className="p-3 bg-gray-50 border-round text-lg font-medium">
                      {medication.name}
                    </div>
                  </div>
                </div>
                <div className="col-12 md:col-6">
                  <div className="field">
                    <label className="block font-medium mb-2 text-gray-700">Concentração:</label>
                    <div className="p-3 bg-gray-50 border-round text-lg">
                      {medication.strength}
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="field">
                    <label className="block font-medium mb-2 text-gray-700">Observações:</label>
                    <div className="p-3 bg-gray-50 border-round min-h-4rem">
                      {medication.notes ? (
                        <span className="text-gray-800">{medication.notes}</span>
                      ) : (
                        <span className="text-gray-400 italic">Nenhuma observação cadastrada</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              <div className="flex justify-content-end gap-3">
                <Button
                  label="Editar"
                  icon="pi pi-pencil"
                  outlined
                  onClick={() => navigate(`/medications/${medication.id}/edit`)}
                  style={{ borderColor: '#00C896', color: '#00C896' }}
                />
                <Button
                  label="Gerenciar Horários"
                  icon="pi pi-clock"
                  onClick={() => navigate(`/medications/${medication.id}/schedules`)}
                  style={{ backgroundColor: '#0062A8', borderColor: '#0062A8' }}
                />
                <Button
                  label="Excluir"
                  icon="pi pi-trash"
                  severity="danger"
                  outlined
                  onClick={confirmDelete}
                />
              </div>
            </Card>
          </div>

          <div className="col-12 lg:col-4">
            <Card className="shadow-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <h3 className="text-xl mb-4" style={{ color: '#003F7D' }}>
                <i className="pi pi-clock mr-2"></i>
                Horários Configurados
              </h3>
              <div className="text-center mb-4">
                <div className="flex justify-content-center align-items-center gap-2 mb-3">
                  <Badge 
                    value={scheduleCount} 
                    size="large"
                    severity={scheduleCount > 0 ? 'success' : 'secondary'}
                  />
                  <span className="text-lg">Total de horários</span>
                </div>
                <div className="flex justify-content-center align-items-center gap-2">
                  <Badge 
                    value={activeSchedules} 
                    size="large"
                    severity={activeSchedules > 0 ? 'info' : 'secondary'}
                  />
                  <span className="text-lg">Horários ativos</span>
                </div>
              </div>

              {scheduleCount === 0 ? (
                <div className="text-center p-4 bg-gray-50 border-round">
                  <i className="pi pi-clock text-3xl text-gray-400 mb-2"></i>
                  <p className="text-gray-600 mb-3">Nenhum horário configurado</p>
                  <Button
                    label="Adicionar Horário"
                    icon="pi pi-plus"
                    size="small"
                    onClick={() => navigate(`/medications/${medication.id}/schedules`)}
                    style={{ backgroundColor: '#00C896', borderColor: '#00C896' }}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  {medication.schedules?.slice(0, 3).map((schedule) => (
                    <div key={schedule.id} className="flex justify-content-between align-items-center p-2 bg-gray-50 border-round">
                      <span className="font-medium">{timeTemplate(schedule)}</span>
                      {statusTemplate(schedule)}
                    </div>
                  ))}
                  {scheduleCount > 3 && (
                    <div className="text-center mt-3">
                      <Button
                        label={`Ver todos (${scheduleCount})`}
                        size="small"
                        text
                        onClick={() => navigate(`/medications/${medication.id}/schedules`)}
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>

        {scheduleCount > 0 && (
          <Card className="shadow-3 mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <h3 className="text-xl mb-4" style={{ color: '#003F7D' }}>
              <i className="pi pi-list mr-2"></i>
              Todos os Horários
            </h3>
            <DataTable
              value={medication.schedules}
              dataKey="id"
              className="p-datatable-sm"
              stripedRows
              emptyMessage="Nenhum horário configurado"
            >
              <Column
                field="timeOfDay"
                header="Horário"
                body={timeTemplate}
                sortable
                style={{ width: '30%' }}
              />
              <Column
                field="enabled"
                header="Status"
                body={statusTemplate}
                style={{ width: '30%' }}
              />
              <Column
                body={scheduleActionsTemplate}
                header="Ações"
                style={{ width: '40%' }}
              />
            </DataTable>
          </Card>
        )}
      </div>

      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
};
