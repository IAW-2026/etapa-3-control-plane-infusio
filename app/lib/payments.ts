const PAYMENTS_URL = process.env.PAYMENTS_APP_URL ?? 'https://proyecto-c-payments-infusio.vercel.app'
const PAYMENTS_API_KEY = process.env.PAYMENTS_API_KEY!

function authHeaders() {
  return { 'x-api-key': PAYMENTS_API_KEY }
}

export interface PaymentOrder {
  id?: string
  order_id?: string
  purchase_order_id?: string
  payment_id?: string
  status?: string
  amount?: number
  total?: number
  currency?: string
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export interface PaymentOrdersResponse {
  orders: PaymentOrder[]
  total: number
  page: number
  totalPages: number
}

function normalizePaymentOrdersResponse(payload: unknown): PaymentOrdersResponse {
  if (Array.isArray(payload)) {
    return {
      orders: payload as PaymentOrder[],
      total: payload.length,
      page: 1,
      totalPages: 1,
    }
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>
    const orders = Array.isArray(record.orders)
      ? (record.orders as PaymentOrder[])
      : Array.isArray(record.data)
        ? (record.data as PaymentOrder[])
        : []

    const total = typeof record.total === 'number' ? record.total : orders.length
    const page = typeof record.page === 'number' ? record.page : 1
    const totalPages = typeof record.totalPages === 'number'
      ? record.totalPages
      : Math.max(1, Math.ceil(total / Math.max(1, orders.length || 5)))

    return { orders, total, page, totalPages }
  }

  throw new Error('Payments API returned an unexpected response')
}

export async function getPaymentOrders(params: {
  page?: number
  limit?: number
} = {}): Promise<PaymentOrdersResponse> {
  const url = new URL('/api/payments/orders', PAYMENTS_URL)

  if (params.page) url.searchParams.set('page', String(params.page))
  if (params.limit) url.searchParams.set('limit', String(params.limit))

  const res = await fetch(url.toString(), { cache: 'no-store', headers: authHeaders() })
  if (!res.ok) throw new Error(`Payments API ${res.status}`)

  return normalizePaymentOrdersResponse(await res.json())
}