import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { expenseRequestService } from '../../../Services/expenseRequestService';
import {type RootState } from '../../../Root/RootReducer';
import { Roles } from '../../../Constants/roles';
import { ApiErrorHelper } from '../../../Helper/apihelper';

interface ExpenseRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  expenseDate: string;
  proofFilePath?: string;
  status: string;
  typeName: string;
  userName?: string | null;
  userId?: string;
}

const BACKEND_URL = 'https://localhost:7184';

export const ViewExpense: React.FC = () => {
  const [requests, setRequests] = useState<ExpenseRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: { value: null, matchMode: 'contains' },
  });

  const toast = useRef<Toast>(null);
  const user = useSelector((state: RootState) => state.users.user);

  useEffect(() => {
    fetchRequests();
  }, [user]);

  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await expenseRequestService.getAll();
      const allData: ExpenseRequest[] = res.data.data;

      if (user.role === Roles.Collaborator) {
        setRequests(allData.filter(req => req.userId === user.id));
      } else {
        setRequests(allData);
      }
    } catch (err) {
      const msg = ApiErrorHelper.extractErrorMessage(err);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg, life: 5000 });
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string) {
    try {
      const res = await expenseRequestService.approve(id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: res.data.message || 'Despesa aprovada!' });
      fetchRequests();
    } catch (err) {
      const msg = ApiErrorHelper.extractErrorMessage(err);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
    }
  }

  async function handleCancel(id: string) {
    try {
      const res = await expenseRequestService.cancel(id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: res.data.message || 'Despesa cancelada!' });
      fetchRequests();
    } catch (err) {
      const msg = ApiErrorHelper.extractErrorMessage(err);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
    }
  }

  async function handlePay(id: string) {
    try {
      const res = await expenseRequestService.pay(id);
      toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: res.data.message || 'Despesa paga!' });
      fetchRequests();
    } catch (err) {
      const msg = ApiErrorHelper.extractErrorMessage(err);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
    }
  }

  const getFileUrl = (filePath?: string) => {
    if (!filePath) return null;
    if (filePath.startsWith('http')) return filePath;
    return `${BACKEND_URL}${filePath}`;
  };

  const podeEditar = [Roles.Admin, Roles.FinancialAnalyst].includes(user.role);

  const actionBodyTemplate = (rowData: ExpenseRequest) => {
    return podeEditar ? (
      <div className="flex gap-2">
        <button onClick={() => handleApprove(rowData.id)}>Aprovar</button>
        <button onClick={() => handleCancel(rowData.id)}>Cancelar</button>
        <button onClick={() => handlePay(rowData.id)}>Pagar</button>
      </div>
    ) : (
      <span>-</span>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={requests}
        paginator
        rows={10}
        loading={loading}
        filters={filters}
        onFilter={e => setFilters(e.filters)}
        filterDisplay="row"
        responsiveLayout="scroll"
        emptyMessage="Nenhuma despesa encontrada"
      >
        <Column field="title" header="Título" filter filterPlaceholder="Filtrar por título" />
        <Column field="description" header="Descrição" />
        <Column
          field="amount"
          header="Valor"
          body={row => `R$ ${row.amount.toFixed(2)}`}
          style={{ textAlign: 'right', paddingRight: '1rem' }}
        />
        <Column
          field="expenseDate"
          header="Data"
          body={row => new Date(row.expenseDate).toLocaleDateString('pt-BR')}
        />
        <Column field="status" header="Status" />
        <Column field="typeName" header="Tipo" />
        {user.role !== Roles.Collaborator && (
          <Column
            field="userName"
            header="Usuário"
            body={row => row.userName || 'Não informado'}
          />
        )}
        <Column
          header="Arquivo"
          body={row => {
            const fileUrl = getFileUrl(row.proofFilePath);
            return fileUrl
              ? <a href={fileUrl} target="_blank" rel="noopener noreferrer">Ver arquivo</a>
              : 'Sem arquivo';
          }}
        />
        <Column header="Ações" body={actionBodyTemplate} />
      </DataTable>
    </>
  );
};
