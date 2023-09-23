import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Venda from './Venda'

export default class VendaItem extends BaseModel {
   @column({ isPrimary: true, columnName: 'cod_item' })
   public codItem: number

   @column({ columnName: 'cod_venda' })
   public codVenda: number

   @column({ columnName: 'des_produto' })
   public desProduto: string

   @column({ columnName: 'val_unitario' })
   public valUnitario: number

   @column({ columnName: 'qtd_itens' })
   public qtdItens: number

   @column({ columnName: 'val_total' })
   public valTotal: number

   @column.dateTime({ autoCreate: true, columnName: 'dta_cadastro' })
   public dtaCadastro: DateTime

   @belongsTo(() => Venda, { foreignKey: 'codVenda' })
   public venda: BelongsTo<typeof Venda>

   public static table = 'venda_item'
}
