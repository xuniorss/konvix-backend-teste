import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Cliente from 'App/Models/Cliente'
import Usuario from 'App/Models/Usuario'
import CreateCustomerValidator from 'App/Validators/CreateCustomerValidator'
import { DateTime } from 'luxon'

export default class ClientesController {
   public async store({ request, response, auth }: HttpContextContract) {
      const customerPayload = await request.validate(CreateCustomerValidator)

      const user = await Usuario.query()
         .where('cod_usuario', auth.user!.codUsuario)
         .andWhere('flg_inativo', '<>', 1)

      if (!user) throw new BadRequestException('Usuário não encontrado', 404)

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
}
