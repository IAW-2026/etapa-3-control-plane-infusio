# Panel Shipping App

Sección accesible desde `/shipping`. Se conecta a la Shipping App para consultar y gestionar los envíos del marketplace.

> **Estado:** pendiente de implementación. La conexión con la Shipping App aún no está construida en el Control Plane. La variable de entorno `SHIPPING_API_KEY` ya está configurada para cuando se agregue.

## Funcionalidades previstas

- Listado de envíos con filtro por estado.
- Detalle de envío: datos del paquete, dirección de destino, estado de seguimiento.
- Acciones: actualizar estado del envío.

## Conexión con la Shipping App

El cliente HTTP irá en `app/lib/shipping.ts`. Usará `Authorization: Bearer <SHIPPING_API_KEY>` en todos los requests.

**URL base:** `SHIPPING_APP_URL=https://proyecto-c-shipping-infusio.vercel.app`
