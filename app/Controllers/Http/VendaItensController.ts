import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Cliente from 'App/Models/Cliente'
import Usuario from 'App/Models/Usuario'
import Venda from 'App/Models/Venda'
import VendaItem from 'App/Models/VendaItem'
import CreateVendaItemValidator from 'App/Validators/CreateVendaItemValidator'

export default class VendaItensController {
   public async store({ request, response, auth }: HttpContextContract) {
      const itemPayload = await request.validate(CreateVendaItemValidator)

      const user = await this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      if (itemPayload.qtd_itens === 0)
         throw new BadRequestException(
            'A quantidade de itens não pode ser zero',
            400
         )

      const openedSale = await Venda.find(itemPayload.cod_venda)

      if (!openedSale)
         throw new BadRequestException('Venda não encontrada', 404)

      const valTotalItem = itemPayload.qtd_itens * itemPayload.val_unitario

      const data: Partial<VendaItem> = {
         codVenda: itemPayload.cod_venda,
         desProduto: itemPayload.des_produto,
         valUnitario: itemPayload.val_unitario,
         qtdItens: itemPayload.qtd_itens,
         valTotal: valTotalItem,
      }

      await VendaItem.create(data)

      const items = await VendaItem.query().where(
         'cod_venda',
         openedSale.codVenda
      )

      const valTotalVenda = items.reduce(
         (prev, curr) => prev + curr.valUnitario * curr.qtdItens,
         0
      )

      openedSale.valTotalVenda = valTotalVenda
      await openedSale.save()

      return response.created({ data, valTotalVenda })
   }

   public async endSale({ request, response, auth }: HttpContextContract) {
      const user = this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const codCliente = request.param('customerId')

      const customer = await Cliente.find(codCliente)

      if (!customer)
         throw new BadRequestException('Cliente não encontrado', 404)

      const sales = await customer.related('vendas').query()

      const valVendaAcc = sales.reduce(
         (prev, curr) => prev + curr.valTotalVenda,
         0
      )

      const qtdVendaAcc = sales.length

      const ultVenda = sales.reverse()[0].dtaVenda

      customer.valVendaAcumulado = valVendaAcc
      customer.qtdVendaPedidos = qtdVendaAcc
      customer.dtaUltPedido = ultVenda

      customer.save()

      return response.ok({})
   }

   private authenticatedUser(userId: number) {
      return Usuario.query()
         .where('cod_usuario', userId)
         .andWhere('flg_inativo', '<>', 1)
   }
}