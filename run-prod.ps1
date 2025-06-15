# PowerShell version of run-dev.sh
$env:NODE_ENV = "production"

Write-Host "==========================================="
Write-Host "Stopping and removing all containers"
Write-Host "==========================================="

docker-compose down --remove-orphans

Write-Host "==========================================="
Write-Host "Starting all containers in $env:NODE_ENV mode"
Write-Host "==========================================="

docker-compose up --build
