import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { expenseRequestService } from '../../Services/expenseRequestService';

interface ExpenseRequest {
  id: string;
  title: string;
  amount: number;
  status: string;
  createdAt: string;
  // adiciona outros campos que precisar
}

interface AppUser {
  roles: string[]; // roles do usuário
}

interface Props {
  currentUser?: AppUser | null; // aceita null pra garantir segurança
}

export const ExpenseRequestList: React.FC<Props> = ({ currentUser }) => {
  const [requests, setRequests] = useState<ExpenseRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (currentUser) {
      fetchRequests();
    }
  }, [currentUser]);

  const fetchRequests = async () => {
    try {
      const res = await expenseRequestService.getAll();
      setRequests(res.data.data);
      console.log("Payload recebido:", res.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar solicitações');
    }
  };

  if (!currentUser) {
    return <p>Usuário não autenticado</p>;
  }

  const hasRole = (role: string) => currentUser?.roles.includes(role) ?? false;

  const confirmDelete = (id: string) => {
    confirmDialog({
      message: 'Quer mesmo deletar essa solicitação?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: () => handleDelete(id),
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await expenseRequestService.delete(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.current?.show({ severity: 'success', summary: 'Deletado', detail: 'Solicitação deletada.' });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao deletar';
      setError(msg);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await expenseRequestService.approve(id);
      toast.current?.show({ severity: 'success', summary: 'Aprovado', detail: 'Solicitação aprovada.' });
      fetchRequests();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao aprovar';
      setError(msg);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await expenseRequestService.cancel(id);
      toast.current?.show({ severity: 'success', summary: 'Cancelado', detail: 'Solicitação cancelada.' });
      fetchRequests();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao cancelar';
      setError(msg);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
    }
  };

  const handlePay = async (id: string) => {
    try {
      await expenseRequestService.pay(id);
      toast.current?.show({ severity: 'success', summary: 'Pago', detail: 'Solicitação marcada como paga.' });
      fetchRequests();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao pagar';
      setError(msg);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
    }
  };

  const actionBodyTemplate = (rowData: ExpenseRequest) => {
    return (
      <div className="flex gap-2">
        {hasRole('Analista') && rowData.status === 'Pendente' && (
          <Button icon="pi pi-check" className="p-button-success" tooltip="Aprovar" onClick={() => handleApprove(rowData.id)} />
        )}
        {hasRole('Colaborador') && rowData.status === 'Pendente' && (
          <Button icon="pi pi-times" className="p-button-warning" tooltip="Cancelar" onClick={() => handleCancel(rowData.id)} />
        )}
        {hasRole('Analista') && rowData.status === 'Aprovado' && (
          <Button icon="pi pi-dollar" className="p-button-info" tooltip="Marcar como Pago" onClick={() => handlePay(rowData.id)} />
        )}
        {(hasRole('Admin') || hasRole('Colaborador')) && (
          <Button icon="pi pi-trash" className="p-button-danger" tooltip="Deletar" onClick={() => confirmDelete(rowData.id)} />
        )}
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      {error && <div className="p-error mb-3">{error}</div>}
      <DataTable
        value={requests}
        paginator
        rows={10}
        responsiveLayout="scroll"
        emptyMessage="Nenhuma solicitação encontrada."
      >
        <Column field="title" header="Título" sortable filter filterPlaceholder="Buscar por título" />
        <Column field="amount" header="Valor (R$)" sortable body={(row) => row.amount.toFixed(2)} />
        <Column field="status" header="Status" sortable />
        <Column field="createdAt" header="Criado em" sortable />
        <Column header="Ações" body={actionBodyTemplate} style={{ width: '15rem' }} />
      </DataTable>
      <ConfirmDialog />
    </div>
  );
};
