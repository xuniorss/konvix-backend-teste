import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class Usuario extends BaseModel {
   @column({ isPrimary: true, columnName: 'cod_usuario' })
   public codUsuario: number

   @column({ columnName: 'des_email' })
   public desEmail: string

   @column({ serializeAs: null, columnName: 'des_senha' })
   public password: string

   @column({ columnName: 'flg_inativo' })
   public flgInativo: number

   public static table = 'usuario'

   @beforeSave()
   public static async hashPassword(usuario: Usuario) {
      if (usuario.$dirty.password) {
         usuario.password = await Hash.make(usuario.password)
      }
   }
}
