# Panel Buyer App

Sección accesible desde `/buyer`. Se conecta a la Buyer App para gestionar los carritos de compra de los usuarios.

## Listado de carritos — `/buyer`

Muestra todos los carritos registrados en la Buyer App con paginación de 20 por página.

**Columnas:** ID · Usuario (nombre, apellido y email si está disponible) · Estado · Subtotal · Fecha de creación.

**Filtros disponibles:**
- **Estado:** `Activo` (`NOT_CHECKED_OUT`) / `Completado` (`CHECKED_OUT`)

La búsqueda y el filtro se aplican via query params (`?status=NOT_CHECKED_OUT&page=2`).

## Detalle de carrito — `/buyer/[id]`

Vista de detalle de un carrito individual. Muestra:

- **Datos del carrito:** ID, estado, subtotal, fechas de creación y actualización.
- **Datos del comprador:** nombre, apellido y email (si el carrito tiene usuario asociado).
- **Tabla de productos:** nombre, variante, cantidad, precio unitario y subtotal por ítem.
- **Panel de acciones** (columna lateral derecha).

## Acciones disponibles

Desde el panel lateral del detalle se puede:

| Acción | Descripción |
|--------|-------------|
| Cambiar estado | Cambia el carrito entre `NOT_CHECKED_OUT` y `CHECKED_OUT` |
| Eliminar carrito | Borra el carrito permanentemente de la Buyer App |

Las acciones se ejecutan mediante Server Actions con `useTransition`. Después de una mutación exitosa se invalida la caché del listado con `revalidatePath('/buyer')`.

## Conexión con la Buyer App

El cliente HTTP está en `app/lib/buyer.ts`. Usa `Authorization: Bearer <CONTROL_PLANE_KEY>` en todos los requests.

| Endpoint consumido | Método | Uso |
|--------------------|--------|-----|
| `/api/carts` | GET | Listado con filtro y paginación |
| `/api/carts/:id` | GET | Detalle de un carrito |
| `/api/carts/:id` | PATCH | Actualizar estado |
| `/api/carts/:id` | DELETE | Eliminar carrito |
