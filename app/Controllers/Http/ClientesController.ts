import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Cliente from 'App/Models/Cliente'
import Usuario from 'App/Models/Usuario'
import CreateCustomerValidator from 'App/Validators/CreateCustomerValidator'
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
         numEndereco: customerPayload.num_endereco,
         desCidade: customerPayload.des_cidade,
         desUf: customerPayload.des_uf,
         desTelefone: customerPayload.des_telefone,
         desContato: customerPayload.des_contato,
         dtaUltPedido: DateTime.now(),
      })

      return response.created({})
   }

   public async index({ response, auth }: HttpContextContract) {
      const user = this.authenticatedUser(auth.user!.codUsuario)
      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

      const customers = await Cliente.all()

      return response.ok({ customers, length: customers.length })
   }

   private authenticatedUser(userId: number) {
      return Usuario.query()
         .where('cod_usuario', userId)
         .andWhere('flg_inativo', '<>', 1)
   }
}
