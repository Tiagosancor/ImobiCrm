# Backend ASP.NET Core — ImobiCrm

Pasta: `backend/ImobiCrm.Api`

Passos iniciais para rodar localmente:

1) Subir PostgreSQL com Docker Compose (inicializa o esquema automaticamente):

```powershell
docker-compose up -d
.\n+# ou
powershell ./backend/setup-db.ps1
```

O arquivo `./backend/postgres-init/init.sql` será executado automaticamente na primeira inicialização do container.

2) Restaurar pacotes e criar migrations (opcional se usar o SQL de inicialização):

```powershell
dotnet restore backend/ImobiCrm.Api
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project backend/ImobiCrm.Api
dotnet ef database update --project backend/ImobiCrm.Api
```

3) Rodar a API:

```powershell
dotnet run --project backend/ImobiCrm.Api
```

Edite a connection string em `backend/ImobiCrm.Api/appsettings.json` se necessário.
