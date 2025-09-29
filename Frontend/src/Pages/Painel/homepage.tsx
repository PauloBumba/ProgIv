import { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { ProgressBar } from 'primereact/progressbar';

import { userService } from '../../Services/userService';
import { medicationService } from '../../Services/medicationService';

export const HomePage = () => {
  // Estados principais
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [expiringMedicines, setExpiringMedicines] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Charts
  const [salesData, setSalesData] = useState({});
  const [stockData, setStockData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  
  const toast = useRef<Toast>(null);

  // Opções dos gráficos
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const }
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Medicamentos
        const medicinesRes = await medicationService.getAll();
        const medicines = medicinesRes.data?.data  || medicinesRes.data || [];
        setTotalMedicines(medicines.length);
        console.log("Medicamentos carregados:", medicines);

        const lowStock = medicines.filter((med: any) => med.stock < 10).length;
        setLowStockItems(lowStock);

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const expiring = medicines.filter((med: any) => 
          new Date(med.expiryDate) <= thirtyDaysFromNow
        ).length;
        setExpiringMedicines(expiring);

        // Usuários ativos
        const usersRes = await userService.getAllUsers();
        const users = usersRes.data?.data || usersRes.data || [];
      
       
        setActiveCustomers(users.length);

        // Configurar gráficos
        setupChartData(medicines);

        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar dados do dashboard');
        toast.current?.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar dados do dashboard'
        });
      } finally {
        setLoading(false);
      }
    };

    const setupChartData = (medicines: any[]) => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      
      // Gráfico de "Evolução dos Medicamentos"
      setSalesData({
        labels: months,
        datasets: [
          {
            label: 'Medicamentos Cadastrados',
            backgroundColor: '#00C896',
            borderColor: '#00B085',
            data: months.map(() => Math.floor(Math.random() * medicines.length) + 1),
          }
        ]
      });

      // Gráfico de status do estoque
      setStockData({
        labels: ['Em Estoque', 'Estoque Baixo', 'Vencimento Próximo', 'Sem Estoque'],
        datasets: [{
          data: [
            medicines.length - lowStockItems - expiringMedicines,
            lowStockItems,
            expiringMedicines,
            0
          ],
          backgroundColor: ['#00C896', '#FFC107', '#FF6B35', '#FF4757']
        }]
      });

      // Gráfico de categorias
      const categories = ['Analgésicos', 'Antibióticos', 'Anti-inflamatórios', 'Vitaminas', 'Genéricos'];
      setCategoryData({
        labels: categories,
        datasets: [{
          data: categories.map(() => Math.floor(Math.random() * 500) + 50),
          backgroundColor: ['#00C896', '#0062A8', '#003F7D', '#A0D8F1', '#00B085']
        }]
      });
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0062A8 0%, #00C896 100%)' }}>
      
      {error && <Message severity="error" text={error} className="mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }} />}

      <Card className="mb-4 shadow-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        <div className="flex justify-content-between align-items-center">
          <div>
            <h1 className="text-3xl font-light m-0 mb-2" style={{ color: '#003F7D' }}>Dashboard Farmacêutico</h1>
            <p className="text-gray-600 m-0">Visão geral da sua farmácia - {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              icon="pi pi-refresh" 
              label="Atualizar"
              style={{ backgroundColor: '#00C896', borderColor: '#00C896' }}
              loading={loading}
              onClick={() => window.location.reload()}
            />
          </div>
        </div>
      </Card>

      {/* Cards de Métricas */}
      <div className=" grid formgrid  mb-4">
        <div className="field col-12 md:col-6 lg:col-3">
          <Card className="text-center shadow-3 h-full" style={{ backgroundColor: 'rgba(0, 200, 150, 0.95)', color: 'white' }}>
            <i className="pi pi-heart text-4xl mb-2"></i>
            <h3 className="text-2xl font-bold mb-1">{totalMedicines.toLocaleString()}</h3>
            <p className="text-sm opacity-90 m-0">Medicamentos</p>
          </Card>
        </div>
        <div className="field  col-12 md:col-6 lg:col-3">
          <Card className="text-center shadow-3 h-full" style={{ backgroundColor: 'rgba(0, 176, 133, 0.95)', color: 'white' }}>
            <i className="pi pi-users text-4xl mb-2"></i>
            <h3 className="text-2xl font-bold mb-1">{activeCustomers.toLocaleString()}</h3>
            <p className="text-sm opacity-90 m-0">Clientes Ativos</p>
          </Card>
        </div>
        <div className="field   col-12 md:col-6 lg:col-3">
          <Card className="shadow-3  h-full" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <div className="flex justify-content-between align-items-center">
              <div>
                <h4 className="text-orange-600 mb-2">Estoque Baixo</h4>
                <p className="text-2xl font-bold text-orange-600 m-0">{lowStockItems}</p>
              </div>
              <Badge value={lowStockItems} severity="warning" size="large"></Badge>
            </div>
            <ProgressBar value={totalMedicines ? (lowStockItems / totalMedicines) * 100 : 0} className="mt-3" style={{ height: '6px' }} />
          </Card>
        </div>
        <div className="field   col-12 md:col-6 lg:col-3">
          <Card className="shadow-3  h-full" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <div className="flex justify-content-between align-items-center">
              <div>
                <h4 className="text-red-600 mb-2">Vencimento Próximo</h4>
                <p className="text-2xl font-bold text-red-600 m-0">{expiringMedicines}</p>
              </div>
              <Badge value={expiringMedicines} severity="danger" size="large"></Badge>
            </div>
            <ProgressBar value={totalMedicines ? (expiringMedicines / totalMedicines) * 100 : 0} className="mt-3" style={{ height: '6px' }} />
          </Card>
        </div>
      </div>

      {/* Cards de Alertas */}
      <div className=" mb-4">
        
      </div>

      {/* Gráficos */}
     <div className="grid col-12 formgrid mr-0 ml-0 mb-4 mt-3">
  <div className="col-12 md:col-6 lg:col-4">
    <Card className="shadow-3 h-full" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
      <h4 className="mb-3" style={{ color: '#003F7D' }}>Evolução dos Medicamentos</h4>
      <Chart type="bar" data={salesData} options={chartOptions} />
    </Card>
  </div>

  <div className="col-12 md:col-6 lg:col-4">
    <Card className="shadow-3 h-full" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
      <h4 className="mb-3" style={{ color: '#003F7D' }}>Status do Estoque</h4>
      <Chart type="doughnut" data={stockData} options={pieOptions} />
    </Card>
  </div>

  <div className="col-12 md:col-6 lg:col-4">
    <Card className="shadow-3 h-full" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
      <h4 className="mb-3" style={{ color: '#003F7D' }}>Categorias de Medicamentos</h4>
      <Chart type="pie" data={categoryData} options={pieOptions} />
    </Card>
  </div>
</div>




      <Toast ref={toast} />
    </div>
  );
};
