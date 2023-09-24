import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Cliente from './Cliente'

export default class Venda extends BaseModel {
   @column({ isPrimary: true, columnName: 'cod_venda' })
   public codVenda: number

   @column({ columnName: 'cod_cliente' })
   public codCliente: number

   @column.date({ columnName: 'dta_venda' })
   public dtaVenda: DateTime

   @column({ columnName: 'val_total_venda' })
   public valTotalVenda: number

   @belongsTo(() => Cliente, { foreignKey: 'codCliente' })
   public cliente: BelongsTo<typeof Cliente>

   public static table = 'venda'
}
