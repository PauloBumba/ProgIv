# Imagem base (runtime)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Imagem de build (SDK)
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar todos os projetos necessários
COPY Shared.Contracts/ ./Shared.Contracts/
COPY UseCaseServices/ ./UseCaseServices/

WORKDIR /src/UseCaseServices

# Restaurar dependências da solução
RUN dotnet restore UseCase.sln

# Build
RUN dotnet build UseCase.sln -c Release -o /app/build

# Publicar
FROM build AS publish
RUN dotnet publish UseCase.sln -c Release -o /app/publish /p:UseAppHost=false

# Imagem final (runtime)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Web.dll"]
