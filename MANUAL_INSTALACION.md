# Manual de instalación de DishCover

Autor: Manuel García Nieto

## 1. Requisitos previos

- Docker Desktop instalado y arrancado.
- Java JDK 17 o superior.
- IntelliJ IDEA para ejecutar el backend Spring Boot.
- Node.js y npm instalados.
- Visual Studio Code para trabajar con el frontend.
- Android Studio con emulador Android, o Expo Go para probar la app.

## 2. Estructura del proyecto

El proyecto se divide en:

- `backend`: API REST desarrollada con Spring Boot.
- `frontend`: aplicación móvil desarrollada con React Native, Expo y NativeWind.
- `docker-compose.yml`: servicios Docker para MySQL, Adminer y backend dockerizado.

Para esta entrega se recomienda usar Docker solo para MySQL y Adminer, y arrancar Spring Boot desde IntelliJ o Maven.

## 3. Arrancar MySQL y Adminer con Docker

Desde la raíz del proyecto `DishCover`:

```bash
cp .env.example .env
docker compose up -d mysql adminer
docker compose ps
```

Adminer estará disponible en:

```text
http://localhost:8083
```

Credenciales de Adminer:

- Sistema: `MySQL`
- Servidor: `mysql`
- Usuario: `dishcover`
- Contraseña: `dishcover`
- Base de datos: `dishcover`

Si el puerto `8083` está ocupado, editar `.env` y cambiar:

```text
DISHCOVER_ADMINER_PORT=18083
```

Después relanzar:

```bash
docker compose up -d mysql adminer
```

## 4. Arrancar el backend Spring Boot

Opción recomendada con IntelliJ:

1. Abrir la carpeta `DishCover/backend` en IntelliJ.
2. Esperar a que Maven descargue las dependencias.
3. Abrir `BackendApplication.java`.
4. Pulsar el botón de Play sobre `BackendApplication`.

Opción por terminal:

```bash
cd backend
./mvnw spring-boot:run
```

El backend queda disponible en:

```text
http://localhost:8080
```

Comprobación rápida:

```bash
curl http://localhost:8080/health
```

Debe devolver una respuesta con `status: UP`.

Usuarios de prueba:

- `demo / 1234`
- `Manuel / root`

Si el puerto `8080` está ocupado, se puede cambiar temporalmente en IntelliJ o arrancar con:

```bash
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

En ese caso habría que adaptar la URL usada por el frontend.

## 5. Arrancar el frontend Expo

Abrir `DishCover/frontend` en Visual Studio Code.

Instalar dependencias:

```bash
npm install
```

Arrancar Expo:

```bash
npm start
```

Después seleccionar:

- `a` para Android.
- `i` para iOS en Mac.
- `w` para navegador web.

La app usa por defecto:

- Android emulator: `http://10.0.2.2:8080`
- iOS simulator y web: `http://localhost:8080`

Si se usa un móvil físico, configurar la IP local del ordenador:

```bash
EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:8080 npm start
```

## 6. Pruebas

Backend:

```bash
cd backend
./mvnw test
```

Frontend:

```bash
cd frontend
npm run lint
npx tsc --noEmit
npm test -- --runInBand
```

## 7. Generar APK Android

Para generar una APK con Expo se recomienda usar EAS Build. El proyecto ya incluye `frontend/eas.json` con el perfil `preview`, que genera APK.

Desde `DishCover/frontend`:

```bash
npx eas-cli@latest login
npx eas-cli@latest build -p android --profile preview
```

Al terminar, Expo/EAS mostrará una URL para descargar la APK.

Si se quiere intentar una build local en el ordenador:

```bash
npx eas-cli@latest build -p android --profile preview --local
```

La build local requiere tener bien configurado Android SDK, Java y herramientas de compilación Android. Para la entrega académica, la opción cloud de EAS suele ser más sencilla.

## 8. Parar el entorno

Parar Spring Boot desde IntelliJ con el botón Stop, o con `Ctrl+C` si se arrancó por terminal.

Parar MySQL y Adminer:

```bash
docker compose stop mysql adminer
```

Si se quiere eliminar los contenedores pero conservar el volumen de MySQL:

```bash
docker compose down
```

No ejecutar `docker compose down -v` salvo que se quiera borrar también la base de datos.
