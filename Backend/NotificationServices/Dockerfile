# Use the official .NET 9 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET 9 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy everything from current context (NotificationServices directory)
COPY . ./
WORKDIR /src/NotificationService

# Restore dependencies (skip missing references)
RUN dotnet restore NotificationService.sln || true

# Build the application (ignore missing project references)
RUN dotnet build NotificationService.sln -c Release -o /app/build --ignore-failed-sources || dotnet build NotificationService.sln -c Release -o /app/build

# Publish the solution
FROM build AS publish
RUN dotnet publish NotificationService.sln -c Release -o /app/publish /p:UseAppHost=false || dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Start the Web API
ENTRYPOINT ["dotnet", "Web.dll"]