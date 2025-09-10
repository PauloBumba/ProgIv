FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET 8 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY GatewayServices/ApiGateway.sln ./GatewayServices/
COPY GatewayServices/ApiGateway.csproj ./GatewayServices/

# Copy any other gateway files
COPY GatewayServices/ ./GatewayServices/

# Set working directory to GatewayServices
WORKDIR /src/GatewayServices

# Restore dependencies
RUN dotnet restore ApiGateway.sln

# Build the application
RUN dotnet build ApiGateway.sln -c Release -o /app/build

# Publish the application
FROM build AS publish
WORKDIR /src/GatewayServices
RUN dotnet publish ApiGateway.csproj -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Start the ApiGateway
ENTRYPOINT ["dotnet", "ApiGateway.dll"]