# Use the official .NET 9 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET 9 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy everything from current context (UseCaseServices directory)
COPY . ./

RUN dotnet restore UseCase.sln || true
RUN dotnet build UseCase.sln -c Release -o /app/build --ignore-failed-sources || dotnet build UseCase.sln -c Release -o /app/build

# Publish the solution
FROM build AS publish
RUN dotnet publish UseCase.sln -c Release -o /app/publish /p:UseAppHost=false || dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "UseCaseService.Web.dll"]
