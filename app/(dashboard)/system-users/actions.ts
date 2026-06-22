'use server'

import { clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

type PublicMetadata = {
  roles?: string[] | string | null
}

type ClerkUser = {
  publicMetadata?: PublicMetadata
}

function normalizeRoles(value: PublicMetadata['roles']) {
  const rawRoles = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  return rawRoles
    .map((role) => role.toLowerCase().replace(/\s+/g, '_'))
    .filter((role, index, roles) => roles.indexOf(role) === index)
}

export async function deleteSystemUserAction(userId: string) {
  const client = await clerkClient()
  await client.users.deleteUser(userId)
  revalidatePath('/system-users')
}

export async function setSystemUserRoleAction(userId: string, role: string) {
  const client = await clerkClient()
  const user = (await client.users.getUser(userId)) as ClerkUser
  const currentRoles = normalizeRoles(user.publicMetadata?.roles)
  const nextRoles = Array.from(new Set([...currentRoles, role]))

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      roles: nextRoles,
    },
  })

  revalidatePath('/system-users')
}

export async function clearSystemUserRolesAction(userId: string) {
  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      roles: [],
    },
  })

  revalidatePath('/system-users')
}