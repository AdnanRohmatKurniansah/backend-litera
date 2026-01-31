import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import { ChangePrimary, Create, Delete, GetAll, GetById, Update } from '../controllers/address.controller'

export const AddressRoute: Router = Router()

// Protected Routes
AddressRoute.use(userAuthenticate)

AddressRoute.get('/', GetAll)
AddressRoute.get('/:addressId', GetById)
AddressRoute.post('/create', Create)
AddressRoute.put('/change-primary/:addressId', ChangePrimary)
AddressRoute.put('/update/:addressId', Update)
AddressRoute.delete('/delete/:addressId', Delete)
