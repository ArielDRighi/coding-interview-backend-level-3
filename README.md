# Bienvenido al coding-interview-backend-level-3 - Parte I

## Descripción

Eres el Senior Developer de tu equipo en El Dorado, y te han dado la responsabilidad de desarrollar un nuevo feature que nos pide el equipo de producto:

> API REST que permita realizar operaciones CRUD sobre una entidad de tipo `Item`.
>
> La entidad tiene 3 campos: `id`, `name` y `price`.

# Requisitos:

- Si el servicio se reinicia, los datos no se pueden perder.
- Tienes que implementar tu codigo como si estuvieses haciendo un servicio para El Dorado listo para produccion.
- Completar la implementación de toda la funcionalidad de forma tal de que los tests e2e pasen exitosamente.

### Que puedes hacer:

- ✅ Modificar el código fuente y agregar nuevas clases, métodos, campos, etc.
- ✅ Cambiar dependencias, agregar nuevas, etc.
- ✅ Modificar la estructura del proyecto (/src/\*\* es todo tuyo)
- ✅ Elegir una base de datos
- ✅ Elegir un framework web
- ✅ Crear tests
- ✅ Cambiar la definición del .devContainer

### Que **no** puedes hacer:

- ❌ No puedes modificar el archivo original /e2e/index.test.ts (pero puedes crear otros test si lo deseas)
- ❌ El proyecto debe usar Typescript
- ❌ Estresarte 🤗

## Pasos para comenzar

1. Haz un fork usando este repositorio como template
2. Clona el repositorio en tu máquina
3. Realiza los cambios necesarios para que los tests pasen
4. Sube tus cambios a tu repositorio
5. Avísanos que has terminado
6. ???
7. PROFIT

### Cualquier duda contactarme a https://www.linkedin.com/in/andreujuan/

## Solución Implementada

# API REST de Items - Challenge Backend El Dorado

## Descripción

API REST que permite realizar operaciones CRUD sobre una entidad de tipo Item, con persistencia de datos y validaciones.

## Características

- ✅ API REST completa con operaciones CRUD
- ✅ Persistencia de datos usando SQLite
- ✅ Validaciones para campos requeridos
- ✅ Validaciones para precios negativos
- ✅ Documentación con Swagger
- ✅ Tests E2E

## Tecnologías Utilizadas

- **Node.js y TypeScript**: Base del proyecto, asegurando tipado estático y mejor mantenibilidad.
- **Hapi**: Framework web elegido por su robustez, fácil configuración y excelente integración con validación y documentación.
- **Prisma**: ORM moderno que brinda una interfaz tipada para interactuar con la base de datos, simplificando las operaciones CRUD.
- **SQLite**: Base de datos ligera y autocontenida que permite persistencia sin la necesidad de servidores externos.
- **Joi**: Biblioteca de validación potente y expresiva para validar datos de entrada.
- **Jest**: Framework de testing para asegurar que toda la funcionalidad opere correctamente.
- **Swagger (hapi-swagger)**: Para documentación interactiva de la API.

## Requisitos

- Node.js (versión 16 o superior)
- npm o yarn

## Instrucciones para Ejecutar

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ArielDRighi/coding-interview-backend-level-3.git

