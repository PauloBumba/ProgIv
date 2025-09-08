FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copia a pasta completa
COPY UseCaseServices ./UseCaseServices

# Restaura pacotes
WORKDIR /src/UseCaseServices
RUN dotnet restore UseCaseService.Web/UseCaseService.Web.csproj

# Publica só o projeto Web, não a solução
RUN dotnet publish UseCaseService.Web/UseCaseService.Web.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "UseCaseService.Web.dll"]
