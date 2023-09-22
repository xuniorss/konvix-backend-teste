import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Usuario from 'App/Models/Usuario'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsuariosController {
   public async store({ request, response }: HttpContextContract) {
      const userPayload = await request.validate(CreateUserValidator)

      const userByEmail = await Usuario.findBy(
         'des_email',
         userPayload.des_email
      )

      if (userByEmail) throw new BadRequestException('E-mail já em uso.', 409)

      const user = await Usuario.create({
         desEmail: userPayload.des_email,
         password: userPayload.des_senha,
      })

      return response.created({ user })
   }
}
