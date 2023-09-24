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

      const codVenda = request.param('saleId')

      const qtdItens = parseInt(itemPayload.qtd_itens)
      const valUnitario = parseFloat(itemPayload.val_unitario.replace(',', '.'))

      const user = await this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      if (qtdItens === 0)
         throw new BadRequestException(
            'A quantidade de itens não pode ser zero',
            400
         )

      if (valUnitario < 0)
         throw new BadRequestException(
            'O valor não pode ser menor que zero',
            400
         )

      const openedSale = await Venda.find(codVenda)

      if (!openedSale)
         throw new BadRequestException('Venda não encontrada', 404)

      const valTotalItem = qtdItens * valUnitario

      const data: Partial<VendaItem> = {
         codVenda,
         desProduto: itemPayload.des_produto.trim(),
         valUnitario,
         qtdItens,
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

   public async indexSaleItem({
      request,
      response,
      auth,
   }: HttpContextContract) {
      const user = this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const codCliente = request.param('customerId')
      const codVenda = request.param('saleId')

      const customer = await Cliente.find(codCliente)

      if (!customer)
         throw new BadRequestException('Cliente não encontrado', 404)

      const items = await VendaItem.query().where('cod_venda', codVenda)

      return response.ok({ items, length: items.length })
   }

   public async storeEndSale({ request, response, auth }: HttpContextContract) {
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

   public async destroyByItem({
      request,
      response,
      auth,
   }: HttpContextContract) {
      const user = this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const codVenda = request.param('saleId')
      const itemId = request.param('itemId')

      const item = await VendaItem.query()
         .where('cod_venda', codVenda)
         .andWhere('cod_item', itemId)
         .first()

      if (!item) throw new BadRequestException('Item não encontrado', 404)

      await item.delete()

      return response.ok({})
   }

   private authenticatedUser(userId: number) {
      return Usuario.query()
         .where('cod_usuario', userId)
         .andWhere('flg_inativo', '<>', 1)
   }
}
