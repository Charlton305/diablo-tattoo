export async function verifyTinaToken(token: string, clientId: string): Promise<boolean> {
  const res = await fetch(
    `https://identity.tinajs.io/v2/apps/${clientId}/currentUser`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
    },
  )
  if (!res.ok) return false
  const user: any = await res.json()
  return user.verified === true
}
