# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia o .csproj do Gateway
COPY Gateway/*.csproj ./Gateway/
RUN dotnet restore ./Gateway/Gateway.csproj

# Copia tudo e publica
COPY . .
RUN dotnet publish ./Gateway/Gateway.csproj -c Release -o /app

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app ./

# Porta do container
EXPOSE 80

# Inicia o Gateway
ENTRYPOINT ["dotnet", "Gateway.dll"]
