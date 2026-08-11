# CMMS Pro

Sistema web profesional para la gestión de mantenimiento, enfocado en el control de órdenes de trabajo, administración de usuarios y asignación de tareas a técnicos especializados.

## Stack Tecnológico

- **Backend:** Java 21 y Spring Boot 3
- **Base de Datos:** PostgreSQL
- **Frontend:** React, TypeScript y Vite
- **Infraestructura:** Docker y Docker Compose
- **Seguridad:** Spring Security con JWT (Access & Refresh Tokens)

## Arquitectura

El proyecto está dividido en dos capas principales contenerizadas y orquestadas vía Docker:

1. **Backend (Spring Boot):** Provee una API RESTful segura y maneja la lógica de negocio y persistencia de datos.
2. **Frontend (React + Vite):** Interfaz de usuario moderna y reactiva que consume la API del backend.
3. **Database (PostgreSQL):** Almacenamiento persistente de datos con volúmenes en Docker.

## Requisitos Previos

- Docker y Docker Compose instalados en tu máquina.
- (Opcional) Node.js y JDK 21 si deseas correr los servicios nativamente fuera de Docker.

## Ejecución Local

### 1. Configurar Variables de Entorno

Desde la raíz del repositorio, asegúrate de tener el archivo `.env` configurado:

Crea el archivo `.env` en la raíz del proyecto:
```env
DB_USER=cmms_user
DB_PASSWORD=cmms_password_secure
DB_NAME=cmms_db
SPRING_PROFILES_ACTIVE=prod
```

Crea el archivo `.env` dentro de la carpeta `frontend/`:
```env
VITE_API_URL=http://localhost:8080/api
```

### 2. Levantar los Contenedores con Docker

Ejecuta el siguiente comando en la raíz del proyecto para construir y levantar todos los servicios:

```bash
docker compose up --build -d
```

### 3. Verificar Servicios

Comprueba que los contenedores estén corriendo correctamente:
```bash
docker compose ps
```

## URLs Locales

| Servicio | URL |
|---|---|
| Aplicación Web (Frontend) | http://localhost:3000 |
| Backend API | http://localhost:8080/api |
| Base de Datos (PostgreSQL)| `localhost:5432` |

## Autenticación y Seguridad

El sistema utiliza autenticación sin estado (Stateless) basada en **JWT (JSON Web Tokens)**.

1. Al iniciar sesión en `/api/auth/login`, el servidor devuelve un `token` (Access Token, vida corta) y un `refreshToken` (vida larga).
2. Para acceder a rutas protegidas, el cliente debe enviar el Access Token en la cabecera:
   `Authorization: Bearer <token>`
3. Si el Access Token caduca, el frontend detectará un error `401 Unauthorized` e interceptará la petición para llamar automáticamente a `/api/auth/refresh` usando el Refresh Token guardado, renovando así la sesión sin interrumpir al usuario.

## Endpoints Principales (API REST)

Todos parten de `http://localhost:8080/api`

### Autenticación

| Método | Ruta | Función | Acceso |
|---|---|---|---|
| POST | `/auth/login` | Iniciar sesión y obtener tokens | Público |
| POST | `/auth/register` | Registrar un nuevo usuario | Público (o ADMIN) |
| POST | `/auth/refresh` | Renovar Access Token | Público (con Refresh Token) |

### Órdenes de Trabajo (Work Orders)

| Método | Ruta | Función | Roles |
|---|---|---|---|
| GET | `/work-orders` | Listar órdenes de trabajo | ADMIN (ve todas), TECHNICIAN (ve asignadas) |

## Pruebas (Testing)

El backend cuenta con una robusta suite de pruebas unitarias e integrales.

**Ejecución local nativa (Requiere JDK y Maven):**
```bash
cd backend
./mvnw test
```

*Nota: Al construir la imagen de Docker, Maven ejecuta automáticamente estas pruebas. Si alguna prueba falla, la construcción del contenedor se detendrá, garantizando que solo código funcional pase a producción.*

## Despliegue en Producción (AWS EC2)

El proyecto está preparado para desplegarse fácilmente en una instancia Ubuntu en AWS EC2.

1. Comprime el código localmente excluyendo node_modules y targets:
   ```bash
   tar --exclude='frontend/node_modules' --exclude='backend/target' --exclude='frontend/dist' --exclude='.git' --exclude='.gemini' -czvf cmms_pro_deploy.tar.gz .
   ```
2. Sube el archivo comprimido a tu servidor EC2 vía SSH:
   ```bash
   scp -i /ruta/a/tu/llave.pem cmms_pro_deploy.tar.gz ubuntu@<IP_PUBLICA>:~
   ```
3. Conéctate a la instancia, descomprime el archivo y levanta Docker:
   ```bash
   ssh -i /ruta/a/tu/llave.pem ubuntu@<IP_PUBLICA>
   mkdir -p cmms_pro && tar -xzvf cmms_pro_deploy.tar.gz -C cmms_pro
   cd cmms_pro
   sudo docker compose up --build -d
   ```

Asegúrate de que los puertos **8080** y **3000** estén abiertos en el *Security Group* de AWS.

## Problemas Frecuentes

- **Timeout al hacer SSH en AWS:** Si tu proveedor de internet cambió tu IP dinámica (muy común de un día para otro), AWS bloqueará la conexión si configuraste el puerto 22 para "My IP". Solución: Actualiza tu IP en las reglas de entrada (Inbound Rules) del Security Group en la consola de AWS.
- **Cambios no reflejados:** Ejecuta `docker compose build --no-cache` para forzar la reconstrucción total de las imágenes.
