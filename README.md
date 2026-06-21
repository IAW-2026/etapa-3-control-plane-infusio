[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Fu6E-LL6)

# Control Plane — Infusio

**Deploy:** https://etapa-3-control-plane-infusio.vercel.app

Aplicación **Control Plane** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión `infusio; Camila De Giusti, Ludmila Prolygin`.

## Acceso

La app requiere autenticación con Clerk. Cualquier cuenta autorizada accede al panel completo.

| Rol | Cómo ingresar |
|-----|---------------|
| Administrador | Cuenta de Google o email/contraseña configurada en Clerk |

## Descripción

Panel de administración global del marketplace de infusiones Infusio. Permite supervisar y gestionar en tiempo real los datos de todas las apps del sistema desde un único lugar.

Cada sección del panel se conecta a la app correspondiente mediante su API REST usando autenticación por API key (`Authorization: Bearer`).

**Stack:** Next.js 15.5 · React 19 · TypeScript · Tailwind CSS v4 · Clerk v7

## Apps del marketplace

| App | URL |
|-----|-----|
| Buyer App | https://proyecto-c-buyer-infusio.vercel.app |
| Seller App | https://proyecto-c-seller-infusio.vercel.app |
| Shipping App | https://proyecto-c-shipping-infusio.vercel.app |
| Payments App | https://proyecto-c-payments-infusio.vercel.app |

## Documentación detallada

La documentación de cada sección está en la carpeta [`/docs`](./docs):

[Autenticación](./docs/autenticacion.md) · [Configuración de entorno](./docs/configuracion.md) · [Panel Buyer App](./docs/buyer.md) · [Panel Seller App](./docs/seller.md) · [Panel Shipping App](./docs/shipping.md) · [Panel Payments App](./docs/payments.md) · [Conexión con APIs externas](./docs/apis-externas.md)
