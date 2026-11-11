# Sistema de Investigación Criminal &mdash; Frontend Noir

> Proyecto de Aula: Desarrollo Web Full-Stack &amp; Paradigmas de Programación (Semestre 2026-2)  
> Implementación del Frontend: **Next.js 14 (App Router), React 18, TypeScript estricto y Tailwind CSS**

---

## 1. Cómo Probar la Aplicación

### Opción A: Probar en Producción (Recomendada para Evaluación)
1. **Despertar el backend en Render**:  
   Abrir en el navegador:  
   👉 [https://sistema-investigacion-criminal-backend.onrender.com/api/health](https://sistema-investigacion-criminal-backend.onrender.com/api/health)  
   Esperar entre 30 y 50 segundos hasta recibir:
   ```json
   {
     "status": "ok",
     "service": "Sistema de Investigación Criminal API",
     "timestamp": "2026-11-10T..."
   }
   ```
2. **Abrir el frontend en Vercel**:  
   👉 [https://sistema-investigacion-criminal-fron.vercel.app](https://sistema-investigacion-criminal-fron.vercel.app)
3. **Iniciar sesión con las credenciales de prueba**:
   - **Detective**: `detective@forense.test` | Contraseña: `Detective2026!`  
     *(Acceso a expedientes propios, creación de casos con imágenes, evidencias y sospechosos)*
   - **Administrador**: `admin@forense.test` | Contraseña: `Admin2026!`  
     *(Acceso global a todos los casos y al panel administrativo `/admin`)*

---

### Opción B: Ejecución en Entorno Local
1. **Levantar primero el backend**:
   ```bash
   cd sistema-investigacion-criminal-backend
   cp .env.example .env
   # Configurar cadenas de conexión a base de datos en .env
   npm ci
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   npm run dev
   ```
   El backend estará disponible en `http://localhost:4000`.

2. **Levantar el frontend**:
   ```bash
   cd ../sistema-investigacion-criminal-frontend
   cp .env.example .env.local
   # Asegurar que NEXT_PUBLIC_API_HOST=http://localhost:4000
   npm ci
   npm run dev
   ```
   Abrir en el navegador: [http://localhost:3000](http://localhost:3000).

---

## 2. Enlaces del Proyecto

- **Frontend en Producción (Vercel)**: [https://sistema-investigacion-criminal-fron.vercel.app](https://sistema-investigacion-criminal-fron.vercel.app)
- **Backend API (Render)**: [https://sistema-investigacion-criminal-backend.onrender.com](https://sistema-investigacion-criminal-backend.onrender.com)
- **Health Check del Backend**: [https://sistema-investigacion-criminal-backend.onrender.com/api/health](https://sistema-investigacion-criminal-backend.onrender.com/api/health)
- **Repositorio Hermano (Backend)**: [https://github.com/Juanexzz/sistema-investigacion-criminal-backend](https://github.com/Juanexzz/sistema-investigacion-criminal-backend)
- **Monorepo Histórico Original**: [https://github.com/juanfer2006/patria_milagro_web](https://github.com/juanfer2006/patria_milagro_web)

---

## 3. Reparto de Trabajo (Equipo de 4 Integrantes)

| Integrante | Responsabilidad | Aportes Principales |
| :--- | :--- | :--- |
| **Juan Esteban Vallejo Hincapié** | **Despliegue, Infraestructura y Casos** | **Despliegue y configuración en Vercel y Render, orquestación de variables de entorno, vistas de casos (`/cases`, `/cases/new`, `/cases/[id]`, `/cases/[id]/edit`), componente ImageUpload e integración de fotos.** |
| **Juan Fernando Castañeda Agudelo** | **Líder de Proyecto y Arquitectura** | **Fundación del frontend (Next.js App Router, cliente HTTP desacoplado, AuthProvider, useAuth, middleware.ts, páginas de Login, Registro, Not Found y Panel Administrativo de Usuarios).** |
| **Camilo Gutiérrez Castañeda** | **Sospechosos y Feedback UI** | **Componentes de retroalimentación modal y diálogos (`Modal`, `ConfirmDialog`, `Spinner`, `EmptyState`, `ErrorState`) y módulo completo de personas de interés/sospechosos.** |
| **José Daniel Morales Villegas** | **Evidencias y Sistema de Diseño** | **Módulo de Evidencias (`EvidencesSection`), Landing Page institucional, tokens de diseño y variables CSS, componentes UI base (`Button`, `Input`, `Select`, `Textarea`, `FormField`, `Pagination`), Navbar con ThemeToggle y Footer.** |

---

## 4. Credenciales de Prueba Oficiales (Seed)

Para la sustentación y pruebas del sistema, se utilizan las cuentas creadas por el seed oficial de la base de datos:

| Rol | Correo de Acceso | Contraseña | Alcance en la Interfaz |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@forense.test` | `Admin2026!` | Acceso total a todos los expedientes criminales, panel administrativo `/admin` y desactivación de usuarios. |
| **USER** | `detective@forense.test` | `Detective2026!` | Acceso exclusivo a expedientes propios, creación de evidencias y vinculación de personas de interés. |

---

## 5. Rutas y Vistas de la Aplicación

El frontend está estructurado mediante el App Router de Next.js en las siguientes rutas públicas y privadas:

| Ruta | Acceso | Propósito y Capacidades |
| :--- | :--- | :--- |
| `/` | Público | Landing page institucional pericial con presentación del sistema, estadísticas y accesos directos. |
| `/login` | Público (redirecciona a `/cases` si autenticado) | Formulario de autenticación con verificación de campos, persistencia de sesión en cookie `cr_token` y aviso de sesión expirada. |
| `/register` | Público (redirecciona a `/cases` si autenticado) | Registro de nuevos usuarios con rol predeterminado `USER`. |
| `/cases` | Privado (`USER` y `ADMIN`) | Listado de expedientes con filtros combinados (`q`, `status`, `from`, `to`), paginación y tarjetas informativas. |
| `/cases/new` | Privado (`USER` y `ADMIN`) | Formulario para apertura de caso nuevo, con carga opcional de fotografía a Supabase Storage. |
| `/cases/[id]` | Privado (`USER` y `ADMIN`) | Expediente criminal detallado: ficha técnica, fotografía de la escena, sección de personas de interés y módulo de evidencias. |
| `/cases/[id]/edit` | Privado (`USER` y `ADMIN`) | Edición de la información del caso y actualización de estado (`OPEN`, `IN_PROGRESS`, `CLOSED`). |
| `/admin` | Privado (Exclusivo `ADMIN`) | Panel administrativo para listar usuarios paginados y desactivar cuentas (`DELETE /api/users/:id`). No modifica roles. |

---

## 6. Estructura del Proyecto y Arquitectura por Features

El código fuente organiza las rutas y el middleware en la raíz del repositorio, y desacopla la lógica de negocio por módulos funcionales bajo `src/features/`:

```
├── app/                        # Rutas de Next.js App Router en la raíz del repositorio
│   ├── admin/                  # Página del panel administrativo (/admin)
│   ├── cases/                  # Rutas de expedientes criminales (/cases, /cases/new, /cases/[id], etc.)
│   ├── login/                  # Página de inicio de sesión (/login)
│   ├── register/               # Página de registro de usuarios (/register)
│   ├── globals.css             # Tokens CSS noir, variables cromáticas y estilos globales
│   ├── layout.tsx              # Layout raíz con AuthProvider, Navbar y Footer
│   ├── not-found.tsx           # Vista 404 personalizada
│   └── page.tsx                # Landing page principal (/)
├── middleware.ts               # Protección perimetral de rutas en la raíz del repositorio
└── src/
    └── features/               # Módulos de dominio desacoplados
        ├── admin/              # Panel administrativo: admin.service.ts y hook useAdminUsers
        ├── auth/               # Autenticación: AuthProvider, useAuth, cookies y servicios
        ├── cases/              # Dominio de casos: servicios, hooks (useCases, useCase), filtros y vistas
        ├── suspects/           # Personas de interés: tarjetas, cálculo de nivel de sospecha (0-100) y modales
        ├── evidences/          # Evidencias: clasificación, relevancia (1-5) y modales
        └── common/             # Utilidades transversales:
            ├── components/     # Button, Input, Modal, ConfirmDialog, Spinner, EmptyState, ErrorState
            ├── domain/         # Tipos y discriminador de errores (ApiError, isApiError)
            ├── hooks/          # useImageUpload, useTheme
            └── http/           # http-client.ts centralizado con inyección de token y manejo de 401
```

---

## 7. Protección de Rutas (`middleware.ts`), Sesión y Manejo de 401

### 7.1. Protección con `middleware.ts` (en la raíz del repositorio)
El archivo `middleware.ts` intercepta las solicitudes hacia rutas protegidas antes de resolver la página:
- **Rutas Privadas (`/cases`, `/cases/:path*`, `/admin`, `/admin/:path*`)**: Verifica la presencia de la cookie `cr_token`. Si no existe o si el token está expirado, redirige a `/login` (sin parámetro `?redirect`).
- **Validación de Expiración del Token**: Decodifica el payload en base64 del JWT (`parseJwt`) y comprueba que `exp * 1000 > Date.now()`. Si el token ya venció, se considera sesión inválida y redirige a `/login`.
- **Control de Acceso por Rol**: Si un usuario con rol distinto a `ADMIN` intenta acceder a `/admin`, el middleware lo redirige automáticamente a `/cases`.
- **Rutas de Autenticación (`/login`, `/register`)**: Si el usuario ya cuenta con una sesión válida activa, se le redirige automáticamente a `/cases`.

### 7.2. Cookie de Sesión `cr_token`
- Al autenticarse, el token JWT devuelto por el backend se guarda en la cookie `cr_token`.
- Configuración de la cookie:
  - `path: '/'`
  - `sameSite: 'lax'`
  - `secure: true` en producción (HTTPS).
  - `expires: 1` (expira en **1 día**, sincronizado exactamente con `JWT_EXPIRES_IN=1d` del backend).

### 7.3. Manejo de Errores 401 en `http-client.ts`
- Cuando el backend retorna un código HTTP 401 (token inválido o revocado), el método `handleUnauthorized()` de `http-client.ts`:
  1. Elimina la cookie `cr_token` mediante `Cookies.remove('cr_token', { path: '/' })`.
  2. Redirige al usuario al inicio de sesión mediante `window.location.href = '/login?expired=1'`.
  3. La página `/login` detecta el parámetro `expired=1` y muestra el mensaje informativo correspondiente.

---

## 8. Filtros de Casos, Estados y Modo Oscuro

- **Estados de Caso**: El sistema gestiona tres estados procesales tipados en `CaseStatus`:
  - `OPEN` (Abierto)
  - `IN_PROGRESS` (En investigación)
  - `CLOSED` (Cerrado: restringe la adición de nuevos sospechosos y evidencias, pero permite consulta y edición de existentes).
- **Filtros Reales en `/cases`**: El componente `CaseFilters` permite filtrar los expedientes en tiempo real por:
  - `q`: Búsqueda textual por título o ubicación.
  - `status`: Selector de estado (`OPEN`, `IN_PROGRESS`, `CLOSED`).
  - `from`: Fecha de inicio del rango.
  - `to`: Fecha de fin del rango.
  - Botón interactivo para reiniciar los filtros (`LIMPIAR FILTROS`) cuando hay alguno activo.
- **Alternancia de Tema (Modo Oscuro / Papel Forense)**: El componente `ThemeToggle` alterna entre el modo oscuro predeterminado y el modo claro (`data-theme="light"` en la etiqueta `<html>`), persistiendo la preferencia en `localStorage`.
- **Suite de Pruebas del Backend**: Los contratos de datos consumidos por este frontend están respaldados por las **119 pruebas automatizadas** de la suite en Vitest del backend.

---

## 9. Variables de Entorno (`.env.local`)

Crear un archivo `.env.local` en la raíz del repositorio frontend:

```env
# URL base de la API sin el prefijo /api (el cliente HTTP lo añade en cada solicitud)
NEXT_PUBLIC_API_HOST=http://localhost:4000
```

Para el entorno de producción en Vercel:
```env
NEXT_PUBLIC_API_HOST=https://sistema-investigacion-criminal-backend.onrender.com
```

> [!IMPORTANT]
> **Modificación de `NEXT_PUBLIC_API_HOST`:**  
> Las variables con prefijo `NEXT_PUBLIC_*` son inyectadas en tiempo de compilación por Next.js (`next build`). Cualquier cambio a esta variable en Vercel requiere disparar un redespliegue para que surta efecto en el navegador de los usuarios.

---

## 10. Instalación y Ejecución Local

1. Ubicarse en la raíz del repositorio frontend:
   ```bash
   cd sistema-investigacion-criminal-frontend
   ```
2. Instalar dependencias exactas:
   ```bash
   npm ci
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## 11. Despliegue en Producción y Entrega Continua (CI/CD)

### 11.1. Guía de Despliegue en Orden de Dependencias
Para desplegar el sistema completo desde cero, debe seguirse estrictamente este orden:

1. **Paso 1: Supabase (Base de Datos & Storage)**:
   - Crear el proyecto en Supabase y obtener las cadenas de conexión: Transaction Pooler (puerto 6543) y Session Pooler (puerto 5432).
   - Crear el bucket `case-images` con acceso público de lectura y políticas de subida autenticada.
   - Obtener la clave `service_role`.

2. **Paso 2: Render (Backend API)**:
   - Crear el Web Service vinculado al repositorio de GitHub del backend.
   - Configurar variables de entorno (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `SUPABASE_*`, etc.).
   - Build Command: `npm ci --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build`
   - Start Command: `node dist/server.js` (o `npm start`)
   - Health Check Path: `/api/health`

3. **Paso 3: Vercel (Frontend)**:
   - Importar el repositorio del frontend en Vercel con Framework Preset `Next.js`.
   - Configurar la variable de entorno:
     `NEXT_PUBLIC_API_HOST=https://sistema-investigacion-criminal-backend.onrender.com`
   - Desplegar. Vercel ejecuta `next build` en cada push a la rama `main`.

4. **Paso 4: Actualizar `CORS_ORIGIN` en Render**:
   - Copiar la URL asignada por Vercel (`https://sistema-investigacion-criminal-fron.vercel.app`).
   - En el dashboard de Render, actualizar la variable `CORS_ORIGIN` con este dominio exacto (sin barra final) para autorizar las solicitudes del navegador.

### 11.2. Entrega Continua en Vercel
- Vercel ejecuta automáticamente `next build` en cada push a la rama `main`, optimizando y desplegando la aplicación en el dominio de producción.
