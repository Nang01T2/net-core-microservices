# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
# USER app
# Run as Root (Not Recommended)
USER root
WORKDIR /app
EXPOSE 80

# Copy certificate to the container
COPY localhost-dev-cert.pfx /https/localhost-dev-cert.pfx

# Configure Kestrel for HTTPS
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/https/localhost-dev-cert.pfx
ENV ASPNETCORE_Kestrel__Certificates__Default__Password=12345678

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Infrastructure/IdentityServer/IdentityServer.csproj", "Infrastructure/IdentityServer/"]
RUN dotnet restore "./Infrastructure/IdentityServer/IdentityServer.csproj"
COPY . .
WORKDIR "/src/Infrastructure/IdentityServer"
RUN dotnet build "./IdentityServer.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./IdentityServer.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Install required tools
# RUN apt-get update && apt-get install -y libnss3-tools

# Generate dev certificates
# RUN dotnet dev-certs https

# Trust certificates (for local use only)
# RUN dotnet dev-certs https --trust

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "IdentityServer.dll"]