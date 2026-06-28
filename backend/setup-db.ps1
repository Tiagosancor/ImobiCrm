#!/usr/bin/env pwsh
Write-Host "Subindo container do Postgres via docker-compose..."
docker-compose up -d

Write-Host "Aguardando 5 segundos para o container iniciar..."
Start-Sleep -Seconds 5

Write-Host "Verifique os logs do container com: docker-compose logs -f db"
Write-Host "O script ./backend/postgres-init/init.sql será aplicado automaticamente na primeira inicialização do container."
