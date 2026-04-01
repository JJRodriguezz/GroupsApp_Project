# 🚀 GroupsApp - Sistema de Mensajería Distribuida

> MVP de un sistema de mensajería tipo WhatsApp/Telegram enfocado en comunicación grupal.
> Monolito modular preparado para evolucionar hacia microservicios.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Documentation](#api-documentation)
- [Arquitectura](#arquitectura)

---

## ✨ Características

### ✅ FASE 1 - AUTENTICACIÓN
- Registro de usuarios con bcrypt
- Login con JWT (Bearer Token)
- JWT Guard para proteger rutas

### ✅ FASE 2 - USUARIOS
- Obtener usuario por ID
- Listar todos los usuarios
- Datos públicos: id, username, email

### ✅ FASE 3 - GRUPOS
- Crear grupos
- Gestionar miembros (add/remove)
- Roles: admin, member
- Listar grupos y sus miembros

### ✅ FASE 4 - MENSAJES (CORE)
- Enviar mensajes a grupos
- Editar/eliminar propios mensajes
- Paginación de historial
- Flag para mensajes editados

### ✅ FASE 5 - ESTADO DE MENSAJES
- Marcar mensajes como leídos
- Estados: sent, delivered, read
- Tracking por usuario

### ✅ FASE 6 - MEDIA
- Upload simulado (placeholder)
- Metadatos almacenados
- Solo el propietario puede eliminar

### ✅ FASE 7 - PRESENCIA
- Estados: online, offline, away, dnd
- Último visto (lastSeen)
- API para consultar presencia

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Runtime | Node.js | - |
| Framework | NestJS | ^11.0.1 |
| Lenguaje | TypeScript | - |
| Base de datos | PostgreSQL | - |
| ORM | TypeORM | - |
| Autenticación | JWT | - |
| Validación | class-validator | ^0.15.1 |
| Hashing | bcrypt | ^6.0.0 |

---

## 📦 Instalación

### Requisitos previos
- **Node.js** 18+ 
- **npm** o **yarn**
- **PostgreSQL** 14+

### Pasos

1. **Clonar repositorio**
```bash
cd "C:/Users/Dxvil/OneDrive/Desktop/Universidad/Semestre 6/Sistemas Distribuidos"
```

2. **Instalar dependencias**
```bash
cd groupsapp
npm install
```

3. **Configurar base de datos PostgreSQL**
```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE groupsapp;"

# O desde pgAdmin
# CREATE DATABASE groupsapp;
```

---

## ⚙️ Configuración

### Variables de Entorno

Copiar `.env.example` a `.env`:
```bash
cp .env.example .env
```

Configurar valores en `.env`:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=groupsapp

# JWT
JWT_SECRET=your-super-secret-key-prod-only

# Application
NODE_ENV=development
PORT=3000
```

---

## 🚀 Ejecución

### Desarrollo (Con hot reload)
```bash
npm run start:dev
```

### Producción
```bash
npm run build
npm run start:prod
```

### Otros comandos
```bash
npm run build          # Compilar TypeScript
npm run lint           # ESLint
npm test               # Tests unitarios
npm run test:e2e       # Tests E2E
npm run format         # Prettier format
```

---

## 📚 API Documentation

Ver documentación completa en: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Endpoints rápidos

#### 🔐 Autenticación
```bash
# Registro
POST /auth/register
{
  "username": "juan",
  "password": "123456",
  "email": "juan@example.com"
}

# Login
POST /auth/login
{
  "username": "juan",
  "password": "123456"
}
# Response: { access_token, user: {...} }
```

#### 👥 Usuarios
```bash
# Listar usuarios
GET /users

# Obtener usuario
GET /users/:id
```

#### 👥 Grupos
```bash
# Crear grupo
POST /groups
{ "name": "Mi Grupo", "description": "..." }

# Obtener grupo
GET /groups/:id

# Agregar miembro
POST /groups/:groupId/members/:userId

# Listar miembros
GET /groups/:id/members
```

#### 💬 Mensajes
```bash
# Enviar mensaje
POST /messages
{
  "content": "Hola grupo!",
  "senderId": "user-id",
  "groupId": "group-id"
}

# Obtener mensajes
GET /messages/group/:groupId?limit=50&offset=0

# Editar mensaje
PUT /messages/:id
{ "content": "Contenido editado" }

# Eliminar mensaje
DELETE /messages/:id
```

#### 🟢 Presencia
```bash
# Obtener presencia de usuario
GET /presence/:userId

# Cambiar estado
POST /presence/:userId/status
{ "status": "online" }

# Ver todas las presencias
GET /presence
```

---

## 🏗️ Arquitectura

### Modular Monolith

El proyecto sigue una arquitectura de **monolito modular**, preparado para evolucionar hacia **microservicios**:

```
src/
├── auth/              → Autenticación y JWT (Futuro: ms-auth)
├── users/             → Gestión de usuarios (Futuro: ms-users)
├── groups/            → Gestión de grupos (Futuro: ms-groups)
├── messages/          → Mensajería principal (Futuro: ms-messages)
├── media/             → Gestión de archivos (Futuro: ms-media)
├── presence/          → Estado de usuarios (Futuro: ms-presence)
├── config/            → Configuración global
└── main.ts            → Entry point
```

### Principios

✅ **Bajo acoplamiento**: Cada módulo es independiente
✅ **DTOs siempre**: Validación en entrada
✅ **Services encapsulan**: Toda lógica en services
✅ **Escalable**: Fácil separación en microservicios
✅ **JWT Guard**: Protección de rutas autenticadas

### Patrón de módulo

```typescript
// *.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService], // Para otros módulos
})
export class ModuleModule {}

