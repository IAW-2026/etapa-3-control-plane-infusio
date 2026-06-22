const SELLER_URL = process.env.SELLER_APP_URL!
const SELLER_API_KEY = process.env.SELLER_API_KEY!

function authHeaders() {
  return { Authorization: `Bearer ${SELLER_API_KEY}` }
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  product_name: string
  product_variant: string | null
  product_image_url: string | null
  price_at_time: number
  quantity: number
}

export interface Order {
  purchase_order_id: string
  user_id: string
  shopping_cart_id: string
  status: string
  created_at: string
  shipping_id: string | null
  payment_id: string | null
  payment_url: string
  shipping_cost: number
  currency: string
  address: string | { street: string; city: string }
  cart_items: CartItem[]
  total?: number
}

export interface OrdersResponse {
  orders: Order[]
  total: number
  page: number
  totalPages: number
}

export interface Product {
  id: string
  sellerId?: string | null
  name: string
  description?: string | null
  price: number
  stock: number
  imageUrl?: string | null
  categories: string[]
  unit?: string | null
  location?: string | null
  isLimitedEdition: boolean
  badge?: string | null
  availableUntil?: string | null
  colors: string[]
  specs?: Record<string, unknown> | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export async function getOrders(params: {
  status?: string
  userId?: string
  page?: number
  limit?: number
} = {}): Promise<OrdersResponse> {
  const url = new URL('/api/control/orders', SELLER_URL)
  if (params.status) url.searchParams.set('status', params.status)
  if (params.userId) url.searchParams.set('userId', params.userId)
  if (params.page) url.searchParams.set('page', String(params.page))
  if (params.limit) url.searchParams.set('limit', String(params.limit))

  const res = await fetch(url.toString(), { cache: 'no-store', headers: authHeaders() })
  if (!res.ok) throw new Error(`Seller API ${res.status}`)
  return res.json()
}

export async function getOrder(id: string): Promise<{ order: Order }> {
  const res = await fetch(`${SELLER_URL}/api/control/orders/${id}`, {
    cache: 'no-store',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`Seller API ${res.status}`)
  return res.json()
}

export async function updateOrder(id: string, data: { status: string }): Promise<{ order: Order }> {
  const res = await fetch(`${SELLER_URL}/api/control/orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Seller API ${res.status}`)
  return res.json()
}

export async function getProducts(params: {
  search?: string
  active?: boolean
  page?: number
  limit?: number
} = {}): Promise<ProductsResponse> {
  const url = new URL('/api/control/products', SELLER_URL)
  if (params.search) url.searchParams.set('search', params.search)
  if (params.active !== undefined) url.searchParams.set('active', String(params.active))
  if (params.page) url.searchParams.set('page', String(params.page))
  if (params.limit) url.searchParams.set('limit', String(params.limit))

  const res = await fetch(url.toString(), { cache: 'no-store', headers: authHeaders() })
  if (!res.ok) throw new Error(`Seller API ${res.status}`)
  return res.json()
}

export async function getProduct(id: string): Promise<{ product: Product }> {
  const res = await fetch(`${SELLER_URL}/api/control/products/${id}`, {
    cache: 'no-store',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`Seller API ${res.status}`)
  return res.json()
}

export async function updateProduct(
  id: string,
  data: { isActive?: boolean },
): Promise<{ product: Product }> {
  const res = await fetch(`${SELLER_URL}/api/control/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Seller API ${res.status}`)
  return res.json()
}
