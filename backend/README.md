# Backend ASP.NET Core — ImobiCrm

Pasta: `backend/src/ImobiCrm.Api`

Passos iniciais para rodar localmente:

1) Subir PostgreSQL com Docker Compose:

```powershell
docker compose up -d
# ou
.\backend\setup-db.ps1
```

2) Aplicar as migrations do Entity Framework Core:

```powershell
dotnet restore backend/src/ImobiCrm.Api
dotnet tool install --global dotnet-ef
dotnet ef database update --project backend/src/ImobiCrm.Api
```

3) Rodar a API:

```powershell
dotnet run --project backend/src/ImobiCrm.Api
```

Edite a connection string em `backend/src/ImobiCrm.Api/appsettings.json` se necessário.
