# Backend ASP.NET Core — ImobiCrm

Pasta: `backend/ImobiCrm.Api`

Passos iniciais para rodar localmente:

1) Subir PostgreSQL com Docker Compose:

```powershell
docker compose up -d
# ou
.\backend\setup-db.ps1
```

2) Aplicar as migrations do Entity Framework Core:

```powershell
dotnet restore backend/ImobiCrm.Api
dotnet tool install --global dotnet-ef
dotnet ef database update --project backend/ImobiCrm.Api
```

3) Rodar a API:

```powershell
dotnet run --project backend/ImobiCrm.Api
```

Edite a connection string em `backend/ImobiCrm.Api/appsettings.json` se necessário.
