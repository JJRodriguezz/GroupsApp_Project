#!/bin/bash

# ============================================================
# SCRIPT DE SETUP PARA GROUPSAPP
# ============================================================
# Este script configura el ambiente completo para GroupsApp
# Uso: bash setup.sh
# ============================================================

set -e  # Salir si algún comando falla

echo "🚀 Iniciando setup de GroupsApp..."
echo ""

# ============================================================
# 1. VERIFICAR REQUISITOS
# ============================================================

echo "✓ Verificando requisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi
echo "✓ Node.js: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi
echo "✓ npm: $(npm --version)"

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado"
    echo "   Descárgalo desde: https://www.postgresql.org/download/"
    exit 1
fi
echo "✓ PostgreSQL: $(psql --version)"
echo ""

# ============================================================
# 2. INSTALAR DEPENDENCIAS
# ============================================================

echo "📦 Instalando dependencias..."
npm install
echo "✓ Dependencias instaladas"
echo ""

# ============================================================
# 3. CREAR .env
# ============================================================

echo "⚙️  Configurando archivo .env..."

if [ -f .env ]; then
    echo "⚠️  .env ya existe, saltando..."
else
    cat > .env << 'EOF'
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
EOF
    echo "✓ .env creado"
fi
echo ""

# ============================================================
# 4. CREAR BASE DE DATOS
# ============================================================

echo "🗄️  Creando base de datos PostgreSQL..."

# Leer credenciales del .env
DB_USER=$(grep ^DB_USER .env | cut -d '=' -f 2)
DB_PASS=$(grep ^DB_PASS .env | cut -d '=' -f 2)
DB_NAME=$(grep ^DB_NAME .env | cut -d '=' -f 2)
DB_HOST=$(grep ^DB_HOST .env | cut -d '=' -f 2)

# Intentar crear la BD
export PGPASSWORD=$DB_PASS

# Verificar si ya existe
if psql -h $DB_HOST -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Base de datos '$DB_NAME' ya existe"
    echo "   ¿Deseas borrarla y recrearla? (s/n)"
    read -r response
    if [ "$response" = "s" ]; then
        psql -h $DB_HOST -U $DB_USER -c "DROP DATABASE $DB_NAME;"
        echo "✓ Base de datos eliminada"
    else
        echo "   Usando base de datos existente"
    fi
else
    psql -h $DB_HOST -U $DB_USER -c "CREATE DATABASE $DB_NAME;"
    echo "✓ Base de datos '$DB_NAME' creada"
fi

unset PGPASSWORD
echo ""

# ============================================================
# 5. SINCRONIZAR ESQUEMA (TypeORM)
# ============================================================

echo "📊 Sincronizando esquema de base de datos..."
echo "   (Las tablas se crearán automáticamente al iniciar el servidor)"
echo ""

# ============================================================
# 6. INSTRUCCIONES FINALES
# ============================================================

echo "✅ SETUP COMPLETADO"
echo ""
echo "════════════════════════════════════════════════════════"
echo "📝 PRÓXIMOS PASOS:"
echo "════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  Inicia el servidor:"
echo "   npm run start:dev"
echo ""
echo "2️⃣  El servidor estará disponible en:"
echo "   http://localhost:3000"
echo ""
echo "3️⃣  Prueba los endpoints:"
echo "   - Abre el archivo 'test-api.http' en VS Code"
echo "   - Instala extensión 'REST Client' (si no la tienes)"
echo "   - Haz click en 'Send Request' en cualquier endpoint"
echo ""
echo "4️⃣  O usa cURL:"
echo "   curl http://localhost:3000"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
