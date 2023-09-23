import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

export default class UpdateCustomerValidator {
   constructor(protected ctx: HttpContextContract) {}

   /*
    * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
    *
    * For example:
    * 1. The username must be of data type string. But then also, it should
    *    not contain special characters or numbers.
    *    ```
    *     schema.string({}, [ rules.alpha() ])
    *    ```
    *
    * 2. The email must be of data type string, formatted as a valid
    *    email. But also, not used by any other user.
    *    ```
    *     schema.string({}, [
    *       rules.email(),
    *       rules.unique({ table: 'users', column: 'email' }),
    *     ])
    *    ```
    */
   public schema = schema.create({
      des_nome: schema.string.optional({}, [rules.minLength(1)]),
      flg_inativo: schema.boolean.optional(),
      des_endereco: schema.string.optional({}, [rules.minLength(1)]),
      num_endereco: schema.string.nullableAndOptional({}),
      des_cidade: schema.string.optional({}, [rules.minLength(1)]),
      des_uf: schema.string.optional({}, [rules.maxLength(2)]),
      des_telefone: schema.string.optional({}, [rules.minLength(1)]),
      des_contato: schema.string.optional({}, [rules.minLength(1)]),
   })

   /**
    * Custom messages for validation failures. You can make use of dot notation `(.)`
    * for targeting nested fields and array expressions `(*)` for targeting all
    * children of an array. For example:
    *
    * {
    *   'profile.username.required': 'Username is required',
    *   'scores.*.number': 'Define scores as valid numbers'
    * }
    *
    */
   public messages: CustomMessages = {}
}
