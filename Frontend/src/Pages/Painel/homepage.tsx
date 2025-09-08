import { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';

import { userService } from '../../Services/userService';
import { expenseRequestService } from '../../Services/expenseRequestService';

export const HomePage = () => {
  const [userCount, setUserCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [barData, setBarData] = useState({});
  const [pieData, setPieData] = useState({});
  const [lineData, setLineData] = useState({});
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getAllUsers();
        setUserCount(res.data?.length || res.data?.data?.length || 0);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao buscar usuários');
      }
    };

    const fetchGraphs = async () => {
      try {
        const res = await expenseRequestService.getAll();
        const data = res.data;

        setBarData({
          labels: data.expenseTypes,
          datasets: [
            {
              label: 'Valor Total (R$)',
              backgroundColor: '#FFC107',
              data: data.valuesByExpenseType,
            }
          ]
        });

        setPieData({
          labels: data.statusLabels,
          datasets: [{
            data: data.valuesByStatus,
            backgroundColor: ['#4CAF50', '#FF6384', '#FFCE56', '#FFC107', '#81C784']
          }]
        });

        setLineData({
          labels: data.timelineLabels,
          datasets: [{
            label: 'Evolução Reembolsos (R$)',
            data: data.valuesOverTime,
            fill: false,
            borderColor: '#4CAF50',
            tension: 0.4
          }]
        });
      } catch {
        setError('Erro ao buscar dados dos gráficos');
      }
    };

    fetchUsers();
    fetchGraphs();
  }, []);

  return (
    <div className="p-4 surface-ground min-h-screen">
      {error && <Message severity="error" text={error} className="mb-4" />}

      {/* Card com total de usuários */}
      <div className="grid mb-5">
        <div className="col-12 md:col-4">
          <Card className="shadow-2">
            <h3 className="text-lg font-semibold text-gray-800">Total de Usuários</h3>
            <p className="text-5xl font-bold text-blue-500 mt-2">{userCount}</p>
            <p className="mt-2 text-sm text-gray-500">Usuários cadastrados no sistema</p>
          </Card>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid">
        <div className="col-12 md:col-4">
          <Card className="shadow-2">
            <h4 className="mb-3">Valor por Tipo de Despesa</h4>
            <Chart type="bar" data={barData} />
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card className="shadow-2">
            <h4 className="mb-3">Solicitações por Status</h4>
            <Chart type="pie" data={pieData} />
          </Card>
        </div>

        <div className="col-12 md:col-4">
          <Card className="shadow-2">
            <h4 className="mb-3">Evolução dos Reembolsos</h4>
            <Chart type="line" data={lineData} />
          </Card>
        </div>
      </div>

      <Toast ref={toast} />
    </div>
  );
};
