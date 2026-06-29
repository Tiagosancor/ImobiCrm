param(
    [int]$DbWaitSeconds = 10
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Push-Location $repoRoot

try {
Write-Host "1) Subindo container PostgreSQL via docker-compose (tentando 'docker compose' primeiro)..."
try {
    docker compose up -d
} catch {
    try {
        docker-compose up -d
    } catch {
        Write-Error "Nenhum comando 'docker compose' ou 'docker-compose' foi encontrado. Instale o Docker Desktop e certifique-se de que os comandos estejam no PATH."
        exit 1
    }
}

Write-Host "Aguardando $DbWaitSeconds segundos para o banco iniciar..."
Start-Sleep -Seconds $DbWaitSeconds

Write-Host "2) Restaurando pacotes do projeto backend"
dotnet restore "backend/ImobiCrm.Api"
if (-not (Get-Command dotnet-ef -ErrorAction SilentlyContinue)) {
    Write-Host "dotnet-ef não encontrado. Instalando ferramenta global dotnet-ef..."
    dotnet tool install --global dotnet-ef
}

Set-Location -Path "backend/ImobiCrm.Api"

Write-Host "Build do projeto para garantir artefatos necessários..."
dotnet build

if (-not (Test-Path -Path "Migrations")) {
    Write-Host "Nenhuma migration encontrada. Criando migration InitialCreate..."
    dotnet ef migrations add InitialCreate
} else {
    Write-Host "Migrations já existem. Pulando criação." 
}

Write-Host "Aplicando migrations ao banco de dados..."
dotnet ef database update

Write-Host "Rodando a API (pressione Ctrl+C para parar)..."
dotnet run
}
finally {
    Pop-Location
}
