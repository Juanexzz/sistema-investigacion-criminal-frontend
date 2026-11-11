# Sistema de Investigación Criminal &mdash; Frontend Noir

> Proyecto de Aula: Desarrollo Web Full-Stack &amp; Paradigmas de Programación (Semestre 2026-2)  
> Identidad Visual: **Expediente Forense Noir**

---

## 1. Descripción del Proyecto

Aplicación web desarrollada con **Next.js 14 (App Router), React 18, TypeScript estricto y Tailwind CSS**. Presenta una interfaz inmersiva basada en la estética de expedientes forenses confidenciales, con tipografías temáticas (`Special Elite`, `IBM Plex Sans`, `IBM Plex Mono`), paleta cromática noir (Tinta `#0E1013`, Grafito `#181B20`, Papel `#E8E1D0`, Rojo Evidencia `#B3262E` y Ámbar Alerta `#D9A441`), alternador de tema claro/oscuro (`ThemeToggle`), autenticación JWT mediante cookies (`cr_token`), protección centralizada con Middleware de Next.js, cliente HTTP desacoplado y componentes accesibles y reutilizables.

---

## 2. Enlaces de Despliegue

- **Frontend en Producción (Vercel)**: `https://sistema-investigacion-criminal-fron.vercel.app`
- **Backend API (Render)**: `https://sistema-investigacion-criminal-backend.onrender.com`
- **Health Check del Backend**: `https://sistema-investigacion-criminal-backend.onrender.com/api/health`
- **Repositorio Hermano (Backend)**: https://github.com/Juanexzz/sistema-investigacion-criminal-backend
- **Monorepo Original**: https://github.com/juanfer2006/patria_milagro_web

---

## 3. Reparto de Trabajo (Equipo de 4 Integrantes)

| Integrante | Responsabilidad | Aportes Principales |
| :--- | :--- | :--- |
| **Juan Esteban Vallejo Hincapié** | **Despliegue, Infraestructura y Casos** | **Despliegue y configuración en Vercel y Render, orquestación de variables de entorno, vistas de casos (`/cases`, `/cases/new`, `/cases/[id]`, `/cases/[id]/edit`), componente ImageUpload e integración pericial de imágenes.** |
| **Juan Fernando Castañeda Agudelo** | **Líder de Proyecto y Arquitectura** | **Fundación del frontend (Next.js App Router, cliente HTTP centralizado, AuthProvider, useAuth, middleware.ts, páginas de Login, Registro, Not Found y Panel de Administración de Usuarios).** |
| **Camilo Gutiérrez Castañeda** | **Sospechosos y Feedback UI** | **Componentes de retroalimentación modal y diálogos (`Modal`, `ConfirmDialog`, `Spinner`, `EmptyState`, `ErrorState`) y módulo completo de personas de interés/sospechosos.** |
| **José Daniel Morales Villegas** | **Evidencias y Sistema de Diseño** | **Módulo de Evidencias de punta a punta (`EvidencesSection`), Landing Page pericial, tokens de diseño y variables CSS, componentes UI base (`Button`, `Input`, `Select`, `Textarea`, `FormField`, `Pagination`), Navbar con ThemeToggle y Footer forense.** |

---

## 4. Credenciales de Prueba Oficiales (Seed)

Para la sustentación y pruebas del sistema, se utilizan las cuentas creadas por el seed oficial de la base de datos:

