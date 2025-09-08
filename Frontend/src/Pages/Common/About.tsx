import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Image } from 'primereact/image';

export const About = () => {
  // Dados de reembolso - exemplo básico
  const pedidosReembolso = [
    { id: 1, colaborador: 'Ana Júlia', valor: 150.75, status: 'Aprovado', descricao: 'Reembolso de viagem' },
    { id: 2, colaborador: 'Paulo Bumba', valor: 320.00, status: 'Pendente', descricao: 'Reembolso de alimentação' },
    { id: 3, colaborador: 'Carlos Silva', valor: 75.50, status: 'Rejeitado', descricao: 'Reembolso de material' },
  ];

  // Equipe responsável pelo reembolso (exemplo)
  const equipeFinanceira = [
    { nome: 'Ana Júlia', papel: 'Analista Financeira', descricao: 'Responsável pela análise dos pedidos.', imgSrc: 'https://media.licdn.com/dms/image/v2/C4D03AQF7UrZ-iAV1Dw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1660233791336?e=1748476800&v=beta&t=aQhYwoD8Sty27cmmsHMJVNSMZIeSxZV5X-YqYig8wNI' },
    { nome: 'Paulo Bumba', papel: 'Coordenador de TI', descricao: 'Responsável pelo sistema e integrações.', imgSrc: 'https://media.licdn.com/dms/image/v2/D4D03AQEJyh1DMaltoQ/profile-displayphoto-shrink_800_800/B4DZXfDSk0HYAc-/0/1743203937692?e=1749081600&v=beta&t=K1eSakJ0a4XYWV846HQGEXiAIqvckm0b6RYILmHtm1M' },
  ];

  // Template para imagem do membro da equipe
  const imagemTemplate = (rowData: any) => (
    <Image src={rowData.imgSrc} alt={rowData.nome} width="100" height="100" className="border-circle" />
  );

  return (
    <main className="m-4 shadow-8 border-round bg-white  col-10 border-round-lg">
      <h1 className="text-center p-mb-4">Sistema de Reembolso</h1>

      {/* Tabela de pedidos de reembolso */}
      <section className="mb-6">
        <h2 className="text-center mb-3">Pedidos de Reembolso</h2>
        <DataTable
          value={pedidosReembolso}
          responsiveLayout="scroll"
          className="mx-auto"
          tableStyle={{ width: '100%', minWidth: '400px' }}
          showGridlines
          stripedRows
        >
          <Column field="id" header="ID" style={{ width: '5rem' }} />
          <Column field="colaborador" header="Colaborador" />
          <Column field="valor" header="Valor (R$)" body={(data) => data.valor.toFixed(2)} style={{ width: '10rem' }} />
          <Column field="status" header="Status" style={{ width: '10rem' }} />
          <Column field="descricao" header="Descrição" />
        </DataTable>
      </section>

      {/* Equipe responsável */}
      <section>
        <h2 className="text-center mb-4">Equipe Financeira</h2>
        <div className="grid justify-center align-center">
          {equipeFinanceira.map((membro, index) => (
            <div key={index} className="col-12 md:col-6 lg:col-4 p-2">
              <Card className="text-center mx-auto flex justify-content-center shadow-3">
                {imagemTemplate(membro)}
                <h3 className="p-mt-2">{membro.nome}</h3>
                <p><strong>{membro.papel}</strong></p>
                <p>{membro.descricao}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