// *.service.ts
@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(Entity)
    private repo: Repository<Entity>,
  ) {}

  async create(...) { }
  async findAll() { }
  // Lógica encapsulada
}

// *.controller.ts
@Controller('endpoint')
export class ModuleController {
  constructor(private service: ModuleService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }
}
```

---

## 🔄 Flujo de una solicitud típica

```
Cliente
  ↓
POST /auth/login
  ↓
AuthController
  ↓
AuthService.login()
  ↓
UsersService.findByUsername()
  ↓
Repository.findOne()
  ↓
PostgreSQL
  ← bcrypt.compare()
  ← JwtService.sign() 
  ↓
Response: { access_token, user }
  ↓
Cliente (almacena token)
  ↓
GET /users con Authorization: Bearer <token>
  ↓
JwtGuard valida token
  ↓
JwtStrategy extrae payload
  ↓
UsersService.findById() verifica usuario
  ↓
Acceso permitido
```

---

## 🚀 Próximos pasos (Roadmap)

### Corto plazo
- [ ] Tests unitarios (Jest)
- [ ] Tests E2E (Cypress/Playwright)
- [ ] Validación de membresía en messages
- [ ] Error handling mejorado

### Mediano plazo
- [ ] WebSocket para mensajes en tiempo real
- [ ] Kafka para eventos asincronos
- [ ] Logging centralizado
- [ ] Rate limiting

### Largo plazo
- [ ] Separar en microservicios (gRPC)
- [ ] API Gateway
- [ ] Caché con Redis
- [ ] Elasticsearch para búsqueda de mensajes
- [ ] Kubernetes deployment

---

## 📝 Notas

- **Seguridad**: Las contraseñas están hasheadas con bcrypt (10 rounds)
- **JWT**: Token expira en 24 horas, almacenar en `localStorage` (cliente)
- **CORS**: Habilitado globalmente (cambiar en producción)
- **Validación**: Global con class-validator, customizable por endpoint
- **Timestamps**: Automáticos (createdAt, updatedAt)

---

## 📞 Support

Para dudas sobre:
- **Arquitectura**: Ver `agents.md`
- **API**: Ver `API_DOCUMENTATION.md`
- **Código**: Revisar comentarios en archivos

---

## 📄 Licencia

UNLICENSED - Proyecto académico (Semestre 6, Universidad)

---

**Última actualización**: March 31, 2026
**Estado**: ✅ MVP Ready
