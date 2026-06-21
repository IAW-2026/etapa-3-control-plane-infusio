'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const shippingAppUrl =
	process.env.SHIPPING_APP_URL ?? 'https://proyecto-c-shipping-infusio.vercel.app'
const shippingApiKey = process.env.SHIPPING_API_KEY!

function authHeaders() {
	return { Authorization: `Bearer ${shippingApiKey}` }
}

export async function updateShipmentStatusAction(
	shippingId: string,
	status: string,
): Promise<{ error?: string }> {
	const { userId } = await auth()
	if (!userId) return { error: 'No autenticado.' }

	try {
		const shipmentsRes = await fetch(new URL('/api/control-plane/shipments', shippingAppUrl), {
			cache: 'no-store',
			headers: authHeaders(),
		})

		if (!shipmentsRes.ok) {
			return { error: 'No se pudo validar el shipment.' }
		}

		const shipmentsData = (await shipmentsRes.json()) as {
			shipments?: Array<{
				id: string
				Tracking: Array<{ status: string }>
			}>
		}

		const shipment = shipmentsData.shipments?.find((item) => item.id === shippingId)
		const currentStatus = shipment?.Tracking[shipment.Tracking.length - 1]?.status
		if (currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED') {
			return { error: 'No se puede modificar un shipment entregado o cancelado.' }
		}

		const res = await fetch(`${shippingAppUrl}/api/shipping/status-update/${shippingId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', ...authHeaders() },
			body: JSON.stringify({ status }),
		})

		if (!res.ok) {
			return { error: 'No se pudo actualizar el estado.' }
		}

		revalidatePath('/shipping/shipments')
		revalidatePath('/shipping/metrics')
		revalidatePath('/shipping')
		return {}
	} catch {
		return { error: 'No se pudo actualizar el estado.' }
	}
}

export async function createShipmentAction(formData: FormData): Promise<{ error?: string }> {
	const { userId } = await auth()
	if (!userId) return { error: 'No autenticado.' }

	const orderId = String(formData.get('order_id') ?? '').trim()
	const sellerId = String(formData.get('seller_id') ?? '').trim()
	const buyerId = String(formData.get('buyer_id') ?? '').trim()
	const originAddress = String(formData.get('origin_address_address') ?? '').trim()
	const originPostalCode = String(formData.get('origin_address_postal_code') ?? '').trim()
	const destinationAddress = String(formData.get('destination_address_address') ?? '').trim()
	const destinationPostalCode = String(formData.get('destination_address_postal_code') ?? '').trim()

	if (
		!orderId ||
		!sellerId ||
		!buyerId ||
		!originAddress ||
		!originPostalCode ||
		!destinationAddress ||
		!destinationPostalCode
	) {
		return { error: 'Completá todos los campos para crear el envío.' }
	}

	try {
		const res = await fetch(`${shippingAppUrl}/api/shipping`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...authHeaders() },
			body: JSON.stringify({
				order_id: orderId,
				seller_id: sellerId,
				buyer_id: buyerId,
				destination_address: {
					address: destinationAddress,
					postal_code: destinationPostalCode,
				},
				origin_address: {
					address: originAddress,
					postal_code: originPostalCode,
				},
			}),
		})

		if (!res.ok) {
			return { error: 'No se pudo crear el envío.' }
		}

		revalidatePath('/shipping/shipments')
		revalidatePath('/shipping/metrics')
		revalidatePath('/shipping')
		return {}
	} catch {
		return { error: 'No se pudo crear el envío.' }
	}
}