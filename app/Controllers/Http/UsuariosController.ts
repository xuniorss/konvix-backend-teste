import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Usuario from "App/Models/Usuario";

export default class UsuariosController {
   public async index({ request, response }: HttpContextContract) {
      const users = await Usuario.query().select("*");

      return response.ok({ users });
   }
}
