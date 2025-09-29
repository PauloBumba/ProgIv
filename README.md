# 💊 Pharmecode

> Sistema de gestão farmacêutica com arquitetura baseada em **microserviços**, **mensageria**, **API Gateway**, **Docker**, **CQRS + MediatR**, **Clean Architecture** e **DDD**.  
> Frontend moderno em **React**, backend em **ASP.NET Core**.

![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Messaging-FF6600?logo=rabbitmq&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestration-326CE5?logo=kubernetes&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## 🧰 Tecnologias & Padrões

- **Backend**: ASP.NET Core 9 (rodando sobre Kestrel)  
- **Frontend**: React (Vite)  
- **Arquitetura**: Clean Architecture + DDD  
- **CQRS + MediatR** para segregação de comandos e queries  
- **Microserviços** desacoplados  
- **Mensageria** para comunicação assíncrona  
- **API Gateway** como ponto único de entrada  
- **Banco de Dados**: MySQL + Adminer  
- **Docker** para orquestração dos serviços  
- **Monitoramento**: Prometheus (pré-configurado)

---

<!-- Estrutura do projeto - renderiza alinhada no GitHub -->
<h2>📂 Estrutura do Projeto</h2>

<pre>
Backend/
├── GatewayServices/        # API Gateway (centraliza autenticação, roteamento)
├── NotificationService/    # Microsserviço de notificações (RabbitMQ)
├── SharedContracts/        # Contratos compartilhados (DTOs, eventos)
├── UseCaseServices/        # Microsserviços principais (CQRS, DDD)
├── docker-compose.yml      # Orquestração local (DB, RabbitMQ, Prometheus)
├── prometheus.yml          # Configuração Prometheus
└── aspnetapp.pfx           # Certificado SSL dev

Frontend/
├── src/                    # Código-fonte React (componentes, páginas, hooks)
├── public/                 # Arquivos estáticos (index.html, assets)
└── package.json            # Config do projeto React

Root/
├── .gitignore              # Ignora arquivos/pastas não versionados
├── .gitattributes          # Normalização de arquivos no Git
└── README.md               # Documentação principal
</pre>


---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Docker e Docker Compose  
- .NET 9 SDK  
- Node.js + npm ou yarn  

### Subindo os serviços com Docker

```bash
# Na raiz do projeto
docker-compose up --build
Serviços disponíveis:

API Gateway: http://localhost:8000
Grafana : http://52.191.207.39:3000/
Adminer: http://48.216.184.41:8080/

MySQL: localhost:3306

Prometheus: http://4.157.64.253:9090

RabbiMq : http://48.223.216.70:15672/
Rodando o Backend manualmente Rodar no microserviços na pasta web 
bash

cd Backend/UseCaseServices/web
dotnet clean
dotnet restore
dotnet run
Rodando o Frontend
bash

cd Frontend
npm install
npm run dev
O frontend sobe em:
👉 http://localhost:5173

🔑 Variáveis de Ambiente
AppSetting

env
Copiar código
# Banco de Dados
Docker-compose e no appssenttig


# Mensageria (RabbitMQ)
BROKER_HOST=localhost
BROKER_PORT=5672
BROKER_USER=guest
BROKER_PASS=guest
✅ Funcionalidades
 Autenticação e autorização via JWT e Cookie

 Gestão de estoque (CRUD de medicamentos)

 Serviço de notificação assíncrono

 Integração MySQL + Adminer

 Prescrições médicas

 Relatórios e dashboard

 Integração com sistemas externos

🔄 Arquitetura Explicada
Clean Architecture + DDD → separação clara entre Domínio, Aplicação e Infraestrutura.

CQRS + MediatR → comandos para escrita, queries para leitura.

Mensageria → serviços desacoplados se comunicam por eventos.

API Gateway → centraliza o acesso, autenticação e roteamento.

Docker Compose → sobe tudo em contêineres (MySQL, Adminer, microsserviços, mensageria, Prometheus).

🤝 Contribuição
Faça um fork do repositório

Crie sua branch (git checkout -b feature/nome-da-feature)

Commit suas alterações (git commit -m 'feat: nova feature')

Push para a branch (git push origin feature/nome-da-feature)

Abra um Pull Request 🎉

📜 Licença
Este projeto está sob a licença MIT.

yaml
Copiar código

---

👉 Quer que eu já coloque uns **badges no topo** (ex: .NET, React, Docker, MySQL, RabbitMQ) pra deixar o README m