| Rol | Correo de Acceso | Contraseña | Alcance en la Interfaz |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@forense.test` | `Admin2026!` | Acceso total a todos los expedientes criminales, panel administrativo `/admin` y gestión de roles de usuarios. |
| **USER** | `detective@forense.test` | `Detective2026!` | Acceso exclusivo a expedientes propios, creación de evidencias y vinculación de personas de interés. |

---

## 5. Rutas y Vistas de la Aplicación

El frontend está estructurado mediante el App Router de Next.js en las siguientes rutas públicas y protegidas:

| Ruta | Acceso | Propósito y Capacidades |
| :--- | :--- | :--- |
| `/` | Público | Landing page institucional pericial noir con presentación del sistema, estadísticas y accesos directos. |
| `/login` | Público (redirecciona si autenticado) | Formulario pericial de inicio de sesión con validación Zod, persistencia de sesión y manejo de expiración. |
| `/register` | Público (redirecciona si autenticado) | Registro de nuevos detectives con asignación predeterminada del rol `USER`. |
| `/cases` | Privado (`USER` y `ADMIN`) | Listado pericial de expedientes con **filtros combinados** (búsqueda por texto/código, filtro por estado `OPEN` / `INVESTIGATING` / `CLOSED`), paginación y ordenamiento. |
| `/cases/new` | Privado (`USER` y `ADMIN`) | Formulario pericial para apertura de un nuevo caso, incluyendo registro fotográfico opcional hacia Supabase Storage. |
| `/cases/[id]` | Privado (`USER` y `ADMIN`) | Expediente criminal confidencial completo: ficha técnica, fotografía de la escena, sección de sospechosos vinculados y módulo de cadena de custodia de evidencias. |
| `/cases/[id]/edit` | Privado (`USER` y `ADMIN`) | Edición de la información pericial del caso y reapertura o cierre formal del expediente. |
| `/admin` | Privado (Exclusivo `ADMIN`) | Panel administrativo para auditoría de usuarios, cambio de roles (`USER` / `ADMIN`) y desactivación de cuentas. |

---

## 6. Arquitectura por Features

El código fuente sigue un patrón modular desacoplado organizado por capacidades del dominio bajo `src/features/`:

```
src/
├── app/                        # Rutas de Next.js App Router y layouts globales
│   ├── (auth)/                 # Rutas de autenticación (/login, /register)
│   ├── admin/                  # Vista del panel administrativo
│   ├── cases/                  # Rutas de expedientes criminales
│   └── globals.css             # Tokens CSS noir y variables de tema
├── features/
│   ├── admin/                  # Panel administrativo: servicios, hooks y tabla de usuarios
│   ├── auth/                   # Autenticación: AuthProvider, useAuth, cookies, login y registro
│   ├── cases/                  # Gestión de casos: dominio, servicios, hooks, filtros y vistas
│   ├── suspects/               # Personas de interés: tarjetas periciales, nivel de sospecha y modales
│   ├── evidences/              # Evidencias forenses: cadena de custodia, clasificación y fotos
│   └── common/                 # Utilidades transversales:
│       ├── components/         # Button, Input, Modal, ConfirmDialog, Spinner, EmptyState
│       ├── domain/             # Tipado uniforme de errores (ApiError, isApiError)
│       ├── hooks/              # useImageUpload, useTheme
│       └── http/               # http-client.ts centralizado con inyección de token y manejo de 401
└── middleware.ts               # Protección perimetral de rutas y validación de roles en el Edge
```

---

## 7. Protección de Rutas (`middleware.ts`), Sesión y Manejo de 401

### 7.1. Protección Perimetral con `middleware.ts`
El archivo `src/middleware.ts` se ejecuta en el runtime Edge de Next.js antes de resolver cualquier solicitud:
- **Rutas Protegidas (`/cases/:path*`, `/admin/:path*`)**: Verifica la presencia de la cookie `cr_token`. Si no existe, redirige inmediatamente a `/login?redirect=<url_original>`.
- **Control de Acceso Basado en Roles (RBAC)**: Para la ruta `/admin`, decodifica el payload del JWT contenido en la cookie. Si el rol no es `ADMIN`, redirige al usuario a `/cases` con acceso restringido.
- **Rutas de Autenticación (`/login`, `/register`)**: Si el usuario ya cuenta con una sesión válida en `cr_token`, el middleware lo redirige automáticamente al listado de expedientes `/cases`.

### 7.2. Cookie de Sesión `cr_token`
- Al iniciar sesión exitosamente, el token JWT devuelto por el backend se almacena en la cookie `cr_token`.
- Configurada con políticas `SameSite=Lax`, `Path=/`, `Secure` en HTTPS de producción y expiración sincronizada con la validez del token JWT (7 días).
- Permite la lectura tanto en el cliente para adjuntar la cabecera `Authorization: Bearer <token>` en cada solicitud del `http-client.ts`, como en el Edge runtime por `middleware.ts`.

### 7.3. Detección y Recuperación ante Errores 401
- Si el backend rechaza una petición por token expirado o revocado (HTTP 401), el interceptor centralizado en `src/features/common/http/http-client.ts` remueve la cookie `cr_token`, limpia el estado en `AuthProvider` y redirige al usuario a `/login?expired=1` informándole que su sesión caducó.

---

## 8. Sistema de Diseño Forense Noir, Modo Oscuro y Filtros Combinados

- **Modo Oscuro Predeterminado e Inmersivo**: Diseñado con la atmósfera estética de una oficina de detectives pericial: fondos en Grafito y Tinta, tipografía mecanográfica `Special Elite` para sellos forenses, y acentos de color en Rojo Evidencia (`#B3262E`) y Ámbar Alerta (`#D9A441`).
- **Modo Claro ("Papel Forense")**: Al activar el `ThemeToggle`, se aplica el atributo `data-theme="light"` en la raíz del documento, transformando los fondos en tonos de papel antiguo envejecido y textos en tinta grafito de alto contraste visual.
- **Filtros Combinados en Expedientes**: La vista `/cases` permite filtrar simultáneamente por término de búsqueda en texto completo (título, descripción o código `CR-XXXX`) y por estado operativo (`OPEN`, `INVESTIGATING`, `CLOSED`), recalculando la paginación y mostrando contadores reactivos.
- **Suite de Pruebas en Backend**: Para garantizar que los contratos de datos consumidos por este frontend permanezcan estables, el repositorio hermano del backend incluye una suite completa de **119 pruebas automatizadas** en Vitest cubriendo DTOs, casos de uso, middlewares y políticas de acceso.

