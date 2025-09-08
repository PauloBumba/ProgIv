import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { expenseRequestService } from '../../../Services/expenseRequestService';
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
}

const BACKEND_URL = 'https://localhost:7184'; // Ajusta pra tua API real

export const MyExpense: React.FC = () => {
  const [despesas, setDespesas] = useState<ExpenseRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    buscarDespesas();
  }, []);

  const buscarDespesas = async () => {
    setLoading(true);
    try {
      const res = await expenseRequestService.getMine();
      setDespesas(res.data);
    } catch (error) {
      const msg = ApiErrorHelper.extractErrorMessage(error);
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: msg });
    } finally {
      setLoading(false);
    }
  };

  const getFileUrl = (filePath?: string) => {
    if (!filePath) return null;
    return filePath.startsWith('https') ? filePath : `${BACKEND_URL}${filePath}`;
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <h2>Minhas Despesas</h2>

      <DataTable
        value={despesas}
        paginator
        rows={10}
        loading={loading}
        responsiveLayout="scroll"
        emptyMessage="Nenhuma despesa encontrada"
      >
        <Column field="title" header="Título" />
        <Column field="description" header="Descrição" />
        <Column
          field="amount"
          header="Valor"
          body={(row) => `R$ ${row.amount.toFixed(2)}`}
        />
        <Column
          field="expenseDate"
          header="Data"
          body={(row) =>
            new Date(row.expenseDate).toLocaleDateString('pt-BR')
          }
        />
        <Column field="status" header="Status" />
        <Column field="typeName" header="Tipo" />
        <Column
          header="Comprovante"
          body={(row) => {
            const fileUrl = getFileUrl(row.proofFilePath);
            return fileUrl ? (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                Ver Arquivo
              </a>
            ) : (
              'Sem arquivo'
            );
          }}
        />
      </DataTable>
    </div>
  );
};
