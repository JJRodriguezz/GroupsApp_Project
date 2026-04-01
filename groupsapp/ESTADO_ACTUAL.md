# 📱 GroupsApp - Estado Actual del Proyecto

## 📋 Índice

1. [Introducción](#introducción)
2. [Arquitectura: Monolito Modular](#arquitectura-monolito-modular)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Funcionalidades Implementadas](#funcionalidades-implementadas)
7. [Cómo Probar los Endpoints](#cómo-probar-los-endpoints)
8. [Base de Datos](#base-de-datos)
9. [Próximos Pasos](#próximos-pasos)

---

## 🎯 Introducción

**GroupsApp** es un sistema de mensajería distribuida, similar a WhatsApp o Telegram, enfocado en comunicación grupal.

El proyecto implementa actualmente un **monolito modular** completamente funcional con todas las fases requeridas.

**Estado General:** ✅ **TOTALMENTE FUNCIONAL Y TESTEADO**

---

## 🏗️ Arquitectura: Monolito Modular

### ¿Qué es un Monolito Modular?

Un **monolito modular** es una arquitectura donde:

- **Todo corre en un ÚNICO proceso** (no hay microservicios separados)
- **Cada dominio está en su propio módulo** (Auth, Users, Groups, Messages, etc.)
- **Los módulos se comunican vía Services** (no llamadas directas)
- **Prepared for future microservices** - El código está diseñado para ser separable

### Ventajas de esta Arquitectura

✅ Simple de desarrollar y deployar  
✅ Fácil de testear (todo en un lugar)  
✅ Bajo overhead de comunicación  
✅ **PREPARADO para convertirse en microservicios** - Solo hay que separar módulos  

### Diagrama de Módulos

```
┌─────────────────────────────────────────────┐
│         NestJS Application (único proceso)   │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  AUTH   │  │  USERS  │  │ GROUPS  │    │
│  └─────────┘  └─────────┘  └─────────┘    │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ MESSAGES │  │  MEDIA   │  │ PRESENCE │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│          PostgreSQL Database (TypeORM)       │
└─────────────────────────────────────────────┘
```

---

## 💻 Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| **Framework** | NestJS | ^11.0.1 |
| **Lenguaje** | TypeScript | ^5.x |
| **Base de Datos** | PostgreSQL | 18.x |
| **ORM** | TypeORM | ^0.3.x |
| **Autenticación** | JWT + Passport | ^10.0.0 |
| **Validación** | class-validator | ^0.14.x |
| **Hashing** | bcrypt | ^5.x |
| **API** | REST (HTTP) | - |

---

## 📂 Estructura del Proyecto

```
groupsapp/
├── src/
│   ├── auth/                    # 🔐 Autenticación
│   │   ├── guards/
│   │   │   └── jwt.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── index.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── index.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                   # 👥 Gestión de Usuarios
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── groups/                  # 👫 Gestión de Grupos
│   │   ├── entities/
│   │   │   ├── group.entity.ts
│   │   │   └── group-member.entity.ts
│   │   ├── dto/
│   │   │   ├── create-group.dto.ts
│   │   │   ├── update-group.dto.ts
│   │   │   └── index.ts
│   │   ├── groups.controller.ts
│   │   ├── groups.service.ts
│   │   └── groups.module.ts
│   │
│   ├── messages/                # 💬 Mensajería
│   │   ├── entities/
│   │   │   ├── message.entity.ts
│   │   │   └── message-status.entity.ts
│   │   ├── dto/
│   │   │   ├── create-message.dto.ts
│   │   │   ├── update-message.dto.ts
│   │   │   └── index.ts
│   │   ├── messages.controller.ts
│   │   ├── messages.service.ts
│   │   └── messages.module.ts
│   │
│   ├── media/                   # 📂 Gestión de Archivos
│   │   ├── entities/
│   │   │   └── media.entity.ts
│   │   ├── dto/
│   │   │   └── upload-media.dto.ts
│   │   ├── media.controller.ts
│   │   ├── media.service.ts
│   │   └── media.module.ts
│   │
│   ├── presence/                # 🟢 Estado de Usuarios
│   │   ├── entities/
│   │   │   └── presence.entity.ts
│   │   ├── presence.controller.ts
│   │   ├── presence.service.ts
│   │   └── presence.module.ts
│   │
│   ├── common/                  # 🔧 Código Compartido
│   │   └── ...
│   │
│   ├── config/                  # ⚙️ Configuración
│   │   └── database.config.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── .env                         # Variables de entorno
├── .env.example
├── package.json
├── tsconfig.json
├── test-api.http                # 🧪 Archivo para testear endpoints
└── README.md

```

---

## ⚙️ Instalación y Configuración

### 1. **Requisitos Previos**

```bash
# Node.js 18+
node --version

# npm
npm --version

# PostgreSQL 15+
psql --version
```

### 2. **Clonar y Instalar Dependencias**

```bash
cd groupsapp
npm install
```

### 3. **Crear Base de Datos**

```bash
# Windows (PowerShell)
$env:PGPASSWORD='password'
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE groupsapp;"

# macOS/Linux
createdb groupsapp -U postgres
```

### 4. **Configurar Variables de Entorno**

Crear archivo `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=groupsapp

# JWT
JWT_SECRET=tu-secreto-super-seguro-cambiar-en-produccion

# Environment
NODE_ENV=development
PORT=3000
```

### 5. **Iniciar el Servidor**

```bash
npm run start:dev
```

Deberías ver:

```
[NestApplication] Nest application successfully started
```

El servidor está escuchando en **http://localhost:3000**

---

## ✨ Funcionalidades Implementadas

### **FASE 1: 🔐 AUTENTICACIÓN** ✅

#### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Login y obtener JWT token |

#### Ejemplo de Registro

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "password": "123456",
    "email": "juan@example.com"
  }'
```

**Respuesta:**

```json
{
  "id": "33fb840e-e01c-487d-baaf-b177b35d683e",
  "username": "juan",
  "email": "juan@example.com"
}
```

#### Ejemplo de Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan",
    "password": "123456"
  }'
```

**Respuesta:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "33fb840e-e01c-487d-baaf-b177b35d683e",
    "username": "juan",
    "email": "juan@example.com"
  }
}
```

- ✅ Password hashing con bcrypt (10 rounds)
- ✅ JWT Token con 24h de expiración
- ✅ Validación de credenciales

---

### **FASE 2: 👥 GESTIÓN DE USUARIOS** ✅

#### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listar todos los usuarios |
| GET | `/users/:id` | Obtener usuario específico |

#### Ejemplo

```bash
curl http://localhost:3000/users
```

**Respuesta:**

```json
[
  {
    "id": "33fb840e-e01c-487d-baaf-b177b35d683e",
    "username": "juan",
    "email": "juan@example.com",
    "createdAt": "2026-04-01T11:20:00.000Z"
  },
  {
    "id": "08efdf84-6d2a-4f3a-9aa5-aed6d834112b",
    "username": "maria",
    "email": "maria@example.com",
    "createdAt": "2026-04-01T11:21:00.000Z"
  }
]
```

- ✅ Usuarios públicos sin passwords por seguridad
- ✅ Timestamps automáticos

---

### **FASE 3: 👫 GESTIÓN DE GRUPOS** ✅

#### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/groups` | Crear grupo |
| GET | `/groups` | Listar todos los grupos |
| GET | `/groups/:id` | Obtener grupo específico |
| PUT | `/groups/:id` | Actualizar grupo |
| DELETE | `/groups/:id` | Eliminar grupo |
| GET | `/groups/:id/members` | Listar miembros del grupo |
| POST | `/groups/:groupId/members/:userId` | Agregar miembro |
| DELETE | `/groups/:groupId/members/:userId` | Remover miembro |

#### Ejemplo - Crear Grupo

```bash
curl -X POST http://localhost:3000/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Desarrolladores",
    "description": "Equipo de backend del proyecto"
  }'
```

**Respuesta:**

```json
{
  "id": "287f12f0-850b-40eb-ad17-b0e8473f16c6",
  "name": "Desarrolladores",
  "description": "Equipo de backend del proyecto",
  "createdAt": "2026-04-01T11:22:00.000Z",
  "members": []
}
```

#### Ejemplo - Agregar Miembro

```bash
curl -X POST http://localhost:3000/groups/287f12f0-850b-40eb-ad17-b0e8473f16c6/members/33fb840e-e01c-487d-baaf-b177b35d683e
```

**Respuesta:**

```json
{
  "id": "e7b11934-19c8-42a0-bcbd-9dbc6c48e8c9",
  "userId": "33fb840e-e01c-487d-baaf-b177b35d683e",
  "groupId": "287f12f0-850b-40eb-ad17-b0e8473f16c6",
  "role": "member",
  "joinedAt": "2026-04-01T11:23:00.000Z"
}
```

- ✅ Crear/Actualizar/Eliminar grupos
- ✅ Roles (admin/member)
- ✅ Cascade delete (grupo eliminado = miembros eliminados)

---

### **FASE 4: 💬 MENSAJERÍA (CORE)** ✅

#### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/messages` | Enviar mensaje |
| GET | `/messages/group/:groupId` | Listar mensajes del grupo |
| GET | `/messages/:id` | Obtener mensaje específico |
| PUT | `/messages/:id` | Editar mensaje |
| DELETE | `/messages/:id` | Eliminar mensaje |

#### Ejemplo - Enviar Mensaje

```bash
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -d '{
    "content": "¡Hola equipo! ¿Cómo están?",
    "senderId": "33fb840e-e01c-487d-baaf-b177b35d683e",
    "groupId": "287f12f0-850b-40eb-ad17-b0e8473f16c6"
  }'
```

**Respuesta:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "content": "¡Hola equipo! ¿Cómo están?",
  "sender": {
    "id": "33fb840e-e01c-487d-baaf-b177b35d683e",
    "username": "juan"
  },
  "group": {
    "id": "287f12f0-850b-40eb-ad17-b0e8473f16c6",
    "name": "Desarrolladores"
  },
  "createdAt": "2026-04-01T11:24:00.000Z",
  "updatedAt": "2026-04-01T11:24:00.000Z",
  "isEdited": false
}
```

#### Ejemplo - Obtener Mensajes de un Grupo

```bash
curl "http://localhost:3000/messages/group/287f12f0-850b-40eb-ad17-b0e8473f16c6?limit=50&offset=0"
```

**Respuesta:**

```json
{
  "messages": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "content": "¡Hola equipo! ¿Cómo están?",
      "sender": {
        "id": "33fb840e-e01c-487d-baaf-b177b35d683e",
        "username": "juan"
      },
      "createdAt": "2026-04-01T11:24:00.000Z",
      "isEdited": false
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

#### Ejemplo - Editar Mensaje (Solo propietario)

```bash
curl -X PUT http://localhost:3000/messages/a1b2c3d4-e5f6-7890-abcd-ef1234567890 \
  -H "Content-Type: application/json" \
  -d '{
    "content": "¡Hola equipo! Actualizado",
    "senderId": "33fb840e-e01c-487d-baaf-b177b35d683e"
  }'
```

- ✅ Enviar mensajes en grupos
- ✅ Editar propios mensajes
- ✅ Eliminar propios mensajes
- ✅ Paginación (limit/offset)
- ✅ Validación: solo miembros del grupo pueden enviar

---

### **FASE 5: 📊 MESSAGE STATUS** ✅

#### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/messages/:id/status` | Obtener estado del mensaje |

#### Características

- ✅ Estados: SENT, DELIVERED, READ
- ✅ Tracking automático por usuario
- ✅ Timestamp de cambios

---

### **FASE 6: 📂 MEDIA (ARCHIVOS)** ✅

#### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/media/upload` | Subir archivo |
| GET | `/media/:id` | Obtener archivo |
| DELETE | `/media/:id` | Eliminar archivo |

#### Ejemplo - Upload

```bash
curl -X POST http://localhost:3000/media/upload \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "documento.pdf",
    "userId": "33fb840e-e01c-487d-baaf-b177b35d683e",
    "groupId": "287f12f0-850b-40eb-ad17-b0e8473f16c6"
  }'
```

**Respuesta:**

```json
{
  "id": "f1e2d3c4-b5a6-7890-1234-567890abcdef",
  "filename": "documento.pdf",
  "url": "https://media.groupsapp.local/files/documento.pdf",
  "mimeType": "application/pdf",
  "size": 2048,
  "uploadedBy": {
    "id": "33fb840e-e01c-487d-baaf-b177b35d683e",
    "username": "juan"
  },
  "createdAt": "2026-04-01T11:25:00.000Z"
}
```

- ✅ Simulación de upload
- ✅ URL auto-generada
- ✅ Metadata (tamaño, tipo MIME)
- ✅ Propiedad: solo propietario puede eliminar

---

### **FASE 7: 🟢 PRESENCE (ESTADO DE USUARIOS)** ✅

#### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/presence/:userId/status` | Cambiar estado |
| GET | `/presence/:userId` | Obtener estado de usuario |
| GET | `/presence` | Obtener estado de todos |

#### Ejemplo - Cambiar Estado a Online

```bash
curl -X POST http://localhost:3000/presence/33fb840e-e01c-487d-baaf-b177b35d683e/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "online"
  }'
```

**Respuesta:**

```json
{
  "userId": "33fb840e-e01c-487d-baaf-b177b35d683e",
  "username": "juan",
  "status": "online",
  "lastSeen": "2026-04-01T11:26:00.000Z"
}
```

#### Estados Disponibles

- `online` - Usuario activo
- `offline` - Usuario desconectado
- `away` - Usuario inactivo
- `dnd` - No molestar

- ✅ Estados de presencia en tiempo real (simulado)
- ✅ Tracking de última actividad
- ✅ OneToOne con usuario

---

## 🧪 Cómo Probar los Endpoints

### Opción 1: Usar el archivo `test-api.http`

**VS Code** con extensión **REST Client** - Es la forma más rápida

```bash
# Instalar extensión REST Client
# Publisher: Huachao Mao
# O simplemente ir a: test-api.http y clickear "Send Request"
```

Pasos:

1. Abre el archivo `test-api.http`
2. Busca la sección de prueba que quieras
3. Haz click en **"Send Request"** (aparece encima de cada request)
4. Ve la respuesta en la pestaña de OUTPUT

### Opción 2: Usar cURL

```bash
# Ejemplo: Obtener todos los usuarios
curl http://localhost:3000/users

# Ejemplo: Crear grupo
curl -X POST http://localhost:3000/groups \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Desarrolladores",
    "description": "Backend team"
  }'
```

### Opción 3: Usar Postman

1. Importar la colección de `test-api.http`
2. Configurar variables de entorno
3. Ejecutar requests

---

## 🗄️ Base de Datos

### Entidades (Tablas)

```
┌──────────────────┐
│     users        │
├──────────────────┤
│ id (UUID, PK)    │
│ username (UQ)    │
│ password         │
│ email            │
│ createdAt        │
└──────────────────┘
        ↓
    ↙       ↘
┌──────────────────┐    ┌──────────────────┐
│ group_members    │    │     groups       │
├──────────────────┤    ├──────────────────┤
│ id (UUID, PK)    │    │ id (UUID, PK)    │
│ userId (FK)      │    │ name             │
│ groupId (FK)     │    │ description      │
│ role (enum)      │    │ createdAt        │
│ joinedAt         │    └──────────────────┘
└──────────────────┘
        ↓
┌──────────────────┐
│    messages      │
├──────────────────┤
│ id (UUID, PK)    │
│ content          │
│ senderId (FK)    │
│ groupId (FK)     │
│ createdAt        │
│ updatedAt        │
│ isEdited         │
└──────────────────┘
```

### Relaciones

- **User → GroupMember → Group** (Many-to-Many)
- **User → Message** (1:N - sender)
- **Group → Message** (1:N - receives messages)
- **User → Presence** (1:1 - unique presence per user)
- **User → Media** (1:N - uploaded files)

### Eliminación en Cascada

- Eliminar grupo → Elimina miembros del grupo
- Eliminar usuario → Elimina sus mensajes, presencia, archivos

---

## 🚀 Próximos Pasos

### Corto Plazo (Próximas semanas)

- [ ] Agregar validación de membresía antes de enviar mensaje
- [ ] Implementar búsqueda de mensajes
- [ ] Mensajes directos (1:1)
- [ ] Notificaciones básicas
- [ ] Tests unitarios
- [ ] Docker para deployar fácilmente

### Mediano Plazo (Próximo mes)

- [ ] WebSockets para mensajería en tiempo real
- [ ] Typing indicators (ver cuando alguien está escribiendo)
- [ ] Read receipts (confirmación de lectura)
- [ ] Búsqueda avanzada
- [ ] Roles más granulares (owner, admin, member, guest)

### Largo Plazo (Futuro)

- [ ] **Migrar a Microservicios** - Separar cada módulo
- [ ] **gRPC** - Para comunicación entre servicios
- [ ] **Kafka** - Event streaming para eventos distribuidos
- [ ] **Kubernetes** - Orquestación de contenedores
- [ ] **GraphQL** - API alternativa
- [ ] **Cache** - Redis para presencia y sesiones

---

## 📝 Notas Importantes

### Seguridad

⚠️ **CAMBIAR ANTES DE PRODUCCIÓN:**

```env
JWT_SECRET=esto-es-una-prueba-cambiar-en-prod
DB_PASS=password  # Cambiar contraseña DB
```

### Password Hashing

- Algoritmo: bcrypt
- Rounds: 10
- No se almacenan passwords en plain text

### Validaciones

- Email: formato de email válido
- Username: único en la BD
- Content: 1-5000 caracteres
- UUID: validación de formato

---

## 👥 Equipo

- **Desarrollador Principal:** [Tu Nombre]
- **Proyecto Académico:** Sistemas Distribuidos - Semestre 6
- **Inicio:** Abril 2026

---

## 📞 Soporte y Preguntas

Para preguntas sobre:

- **Arquitectura:** Ver `agents.md`
- **Instalación:** Ver sección de Instalación
- **Endpoints:** Ver sección de Funcionalidades
- **Testing:** Ver sección de Pruebas

---

**Última actualización:** 1 de Abril, 2026  
**Versión:** 1.0 - MVP Completo
