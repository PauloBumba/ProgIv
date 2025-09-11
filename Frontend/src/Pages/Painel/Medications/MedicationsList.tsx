import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Badge } from 'primereact/badge';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';

import { FilterMatchMode } from 'primereact/api';

import { medicationService, type Medication } from '../../../Services/medicationService';

export const MedicationsList = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    strength: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMedications();
  }, []);

  const loadMedications = async () => {
    setLoading(true);
    try {
      const response = await medicationService.getAll();
      if (response.success) {
        setMedications(response.data);
      } else {
        showToast('error', 'Erro', 'Falha ao carregar medicamentos');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail });
  };

  const confirmDelete = (medication: Medication) => {
    confirmDialog({
      message: `Tem certeza que deseja excluir o medicamento "${medication.name}"?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteMedication(medication.id),
      reject: () => {},
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger'
    });
  };

  const deleteMedication = async (id: string) => {
    try {
      const response = await medicationService.delete(id);
      if (response.success) {
        showToast('success', 'Sucesso', 'Medicamento excluído com sucesso');
        loadMedications();
      } else {
        showToast('error', 'Erro', 'Falha ao excluir medicamento');
      }
    } catch (error: any) {
      showToast('error', 'Erro', error.message);
    }
  };

  // Templates das colunas
  const nameTemplate = (rowData: Medication) => (
    <div className="flex align-items-center gap-2">
      <div className="w-2rem h-2rem border-circle flex align-items-center justify-content-center"
           style={{ backgroundColor: '#00C896', color: 'white' }}>
        <i className="pi pi-heart text-sm"></i>
      </div>
      <div>
        <div className="font-medium">{rowData.name}</div>
        <div className="text-sm text-gray-500">{rowData.strength}</div>
      </div>
    </div>
  );

  const schedulesTemplate = (rowData: Medication) => {
    const scheduleCount = rowData.schedules?.length || 0;
    const activeSchedules = rowData.schedules?.filter(s => s.enabled).length || 0;
    
    return (
      <div className="flex align-items-center gap-2">
        <Badge 
          value={scheduleCount} 
          severity={scheduleCount > 0 ? 'success' : 'secondary'}
        />
        <span className="text-sm text-gray-600">
          {activeSchedules}/{scheduleCount} ativos
        </span>
      </div>
    );
  };

  const actionsTemplate = (rowData: Medication) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-eye"
        size="small"
        outlined
        tooltip="Visualizar"
        tooltipOptions={{ position: 'top' }}
        onClick={() => navigate(`/medications/${rowData.id}`)}
        style={{ color: '#0062A8', borderColor: '#0062A8' }}
      />
      <Button
        icon="pi pi-pencil"
        size="small"
        outlined
        tooltip="Editar"
        tooltipOptions={{ position: 'top' }}
        onClick={() => navigate(`/medications/${rowData.id}/edit`)}
        style={{ color: '#00C896', borderColor: '#00C896' }}
      />
      <Button
        icon="pi pi-clock"
        size="small"
        outlined
        tooltip="Gerenciar Horários"
        tooltipOptions={{ position: 'top' }}
        onClick={() => navigate(`/medications/${rowData.id}/schedules`)}
        style={{ color: '#003F7D', borderColor: '#003F7D' }}
      />
      <Button
        icon="pi pi-trash"
        size="small"
        outlined
        severity="danger"
        tooltip="Excluir"
        tooltipOptions={{ position: 'top' }}
        onClick={() => confirmDelete(rowData)}
      />
    </div>
  );

  const notesTemplate = (rowData: Medication) => (
    <div className="max-w-20rem">
      {rowData.notes ? (
        <span className="text-sm">{rowData.notes}</span>
      ) : (
        <span className="text-sm text-gray-400 italic">Sem observações</span>
      )}
    </div>
  );

  // Header da toolbar
  const leftToolbarTemplate = () => (
    <div className="flex align-items-center gap-2">
      <Button
        label="Novo Medicamento"
        icon="pi pi-plus"
        style={{ backgroundColor: '#00C896', borderColor: '#00C896' }}
        onClick={() => navigate('/medications/new')}
      />
      <Button
        label="Atualizar"
        icon="pi pi-refresh"
        outlined
        onClick={loadMedications}
        loading={loading}
        style={{ borderColor: '#0062A8', color: '#0062A8' }}
      />
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="flex align-items-center gap-2">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar medicamentos..."
          className="w-20rem"
        />
      </span>
    </div>
  );

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h2 className="m-0" style={{ color: '#003F7D' }}>
        <i className="pi pi-heart mr-2"></i>
        Medicamentos
      </h2>
      <Badge 
        value={medications.length} 
        severity="info" 
        size="large"
      />
    </div>
  );

  return (
    <div className="min-h-screen p-4" 
         style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
      
      <Card className="shadow-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        {header}
        
        <Toolbar 
          className="mb-4 border-round" 
          left={leftToolbarTemplate} 
          right={rightToolbarTemplate}
        />

        <DataTable
          value={medications}
          loading={loading}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          globalFilter={globalFilter}
          filters={filters}
          onFilter={(e) => setFilters(e.filters as any)}
          emptyMessage="Nenhum medicamento encontrado"
          className="p-datatable-sm"
          stripedRows
          showGridlines
          responsiveLayout="scroll"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} medicamentos"
        >
          <Column
            field="name"
            header="Medicamento"
            body={nameTemplate}
            sortable
            filter
            filterPlaceholder="Filtrar por nome"
            style={{ minWidth: '14rem' }}
          />
          
          <Column
            field="schedules"
            header="Horários"
            body={schedulesTemplate}
            style={{ minWidth: '8rem' }}
          />
          
          <Column
            field="notes"
            header="Observações"
            body={notesTemplate}
            style={{ minWidth: '12rem' }}
          />
          
          <Column
            body={actionsTemplate}
            header="Ações"
            frozen
            alignFrozen="right"
            style={{ minWidth: '12rem' }}
          />
        </DataTable>
      </Card>

      <Toast ref={toast} />
      <ConfirmDialog />
    </div>
  );
};