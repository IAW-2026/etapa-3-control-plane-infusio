'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { updateProduct } from '@/app/lib/seller'

export async function toggleProductAction(
  productId: string,
  isActive: boolean,
): Promise<{ error?: string }> {
  const { userId } = await auth()
  if (!userId) return { error: 'No autenticado.' }

  try {
    await updateProduct(productId, { isActive })
    revalidatePath(`/seller/products/${productId}`)
    revalidatePath('/seller/products')
    return {}
  } catch {
    return { error: 'No se pudo actualizar el producto.' }
  }
}
