# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia os arquivos de csproj e restaura dependências
COPY *.sln ./
COPY */*.csproj ./
RUN for file in $(ls *.csproj); do mkdir -p ${file%.*} && mv $file ${file%.*}/; done

RUN dotnet restore

# Copia tudo e compila
COPY . .
RUN dotnet publish -c Release -o /app

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app ./

# Porta padrão do container (80) -> exposta pelo docker-compose
EXPOSE 80

# Starta a aplicação
ENTRYPOINT ["dotnet", "NotificationService.dll"]
