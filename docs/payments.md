# Panel Payments App

Sección accesible desde `/payments`. Consume `GET ${PAYMENTS_APP_URL}/api/payments/orders` y lista las órdenes de pago con paginación de 5 registros por página.

## Vista

- Página: `/payments`
- Fuente de datos: `app/lib/payments.ts`
- Paginación: 5 órdenes por página

Cada orden se renderiza en una tarjeta con todos los campos devueltos por la API para no perder información si el contrato cambia.
