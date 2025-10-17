# Inventory API - Sistema de Gestión de Autos

API REST  completa para la gestión de inventario de autos con autenticación JWT, construida con Node.js, TypeScript, Express y MongoDB siguiendo la arquitectura hexagonal.

##  Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)

- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Documentación de API](#documentación-de-api)
- [Arquitectura](#arquitectura)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## Características

-  **CRUD Completo** de autos con soft delete
-  **Autenticación JWT** con tokens seguros
- **Upload de Imágenes** con Multer
-  **Paginación y Filtros** avanzados
-  **Catálogos** de marcas, modelos y años
-  **Validación de Datos** con Zod
-  **Arquitectura Hexagonal** (Puertos y Adaptadores)
-  **TypeScript** con tipado estricto
-  **MongoDB** con TypeORM
-  **Documentación Swagger** interactiva
-  **Manejo de Errores** consistente y bilingüe (EN/ES)
-  **CORS** habilitado

---

##  Tecnologías

### Backend
- **Node.js** v18+
- **TypeScript** v5.9
- **Express** v5.1
- **TypeORM** v0.3
- **MongoDB** v6.20

### Autenticación y Seguridad
- **jsonwebtoken** - JWT tokens
- **bcryptjs** - Hash de contraseñas

### Validación
- **Zod** v4.1 - Validación de schemas

### Documentación
- **Swagger UI Express** - Documentación interactiva
- **Swagger JSDoc** - Generación de docs

### Utilidades
- **Multer** - Upload de archivos
- **dotenv** - Variables de entorno
- **cors** - Cross-Origin Resource Sharing

---


##  Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd inventory_api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env`:
```env
PORT=3000
MONGO_URI=mongodb://admin:admin123@localhost:27017/inventory_db?authSource=admin
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
SALTS_ROUNDS=10
```

4. **Poblar base de datos** (opcional)
```bash
npm run seed
```

Esto creará:
- 10 marcas de autos
- 50 modelos (5 por marca)

5. **Iniciar el servidor**
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

---

## Documentación de API

###  Swagger UI (Recomendado)

Accede a la documentación interactiva en:

```
http://localhost:3000/api-docs
```

**Características de Swagger:**
-  Prueba todos los endpoints desde el navegador
-  Configura autenticación JWT fácilmente
-  Ve ejemplos de peticiones y respuestas
-  Exporta especificación OpenAPI



###  Documentación por Módulo

- [**Autenticación**](./AUTH_README.md) - Login, registro y JWT
- [**Catálogos**](./CATALOG_API.md) - Marcas, modelos y años

---

##  Arquitectura

Este proyecto sigue la **Arquitectura Hexagonal** (Puertos y Adaptadores):

```
src/
├── core/                      # DOMAIN LAYER
│   ├── entities/             # Entidades de negocio
│   ├── ports/                # Interfaces (contratos)
│   ├── uses-cases/           # Lógica de negocio
│   └── shared/
│       ├── dtos/             # Data Transfer Objects
│       └── errors/           # Errores de dominio
│
├── infrastructure/           # INFRASTRUCTURE LAYER
│   ├── database/
│   │   ├── repositories/    # Implementaciones de puertos
│   │   └── data-source.ts   # Configuración TypeORM
│   ├── services/            # Servicios externos
│   └── web/
│       └── express/         # Configuración Express/Swagger
│
└── api/                      # APPLICATION LAYER
    ├── controllers/          # Controladores HTTP
    ├── routes/              # Definición de rutas
    ├── middlewares/         # Middlewares
    └── dtos/                # Validaciones y schemas
```

### Capas

#### 1. **Domain Layer (Core)**
- Contiene la lógica de negocio pura
- Independiente de frameworks y tecnologías
- Define contratos (ports) e implementa casos de uso

#### 2. **Infrastructure Layer**
- Implementa los puertos definidos en el dominio
- Maneja conexiones a base de datos
- Servicios externos (archivos, email, etc.)

#### 3. **Application Layer (API)**
- Expone los casos de uso como endpoints HTTP
- Maneja peticiones y respuestas
- Validaciones de entrada

---

## API Endpoints

### Health Check

#### GET /api/health
Verifica el estado del servidor.

**Autenticación:** No requerida

**Response 200:**
```json
{
  "status": "UP"
}
```

---

### Autenticación

#### POST /api/usuarios/login
Inicia sesión y retorna un token JWT.

**Autenticación:** No requerida

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Validaciones:**
- `email`: debe ser un email válido
- `password`: mínimo 6 caracteres

**Response 200:**
```json
{
    "status": 200,
    "message": "Login exitoso.",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZjIzZjRkNzhkZmNiNGVkYWY5NmZmMSIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTc2MDcxNDMxMSwiZXhwIjoxNzYwODAwNzExfQ.Rvy3hzd6U8vnwlYF-d1wVezEFVybKxMGIVVzBQVN1HU",
        "user": {
            "id": "68f23f4d78dfcb4edaf96ff1",
            "email": "test@test.com"
        }
    }
}
```

**Response 401:**
```json
{
  "status": 401,
  "name": "Unauthorized",
  "message": "Invalid credentials",
  "customMessage": "Credenciales inválidas"
}
```

---

#### POST /api/usuarios
Registra un nuevo usuario en el sistema.

**Autenticación:** No requerida

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepass123"
}
```

**Validaciones:**
- `email`: debe ser único y válido
- `password`: mínimo 6 caracteres

**Response 201:**
```json
{
    "status": 201,
    "message": "User created successfully.",
    "data": {
        "id": "68f23f4d78dfcb4edaf96ff1",
        "email": "test@test.com",
        "password": "",
        "createdAt": "2025-10-17T13:06:21.197Z",
        "updatedAt": "2025-10-17T13:06:21.197Z"
    }
}
```

**Response 400:**
```json
{
  "status": 400,
  "name": "Bad Request",
  "message": "Email already exists",
  "customMessage": "El email ya existe"
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

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor en modo desarrollo con hot-reload

# Seed
npm run seed             # Puebla la base de datos con datos iniciales

# Testing (no implementado aún)
npm test                 # Ejecuta tests
```

---

##  Uso de Autenticación

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

### 2. Iniciar Sesión
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'
```

Respuesta:
```json
{
  "status": 200,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com"
    }
  }
}
```

### 3. Usar Token en Peticiones Protegidas
```bash
curl -X POST http://localhost:3000/api/autos \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: multipart/form-data" \
  -F "marca=Toyota" \
  -F "modelo=Corolla" \
  -F "año=2023" \
  -F "precio=25000" \
  -F "kilometraje=15000" \
  -F "email=vendedor@test.com" \
  -F "telefono=9611879041" \
  -F "fotografia=@/ruta/a/imagen.jpg"
```

---









