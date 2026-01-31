import axios from 'axios'

export const rajaOngkir = axios.create({
  baseURL: process.env.RAJAONGKIR_BASE_URL,
  headers: {
    key: process.env.RAJAONGKIR_API_KEY!,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 10000
})
