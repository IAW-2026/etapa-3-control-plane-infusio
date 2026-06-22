'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { updateOrder } from '@/app/lib/seller'

export async function updateOrderStatusAction(
  orderId: string,
  status: string,
): Promise<{ error?: string }> {
  const { userId } = await auth()
  if (!userId) return { error: 'No autenticado.' }

  try {
    await updateOrder(orderId, { status })
    revalidatePath(`/seller/orders/${orderId}`)
    revalidatePath('/seller/orders')
    return {}
  } catch {
    return { error: 'No se pudo actualizar el estado.' }
  }
}