# Instalar dependencias
npm install
```

### Configuración

El proyecto usa SQLite como base de datos, que se configura automáticamente. El archivo `.env` ya contiene la configuración necesaria:

```
DATABASE_URL="file:./dev.db"
```

### Migraciones

Antes de iniciar el servidor, debes aplicar las migraciones para crear la estructura de la base de datos:

```bash
npm run db:migrate
```

### Ejecución

#### Modo Desarrollo

```bash
npm run dev
```

El servidor estará disponible en http://localhost:3000

#### Modo Producción

```bash
npm run build
npm start
```

### Pruebas

```bash
npm test
```

### Explorar la Base de Datos

```bash
npm run db:studio
```

Abre Prisma Studio en http://localhost:5555 para ver y manipular los datos directamente.

## Documentación de la API

Accede a la documentación interactiva (Swagger) en http://localhost:3000/docs cuando el servidor esté en ejecución.

## Estructura del Proyecto

```
/
├── e2e/                   # Tests end-to-end
├── prisma/                # Configuración de Prisma y migraciones
│   ├── migrations/        # Migraciones de base de datos
│   └── schema.prisma      # Esquema de Prisma
├── src/                   # Código fuente
│   ├── database/          # Configuración de la base de datos
│   │   └── client.ts      # Cliente Prisma
│   ├── services/          # Lógica de negocio
│   │   └── itemService.ts # Servicio para operaciones con items
│   ├── validation/        # Validaciones
│   │   └── itemValidation.ts # Validación de items
│   ├── routes.ts          # Definición de rutas
│   ├── server.ts          # Configuración del servidor
│   └── index.ts           # Punto de entrada
├── .env                   # Variables de entorno
└── package.json           # Dependencias y scripts
```

## Decisiones Técnicas

### Por qué Hapi

Elegí Hapi como framework web por:

1. **Enfoque empresarial**: Diseñado para construir APIs robustas y aplicaciones de servidor.
2. **Configuración declarativa**: Permite definir rutas, validaciones y respuestas de manera clara y estructurada.
3. **Integración con Swagger**: Facilita la documentación automática de la API.
4. **Validación integrada**: Excelente soporte para validación de datos con Joi.

### Por qué SQLite + Prisma

Esta combinación fue elegida por:

1. **Simplicidad**: SQLite no requiere instalación de servidores adicionales.
2. **Persistencia**: Cumple con el requisito de que los datos no se pierdan al reiniciar.
3. **Desarrollo rápido**: Ideal para proyectos que necesitan ser configurados rápidamente.
4. **Prisma**: Proporciona una capa de abstracción con type-safety que evita errores comunes.
5. **Migraciones**: Facilita la evolución del esquema de datos.

### Enfoque de Validación

La validación se implementa en dos niveles:

1. **Nivel de Ruta**: Usando las capacidades de validación de Hapi con Joi para validar parámetros y payload.
2. **Nivel de Servicio**: Validación adicional en `itemValidation.ts` para reglas de negocio específicas.

Las validaciones incluyen:

- Campos requeridos para `name` y `price`
- Precios no negativos
- Mensajes de error personalizados y detallados

### Arquitectura sin Controladores Explícitos

En este proyecto, he adoptado deliberadamente una arquitectura que no utiliza controladores explícitos como capa separada, sino que integra esta funcionalidad directamente en los handlers de las rutas:

1. **Enfoque orientado a Hapi**: Este diseño se alinea con las prácticas recomendadas por Hapi, donde los handlers de rutas actúan como controladores.

2. **Ventajas para este proyecto**:

   - **Mayor cohesión**: Toda la lógica relacionada con un endpoint (validación, procesamiento, respuesta) se encuentra en un solo lugar.
   - **Menos indirección**: Elimina una capa adicional de abstracción, reduciendo la complejidad en una API pequeña.
   - **Mejor legibilidad**: Facilita seguir el flujo de una solicitud desde su recepción hasta la respuesta.

3. **Estructura resultante**:

   - **Rutas (routes.ts)**: Definen endpoints y contienen handlers que actúan como controladores
   - **Servicios (itemService.ts)**: Encapsulan la lógica de negocio y operaciones de base de datos
   - **Validación (itemValidation.ts)**: Proporciona validación de datos de entrada

4. **Consideraciones para proyectos más grandes**:
   Este enfoque es ideal para APIs pequeñas y medianas. Para proyectos más grandes o complejos, una capa de controladores separada podría ofrecer beneficios adicionales como mejor organización del código, más fácil testing unitario y mayor reutilización.

Esta arquitectura representa un equilibrio intencional entre simplicidad y buenas prácticas, adecuado para el alcance de este challenge y demostrando una decisión arquitectónica razonada.

### Manejo de Errores

El manejo de errores sigue estas prácticas:

1. **Errores de Validación**: Retorna 400 Bad Request con detalles específicos sobre qué campo falló y por qué.
2. **Recursos no Encontrados**: Retorna 404 Not Found cuando se intenta acceder a un item que no existe.
3. **Errores de Servidor**: Captura global de excepciones no manejadas para evitar caídas del servidor.
4. **Cierre Graceful**: Manejo adecuado del cierre del servidor y desconexión de la base de datos.

## Posibles Mejoras para un Entorno de Producción

- Implementar logging estructurado
- Añadir autenticación y autorización
- Implementar rate limiting
- Configurar CORS para producción
- Implementar caché para mejorar rendimiento
- Dockerización para despliegue consistente
- CI/CD para integración y despliegue continuos
