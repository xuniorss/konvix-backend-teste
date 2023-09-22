import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Usuario from 'App/Models/Usuario'
import FormattedResponse from '../../../lib/FormattedResponse'

export default class SessionsController {
   public async store({ request, response, auth }: HttpContextContract) {
      try {
         const { des_email, des_senha } = request.only([
            'des_email',
            'des_senha',
         ])

         const user = await Usuario.query()
            .where('des_email', des_email)
            .andWhere('flg_inativo', '<>', 1)
            .first()

         if (!user)
            return response.unauthorized(
               FormattedResponse.errorMessage(
                  'Usuário não encontrado ou inativo.'
               )
            )

         const token = await auth
            .use('api')
            .attempt(des_email, des_senha, { expiresIn: '7 days' })

         const expires = Number(token.expiresAt)

         return response.created({ user, token, expires })
      } catch (error) {
         if (error.message === 'E_INVALID_AUTH_PASSWORD: Password mis-match')
            return response.unauthorized(
               FormattedResponse.errorMessage('E-mail ou Senha incorretos.')
            )

         return response.internalServerError(
            FormattedResponse.error(error.messages.error, error.message)
         )
      }
   }
}
