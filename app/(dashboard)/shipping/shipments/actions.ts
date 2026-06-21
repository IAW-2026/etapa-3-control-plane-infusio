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
		if (currentStatus === 'DELIVERED') {
			return { error: 'No se puede modificar un shipment entregado.' }
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