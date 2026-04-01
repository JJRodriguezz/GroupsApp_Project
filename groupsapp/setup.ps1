# ============================================================
# SCRIPT DE SETUP PARA GROUPSAPP (WINDOWS)
# ============================================================
# Este script configura el ambiente completo para GroupsApp
# Uso: .\setup.ps1
# ============================================================

Write-Host "🚀 Iniciando setup de GroupsApp..." -ForegroundColor Green
Write-Host ""

# ============================================================
# 1. VERIFICAR REQUISITOS
# ============================================================

Write-Host "✓ Verificando requisitos..." -ForegroundColor Cyan

# Verificar Node.js
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    exit 1
}
$nodeVersion = & node --version
Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green

# Verificar npm
$npmCheck = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCheck) {
    Write-Host "❌ npm no está instalado" -ForegroundColor Red
    exit 1
}
$npmVersion = & npm --version
Write-Host "✓ npm: $npmVersion" -ForegroundColor Green

# Verificar PostgreSQL
$psqlCheck = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlCheck) {
    Write-Host "❌ PostgreSQL no está instalado" -ForegroundColor Red
    Write-Host "   Descárgalo desde: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}
$psqlVersion = & psql --version
Write-Host "✓ PostgreSQL: $psqlVersion" -ForegroundColor Green
Write-Host ""

# ============================================================
# 2. INSTALAR DEPENDENCIAS
# ============================================================

Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
npm install
Write-Host "✓ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

# ============================================================
# 3. CREAR .env
# ============================================================

Write-Host "⚙️  Configurando archivo .env..." -ForegroundColor Cyan

if (Test-Path .env) {
    Write-Host "⚠️  .env ya existe, saltando..." -ForegroundColor Yellow
}
else {
    @"
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=groupsapp

# JWT Configuration
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion

# Environment
NODE_ENV=development
PORT=3000
"@ | Out-File -FilePath .env -Encoding UTF8
    Write-Host "✓ .env creado" -ForegroundColor Green
}
Write-Host ""

# ============================================================
# 4. CREAR BASE DE DATOS
# ============================================================

Write-Host "🗄️  Creando base de datos PostgreSQL..." -ForegroundColor Cyan

# Leer credenciales del .env
$envContent = Get-Content .env
$dbUser = ($envContent | Where-Object { $_ -match '^DB_USER=' }) -replace '^DB_USER=', ''
$dbPass = ($envContent | Where-Object { $_ -match '^DB_PASS=' }) -replace '^DB_PASS=', ''
$dbName = ($envContent | Where-Object { $_ -match '^DB_NAME=' }) -replace '^DB_NAME=', ''
$dbHost = ($envContent | Where-Object { $_ -match '^DB_HOST=' }) -replace '^DB_HOST=', ''

$env:PGPASSWORD = $dbPass

try {
    # Verificar si la BD ya existe
    $checkDb = & psql -h $dbHost -U $dbUser -lqt 2>$null | Select-String -Pattern [regex]::Escape($dbName)
    
    if ($checkDb) {
        Write-Host "⚠️  Base de datos '$dbName' ya existe" -ForegroundColor Yellow
        $response = Read-Host "¿Deseas borrarla y recrearla? (s/n)"
        
        if ($response -eq "s") {
            & psql -h $dbHost -U $dbUser -c "DROP DATABASE $dbName;" 2>$null
            Write-Host "✓ Base de datos eliminada" -ForegroundColor Green
        }
        else {
            Write-Host "   Usando base de datos existente" -ForegroundColor Yellow
        }
    }
    
    # Crear BD si no existe (o si fue eliminada)
    $checkDb2 = & psql -h $dbHost -U $dbUser -lqt 2>$null | Select-String -Pattern [regex]::Escape($dbName)
    if (-not $checkDb2) {
        & psql -h $dbHost -U $dbUser -c "CREATE DATABASE $dbName;" 2>$null
        Write-Host "✓ Base de datos '$dbName' creada" -ForegroundColor Green
    }
}
finally {
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}
Write-Host ""

# ============================================================
# 5. SINCRONIZAR ESQUEMA (TypeORM)
# ============================================================

Write-Host "📊 Sincronizando esquema de base de datos..." -ForegroundColor Cyan
Write-Host "   (Las tablas se crearán automáticamente al iniciar el servidor)" -ForegroundColor Gray
Write-Host ""

# ============================================================
# 6. INSTRUCCIONES FINALES
# ============================================================

Write-Host "✅ SETUP COMPLETADO" -ForegroundColor Green
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📝 PRÓXIMOS PASOS:" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Inicia el servidor:" -ForegroundColor Yellow
Write-Host "   npm run start:dev" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  El servidor estará disponible en:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  Prueba los endpoints:" -ForegroundColor Yellow
Write-Host "   - Abre el archivo 'test-api.http' en VS Code" -ForegroundColor White
Write-Host "   - Instala extensión 'REST Client' (si no la tienes)" -ForegroundColor White
Write-Host "   - Haz click en 'Send Request' en cualquier endpoint" -ForegroundColor White
Write-Host ""
Write-Host "4️⃣  O usa PowerShell:" -ForegroundColor Yellow
Write-Host "   Invoke-WebRequest http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
