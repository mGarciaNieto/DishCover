# DishCover

DishCover es una aplicación académica de recetas, favoritos y eventos culinarios desarrollada por Manuel García Nieto.

## Desarrollo local

Levantar todo el stack de backend con Docker:

```bash
docker compose up -d --build
```

Servicios disponibles por defecto:

- Backend Spring Boot: `http://localhost:8080`
- Healthcheck del backend: `http://localhost:8080/health`
- Adminer: `http://localhost:8083`

Comprobar el estado de los contenedores:

```bash
docker compose ps
```

Credenciales de Adminer:

- Servidor: `mysql`
- Base de datos: `dishcover`
- Usuario: `dishcover`
- Contraseña: `dishcover`

Docker crea una red interna para los servicios. Por eso el backend no se conecta a MySQL usando `localhost`, sino usando el nombre del servicio `mysql` en el puerto interno `3306`.

## Puertos configurables

Si el puerto `8080` o `8083` ya está ocupado en el ordenador, copia el fichero de ejemplo:

```bash
cp .env.example .env
```

Después cambia los puertos necesarios:

```properties
DISHCOVER_BACKEND_PORT=18080
DISHCOVER_ADMINER_PORT=18083
```

Y vuelve a levantar el stack:

```bash
docker compose up -d --build
```

En ese caso el backend quedaría en `http://localhost:18080` y Adminer en `http://localhost:18083`.

## Frontend Expo

El frontend React Native con Expo se mantiene fuera de Docker para facilitar el uso con navegador, emulador y dispositivo móvil.

La configuración SSL con `.p12` queda fuera de esta primera entrega.
