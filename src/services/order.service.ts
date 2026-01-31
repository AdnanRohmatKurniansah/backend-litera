import { rajaOngkir } from '../lib/rajaongkir'
import { GetCostType } from '../validations/order.validation'

export const CalculateShippingCost = async (payload: GetCostType) => {
  const response = await rajaOngkir.post('/calculate/domestic-cost', {
    origin: payload.origin,
    destination: payload.destination,
    weight: payload.weight,
    courier: payload.courier
  })

  return response.data
}
