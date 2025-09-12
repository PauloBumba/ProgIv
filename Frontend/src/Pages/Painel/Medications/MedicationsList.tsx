import { useEffect, useState, useRef } from 'react';
import { medicationService } from '../../../Services/medicationService'; // seu serviço de medicamentos
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';

interface IMedication {
  id?: string;
  name: string;
  strength: string;
  notes?: string;
}

export const GenericList= () => {
  const [medications, setMedications] = useState<IMedication[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedMed, setSelectedMed] = useState<IMedication | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useRef<Toast>(null);

  // Buscar medicamentos
  const fetchMeds = async () => {
    try {
      const res = await medicationService.getAll();
      setMedications(res.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar medicamentos');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  // Confirmar exclusão
  const confirmDelete = (id: string) => {
    confirmDialog({
      message: 'Tem certeza que deseja deletar este medicamento?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(id),
    });
  };

  // Deletar medicamento
  const handleDelete = async (id: string) => {
    try {
      await medicationService.delete(id);
      setMedications(prev => prev.filter(m => m.id !== id));
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Medicamento deletado.' });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar medicamento');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    }
  };

  // Abrir modal criar
  const openCreateModal = () => {
    setSelectedMed({ name: '', strength: '', notes: '' });
    setModalVisible(true);
  };

  // Abrir modal editar
  const openEditModal = (med: IMedication) => {
    setSelectedMed(med);
    setModalVisible(true);
  };

  // Fechar modal
  const hideModal = () => {
    setModalVisible(false);
    setSelectedMed(null);
    setError(null);
  };

  // Salvar medicamento (criar ou editar)
  const handleSave = async () => {
    if (!selectedMed) return;

    if (!selectedMed.name.trim() || !selectedMed.strength.trim()) {
      setError('Nome e força são obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      if (selectedMed.id) {
        await medicationService.update(selectedMed.id, selectedMed);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Medicamento atualizado.' });
      } else {
        await medicationService.create(selectedMed);
        toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Medicamento criado.' });
      }
      fetchMeds();
      hideModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar medicamento');
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error });
    } finally {
      setSaving(false);
    }
  };

  // Botões AÇÃO
  const actionBodyTemplate = (rowData: IMedication) => {
    return (
      <div className="flex gap-2 justify-content-center">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning"
          onClick={() => openEditModal(rowData)}
          tooltip="Editar medicamento"
          tooltipOptions={{ position: 'top' }}
          type="button"
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmDelete(rowData.id!)}
          tooltip="Deletar medicamento"
          tooltipOptions={{ position: 'top' }}
          type="button"
        />
      </div>
    );
  };

  const header = (
    <div className="flex justify-content-between align-items-center">
      <h2>Lista de Medicamentos</h2>
      <div className="flex gap-3 align-items-center">
        <InputText
          type="search"
          placeholder="Buscar..."
          onInput={(e: any) => setGlobalFilter(e.target.value)}
          value={globalFilter}
          className="p-input-icon-left"
          style={{ maxWidth: 250 }}
        />
        <Button
          label="Criar Medicamento"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={openCreateModal}
          type="button"
        />
      </div>
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />
      {error && <Message severity="error" text={error} />}
      <ConfirmDialog />
      <DataTable
        value={medications}
        paginator
        rows={10}
        header={header}
        globalFilter={globalFilter}
        emptyMessage="Nenhum medicamento encontrado."
        responsiveLayout="scroll"
        stripedRows
      >
        <Column field="name" header="Nome" sortable filter filterPlaceholder="Buscar por nome" />
        <Column field="strength" header="Força" sortable filter filterPlaceholder="Buscar por força" />
        <Column field="notes" header="Notas" />
        <Column body={actionBodyTemplate} header="Ações" style={{ width: '10rem' }} />
      </DataTable>

      <Dialog
        visible={modalVisible}
        header={selectedMed?.id ? 'Editar Medicamento' : 'Criar Medicamento'}
        modal
        closable
        onHide={hideModal}
        footer={
          <>
            <Button label="Cancelar" icon="pi pi-times" onClick={hideModal} className="p-button-text" disabled={saving} type="button" />
            <Button label="Salvar" icon="pi pi-check" onClick={handleSave} disabled={saving} loading={saving} type="button" />
          </>
        }
      >
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="name">Nome</label>
            <InputText
              id="name"
              value={selectedMed?.name || ''}
              onChange={(e) => setSelectedMed(prev => prev ? { ...prev, name: e.target.value } : null)}
              disabled={saving}
              required
            />
          </div>
          <div className="field mt-3">
            <label htmlFor="strength">Força</label>
            <InputText
              id="strength"
              value={selectedMed?.strength || ''}
              onChange={(e) => setSelectedMed(prev => prev ? { ...prev, strength: e.target.value } : null)}
              disabled={saving}
              required
            />
          </div>
          <div className="field mt-3">
            <label htmlFor="notes">Notas</label>
            <InputText
              id="notes"
              value={selectedMed?.notes || ''}
              onChange={(e) => setSelectedMed(prev => prev ? { ...prev, notes: e.target.value } : null)}
              disabled={saving}
            />
          </div>
          {error && <Message severity="error" text={error} />}
        </div>
      </Dialog>
    </div>
  );
}
