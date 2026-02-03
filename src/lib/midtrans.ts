import midtransClient from 'midtrans-client'

export const snap = new midtransClient.Snap({
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!
})
