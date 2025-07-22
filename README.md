# Sistema de Trazabilidad Animal

Este repositorio contiene el proyecto del sistema de trazabilidad animal desarrollado en Node.js con Fastify. El sistema permite gestionar animales, predios, caravanas, transportes y eventos del ciclo de vida animal como pesajes, vacunaciones y ventas.

## 1. Propósito del sistema

Este sistema fue diseñado para ayudar a productores y entidades del rubro ganadero a registrar y consultar información clave del ciclo de vida de los animales, mejorando la trazabilidad y gestión operativa. Cada animal está vinculado a eventos, caravanas y predios, permitiendo una visión integral del historial de movimientos y controles.

## 2. Stack tecnológico (backend)

- **Node.js + Fastify** como framework web
- **TypeBox** para definir y validar esquemas
- **JWT** para autenticación basada en tokens
- **Swagger** para documentación automática
- **PostgreSQL** como base de datos relacional
- **Docker + Docker Compose** para facilitar la ejecución del entorno
- **pnpm/npm** como gestor de paquetes

## 3. Rutas del Backend y Endpoints

El backend expone una API REST organizada por entidad, con rutas agrupadas en subcarpetas de `/src/routes`. La documentación completa de cada endpoint, incluyendo parámetros, respuestas y descripciones, puede consultarse directamente en Swagger:

**→ http://localhost:3000/docs**

A continuación se presenta una vista general del árbol de endpoints:

```
/
├──/auth
   └── /login → POST - Login de usuario
├──/animals
   └── / → GET, POST
      ├── /:animal_id → GET, PUT, DELETE
      ├── /:animal_id/modifications → GET
      └── /:animal_id/events → GET
         ├── /sale/:animal_id → GET, POST
         ├── /vaccine/:animal_id → GET, POST
         └── /weighing/:animal_id → GET, POST
├──/users
   └── / → GET, POST
      └── user_id/:user_id → GET, PUT, DELETE
├──/lands
   └── / → GET, POST
      ├── /land_id/:land_id → GET, PUT
      └── /land_id/:land_id/animals → GET
├──/tags
   └── / → GET
      └── /tag_id/:tag_id → GET, PUT
└──/transport
   └──/ → GET, POST
      └── /transport_id/:transport_id → GET, PUT, DELETE
```

## 4. Ejecución con Docker (recomendado)

### 🐳 Requisitos previos

- Tener instalado **Docker** y **Docker Compose**

### 🛠️ Paso a paso

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repo>
   cd backend

   ```

2. Crear un archivo .env en la raíz del backend con las siguientes variables:

   ```
   DB_HOST=db
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=trazabilidad
   FASTIFY_SECRET=supersecreto
   ```

3. Levantar el entorno completo con:

   ```
   docker-compose up --build
   ```

4. Esperar un tiempo y luego ingresar a:
   http://localhost:3000/docs

> [!IMPORTANT]
> ⚠️ La base de datos se inicializa automáticamente con estructura y datos base al ejecutar los contenedores por primera vez. Los scripts .sql están en: `src/database/scripts/`

## 5. Datos para probar la documentación

> [!WARNING]
> El texto default que aparece en la documentación de swagger no va a funcionar en el login

A continuación se muestran ejemplos de como probar el login con cada uno de los roles:

1. Administrador
   ```
      {
          email: "administrador@example.com",
          password: "admin123"
      }
   ```
2. Usuario consulta
   ```
      {
          email: "consulta@example.com",
          password: "consulta123"
      }
   ```
3. Operador
   ```
      {
          email: "operador@example.com",
          password: "operador123"
      }
   ```

Aparte, en la ruta `users/user_id` se puede utilizar el valor: `3600e259-0cc1-491d-9860-aa4cff12155c`

> [!IMPORTANT]
> Las rutas a probar para la entrega del día 21 de julio son las que se encuentran en las siguientes direcciones: `/auth/login`, `/users/user_id`
