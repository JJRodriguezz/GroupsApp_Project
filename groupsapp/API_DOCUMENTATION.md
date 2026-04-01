# 📋 GroupsApp - API Endpoints & Implementation Status

## ✅ IMPLEMENTACIÓN COMPLETA

---

## 🔐 FASE 1 - AUTH (✅ COMPLETADA - 100%)

### Entidades
- **User**: UUID, username (unique), password (bcrypt), email, createdAt

### Endpoints
```
POST /auth/register
Body: { username, password, email? }
Response: { id, username, email }

POST /auth/login
Body: { username, password }
Response: { access_token, user: { id, username, email } }
```

### Seguridad
- ✅ Hash bcrypt (10 rounds)
- ✅ JWT Generation (24h expiration)
- ✅ JWT Strategy (Passport.js)
- ✅ JWT Guard para proteger rutas

---

## 👥 FASE 2 - USERS (✅ COMPLETADA - 100%)

### Endpoints
```
GET /users
Response: [ { id, username, email, createdAt }, ... ]

GET /users/:id
Response: { id, username, password (hash), email, createdAt }

POST /auth/register
(Creates user)
```

---

## 👥 FASE 3 - GROUPS (✅ COMPLETADA - 100%)

### Entidades
- **Group**: UUID, name, description, createdAt, members
- **GroupMember**: UUID, user, group, role (admin/member), joinedAt

### Endpoints
```
POST /groups
Body: { name, description? }
Response: Group object

GET /groups
Response: [Group objects]

GET /groups/:id
Response: Group object with members

PUT /groups/:id
Body: { name?, description? }
Response: Updated group

DELETE /groups/:id
Response: Success

GET /groups/:id/members
Response: [GroupMember objects]

POST /groups/:groupId/members/:userId
Response: GroupMember created

DELETE /groups/:groupId/members/:userId
Response: Member removed
```

### Features
- ✅ ROLES: admin, member
- ✅ Timestamps (joinedAt)
- ✅ Cascade delete (miembros al eliminar grupo)

---

## 💬 FASE 4 - MESSAGES (✅ COMPLETADA - 100%)

### Entidades
- **Message**: UUID, content, sender (User), group (Group), createdAt, updatedAt, isEdited

### Endpoints
```
POST /messages
Body: { content, senderId, groupId }
Response: Message created

GET /messages/:id
Response: Message object

GET /messages/group/:groupId?limit=50&offset=0
Response: { messages, total, limit, offset }

PUT /messages/:id
Body: { content }
Response: Updated message (marks isEdited=true)

DELETE /messages/:id
Response: Message deleted
```

### Features
- ✅ Validación de contenido no vacío
- ✅ Solo el remitente puede editar/eliminar
- ✅ Paginación automática
- ✅ Timestamps (createdAt, updatedAt)
- ✅ isEdited flag

---

## 📊 FASE 5 - MESSAGE STATUS (✅ COMPLETADA - 100%)

### Entidades
- **MessageStatus**: UUID, message, user, status (sent/delivered/read), createdAt

### Endpoints
```
PATCH /messages/:id/read
Body: { userId }
Response: MessageStatus updated

GET /messages/:id/status
Response: [MessageStatus objects for that message]
```

### Features
- ✅ Estados: SENT, DELIVERED, READ
- ✅ Seguimiento por usuario
- ✅ Timestamps

---

## 📂 FASE 6 - MEDIA (✅ PLACEHOLDER - 100%)

### Entidades
- **Media**: UUID, filename, url, mimeType, size, uploadedBy (User), group?, createdAt

### Endpoints
```
POST /media/upload
Body: { filename, userId, groupId? }
Response: { id, filename, url (simulated), size }

GET /media/:id
Response: Media metadata

DELETE /media/:id
Body: { userId }
Response: Media deleted (solo owner)
```

### Features
- ✅ Simulación de URL (https://media.groupsapp.local/files/...)
- ✅ Validación de propiedad
- ✅ Metadata almacenada

---

## 🟢 FASE 7 - PRESENCE (✅ PLACEHOLDER - 100%)

### Entidades
- **Presence**: UUID, user (OneToOne), status (online/offline/away/dnd), lastSeen, updatedAt

### Endpoints
```
GET /presence
Response: [{ userId, username, status, lastSeen }, ...]

GET /presence/:userId
Response: { userId, username, status, lastSeen }

POST /presence/:userId/status
Body: { status: "online"|"offline"|"away"|"dnd" }
Response: Updated presence
```

### Features
- ✅ Estados: ONLINE, OFFLINE, AWAY, DND
- ✅ lastSeen tracking
- ✅ Simulación lista para eventos WebSocket

---

## 🏗️ ARQUITECTURA - MODULAR MONOLITH

### Estructura
```
src/
  auth/
    ├── guards/
    ├── strategies/
    ├── dto/
    ├── auth.module.ts
    ├── auth.service.ts
    ├── auth.controller.ts
  
  users/
    ├── entities/
    ├── dto/
    ├── users.module.ts
    ├── users.service.ts
    ├── users.controller.ts
  
  groups/
    ├── entities/
    ├── dto/
    ├── groups.module.ts
    ├── groups.service.ts
    ├── groups.controller.ts
  
  messages/
    ├── entities/
    ├── dto/
    ├── messages.module.ts
    ├── messages.service.ts
    ├── messages.controller.ts
    ├── message-status.service.ts
  
  media/
    ├── entities/
    ├── dto/
    ├── media.module.ts
    ├── media.service.ts
    ├── media.controller.ts
  
  presence/
    ├── entities/
    ├── presence.module.ts
    ├── presence.service.ts
    ├── presence.controller.ts
  
  config/
    └── database.config.ts
  
  main.ts
  app.module.ts
```

---

## ✨ PRINCIPIOS IMPLEMENTADOS

### ✅ Modular Monolith
- Cada dominio en su propio módulo
- No compartir lógica directamente
- Comunicación SOLO vía services

### ✅ Bajo Acoplamiento
- DTOs siempre (validación en entrada)
- Services encapsulan lógica
- No importar entidades directamente
- Exports selectivos en módulos

### ✅ Escalabilidad Futura
- Interfaces claras entre módulos
- Services pueden reemplazarse por gRPC
- Lógica lista para Kafka events
- Separación clara de responsabilidades

---

## 🔒 SEGURIDAD

### ✅ JWT Authentication
- Token en header: `Authorization: Bearer <token>`
- Expiración: 24 horas
- Secret en .env

### ✅ Validación
- DTOs con class-validator
- ValidationPipe global
- Whitelist habilitada (forbidNonWhitelisted)

### ✅ Acceso
- Solo propietario puede editar/eliminar propios recursos (messages, media)
- Roles en groups (admin/member)

---

## 🚀 PRÓXIMOS PASOS (Para separación en microservicios)

1. **Eventos Kafka**
   - Reemplazar llamadas internas por eventos
   - Ejemplo: message.created → MessageStatusService escucha

2. **gRPC**
   - Especificar .proto files
   - Reemplazar imports de services

3. **Bases de datos por servicio**
   - Cada microservicio: su DB PostgreSQL separada
   - Sincronización vía eventos

4. **API Gateway**
   - Validación de tokens centralizada
   - Rate limiting
   - Request/Response logging

---

## 📝 NOTA

Este monolito está diseñado específicamente para:
- ✅ MVP funcional
- ✅ Validación de arquitectura
- ✅ Fácil evolución a microservicios

Todos los módulos pueden separarse sin cambios significativos en la lógica de negocio.

---

Last updated: March 31, 2026
Status: ✅ READY FOR MVPImage
