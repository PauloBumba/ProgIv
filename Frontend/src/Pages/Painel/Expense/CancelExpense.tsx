import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { expenseRequestService } from '../../../Services/expenseRequestService';

export const CancelExpense: React.FC = () => {
  const { id } = useParams();
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    try {
      setLoading(true);
      await expenseRequestService.cancel(id!);
      toast.current?.show({ severity: 'success', summary: 'Cancelado', detail: 'Despesa cancelada com sucesso!' });
      setTimeout(() => navigate('/despesas/listar'), 2000);
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Erro ao cancelar despesa.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCancel();
  }, []);

  return (
    <div className="card">
      <Toast ref={toast} />
      {loading ? <p>Cancelando despesa...</p> : <Button label="Repetir cancelamento" onClick={handleCancel} />}
    </div>
  );
};
