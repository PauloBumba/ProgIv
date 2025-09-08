import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button'; 
import { expenseRequestService } from '../../../Services/expenseRequestService';

export const DeleteExpense: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [visible, setVisible] = useState(true);

  const handleDelete = async () => {
    try {
      await expenseRequestService.delete(id!);
      toast.current?.show({ severity: 'success', summary: 'Deletado', detail: 'Despesa excluída com sucesso!' });
      setTimeout(() => navigate('/despesas/listar'), 1500);
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Erro ao excluir despesa.' });
    }
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => navigate('/despesas/listar')}
        message="Deseja realmente excluir esta despesa?"
        header="Confirmação"
        icon="pi pi-exclamation-triangle"
        accept={handleDelete}
        reject={() => navigate('/despesas/listar')}
      />
      <p>Carregando diálogo de confirmação...</p>
    </div>
  );
};
