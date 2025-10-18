# Inventory API

API REST para la gestión de inventario de vehículos construida con Node.js, TypeScript, Express y MongoDB, siguiendo principios de arquitectura hexagonal.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Testing](#testing)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Endpoints API](#endpoints-api)
- [Documentación Swagger](#documentación-swagger)

---

## Descripción General

Sistema backend completo para la gestión de un inventario de vehículos que permite operaciones CRUD sobre automóviles, gestión de usuarios con autenticación JWT, y catálogos de marcas, modelos y años. El proyecto implementa mejores prácticas de desarrollo, incluyendo validación de datos, manejo de errores, logging estructurado y despliegue con Docker.

### Características Principales

- Autenticación y autorización mediante JSON Web Tokens
- CRUD completo de vehículos con soft delete
- Gestión de imágenes con almacenamiento local
- Paginación y filtros avanzados para consultas
- Catálogos dinámicos de marcas, modelos y años disponibles
- Validación exhaustiva de datos con Zod
- Logging estructurado con Winston y rotación de archivos
- Rate limiting para prevención de abuso
- Documentación interactiva con Swagger UI
- Suite de tests automatizados con Jest
- Despliegue containerizado con Docker Compose

---

## Arquitectura

El proyecto sigue una arquitectura hexagonal (Puertos y Adaptadores) que separa la lógica de negocio de los detalles de implementación, facilitando el mantenimiento y la testabilidad.

### Capas Principales

**Core (Dominio)**
- Entidades: Representaciones de los conceptos del negocio
- Casos de uso: Lógica de aplicación independiente de frameworks
- Puertos: Interfaces que definen contratos de comunicación
- DTOs: Objetos de transferencia de datos

**Infrastructure (Infraestructura)**
- Adaptadores de base de datos: Implementaciones concretas con TypeORM
- Servicios externos: Logging, almacenamiento de archivos
- Configuración de servidor Express

**API (Presentación)**
- Controllers: Manejo de peticiones HTTP
- Middlewares: Autenticación, validación, logging, manejo de errores
- Routes: Definición de endpoints
- DTOs de validación: Schemas con Zod

### Principios Aplicados

- Inversión de dependencias
- Separación de responsabilidades
- Inyección de dependencias
- Desacoplamiento entre capas

---

## Tecnologías

### Runtime y Lenguaje
- Node.js 22.x
- TypeScript 5.9.3

### Framework y Servidor
- Express 5.1.0
- CORS habilitado

### Base de Datos
- MongoDB 7
- TypeORM 0.3.20
- Reflect Metadata

### Autenticación y Seguridad
- JSON Web Token
- bcryptjs para hashing de contraseñas
- express-rate-limit

### Validación
- Zod 4.1

### Logging
- Winston 3.11
- winston-daily-rotate-file

### Manejo de Archivos
- Multer

### Documentación
- swagger-ui-express
- swagger-jsdoc

### Testing
- Jest 29.7
- ts-jest

### Desarrollo
- ts-node-dev
- dotenv
- tsc-alias

### Containerización
- Docker
- Docker Compose

---

## Requisitos Previos

### Opción 1: Docker (Recomendado)
- Docker 20.x o superior
- Docker Compose 2.x o superior

### Opción 2: Instalación Local
- Node.js 22.x o superior
- MongoDB 7.x o superior
- npm o yarn

---

## Instalación

### Con Docker

**IMPORTANTE**: Es obligatorio crear un archivo `.env` antes de ejecutar Docker. El contenedor no iniciará sin este archivo.

```bash
# Clonar el repositorio
git clone <repository-url>
cd inventory_api

# PASO CRÍTICO: Crear archivo de variables de entorno
cp .env.example .env

# Editar .env con tus valores (especialmente JWT_SECRET y credenciales de MongoDB)
# nano .env  # o usar cualquier editor

# Construir y levantar los contenedores
docker-compose up -d --build
```

### Instalación Local

```bash
# Clonar el repositorio
git clone <repository-url>
cd inventory_api

# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env

# Compilar TypeScript
npm run build
```

---

## Configuración

El proyecto utiliza variables de entorno para su configuración. Crear un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
# Aplicación
NODE_ENV=development
PORT=3001

# Base de Datos MongoDB
MONGO_URI=mongodb://admin:admin123@mongodb:27017/inventory_db?authSource=admin
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DATABASE=inventory_db
MONGO_PORT=27017

# Autenticación JWT
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRATION=24h

# Seguridad
SALTS_ROUNDS=10

# Archivos
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Variables de Entorno

**NODE_ENV**: Entorno de ejecución (development, production)  
**PORT**: Puerto del servidor HTTP  
**MONGO_URI**: Cadena de conexión completa a MongoDB  
**MONGO_ROOT_USER**: Usuario root de MongoDB  
**MONGO_ROOT_PASSWORD**: Contraseña del usuario root  
**MONGO_DATABASE**: Nombre de la base de datos  
**MONGO_PORT**: Puerto de MongoDB  
**JWT_SECRET**: Secreto para firmar tokens JWT (mínimo 32 caracteres)  
**JWT_EXPIRATION**: Tiempo de expiración de tokens  
**SALTS_ROUNDS**: Número de rondas para bcrypt  
**MAX_FILE_SIZE**: Tamaño máximo de archivo en bytes  
**ALLOWED_FILE_TYPES**: Tipos MIME permitidos para imágenes  
**ALLOWED_ORIGINS**: Orígenes permitidos para CORS

---

## Ejecución

### Con Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker logs -f inventory_api

# Detener servicios
docker-compose down

# Reiniciar limpiando volúmenes
docker-compose down -v
docker-compose up -d --build
```

El servidor estará disponible en `http://localhost:3001`

### Desarrollo Local

```bash
# Modo desarrollo con hot reload
npm run dev

# Compilar y ejecutar
npm run build
npm start
```

### Seed de Datos

Al utilizar Docker, el seed se ejecuta automáticamente al iniciar el contenedor. Para ejecutarlo manualmente:

```bash
# Local
npm run seed

# Docker (si no se ejecutó automáticamente)
docker exec inventory_api node dist/infrastructure/database/seed.js
```

El seed inicializa:
- Usuario de prueba (admin@example.com / admin123)
- 10 marcas de vehículos
- 50 modelos (5 por marca)
- Rango de años disponibles (2015-2025)

---

## Testing

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Con coverage
npm run test:coverage

# Modo watch
npm run test:watch

# Tests en Docker
npm run test:docker
```

### Suite de Tests

El proyecto incluye 33 tests que cubren:

**Use Cases**
- Creación de vehículos
- Actualización de vehículos
- Eliminación de vehículos
- Búsqueda con filtros y paginación
- Gestión de fotos

**Controllers**
- Validación de datos de entrada
- Manejo de errores
- Respuestas HTTP correctas

**Validaciones**
- Schemas de creación y actualización
- Filtros de búsqueda
- Autenticación

---

## Estructura del Proyecto

```
inventory_api/
├── src/
│   ├── api/
│   │   ├── controllers/       # Controladores HTTP
│   │   ├── dtos/              # Schemas de validación
│   │   ├── middlewares/       # Auth, validación, logging, errores
│   │   └── routes/            # Definición de rutas
│   │
│   ├── core/
│   │   ├── entities/          # Entidades del dominio
│   │   ├── ports/             # Interfaces de repositorios
│   │   ├── shared/
│   │   │   ├── dtos/          # DTOs del dominio
│   │   │   └── errors/        # Errores personalizados
│   │   └── uses-cases/        # Lógica de aplicación
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── repositories/  # Implementaciones de repositorios
│   │   │   ├── transformers/  # Mapeo entidad-modelo
│   │   │   ├── data-source.ts # Configuración TypeORM
│   │   │   └── seed.ts        # Inicialización de datos
│   │   ├── services/          # Logger, almacenamiento
│   │   └── web/
│   │       └── express/       # Configuración del servidor
│   │
│   ├── test/                  # Tests unitarios y de integración
│   ├── app.ts                 # Configuración de Express
│   └── config/                # Configuración centralizada
│
├── dist/                      # Código compilado
├── logs/                      # Logs de la aplicación
├── public/uploads/            # Archivos subidos
├── docker-compose.yml         # Orquestación de contenedores
├── docker-compose.test.yml    # Configuración para tests
├── Dockerfile                 # Imagen de producción
├── Dockerfile.test            # Imagen de tests
├── .dockerignore
├── jest.config.js
├── tsconfig.json
└── package.json
```

---

## Endpoints API

La API expone los siguientes endpoints REST. Todos los endpoints (excepto autenticación y salud) requieren autenticación mediante JWT en el header `Authorization: Bearer <token>`.

### Autenticación

#### POST `/api/usuarios/`
Registro de nuevo usuario en el sistema.

**Body:**
```json
{
   "email":"testzzz@test.com","password":"ELTopn4590@"
}
```

**Response (201):**
```json
{
    "status": 201,
    "message": "User created successfully.",
    "data": {
        "id": "68f2f2c4403113ea27a41b4d",
        "email": "testzzz@test.com",
        "password": "",
        "createdAt": "2025-10-18T01:52:04.817Z",
        "updatedAt": "2025-10-18T01:52:04.817Z"
    }
}
```

#### POST `/api/users/login`
Autenticación de usuario existente.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
    "status": 200,
    "message": "Login exitoso.",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjJkYzg0YjU0MWFiMTc2ZGEyNmQ2YyIsImVtYWlsIjoidGVzdHp6ekB0ZXN0LmNvbSIsImlhdCI6MTc2MDc0NjY5NywiZXhwIjoxNzYwODMzMDk3fQ.2jEItU8dkfCbLMiljCixMSjjv3NcSWo_THG5C3LyeG0",
        "user": {
            "id": "68f2dc84b541ab176da26d6c",
            "email": "testzzz@test.com"
        }
    }
}
```

---

### Gestión de Autos

#### GET /api/autos
Lista todos los autos con paginación y filtros opcionales.

**Autenticación:** Requerida (Bearer Token)

**Query Parameters:**
- `page` (number, opcional): Número de página. Default: 1
- `limit` (number, opcional): Elementos por página. Default: 10
- `marca` (string, opcional): Filtrar por marca
- `modelo` (string, opcional): Filtrar por modelo
- `anio` (number, opcional): Filtrar por año
- `color` (string, opcional): Filtrar por color
- `precioMin` (number, opcional): Precio mínimo
- `precioMax` (number, opcional): Precio máximo

**Ejemplo Request:**
```
GET /api/autos?page=1&limit=10&marca=Toyota&precioMin=10000&precioMax=50000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
{
    "status": 200,
    "message": "Carros obtenidos exitosamente.",
    "data": {
        "items": [
            {
                "id": "68f257d988886068bcd7d6ad",
                "marca": "zzz",
                "modelo": "ss",
                "año": 2023,
                "precio": 234,
                "kilometraje": 100,
                "color": null,
                "email": "upconectionupconection@gmail.com",
                "telefono": "9622345678",
                "fotografia": "http://localhost:3000/uploads/cars/car-1760712664951-124583902.jpeg",
                "fechaDeAlta": "2025-10-17T14:51:05.032Z",
                "fechaDeModificacion": "2025-10-17T14:51:05.032Z",
                "fechaDeEliminacion": null
            },
            {
                "id": "68f24f5e0256d59ae2e80304",
                "marca": "Toyota",
                "modelo": "Corolla",
                "año": 2023,
                "precio": 25000,
                "kilometraje": 15000,
                "color": "Rojo",
                "email": "vendedor@example.com",
                "telefono": "9611879041",
                "fotografia": null,
                "fechaDeAlta": "2025-10-17T14:14:54.693Z",
                "fechaDeModificacion": "2025-10-17T14:14:54.693Z",
                "fechaDeEliminacion": null
            },
            {
                "id": "68f2415fd15cabfa0bc666fd",
                "marca": "zzz",
                "modelo": "ss",
                "año": 2023,
                "precio": 234,
                "kilometraje": 100,
                "color": null,
                "email": "upconectionupconection@gmail.com",
                "telefono": "9622345678",
                "fotografia": null,
                "fechaDeAlta": "2025-10-17T13:15:11.402Z",
                "fechaDeModificacion": "2025-10-17T13:15:11.402Z",
                "fechaDeEliminacion": null
            },
            {
                "id": "68f2003ab186fee60959a96b",
                "marca": "zzz",
                "modelo": "ss",
                "año": 2023,
                "precio": 234,
                "kilometraje": 100,
                "color": null,
                "email": "upconectionupconection@gmail.com",
                "telefono": "9622345678",
                "fotografia": "http://localhost:3000/uploads/cars/car-1760690234712-497219349.jpeg",
                "fechaDeAlta": "2025-10-17T08:37:14.733Z",
                "fechaDeModificacion": "2025-10-17T08:37:14.733Z",
                "fechaDeEliminacion": null
            },
            {
                "id": "68f1ff64efea598ea4e212ab",
                "marca": "zzz",
                "modelo": "ss",
                "año": 2023,
                "precio": 234,
                "kilometraje": 100,
                "color": null,
                "email": "upconectionupconection@gmail.com",
                "telefono": "9622345678",
                "fotografia": "http://localhost:3000/uploads/cars/car-1760690020704-386697467.jpeg",
                "fechaDeAlta": "2025-10-17T08:33:40.722Z",
                "fechaDeModificacion": "2025-10-17T08:33:40.722Z",
                "fechaDeEliminacion": null
            },
            {
                "id": "68f1871bf14fbd2537a35d35",
                "marca": "zzz",
                "modelo": "ss",
                "año": 2023,
                "precio": 234,
                "kilometraje": 100,
                "color": null,
                "email": "upconectionupconection@gmail.com",
                "telefono": "9622345678",
                "fotografia": "http://localhost:3000/uploads/cars/car-1760659227231-473255082.jpeg",
                "fechaDeAlta": "2025-10-17T00:00:27.249Z",
                "fechaDeModificacion": "2025-10-17T00:00:27.249Z",
                "fechaDeEliminacion": null
            },
            {
                "id": "68f1863ca7136b04161bafed",
                "marca": "zzz",
                "modelo": "ss",
                "año": 2023,
                "precio": 234,
                "kilometraje": 100,
                "color": null,
                "email": "upconectionupconection@gmail.com",
                "telefono": "9622345678",
                "fotografia": "http://localhost:3000/uploads/cars/car-1760659004594-909767572.jpeg",
                "fechaDeAlta": "2025-10-16T23:56:44.643Z",
                "fechaDeModificacion": "2025-10-16T23:56:44.643Z",
                "fechaDeEliminacion": null
            },
            {
                "id": "68f185f35a3e81cbce41a64f",
                "marca": "zzz",
                "modelo": "ss",
                "año": 2023,
                "precio": 234,
                "kilometraje": 100,
                "color": null,
                "email": "upconectionupconection@gmail.com",
                "telefono": "9622345678",
                "fotografia": "http://localhost:3000/uploads/cars/car-1760658931091-812807273.jpeg",
                "fechaDeAlta": "2025-10-16T23:55:31.141Z",
                "fechaDeModificacion": "2025-10-16T23:55:31.141Z",
                "fechaDeEliminacion": null
            },
            {
                "id": "68f1808512979067fdf9f861",
                "marca": "zzz",
                "modelo": "ss",
                "año": 2023,
                "precio": 234,
                "kilometraje": 100,
                "color": null,
                "email": "upconectionupconection@gmail.com",
                "telefono": "9622345678",
                "fotografia": "http://localhost:3000/uploads/cars/car-1760657541089-387679135.jpeg",
                "fechaDeAlta": "2025-10-16T23:32:21.108Z",
                "fechaDeModificacion": "2025-10-16T23:32:21.108Z",
                "fechaDeEliminacion": null
            }
        ],
        "page": 1,
        "limit": 10,
        "total": 9,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    }
}
```

**Response 400:**
```json
{
  "status": 400,
  "name": "Bad Request",
  "message": "Invalid query parameters",
  "customMessage": "Parámetros de consulta inválidos"
}
```

**Response 401:**
```json
{
  "status": 401,
  "name": "Unauthorized",
  "message": "Token not provided",
  "customMessage": "Token no proporcionado"
}
```

---

#### GET /api/autos/:id
Obtiene los detalles de un auto específico por su ID.

**Autenticación:** Requerida (Bearer Token)

**Path Parameters:**
- `id` (string): ID del auto en formato ObjectId de MongoDB

**Ejemplo Request:**
```
GET /api/autos/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
{
    "status": 200,
    "message": "Carro encontrado exitosamente.",
    "data": {
        "id": "68f257d988886068bcd7d6ad",
        "marca": "zzz",
        "modelo": "ss",
        "año": 2023,
        "precio": 234,
        "kilometraje": 100,
        "color": null,
        "email": "upconectionupconection@gmail.com",
        "telefono": "9622345678",
        "fotografia": "http://localhost:3000/uploads/cars/car-1760712664951-124583902.jpeg",
        "fechaDeAlta": "2025-10-17T14:51:05.032Z",
        "fechaDeModificacion": "2025-10-17T14:51:05.032Z",
        "fechaDeEliminacion": null
    }
}
```

**Response 400:**
```json
{
  "status": 400,
  "name": "Bad Request",
  "message": "Invalid ID",
  "customMessage": "ID inválido"
}
```

**Response 404:**
```json
{
  "status": 404,
  "name": "Not Found",
  "message": "Car not found",
  "customMessage": "Auto no encontrado"
}
```

---

#### POST /api/autos
Crea un nuevo auto en el inventario.

**Autenticación:** Requerida (Bearer Token)

**Content-Type:** multipart/form-data

**Form Data:**
- `marca` (string, requerido): Marca del auto
- `modelo` (string, requerido): Modelo del auto
- `anio` (number, requerido): Año del auto (mínimo 1900)
- `precio` (number, requerido): Precio del auto (mínimo 0)
- `kilometraje` (number, requerido): Kilometraje del auto (mínimo 100)
- `email` (string, requerido): Email de contacto (formato válido)
- `telefono` (string, requerido): Teléfono (formato: 9611879041 o 961-187-9041)
- `color` (string, opcional): Color del auto
- `fotografia` (file, opcional): Imagen del auto

**Ejemplo Request (curl):**
```bash
curl -X POST http://localhost:3000/api/autos \
  -H "Authorization: Bearer TOKEN" \
  -F "marca=Toyota" \
  -F "modelo=Corolla" \
  -F "anio=2023" \
  -F "precio=25000" \
  -F "kilometraje=15000" \
  -F "email=vendedor@test.com" \
  -F "telefono=9611879041" \
  -F "color=Rojo" \
  -F "fotografia=@/ruta/imagen.jpg"
```

**Response 201:**
```json
{
    "status": 201,
    "message": "Carro creado exitosamente.",
    "data": {
        "id": "68f25edc11891631a6c4e600",
        "marca": "zzz",
        "modelo": "ss",
        "año": 2023,
        "precio": 234,
        "kilometraje": 100,
        "color": null,
        "email": "upconectionupconection@gmail.com",
        "telefono": "9622345678",
        "fotografia": "http://localhost:3000/uploads/cars/car-1760714459878-288126123.jpeg",
        "fechaDeAlta": "2025-10-17T15:20:59.992Z",
        "fechaDeModificacion": "2025-10-17T15:20:59.992Z",
        "fechaDeEliminacion": null
    }
}
```

**Response 400:**
```json
{
  "status": 400,
  "name": "Bad Request",
  "message": "Validation failed",
  "customMessage": "Error de validación"
}
```

---

#### PUT /api/autos/:id
Actualiza los datos de un auto existente.

**Autenticación:** Requerida (Bearer Token)

**Content-Type:** application/json

**Path Parameters:**
- `id` (string): ID del auto

**Request Body:**
```json
{
  "marca": "Toyota",
  "modelo": "Camry",
  "anio": 2024,
  "precio": 30000,
  "kilometraje": 5000,
  "color": "Negro",
  "email": "nuevo@example.com",
  "telefono": "9612345678"
}
```

**Nota:** Todos los campos son opcionales. Solo se actualizarán los campos enviados.

**Response 200:**
```json
{
    "status": 200,
    "message": "Carro actualizado exitosamente.",
    "data": {
        "id": "68f25edc11891631a6c4e600",
        "marca": "hola",
        "modelo": "ss",
        "año": 2023,
        "precio": 234,
        "kilometraje": 100,
        "color": null,
        "email": "upconectionupconection@gmail.com",
        "telefono": "9622345678",
        "fotografia": "http://localhost:3000/uploads/cars/car-1760714459878-288126123.jpeg",
        "fechaDeAlta": "2025-10-17T15:20:59.992Z",
        "fechaDeModificacion": "2025-10-17T15:20:59.992Z",
        "fechaDeEliminacion": null
    }
}
```

**Response 404:**
```json
{
  "status": 404,
  "name": "Not Found",
  "message": "Car not found",
  "customMessage": "Auto no encontrado"
}
```

---

#### DELETE /api/autos/:id
Elimina un auto del inventario (soft delete).

**Autenticación:** Requerida (Bearer Token)

**Path Parameters:**
- `id` (string): ID del auto

**Ejemplo Request:**
```
DELETE /api/autos/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
{
  "status": 200,
  "message": "Car deleted successfully",
  "data": null
}
```

**Response 404:**
```json
{
  "status": 404,
  "name": "Not Found",
  "message": "Car not found",
  "customMessage": "Auto no encontrado"
}
```

---

#### POST /api/autos/:id/fotografia
Actualiza la fotografía de un auto existente.

**Autenticación:** Requerida (Bearer Token)

**Content-Type:** multipart/form-data

**Path Parameters:**
- `id` (string): ID del auto

**Form Data:**
- `fotografia` (file, requerido): Nueva imagen del auto

**Ejemplo Request (curl):**
```bash
curl -X POST http://localhost:3000/api/autos/507f1f77bcf86cd799439011/fotografia \
  -H "Authorization: Bearer TOKEN" \
  -F "fotografia=@/ruta/nueva-imagen.jpg"
```

**Response 200:**
```json
{
    "status": 200,
    "message": "Foto del carro subida y actualizada exitosamente.",
    "data": {
        "id": "68f20784931f237500bdf81a",
        "marca": "zzz",
        "modelo": "ss",
        "año": 2023,
        "precio": 234,
        "kilometraje": 100,
        "color": null,
        "email": "upconectionupconection@gmail.com",
        "telefono": "9622345678",
        "foto": "http://localhost:3000/uploads/cars/car-1760703498336-791844934.jpeg"
    }
}
```

**Response 404:**
```json
{
  "status": 404,
  "name": "Not Found",
  "message": "Car not found",
  "customMessage": "Auto no encontrado"
}
```

---

### Catálogos

#### GET /api/marcas
Obtiene la lista completa de marcas de autos disponibles.

**Autenticación:** Requerida (Bearer Token)

**Ejemplo Request:**
```
GET /api/marcas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
{
  "status": 200,
  "message": "Marcas retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "nombre": "Toyota"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "nombre": "Honda"
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "nombre": "Ford"
    }
  ]
}
```

---

#### GET /api/modelos
Obtiene la lista completa de modelos de autos disponibles.

**Autenticación:** Requerida (Bearer Token)

**Ejemplo Request:**
```
GET /api/modelos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
{
  "status": 200,
  "message": "Modelos retrieved successfully",
  "data": [
    {
      "id": "607f1f77bcf86cd799439021",
      "nombre": "Corolla",
      "marcaId": "507f1f77bcf86cd799439011"
    },
    {
      "id": "607f1f77bcf86cd799439022",
      "nombre": "Camry",
      "marcaId": "507f1f77bcf86cd799439011"
    },
    {
      "id": "607f1f77bcf86cd799439023",
      "nombre": "Civic",
      "marcaId": "507f1f77bcf86cd799439012"
    }
  ]
}
```

---

#### GET /api/modelos/marca/:marcaId
Obtiene todos los modelos asociados a una marca específica.

**Autenticación:** Requerida (Bearer Token)

**Path Parameters:**
- `marcaId` (string): ID de la marca en formato ObjectId

**Ejemplo Request:**
```
GET /api/modelos/marca/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
{
  "status": 200,
  "message": "Modelos retrieved successfully",
  "data": [
    {
      "id": "607f1f77bcf86cd799439021",
      "nombre": "Corolla",
      "marcaId": "507f1f77bcf86cd799439011"
    },
    {
      "id": "607f1f77bcf86cd799439022",
      "nombre": "Camry",
      "marcaId": "507f1f77bcf86cd799439011"
    }
  ]
}
```

**Response 400:**
```json
{
  "status": 400,
  "name": "Bad Request",
  "message": "Invalid marca ID",
  "customMessage": "ID de marca inválido"
}
```

---

#### GET /api/years
Obtiene el rango de años disponibles para autos (1990-2025).

**Autenticación:** Requerida (Bearer Token)

**Ejemplo Request:**
```
GET /api/years
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
{
  "status": 200,
  "message": "Years retrieved successfully",
  "data": {
    "minYear": 1990,
    "maxYear": 2025,
    "years": [2025, 2024, 2023, 2022, 2021, ...]
  }
}
```

---

### Resumen de Autenticación

**Endpoints Públicos (sin autenticación):**
- POST /api/usuarios/login
- POST /api/usuarios
- GET /api/health

**Endpoints Protegidos (requieren Bearer Token):**
- GET /api/autos
- GET /api/autos/:id
- POST /api/autos
- PUT /api/autos/:id
- DELETE /api/autos/:id
- POST /api/autos/:id/fotografia
- GET /api/marcas
- GET /api/modelos
- GET /api/modelos/marca/:marcaId
- GET /api/years

**Formato del Header de Autenticación:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Documentación Swagger

El proyecto implementa **Swagger UI** para documentación interactiva completa de la API.

### Acceso a Swagger

Una vez que el servidor está corriendo, la documentación está disponible en:

```
http://localhost:3001/api-docs
```

### Características de Swagger

**Exploración Interactiva:**
- Visualización de todos los endpoints disponibles
- Schemas detallados de request y response
- Ejemplos de uso para cada endpoint
- Códigos de respuesta HTTP documentados

**Testing en Vivo:**
- Ejecutar peticiones directamente desde el navegador
- Probar diferentes parámetros y body
- Ver respuestas en tiempo real

**Autenticación JWT:**
- Botón "Authorize" en la parte superior
- Ingresar token JWT obtenido del login
- Token se incluye automáticamente en todas las peticiones

**Uso:**
1. Abrir `http://localhost:3001/api-docs`
2. Hacer login en `/api/users/login` para obtener token
3. Copiar el token de la respuesta
4. Hacer clic en "Authorize" en Swagger UI
5. Pegar el token en el campo (sin "Bearer")
6. Probar cualquier endpoint protegido

---

## Logging

El sistema implementa logging estructurado con Winston:

### Niveles de Log
- error: Errores de aplicación
- warn: Advertencias
- info: Información general
- http: Logs de peticiones HTTP
- debug: Información de depuración

### Archivos de Log
- `logs/error-%DATE%.log`: Solo errores
- `logs/combined-%DATE%.log`: Todos los logs
- Rotación automática diaria
- Retención de 14 días

---

## Características de Seguridad

- Autenticación basada en JWT
- Passwords hasheados con bcrypt
- Validación exhaustiva de entrada de datos
- Rate limiting en endpoints públicos
- CORS configurado
- Soft delete para preservar datos
- Validación de tipos de archivo en uploads
- Manejo seguro de errores sin exponer información sensible

---

## Docker

### Arquitectura Multi-Stage

El Dockerfile utiliza una construcción en múltiples etapas para optimizar el tamaño de la imagen:

1. Base: Definición de directorio y usuario
2. Dependencies: Instalación de dependencias de producción
3. Build: Compilación de TypeScript
4. Production: Imagen final optimizada

### Servicios Docker Compose

**mongodb**
- Imagen: mongo:7
- Puerto: 27017
- Volúmenes persistentes para datos
- Health check con mongosh

**api**
- Build desde Dockerfile local
- Puerto: 3001
- Depende de MongoDB
- Ejecuta seed automáticamente al iniciar
- Health check en endpoint /api/health
- Volúmenes para logs y archivos subidos

### Comandos Docker

```bash
# Construir sin cache
docker-compose build --no-cache

# Ver logs de un servicio específico
docker-compose logs -f mongodb

# Ejecutar comando en contenedor
docker exec -it inventory_api sh

# Limpiar todo (contenedores, redes, volúmenes)
docker-compose down -v

# Ver recursos utilizados
docker stats inventory_api inventory_mongodb
```

---

## Manejo de Errores

El sistema implementa un manejo centralizado de errores con clases personalizadas:

**HttpError**: Clase base para errores HTTP  
**BadRequestError**: 400 - Peticiones inválidas  
**UnauthorizedError**: 401 - No autenticado  
**NotFoundError**: 404 - Recurso no encontrado

Todos los errores devuelven respuestas consistentes en formato JSON:

```json
{
  "error": "Error message",
  "statusCode": 400,
  "timestamp": "2025-10-18T02:30:00.000Z",
  "path": "/api/cars"
}
```

---

## Validación de Datos

Utiliza Zod para validación declarativa y type-safe:

- Validación en controllers antes de ejecutar casos de uso
- Schemas reutilizables y componibles
- Mensajes de error descriptivos
- Validación de tipos, formatos y reglas de negocio
- Transformación automática de datos

---

## Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Modo desarrollo con hot reload
npm run build        # Compilar TypeScript
npm start            # Ejecutar versión compilada
npm test             # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Coverage de tests
npm run seed         # Ejecutar seed de datos
```

### Configuración de TypeScript

- Target: ES2022
- Module: CommonJS
- Strict mode habilitado
- Decoradores experimentales habilitados
- Path aliases configurados
- Source maps generados

### Compilación

El proceso de build utiliza `tsc-alias` para resolver los path aliases de TypeScript en el código JavaScript compilado, permitiendo imports limpios sin rutas relativas complejas.

