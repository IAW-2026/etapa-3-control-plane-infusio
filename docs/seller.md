# Panel Seller App

Sección accesible desde `/seller`. Se conecta a la Seller App para gestionar órdenes y productos del marketplace.

La página de entrada (`/seller`) muestra dos tarjetas de acceso rápido a los sub-paneles de Órdenes y Productos.

---

## Órdenes — `/seller/orders`

Listado de todas las órdenes de compra registradas en la Seller App, con paginación de 20 por página.

**Columnas:** ID · Estado · Dirección · Costo de envío · Fecha.

**Filtros disponibles:**
- **Estado:** todos los valores del enum `OrderStatus` de Prisma.

| Valor de la API | Etiqueta |
|-----------------|----------|
| `pending` | Pendiente |
| `payment_confirmed` | Pago confirmado |
| `preparing` | Preparando |
| `dispatched` | Despachada |
| `delivered` | Entregada |
| `cancelled` | Cancelada |

### Detalle de orden — `/seller/orders/[id]`

Muestra la información completa de una orden:

- **Datos de la orden:** ID, estado, costo de envío, total de productos, dirección, fecha, ID de envío e ID de pago.
- **Tabla de productos:** nombre, variante, cantidad, precio unitario y subtotal.
- **Panel de acciones** (columna lateral derecha).

**Acción disponible:** cambiar el estado a cualquier valor del enum. Se selecciona desde un `<select>` y se confirma con un botón. El campo queda deshabilitado hasta que se elija un estado distinto al actual.

---

## Productos — `/seller/products`

Listado de todos los productos del catálogo (activos e inactivos), con paginación de 20 por página.

**Columnas:** Nombre · Categorías · Precio · Stock · Estado (Activo / Inactivo).

**Filtros disponibles:**
- **Búsqueda por nombre** (campo de texto libre).
- **Estado:** Todos / Activos / Inactivos.

### Detalle de producto — `/seller/products/[id]`

Muestra todos los campos del modelo `Product` de Prisma:

- Información principal: nombre, descripción, precio, stock, imagen, unidad, ubicación.
- Categorías y colores disponibles.
- Edición limitada: badge, fecha de disponibilidad.
- Specs (objeto JSON con especificaciones técnicas opcionales).
- Estado: activo o inactivo, con fecha de creación y última actualización.

**Acción disponible:** activar o desactivar el producto con un botón de toggle. El estado se actualiza en la Seller App y se refleja inmediatamente.

---

## Conexión con la Seller App

El cliente HTTP está en `app/lib/seller.ts`. Usa `Authorization: Bearer <SELLER_API_KEY>` en todos los requests. Los endpoints son parte de la API de Control Plane expuesta por la Seller App (prefijo `/api/control/`), separada de la API pública del marketplace.

| Endpoint consumido | Método | Uso |
|--------------------|--------|-----|
| `/api/control/orders` | GET | Listado con filtro y paginación |
| `/api/control/orders/:id` | GET | Detalle de una orden |
| `/api/control/orders/:id` | PATCH | Actualizar estado |
| `/api/control/products` | GET | Listado con búsqueda, filtro y paginación |
| `/api/control/products/:id` | GET | Detalle de un producto |
| `/api/control/products/:id` | PATCH | Activar / desactivar |
