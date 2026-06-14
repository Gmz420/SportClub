# SportClub

Aplicación web (SPA) para la gestión de un club deportivo: autenticación, perfiles por rol
(Usuario / Coach / Administrador) y administración de usuarios. Proyecto de la
**Evaluación N°3 — Programación Front End (Unidad 3)**.

## Integrante

- Gmz420

## Tecnologías

- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- [React Router v7](https://reactrouter.com/) (`BrowserRouter`)
- [React-Bootstrap](https://react-bootstrap.netlify.app/) + [Bootstrap 5](https://getbootstrap.com/)
- [SweetAlert2](https://sweetalert2.github.io/) para alertas y confirmaciones
- ESLint + Prettier
- Gestor de paquetes: **pnpm**

Backend (proyecto aparte, no incluido en este repo): Node.js + Express + Sequelize + SQLite + JWT.

## Instalación

```bash
pnpm install
```

## Configuración

Copiar `.env.example` a `.env` y ajustar si es necesario:

```
VITE_API_URL=http://localhost:3000
```

## Cómo correr el proyecto

### 1. Backend

El frontend necesita el backend de SportClub corriendo en `http://localhost:3000`.
Desde la carpeta del backend (ej. `../FrontEnd-Backend-ClubDeportivo-main`):

```bash
node src/server.js
```

### 2. Frontend

Desde esta carpeta:

```bash
pnpm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Otros comandos

```bash
pnpm run build    # build de producción (carpeta dist/)
pnpm run preview  # previsualizar el build
pnpm run lint     # revisar el código con ESLint
pnpm run format   # formatear el código con Prettier
```

## Cuentas de prueba

El backend incluye usuarios semilla (contraseña `12345678` para todos):

| Email | Rol |
|---|---|
| `user1@demo.cl` / `user2@demo.cl` | Usuario |
| `coach1@demo.cl` / `coach2@demo.cl` | Coach |
| `admin1@demo.cl` / `admin2@demo.cl` | Administrador |

## Funcionalidades principales

- **Login y Registro** con validaciones (React-Bootstrap).
- **Rutas protegidas** por sesión (`ProtectedRoute`) y por rol (`RoleRoute`), con redirección a
  `/login` o `/unauthorized` según corresponda.
- **Navbar y dashboard propios por rol** (Usuario = azul, Coach = verde, Administrador = morado),
  con contenido real conectado al backend donde existe endpoint y datos de ejemplo donde no.
- **Mi Perfil**: ver y editar datos personales, y cambiar contraseña (`PUT /api/auth/me`,
  `PUT /api/auth/me/password`).
- **Gestión de Usuarios** (solo Administrador): listar, crear, editar y eliminar usuarios, con
  confirmaciones y mensajes vía SweetAlert2.

## Estructura del proyecto

```
src/
├── assets/           # logo e imágenes
├── components/
│   ├── routing/      # ProtectedRoute, RoleRoute
│   ├── ui/           # RoleBadge, RoleNavbar
│   └── users/         # UserFormModal (CRUD admin)
├── config/           # api.js (VITE_API_URL, headers)
├── constants/        # roleColors.js, mockData.js
├── hooks/            # useScrollToHash
├── layouts/          # UserLayout, CoachLayout, AdminLayout
├── pages/            # Login, Register, Profile, dashboards por rol, UsersPage
├── routes/           # AppRoutes.jsx
├── services/         # authService.js, userService.js
└── styles/           # roles.css
```
