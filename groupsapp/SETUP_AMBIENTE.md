# 🔧 Guía: Replicar el Ambiente de GroupsApp

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Dónde se Crea la BD](#dónde-se-crea-la-bd)
3. [Configuración Automática (Recomendado)](#configuración-automática-recomendado)
4. [Configuración Manual](#configuración-manual)
5. [Verificación del Setup](#verificación-del-setup)
6. [Población con Datos de Prueba](#población-con-datos-de-prueba)

---

## 📦 Descripción General

GroupsApp utiliza una **arquitectura de 3 capas**:

```
┌─────────────────────────────┐
│   Aplicación NestJS         │
│   (src/...)                 │
└────────────┬────────────────┘
             ↓
┌─────────────────────────────┐
│   TypeORM (ORM)             │
│   - Sincroniza BD           │
│   - Mapea Entidades         │
└────────────┬────────────────┘
             ↓
┌─────────────────────────────┐
│   PostgreSQL Database       │
│   (7 tablas)                │
└─────────────────────────────┘
```

---

## 🗄️ Dónde se Crea la BD

### 1. **Base de Datos PostgreSQL**

La BD se crea en **PostgreSQL** (servidor de BD):

- **Ubicación:** `localhost:5432` (por defecto)
- **Nombre:** `groupsapp`
- **Usuario:** `postgres` (por defecto)
- **Password:** `password` (por defecto, CAMBIAR EN PRODUCCIÓN)

### 2. **Tablas (Automáticamente)**

Las **tablas se crean automáticamente** cuando inicia AppJS:

```
src/config/database.config.ts:
├─ synchronize: true    <- EN DESARROLLO (crea tablas automáticamente)
└─ synchronize: false   <- EN PRODUCCIÓN (solo lee esquema existente)
```

**Proceso:**

```
npm run start:dev
       ↓
NestJS inicia
       ↓
TypeORM lee las ENTIDADES (@Entity en los archivos .ts)
       ↓
Conecta a PostgreSQL
       ↓
Compara esquema actual con clases de TypeScript
       ↓
SI NO COINCIDEN → Crea/Modifica tablas automáticamente
```

### 3. **Datos Iniciales (Manualmente)**

Los **datos** se crean haciendo requests a los endpoints:

```
POST /auth/register  → Crea usuarios
POST /groups         → Crea grupos
POST /messages       → Crea mensajes
```

---

## ⚡ Configuración Automática (RECOMENDADO)

### **Para macOS/Linux:**

```bash
chmod +x setup.sh    # Dar permisos de ejecución
./setup.sh           # Ejecutar script
```

### **Para Windows:**

```powershell
# Permitir ejecutar scripts (si no lo has hecho)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Ejecutar setup
.\setup.ps1
```

**Lo que hace el script:**

✅ Verifica que tengas Node.js, npm y PostgreSQL  
✅ Instala dependencias (`npm install`)  
✅ Crea archivo `.env` con configuración por defecto  
✅ Crea la base de datos PostgreSQL  
✅ Da instrucciones para iniciar el servidor  

---

## 🔨 Configuración Manual

Si prefieres hacerlo manualmente:

### **Paso 1: Instalar Dependencias**

```bash
npm install
```

### **Paso 2: Crear archivo `.env`**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=groupsapp

# JWT Configuration
JWT_SECRET=tu-secreto-cambiar-en-produccion

# Environment
NODE_ENV=development
PORT=3000
```

### **Paso 3: Crear Base de Datos PostgreSQL**

#### **Windows (PowerShell):**

```powershell
$env:PGPASSWORD='password'
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE groupsapp;"
```

#### **macOS/Linux (Bash):**

```bash
export PGPASSWORD='password'
psql -U postgres -h localhost -c "CREATE DATABASE groupsapp;"
```

### **Paso 4: Iniciar el Servidor**

```bash
npm run start:dev
```

**Deberías ver en los logs:**

```
[Nest] 12624 - 01/04/2026, 11:00:00 LOG [NestFactory] Starting Nest application...
...
[Nest] 12624 - 01/04/2026, 11:00:05 LOG [NestApplication] Nest application successfully started +500ms
```

Las **tablas se crearán automáticamente**.

---

## ✅ Verificación del Setup

### **1. Verificar BD Creada**

```bash
# Windows PowerShell
$env:PGPASSWORD='password'
& psql -U postgres -h localhost -c "\l"

# macOS/Linux
psql -U postgres -h localhost -c "\l"
```

Deberías ver `groupsapp` en la lista.

### **2. Verificar Tablas Creadas**

```bash
# Windows PowerShell
$env:PGPASSWORD='password'
& psql -U postgres -h localhost -d groupsapp -c "\dt"

# macOS/Linux
psql -U postgres -h localhost -d groupsapp -c "\dt"
```

Deberías ver:

```
              List of relations
 Schema |      Name       | Type  |  Owner   
--------+-----------------+-------+----------
 public | group_members   | table | postgres
 public | groups          | table | postgres
 public | media           | table | postgres
 public | messages        | table | postgres
 public | presence        | table | postgres
 public | users           | table | postgres
(7 rows)
```

### **3. Health Check del API**

```bash
curl http://localhost:3000
```

Deberías recibir:

```json
{"message":"API is running","timestamp":"2026-04-01T11:00:00.000Z"}
```

---

## 📝 Población con Datos de Prueba

### **Opción 1: Usando el archivo `test-api.http` (Recomendado)**

1. Abre VS Code
2. Instala extensión **REST Client** (Huachao Mao)
3. Abre el archivo `test-api.http`
4. Haz click en **"Send Request"** en cada sección en orden:
   - Health Check
   - Register Users (3 usuarios)
   - Login (obtener tokens)
   - Create Groups (3 grupos)
   - Add Members
   - Send Messages
   - Upload Media
   - Set Presence

### **Opción 2: Script de Seed (Próximamente)**

Crearemos un script `seed.ts` que:

```typescript
// npm run seed

// Esto ejecutará:
// - Crear 5 usuarios de prueba
// - Crear 3 grupos
// - Agregar miembros a grupos
// - Crear 10 mensajes de ejemplo
// - Configurar presencia
```

---

## 🐳 Alternativa: Docker (Próximamente)

Para facilitar aún más la replicación:

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "start:dev"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=postgres
      - DB_NAME=groupsapp
    depends_on:
      - postgres
  
  postgres:
    image: postgres:18-alpine
    environment:
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=groupsapp
    ports:
      - "5432:5432"
```

**Uso:**

```bash
docker-compose up
# ¡Listo! Accede a http://localhost:3000
```

---

## 🔄 Proceso Completo para Tu Compañero

### **Primera Vez:**

```bash
# Clonar repositorio
git clone <repo-url>
cd groupsapp

# Ejecutar setup (elije uno)
./setup.sh              # macOS/Linux
.\setup.ps1             # Windows

# Esperar a que termine...

# Iniciar servidor
npm run start:dev

# ✅ ¡Listo! BD creada con esquema
```

### **Crear Datos de Prueba:**

1. Abre `test-api.http`
2. Haz click en "Send Request" en cada endpoint
3. ✅ Listo con datos de prueba

### **Para Próximas Sesiones:**

```bash
# Solo iniciar servidor (la BD ya existe)
npm run start:dev
```

---

## 🆘 Troubleshooting

### ❌ Error: "Connection refused"

**Problema:** PostgreSQL no está corriendo

**Solución:**

```bash
# macOS (Homebrew)
brew services start postgresql

# Windows (Services)
# Presiona Win + R → services.msc → Busca "PostgreSQL" → Start

# Linux (systemd)
sudo systemctl start postgresql
```

### ❌ Error: "role 'postgres' does not exist"

**Problema:** Usuario DB no existe o contraseña incorrecta

**Solución:** Verifica las credenciales en `.env`

```env
DB_USER=postgres  # Usuario correcto
DB_PASS=password  # Contraseña correcta
```

### ❌ Error: "database 'groupsapp' does not exist"

**Problema:** La BD no se creó

**Solución:** Crea manualmente:

```bash
$env:PGPASSWORD='password'
& psql -U postgres -h localhost -c "CREATE DATABASE groupsapp;"
```

### ❌ Error: "synchronize: true operation requires database admin permissions"

**Problema:** Usuario sin permisos suficientes

**Solución:** Usa el usuario `postgres` que tiene permisos totales

---

## 📊 Resumen Técnico

| Componente | Ubicación | Creación | Responsable |
|-----------|-----------|----------|-------------|
| **Base de Datos** | PostgreSQL 5432 | Manual (script/comando) | DevOps |
| **Tablas** | groupsapp DB | Automática (TypeORM) | TypeORM |
| **Datos** | Tablas | Manual (API requests) | Usuarios/Seeds |
| **Código** | src/ | Manual (Git) | Developers |
| **Config** | .env | Manual (plantilla) | Cada dev |

---

## ✨ Checklist para Tu Compañero

- [ ] Descargar Node.js 18+
- [ ] Descargar PostgreSQL 15+
- [ ] Clonar repositorio
- [ ] `npm install`
- [ ] Ejecutar `setup.sh` o `setup.ps1`
- [ ] `npm run start:dev`
- [ ] Abrir `test-api.http`
- [ ] Instalar extensión REST Client
- [ ] Ejecutar endpoints de test
- [ ] ✅ ¡Listo!

---

## 📞 Preguntas Frecuentes

**P: ¿Cuánto espacio ocupa la BD?**  
R: Muy poco initially (~1-5MB), crece con datos

**P: ¿Puedo usar MySQL/SQLite en lugar de PostgreSQL?**  
R: Sí, solo cambia en `database.config.ts` y `.env`

**P: ¿Las tablas se borran si apago el servidor?**  
R: No, quedan en la BD. Solo se actualizan si cambia el schema

**P: ¿Puedo resetear la BD?**  
R: Sí, borra la BD y vuelve a crear: `DROP DATABASE groupsapp;`

---

**Última actualización:** 1 de Abril, 2026
