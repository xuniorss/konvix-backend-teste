import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Cliente from 'App/Models/Cliente'
import Usuario from 'App/Models/Usuario'
import Venda from 'App/Models/Venda'
import CreateCouponValidator from 'App/Validators/CreateCouponValidator'

export default class VendasController {
   public async store({ request, response, auth }: HttpContextContract) {
      const couponPayload = await request.validate(CreateCouponValidator)

      const user = await this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const customer = this.customerActive(parseInt(couponPayload.cod_cliente))

      if (!customer)
         throw new BadRequestException('Cliente não encontrado', 404)

      const sale = await Venda.create({
         codCliente: parseInt(couponPayload.cod_cliente),
         dtaVenda: couponPayload.dta_venda,
         valTotalVenda: 0,
      })

      return response.created(sale)
   }

   public async destroy({ request, response, auth }: HttpContextContract) {
      const user = this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const codVenda = request.param('saleId')

      const sale = await Venda.find(codVenda)

      if (!sale) throw new BadRequestException('Venda não encontrada', 404)

      await sale.delete()

      return response.ok({})
   }

   private authenticatedUser(userId: number) {
      return Usuario.query()
         .where('cod_usuario', userId)
         .andWhere('flg_inativo', '<>', 1)
   }

   private customerActive(customerId: number) {
      return Cliente.query()
         .where('cod_cliente', customerId)
         .andWhere('flg_inativo', '<>', 1)
   }
}
