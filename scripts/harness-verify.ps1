$ErrorActionPreference = 'Stop'

Write-Host '=== FlowSync harness verification ==='

$root = Split-Path -Parent $PSScriptRoot
$frontend = Join-Path $root 'frontend'
$backend = Join-Path $root 'backend'

if (-not (Test-Path $frontend)) { throw 'frontend/ no existe' }
if (-not (Test-Path $backend)) { throw 'backend/ no existe' }

Push-Location $frontend
try {
    Write-Host "`n[1/3] Prettier check"
    npx prettier@3.9.6 --check .
    if ($LASTEXITCODE -ne 0) { throw 'Prettier check failed' }

    Write-Host "`n[2/3] Frontend lint"
    npm run lint
    if ($LASTEXITCODE -ne 0) { throw 'Frontend lint failed' }

    Write-Host "`n[3/3] Frontend build / TypeScript"
    npm run build
    if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed' }
}
finally {
    Pop-Location
}

Write-Host "`nOK: frontend pasó format-check, lint y build."
