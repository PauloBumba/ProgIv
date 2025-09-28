import { useEffect, useState, type FC } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Rating } from "primereact/rating";
import { Depoimentos } from "../../Utils/Depoiment";
import useScrollReveal from '../../Hook/ScroollReavel';

export const Index: FC = () => {
  const features = [
    { title: "Gestão de Medicamentos", icon: "pi pi-shopping-bag", color: "green" },
    { title: "Controle de Estoque", icon: "pi pi-database", color: "blue" },
    { title: "Prescrições Digitais", icon: "pi pi-file-edit", color: "green" },
    { title: "Relatórios Farmacêuticos", icon: "pi pi-chart-bar", color: "blue" },
  ];

  const [chartData, setChartData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Vendas (R$)",
        data: [45000, 52000, 48000, 61000, 58000, 67000],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"],
        borderColor: "#0062A8",
        borderWidth: 2
      },
    ],
  });

  const [stockData, setStockData] = useState({
    labels: ["Analgésicos", "Antibióticos", "Vitaminas", "Dermocosméticos", "Genéricos"],
    datasets: [
      {
        label: "Estoque Atual",
        data: [850, 420, 680, 320, 950],
        backgroundColor: [
          "#0062A8", 
          "#00C896", 
          "#003F7D", 
          "#A0D8F1", 
          "#002C5C"
        ],
      },
    ],
  });

  useScrollReveal('.reveal-card', {
    origin: 'bottom',
    distance: '50px',
    duration: 100,
   
    reset: false  
  });

  useScrollReveal('.reveal-chart', {
    origin: 'left',
    distance: '100px',
    duration: 100,
   
    reset: false
  });

  // Atualização dinâmica dos dados de vendas
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = prev.datasets[0].data.map(value => {
          const variation = (Math.random() - 0.5) * 10000;
          return Math.max(30000, Math.floor(value + variation));
        });

        return {
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData
            }
          ]
        };
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Atualização dos dados de estoque
  useEffect(() => {
    const stockInterval = setInterval(() => {
      setStockData(prev => {
        const newData = prev.datasets[0].data.map(value => {
          const variation = Math.floor((Math.random() - 0.5) * 100);
          return Math.max(50, value + variation);
        });

        return {
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: newData
            }
          ]
        };
      });
    }, 12000);

    return () => clearInterval(stockInterval);
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Mensal'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return 'R$ ' + value.toLocaleString();
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Distribuição por Categoria'
      }
    }
  };

  return (
    <main className="mx-auto card lg:col-11 border-round-xl ">
      <Card className="border-none shadow-3">
        {/* Header Principal */}
        <section className="text-center mb-6 py-4">
          <div className="flex align-items-center justify-content-center mb-4">
            <i className="pi pi-heart text-6xl text-blue mr-3"></i>
            <div>
              <h1 className="text-6xl font-light mb-2 line-height-1">
                Bem-vindo ao <span className="text-blue">Código</span>
                
                <span className="text-green-500">Farmacêutico</span>
              </h1>
            </div>
          </div>
          <p className="text-gray-600 mb-5 text-2xl font-light max-w-4xl mx-auto line-height-3">
            Gerencie sua farmácia com inteligência: controle de estoque, prescrições digitais e relatórios avançados em uma única plataforma.
          </p>
          <div className="flex flex-wrap gap-3 justify-content-center">
            <Button 
              label="Acessar Dashboard" 
              severity="success" 
              size="large"
              icon="pi pi-sign-in"
              className="px-4 py-3"
            />
            <Button 
              label="Ver Demonstração" 
              severity="secondary" 
              size="large"
              icon="pi pi-play"
              outlined
              className="px-4 py-3"
            />
          </div>
        </section>

        {/* Features Farmacêuticas */}
        <section className="mb-8 text-center reveal-card" id="funcionalidades">
          <div className="mb-5">
            <h2 className="text-5xl font-light mb-3 text-blue-700 back">Funcionalidades Principais</h2>
            <p className="text-gray-600 text-xl">Tecnologia avançada para gestão farmacêutica completa</p>
          </div>
          
          <div className="grid" id="produtos">
            {features.map((feature, index) => (
              <div key={index} className="col-12 md:col-6 lg:col-3 p-3">
                <Card className="text-center h-full shadow-4 border-round-2xl hover:shadow-8 transition-all transition-duration-300">
                  <div className="flex flex-column align-items-center justify-content-center h-full p-4">
                    <div className={`w-5rem h-5rem border-circle flex align-items-center justify-content-center mb-4 ${
                      feature.color === 'green' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <i className={`${feature.icon} text-4xl ${
                        feature.color === 'green' ? 'text-green-500' : 'text-blue-500'
                      }`}></i>
                    </div>
                    
                    <h3 className="font-bold text-xl mb-3 text-gray-800 line-height-2">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-height-3">
                      {feature.title === "Gestão de Medicamentos" && "Cadastre, organize e monitore todos os medicamentos com alertas de validade."}
                      {feature.title === "Controle de Estoque" && "Controle inteligente com alertas automáticos de reposição e relatórios."}
                      {feature.title === "Prescrições Digitais" && "Sistema integrado para receitas médicas com validação automática."}
                      {feature.title === "Relatórios Farmacêuticos" && "Analytics avançados de vendas, estoque e performance financeira."}
                    </p>
                    
                    <Rating 
                      value={5} 
                      readOnly 
                      stars={5} 
                      cancel={false} 
                      className="mb-4"
                    />
                    
                    <Button 
                      label="Explorar" 
                      severity={feature.color === 'green' ? "success" : "info"}
                      className="w-full"
                      outlined
                      size="small"
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Gráficos de Performance */}
        <section className="mb-8 reveal-chart">
          <div className="grid">
            {/* Gráfico de Vendas */}
            <div className="col-12 lg:col-8">
              <Card className="h-full shadow-3 border-round-xl">
                <div className="text-center mb-4">
                  <h2 className="text-4xl font-light mb-2 text-blue-700 ">Performance de Vendas</h2>
                  <p className="text-gray-600 text-lg">Acompanhe o faturamento mensal da farmácia</p>
                </div>
                <Chart 
                  type="bar" 
                  data={chartData} 
                  options={chartOptions}
                  className="w-full text-center"
                />
              </Card>
            </div>

            {/* Gráfico de Estoque */}
            <div className="col-12 lg:col-4">
              <Card className="h-full shadow-3 border-round-xl">
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-light mb-2 text-blue-700 ">Estoque por Categoria</h3>
                  <p className="text-gray-600">Distribuição atual</p>
                </div>
                <Chart 
                  type="doughnut" 
                  data={stockData} 
                  options={pieOptions}
                  className="w-full text-center" 
                />
              </Card>
            </div>
          </div>
        </section>

        {/* Métricas Rápidas */}
        <section className="mb-8 reveal-card">
          <Card className="shadow-3 border-round-xl">
            <h2 className="text-4xl font-light mb-4 text-center text-blue-700 ">Métricas em Tempo Real</h2>
            <div className="grid">
              <div className="col-12 md:col-3">
                <div className="text-center p-3 border-round bg-green-50">
                  <i className="pi pi-shopping-cart text-4xl text-green-500 mb-2"></i>
                  <div className="text-2xl font-bold text-green-600">R$ 127.340</div>
                  <div className="text-gray-600">Vendas do Mês</div>
                </div>
              </div>
              <div className="col-12 md:col-3">
                <div className="text-center p-3 border-round bg-blue-50">
                  <i className="pi pi-box text-4xl text-blue-500 mb-2"></i>
                  <div className="text-2xl font-bold text-blue-600">3.247</div>
                  <div className="text-gray-600">Produtos Ativos</div>
                </div>
              </div>
              <div className="col-12 md:col-3">
                <div className="text-center p-3 border-round bg-orange-50">
                  <i className="pi pi-exclamation-triangle text-4xl text-orange-500 mb-2"></i>
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <div className="text-gray-600">Produtos Vencendo</div>
                </div>
              </div>
              <div className="col-12 md:col-3">
                <div className="text-center p-3 border-round bg-purple-50">
                  <i className="pi pi-users text-4xl text-purple-500 mb-2"></i>
                  <div className="text-2xl font-bold text-purple-600">1.893</div>
                  <div className="text-gray-600">Clientes Ativos</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Depoimentos */}
        <section className="text-center " id="depoimentos">
          <div className="mb-5">
            <h2 className="text-5xl font-light mb-3 text-blue-700 back">Depoimentos</h2>
            <p className="text-gray-600 text-xl">O que dizem os farmacêuticos que usam nossa plataforma</p>
          </div>
          <Depoimentos />
        </section>

        {/* Call to Action Final */}
        <section className="text-center mt-8 p-6 bg-gradient-to-r from-blue-500 to-green-500 border-round-2xl">
          <div >
            <h2 className="text-4xl font-light mb-3 ">Pronto para transformar sua farmácia?</h2>
            <p className="text-xl mb-5 opacity-90">Junte-se a mais de 1.500 farmácias que já confiam no Código Farmacêutico</p>
            <div className="flex flex-wrap gap-3 justify-content-center">
              <Button 
                label="Começar Agora" 
                severity="secondary"
                size="large"
                icon="pi pi-arrow-right"
                className="bg-white text-blue-600 border-white px-5 py-3"
              />
              <Button 
                label="Falar com Consultor" 
                severity="secondary"
                size="large"
                icon="pi pi-phone"
                outlined
                className="border-white text-white hover:bg-white hover:text-blue-600 px-5 py-3"
              />
            </div>
          </div>
        </section>
      </Card>
    </main>
  );
};