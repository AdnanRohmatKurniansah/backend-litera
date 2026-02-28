import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const verifyGoogleToken = async (id_token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()
  if (!payload?.email) throw new Error('Invalid Google token')
  return {
    email: payload.email,
    name: payload.name ?? payload.email.split('@')[0],
    picture: payload.picture,
  }
}

export const verifyGoogleAccessToken = async (access_token: string) => {
  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  if (!res.ok) throw new Error('Invalid Google access token')
  const data = await res.json() as { email: string; name?: string; picture?: string }
  if (!data.email) throw new Error('Email not found')
  return {
    email: data.email,
    name: data.name ?? data.email.split('@')[0],
    picture: data.picture,
  }
}