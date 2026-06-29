#!/usr/bin/env pwsh
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Push-Location $repoRoot

try {
	Write-Host "Subindo container do Postgres via docker compose..."
	try {
		docker compose up -d
	} catch {
		docker-compose up -d
	}

	Write-Host "Aguardando 5 segundos para o container iniciar..."
	Start-Sleep -Seconds 5

	Write-Host "Aplicando migrations do Entity Framework Core..."
	dotnet ef database update --project backend/ImobiCrm.Api

	Write-Host "Verifique os logs do container com: docker compose logs -f db"
	Write-Host "Schema do banco é gerenciado pelas migrations do EF Core."
}
finally {
	Pop-Location
}
