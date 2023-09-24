/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
   return { hello: 'world' }
})

Route.post('/create-account', 'UsuariosController.store')
Route.post('/create-session', 'SessionsController.store')

Route.group(() => {
   Route.delete('/destroy-session', 'SessionsController.destroy')

   Route.post('/create-customer', 'ClientesController.store')
   Route.get('/customers', 'ClientesController.index')
   Route.get('/customers/all', 'ClientesController.indexAll')
   Route.put('/customer/:id', 'ClientesController.update')
   Route.delete('/customer/:id', 'ClientesController.destroy')

   Route.post('/create-coupon', 'VendasController.store')
   Route.delete('/destroy-coupon/:saleId', 'VendasController.destroy')

   Route.post('/add-item/:saleId', 'VendaItensController.store')
   Route.get(
      '/sale-item/:customerId/:saleId',
      'VendaItensController.indexSaleItem'
   )
   Route.post('/end-sale/:customerId', 'VendaItensController.storeEndSale')
}).middleware('auth')