---

## 9. Variables de Entorno (`.env.local`)

Crear un archivo `.env.local` en la raíz del repositorio:

```env
# URL base de la API sin el prefijo /api (el cliente HTTP lo concatena automáticamente)
NEXT_PUBLIC_API_HOST=http://localhost:4000
```

Para el entorno de producción en Vercel:
```env
NEXT_PUBLIC_API_HOST=https://sistema-investigacion-criminal-backend.onrender.com
```

> [!IMPORTANT]
> **Aclaración sobre `NEXT_PUBLIC_*` en Next.js:**  
> Las variables de entorno que inician con el prefijo `NEXT_PUBLIC_` son inyectadas en tiempo de compilación (**build-time**) por Next.js dentro del paquete JavaScript cliente. En consecuencia, **cualquier modificación al valor de `NEXT_PUBLIC_API_HOST` en Vercel requiere redesplegar la aplicación** (mediante un nuevo commit o *Redeploy* desde el dashboard de Vercel) para que tome efecto en el navegador de los usuarios.

---

## 10. Instalación y Ejecución Local

1. Clonar el repositorio y ubicarse en la raíz:
   ```bash
   cd sistema-investigacion-criminal-frontend
   ```
2. Instalar dependencias exactas:
   ```bash
   npm ci
   ```
3. Iniciar el servidor de desarrollo en Next.js:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## 11. Arquitectura de Despliegue Frontend y Entrega Continua (CI/CD)

El frontend se encuentra alojado y orquestado en la plataforma **Vercel**, aprovechando la infraestructura global de borde (Edge Network) y las capacidades de Next.js App Router:

### 11.1. Topología y Modelo de Ejecución
- **Infraestructura de Borde (Edge Distribution)**: Distribución global en CDN de alto rendimiento, optimizando tiempos de respuesta (TTFB) y entrega de bundles estáticos.
- **Estrategia Híbrida de Renderizado**:
  - **Static Site Generation (SSG)**: Vistas estructurales (`/`, `/login`, `/register`, `/cases/new`) prerenderizadas en tiempo de compilación para máxima velocidad de carga.
  - **Dynamic Server-Side Rendering (SSR)**: Vistas parametrizadas (`/cases/[id]`, `/cases/[id]/edit`) resueltas dinámicamente para garantizar la consistencia en tiempo real de los expedientes.
- **Seguridad Perimetral en el Edge**: El archivo `middleware.ts` intercepta cada petición entrante en los puntos de presencia (PoPs) antes de alcanzar la lógica de interfaz, validando la cookie `cr_token` y autorizando el acceso por roles con latencia mínima.

### 11.2. Pipeline Automatizado de Integración y Entrega Continua (CI/CD)
Cada confirmación en la rama `main` del repositorio dispara automáticamente el ciclo de verificación y despliegue en Vercel:
1. **Auditoría de Código y Calidad (`next lint`)**: Validación estricta de sintaxis, reglas de accesibilidad y estándares de código.
2. **Validación Estricta de Tipos (`tsc --noEmit`)**: Comprobación estática de tipos TypeScript sobre el 100% de los componentes y contratos de datos.
3. **Compilación y Empaquetado (`next build`)**: Optimización de chunks de JavaScript compartidos, minimización de estilos con Tailwind CSS y generación del árbol de rutas.
4. **Asignación Automática de Producción**: Vinculación atómica e inmediata con el dominio canónico `https://sistema-investigacion-criminal-fron.vercel.app`.

### 11.3. Sincronización Segura con el Backend
La comunicación entre la interfaz de usuario y la API de Render opera bajo un esquema de origen cruzado estrictamente validado:
- **`NEXT_PUBLIC_API_HOST`**: Apunta al endpoint canónico del backend (`https://sistema-investigacion-criminal-backend.onrender.com`).
- **Política CORS Estricta**: El backend rechaza peticiones que no provengan exactamente del origen registrado de Vercel, mitigando riesgos de suplantación o solicitudes no autorizadas desde navegadores externos.
