# Autenticación

La autenticación está manejada por [Clerk](https://clerk.com) v7. Se puede iniciar sesión con Google o con email y contraseña.

## Rutas protegidas

Todas las rutas están protegidas por defecto mediante `clerkMiddleware`. Las únicas rutas públicas son:

- `/` — landing page
- `/sign-in` y `/sign-up`

Cualquier ruta del dashboard (`/buyer`, `/seller`, `/shipping`, `/payments`) redirige al sign-in si el usuario no está autenticado.

## Sidebar

El sidebar muestra un `<UserButton />` de Clerk en la parte inferior, que permite al usuario ver su perfil y cerrar sesión sin salir del panel.

## Variables de entorno requeridas

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

Estas variables deben estar configuradas tanto en `.env.local` como en el proyecto de Vercel. Sin ellas el middleware falla con `MIDDLEWARE_INVOCATION_FAILED`.
