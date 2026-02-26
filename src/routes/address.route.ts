import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import { ChangePrimary, Create, Delete, GetAll, GetById, GetCities, GetDistricts, GetProvinces, Update } from '../controllers/address.controller'
import { CalculateShippingCost } from '../services/order.service'

export const AddressRoute: Router = Router()

// Protected Routes
AddressRoute.use(userAuthenticate)

AddressRoute.get('/', GetAll)

AddressRoute.get('/province', GetProvinces)
AddressRoute.get('/city/:provinceId', GetCities)
AddressRoute.get('/district/:cityId', GetDistricts)
AddressRoute.post('/cost', CalculateShippingCost)

AddressRoute.get('/:addressId', GetById)
AddressRoute.post('/create', Create)
AddressRoute.put('/change-primary/:addressId', ChangePrimary)
AddressRoute.put('/update/:addressId', Update)
AddressRoute.delete('/delete/:addressId', Delete)
