# API de Catálogos - Sistema de Inventario

## Endpoints de Catálogos

### 1. Obtener Todas las Marcas

```http
GET /api/marcas
```

**Respuesta exitosa (200):**
```json
{
  "status": 200,
  "message": "Brands retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "nombre": "Toyota",
      "fechaDeAlta": "2025-10-17T00:00:00.000Z",
      "fechaDeModificacion": "2025-10-17T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "nombre": "Honda",
      "fechaDeAlta": "2025-10-17T00:00:00.000Z",
      "fechaDeModificacion": "2025-10-17T00:00:00.000Z"
    }
  ]
}
```

---

### 2. Obtener Todos los Modelos

```http
GET /api/modelos
```

**Respuesta exitosa (200):**
```json
{
  "status": 200,
  "message": "Models retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439021",
      "nombre": "Corolla",
      "marcaId": "507f1f77bcf86cd799439011",
      "fechaDeAlta": "2025-10-17T00:00:00.000Z",
      "fechaDeModificacion": "2025-10-17T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Obtener Modelos por Marca

```http
GET /api/modelos/marca/:marcaId
```

**Parámetros:**
- `marcaId` (string, required): ID de la marca

**Ejemplo:**
```http
GET /api/modelos/marca/507f1f77bcf86cd799439011
```

**Respuesta exitosa (200):**
```json
{
  "status": 200,
  "message": "Models retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439021",
      "nombre": "Corolla",
      "marcaId": "507f1f77bcf86cd799439011",
      "fechaDeAlta": "2025-10-17T00:00:00.000Z",
      "fechaDeModificacion": "2025-10-17T00:00:00.000Z"
    },
    {
      "id": "507f1f77bcf86cd799439022",
      "nombre": "Camry",
      "marcaId": "507f1f77bcf86cd799439011",
      "fechaDeAlta": "2025-10-17T00:00:00.000Z",
      "fechaDeModificacion": "2025-10-17T00:00:00.000Z"
    }
  ]
}
```

**Respuesta de error (400):**
```json
{
  "status": 400,
  "name": "Bad Request",
  "message": "The marcaId '123' is not a valid ObjectId",
  "customMessage": "El marcaId '123' no es un ObjectId válido"
}
```

---

### 4. Obtener Años Disponibles

```http
GET /api/years
```

**Respuesta exitosa (200):**
```json
{
  "status": 200,
  "message": "Available years retrieved successfully",
  "data": {
    "minYear": 1990,
    "maxYear": 2025,
    "years": [2025, 2024, 2023, 2022, 2021, ...]
  }
}
```

---

## Flujo de Uso Recomendado

### Formulario de Creación/Filtrado de Autos

1. **Cargar Marcas** (al iniciar el formulario)
   ```
   GET /api/marcas
   ```

2. **Usuario selecciona una Marca**
   - Guardar el `id` de la marca seleccionada

3. **Cargar Modelos basados en la Marca**
   ```
   GET /api/modelos/marca/{marcaId}
   ```

4. **Usuario selecciona un Modelo**
   - Guardar el nombre del modelo seleccionado

5. **Cargar Años disponibles**
   ```
   GET /api/years
   ```

6. **Usuario selecciona un Año**
   - Usar el año seleccionado en el formulario

---

## Ejemplos con cURL

### Obtener todas las marcas
```bash
curl -X GET http://localhost:3000/api/marcas
```

### Obtener modelos por marca
```bash
curl -X GET http://localhost:3000/api/modelos/marca/507f1f77bcf86cd799439011
```

### Obtener todos los modelos
```bash
curl -X GET http://localhost:3000/api/modelos
```

### Obtener años disponibles
```bash
curl -X GET http://localhost:3000/api/years
```

---

## Ejemplo de Integración Frontend

```javascript
const marcaSelect = document.getElementById('marca');
const modeloSelect = document.getElementById('modelo');
const yearSelect = document.getElementById('year');

async function loadMarcas() {
    const response = await fetch('http://localhost:3000/api/marcas');
    const result = await response.json();
    
    result.data.forEach(marca => {
        const option = document.createElement('option');
        option.value = marca.id;
        option.textContent = marca.nombre;
        marcaSelect.appendChild(option);
    });
}

async function loadModelos(marcaId) {
    modeloSelect.innerHTML = '<option value="">Seleccione modelo...</option>';
    
    const response = await fetch(`http://localhost:3000/api/modelos/marca/${marcaId}`);
    const result = await response.json();
    
    result.data.forEach(modelo => {
        const option = document.createElement('option');
        option.value = modelo.nombre;
        option.textContent = modelo.nombre;
        modeloSelect.appendChild(option);
    });
}

async function loadYears() {
    const response = await fetch('http://localhost:3000/api/years');
    const result = await response.json();
    
    result.data.years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

marcaSelect.addEventListener('change', (e) => {
    const marcaId = e.target.value;
    if (marcaId) {
        loadModelos(marcaId);
    }
});

loadMarcas();
loadYears();
```

---

## Poblar Base de Datos

Para poblar la base de datos con marcas y modelos predefinidos, ejecuta:

```bash
npm run seed
```

Este comando creará:
- 10 marcas de autos populares
- 5 modelos por cada marca (50 modelos en total)

---

## Arquitectura Implementada

### Capa de Dominio (Core)
- **Entities**: `Marca`, `Modelo`
- **Ports**: `IMarcaRepository`, `IModeloRepository`
- **Use Cases**:
  - `GetAllMarcasUseCase`
  - `GetAllModelosUseCase`
  - `GetModelosByMarcaUseCase`
  - `GetAvailableYearsUseCase`
- **DTOs**: `YearRangeDto`

### Capa de Infraestructura
- **Repositories**: 
  - `MarcaRepository`
  - `ModeloRepository`

### Capa de Aplicación (API)
- **Controllers**: 
  - `MarcaController`
  - `ModeloController`
  - `YearController`
- **Routes**: 
  - `/api/marcas`
  - `/api/modelos`
  - `/api/years`

---

## Notas

- Todos los endpoints de catálogos son **públicos** (no requieren autenticación)
- Los años disponibles van desde 1990 hasta el año actual
- Los modelos están relacionados con las marcas mediante `marcaId`
- Los datos se ordenan alfabéticamente por nombre
