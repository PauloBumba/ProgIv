import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { expenseRequestService } from '../../../Services/expenseRequestService';

export const ApproveExpense: React.FC = () => {
  const { id } = useParams();
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    try {
      setLoading(true);
      await expenseRequestService.approve(id!);
      toast.current?.show({ severity: 'success', summary: 'Aprovado', detail: 'Despesa aprovada com sucesso!' });
      setTimeout(() => navigate('/despesas/listar'), 2000);
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Erro ao aprovar despesa.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleApprove();
  }, []);

  return (
    <div className="card">
      <Toast ref={toast} />
      {loading ? <p>Aprovando despesa...</p> : <Button label="Reaprovar" onClick={handleApprove} />}
    </div>
  );
};
