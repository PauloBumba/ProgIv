# 💊 Pharmecode

> Sistema de gestão farmacêutica com arquitetura baseada em **microserviços**, **mensageria**, **API Gateway**, **Docker**, **CQRS + MediatR**, **Clean Architecture** e **DDD**.  
> Frontend moderno em **React**, backend em **ASP.NET Core**.

---

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

## 📂 Estrutura do Projeto

Backend/
├── GatewayServices/ # API Gateway para roteamento
├── NotificationService/ # Serviço de Notificação (eventos/mensageria)
├── SharedContracts/ # Contratos compartilhados entre serviços
├── UseCaseServices/ # Serviços de caso de uso (core da aplicação)
├── docker-compose.yml # Orquestração dos microsserviços + banco
├── prometheus.yml # Configuração de monitoramento
└── aspnetapp.pfx # Certificado SSL de desenvolvimento

Frontend/
├── src/ # Código do React
├── public/
└── package.json

.gitignore
.gitattributes
README.md

yaml
Copiar código

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

Adminer: http://localhost:8080

MySQL: localhost:3306

Prometheus: http://localhost:9090

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
