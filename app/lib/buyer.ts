const BUYER_URL = process.env.BUYER_APP_URL!
const BUYER_API_KEY = process.env.BUYER_API_KEY!

function authHeaders() {
  return { Authorization: `Bearer ${BUYER_API_KEY}` }
}

export interface CartItem {
  id: string
  cartId?: string
  productId: string
  productName: string
  productVariant?: string | null
  productImageUrl?: string | null
  priceAtTime: number
  quantity: number
}

export interface CartUser {
  id: string
  name: string
  lastName: string
  email: string
}

export interface Cart {
  id: string
  userId: string
  status: string
  subtotal: number | null
  createdAt: string
  updatedAt: string
  user?: CartUser
  items?: CartItem[]
}

export interface CartsResponse {
  carts: Cart[]
  total: number
  page: number
  totalPages: number
}

export async function getCarts(params: {
  userId?: string
  status?: string
  page?: number
  limit?: number
} = {}): Promise<CartsResponse> {
  const url = new URL('/api/control/carts', BUYER_URL)
  if (params.userId) url.searchParams.set('userId', params.userId)
  if (params.status) url.searchParams.set('status', params.status)
  if (params.page) url.searchParams.set('page', String(params.page))
  if (params.limit) url.searchParams.set('limit', String(params.limit))

  const res = await fetch(url.toString(), { cache: 'no-store', headers: authHeaders() })
  if (!res.ok) throw new Error(`Buyer API ${res.status}`)
  return res.json()
}

export async function getCart(id: string): Promise<{ cart: Cart }> {
  const res = await fetch(`${BUYER_URL}/api/control/carts/${id}`, {
    cache: 'no-store',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`Buyer API ${res.status}`)
  return res.json()
}

export async function updateCart(id: string, data: { status?: string }): Promise<{ cart: Cart }> {
  const res = await fetch(`${BUYER_URL}/api/control/carts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`Buyer API ${res.status}`)
  return res.json()
}

export async function deleteCart(id: string): Promise<{ ok: boolean }> {
  const res = await fetch(`${BUYER_URL}/api/control/carts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error(`Buyer API ${res.status}`)
  return res.json()
}
