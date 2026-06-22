'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const CLERK_API_URL = process.env.CLERK_API_URL ?? 'https://api.clerk.com'
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY

function clerkHeaders() {
  if (!CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY no está configurada')
  }

  return {
    Authorization: `Bearer ${CLERK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  }
}

async function updateClerkUser(userId: string, body: Record<string, unknown>) {
  const response = await fetch(`${CLERK_API_URL}/v1/users/${userId}`, {
    method: 'PATCH',
    headers: clerkHeaders(),
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Clerk API ${response.status}`)
  }

  return response.json()
}

export async function deleteSystemUserAction(userId: string) {
  if (!CLERK_SECRET_KEY) {
    throw new Error('CLERK_SECRET_KEY no está configurada')
  }

  const client = await clerkClient()
  await client.users.deleteUser(userId)
  revalidatePath('/system-users')
}

export async function setSystemUserRoleAction(userId: string, role: string) {
  await updateClerkUser(userId, {
    public_metadata: {
      roles: [role],
    },
  })

  revalidatePath('/system-users')
}

export async function clearSystemUserRolesAction(userId: string) {
  await updateClerkUser(userId, {
    public_metadata: {
      roles: [],
    },
  })

  revalidatePath('/system-users')
}