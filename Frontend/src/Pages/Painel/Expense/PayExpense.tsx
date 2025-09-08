import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { expenseRequestService } from '../../../Services/expenseRequestService';

export const PayExpense: React.FC = () => {
  const { id } = useParams();
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);
      await expenseRequestService.pay(id!);
      toast.current?.show({ severity: 'success', summary: 'Pago', detail: 'Despesa marcada como paga!' });
      setTimeout(() => navigate('/despesas/listar'), 2000);
    } catch (error: any) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: error.response?.data?.message || 'Erro ao pagar despesa.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handlePay();
  }, []);

  return (
    <div className="card">
      <Toast ref={toast} />
      {loading ? <p>Processando pagamento...</p> : <Button label="Repetir pagamento" onClick={handlePay} />}
    </div>
  );
};
