import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Cliente extends BaseModel {
   @column({ isPrimary: true, columnName: 'cod_cliente' })
   public codCliente: number

   @column({ columnName: 'des_nome' })
   public desNome: string

   @column({ columnName: 'flg_inativo' })
   public flgInativo: number

   @column({ columnName: 'des_endereco' })
   public desEndereco: string

   @column({ columnName: 'num_endereco' })
   public numEndereco: string | null

   @column({ columnName: 'des_cidade' })
   public desCidade: string

   @column({ columnName: 'des_uf' })
   public desUf: string

   @column({ columnName: 'des_telefone' })
   public desTelefone: string

   @column({ columnName: 'des_contato' })
   public desContato: string

   @column({ columnName: 'val_venda_acumulado' })
   public valVendaAcumulado: number

   @column({ columnName: 'qtd_venda_pedidos' })
   public qtdVendaPedidos: number

   @column.dateTime({ columnName: 'dta_ult_pedido' })
   public dtaUltPedido: DateTime

   @column.dateTime({ autoCreate: true, columnName: 'dta_cadastro' })
   public createdAt: DateTime

   @column.dateTime({
      autoCreate: true,
      autoUpdate: true,
      columnName: 'dta_alteracao',
   })
   public updatedAt: DateTime

   public static table = 'cliente'
}
