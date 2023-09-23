import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Cliente from 'App/Models/Cliente'
import Usuario from 'App/Models/Usuario'
import CreateCustomerValidator from 'App/Validators/CreateCustomerValidator'
import UpdateCustomerValidator from 'App/Validators/UpdateCustomerValidator'
import { DateTime } from 'luxon'

export default class ClientesController {
   public async store({ request, response, auth }: HttpContextContract) {
      const customerPayload = await request.validate(CreateCustomerValidator)

      const user = this.authenticatedUser(auth.user!.codUsuario)

      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const existingCustomer = await Cliente.query()
         .where('des_telefone', customerPayload.des_telefone)
         .first()

      if (existingCustomer)
         throw new BadRequestException(
            'Cliente com o mesmo número de telefone já cadastrado',
            400
         )

      await Cliente.create({
         desNome: customerPayload.des_nome,
         desEndereco: customerPayload.des_endereco,
         numEndereco: customerPayload.num_endereco
            ? customerPayload.num_endereco
            : 'S/N',
         desCidade: customerPayload.des_cidade,
         desUf: customerPayload.des_uf,
         desTelefone: customerPayload.des_telefone,
         desContato: customerPayload.des_contato,
         dtaUltPedido: DateTime.now(),
      })

      return response.created({})
   }

   public async index({ request, response, auth }: HttpContextContract) {
      const user = this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const page = request.input('page', 1)
      const perPage = 10

      const customers = await Cliente.query()
         .orderBy('cod_cliente', 'asc')
         .paginate(page, perPage)

      return response.ok({ customers })
   }

   public async update({ request, response, auth }: HttpContextContract) {
      const user = this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const customerPayload = await request.validate(UpdateCustomerValidator)
      const codCliente = request.param('id')

      const customer = await Cliente.find(codCliente)

      if (!customer)
         throw new BadRequestException('Cliente não encontrado', 404)

      const data: Partial<Cliente> = {
         desNome: customerPayload.des_nome,
         flgInativo: customerPayload.flg_inativo,
         desEndereco: customerPayload.des_endereco,
         numEndereco: customerPayload.num_endereco,
         desCidade: customerPayload.des_cidade,
         desUf: customerPayload.des_uf,
         desTelefone: customerPayload.des_telefone,
         desContato: customerPayload.des_contato,
      }

      const updatedCustomer = await customer.merge({ ...data }).save()

      return response.ok({ customer: updatedCustomer })
   }

   public async destroy({ request, response, auth }: HttpContextContract) {
      const user = this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const codCliente = request.param('id')

      const customer = await Cliente.find(codCliente)

      if (!customer)
         throw new BadRequestException('Cliente não encontrado', 404)

      await customer.delete()

      return response.ok({})
   }

   private authenticatedUser(userId: number) {
      return Usuario.query()
         .where('cod_usuario', userId)
         .andWhere('flg_inativo', '<>', 1)
   }
}
