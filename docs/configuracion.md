# Configuración de entorno

Copiá `.env.example` a `.env.local` y completá cada variable con los valores del equipo.

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# API keys de las apps individuales
CONTROL_PLANE_KEY=       # Key que el Control Plane usa para autenticarse ante la Buyer App
SELLER_API_KEY=          # Key para autenticarse ante la Seller App
SHIPPING_API_KEY=        # Key para autenticarse ante la Shipping App

# URLs de las apps individuales
BUYER_APP_URL=https://proyecto-c-buyer-infusio.vercel.app
SELLER_APP_URL=https://proyecto-c-seller-infusio.vercel.app
SHIPPING_APP_URL=https://proyecto-c-shipping-infusio.vercel.app
PAYMENTS_APP_URL=https://proyecto-c-payments-infusio.vercel.app
```

## Dónde obtener cada valor

| Variable | Fuente |
|----------|--------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Dashboard de Clerk del proyecto |
| `CLERK_SECRET_KEY` | Dashboard de Clerk del proyecto |
| `CLERK_WEBHOOK_SECRET` | Webhook configurado en Clerk |
| `CONTROL_PLANE_KEY` | Generada por el equipo, compartida con la Buyer App |
| `SELLER_API_KEY` | Generada en la Seller App (`API_KEY` en su Vercel) |
| `SHIPPING_API_KEY` | Generada en la Shipping App |

## En Vercel

Las mismas variables deben cargarse en el proyecto de Vercel del Control Plane. Sin `CLERK_SECRET_KEY` el deploy falla en middleware con `500 MIDDLEWARE_INVOCATION_FAILED`.
