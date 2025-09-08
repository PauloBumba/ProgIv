import { useEffect, useState, type FC } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Rating } from "primereact/rating";
import { Depoimentos } from "../../Utils/Depoiment";
import useScrollReveal from '../../Hook/ScroollReavel'; 
export const Index: FC = () => {
  const features = [
    { title: "Solicitação de Reembolso", icon: "pi pi-wallet" },
    { title: "Aprovação Financeira", icon: "pi pi-check-circle" },
    { title: "Relatórios e Dashboards", icon: "pi pi-chart-bar" },
    { title: "Gestão de Colaboradores", icon: "pi pi-users" },
  ];

  const [chartData, setChartData] = useState({
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Reembolsos",
        data: [1200, 1500, 1800, 2000, 2200, 2500],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"],
      },
    ],
  });
   useScrollReveal('.dish', {
    origin: 'top',
    distance: '40%',
    duration:2000,
    delay:200,
    
    reset :true
} );

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = chartData.datasets[0].data.map(() =>
        Math.floor(Math.random() * 2000) + 1000
      );

      setChartData(prev => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: newData
          }
        ]
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [chartData]); // ⚠ Cuidado! Isso pode gerar loops infinitos

  // Melhor: deixar o intervalo sem depender do chartData, assim:
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = prev.datasets[0].data.map(() =>
          Math.floor(Math.random() * 2000) + 1000
        );

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
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="  mx-auto card lg:col-11 border ">
      <Card>
        {/* Header */}
        <section className="text-center mb-6 ">
          <h1 className="text-6xl font-light mb-3 .lef">Desfrute da <span className="bg-blue-100">sua</span> plataforma de <span className="bg-yellow-100">reembolsos</span></h1>
          <p className="text-gray-600 mb-4 text-3xl font-light">Organize, controle e aprove os reembolsos dos seus colaboradores com agilidade e segurança.</p>
          <Button label="Acessar Sistema" severity="success" />
        </section>

        {/* Features */}
        <section className="mb-6 text-center rounded dish " id="produtos">
          <h2 className="text-4xl font-light mb-2 back">Funcionalidades</h2>
          <p className="text-gray-600 mb-4">Explore as principais ferramentas do sistema</p>
          <div className="grid">
            {features.map((f, i) => (
              <div key={i} className="mx-auto md:col-6 lg:col-3">
                <Card className="text-center h-20rem shadow-2">
                  <i className={`${f.icon} text-4xl mb-3 ${i < 2 ? "text-green-500" : "text-blue-500"}`}></i>
                  <div className="font-bold mb-4">{f.title}</div>
                  <p className="text-sm text-gray-500">Acompanhe e gerencie de forma prática.</p>
                  <Rating value={5} readOnly stars={5} cancel={false} className="my-4 flex justify-content-center" />
                  <Button label="Acessar" severity={i < 2 ? "success" : "secondary"} className="mt-1" />
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Gráfico */}
        <section className="mb-6 text-center rounded ">
          <h2 className="text-4xl font-light mb-3 back">Desempenho Financeiro</h2>
          <p className="text-gray-600 mb-4">Veja os reembolsos aprovados mês a mês</p>
          <Chart type="bar" data={chartData} className="w-full shadow-3 col-10" />
        </section>

       
        {/* Depoimentos */}
        <section className="rounded text-center"  id="contato">
          <h2 className="text-4xl font-light mb-3 back">Depoimentos</h2>
          <p className="text-gray-600 mb-4">Veja o que dizem os nossos usuários</p>
          <Depoimentos />
        </section>
      </Card>
    </main>
  );
};
