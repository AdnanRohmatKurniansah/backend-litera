import axios from 'axios'
import { RAJAONGKIR_API_KEY, RAJAONGKIR_BASE_URL } from '../config'

export const rajaOngkir = axios.create({
  baseURL: RAJAONGKIR_BASE_URL,
  headers: {
    key: RAJAONGKIR_API_KEY!,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 10000
})
