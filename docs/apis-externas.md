# Conexión con APIs externas

El Control Plane no tiene base de datos propia. Toda la información se obtiene en tiempo real consumiendo las APIs REST de cada app del marketplace. Cada cliente HTTP está en `app/lib/`.

## Autenticación

Todas las apps usan el header `Authorization: Bearer <key>`. Cada app tiene su propia key configurada en las variables de entorno.

| App | Variable de entorno | Header enviado |
|-----|---------------------|----------------|
| Buyer App | `CONTROL_PLANE_KEY` | `Authorization: Bearer <CONTROL_PLANE_KEY>` |
| Seller App | `SELLER_API_KEY` | `Authorization: Bearer <SELLER_API_KEY>` |
| Shipping App | `SHIPPING_API_KEY` | `Authorization: Bearer <SHIPPING_API_KEY>` |
| Payments App | `PAYMENTS_API_KEY` | `x-api-key: <PAYMENTS_API_KEY>` |

## Clientes HTTP

| Archivo | App | Funciones exportadas |
|---------|-----|---------------------|
| `app/lib/buyer.ts` | Buyer App | `getCarts`, `getCart`, `updateCart`, `deleteCart` |
| `app/lib/seller.ts` | Seller App | `getOrders`, `getOrder`, `updateOrder`, `getProducts`, `getProduct`, `updateProduct` |
| `app/lib/payments.ts` | Payments App | `getPaymentOrders` |

Todos los fetches usan `cache: 'no-store'` para garantizar datos frescos en cada request (Server Components).

## Endpoints privados de la Seller App

La Seller App expone un prefijo `/api/control/` exclusivo para el Control Plane, separado de la API pública `/api/seller/` usada por el resto del marketplace. Estos endpoints no requieren sesión de Clerk pero sí la API key en el header.

Para que funcionen, el middleware de Clerk de la Seller App debe tener `/api/control/(.*)` como ruta pública (`proxy.ts`).

## Manejo de errores

Si una app no responde o devuelve error HTTP, el cliente lanza una excepción. Los Server Components la capturan con `try/catch` y muestran un mensaje de error en lugar de romper la página entera.
