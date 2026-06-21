'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { updateCart, deleteCart } from '@/app/lib/buyer'

export async function updateCartStatusAction(
  cartId: string,
  status: string,
): Promise<{ error?: string }> {
  const { userId } = await auth()
  if (!userId) return { error: 'No autenticado.' }

  try {
    await updateCart(cartId, { status })
    revalidatePath(`/buyer/${cartId}`)
    revalidatePath('/buyer')
    return {}
  } catch {
    return { error: 'No se pudo actualizar el estado.' }
  }
}

export async function deleteCartAction(cartId: string): Promise<{ error?: string }> {
  const { userId } = await auth()
  if (!userId) return { error: 'No autenticado.' }

  try {
    await deleteCart(cartId)
  } catch {
    return { error: 'No se pudo eliminar el carrito.' }
  }

  revalidatePath('/buyer')
  redirect('/buyer')
}
