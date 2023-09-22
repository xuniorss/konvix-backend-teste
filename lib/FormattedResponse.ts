interface FormattedResponseInterface {
   success: boolean
   message?: string
   data?: any
   count?: number
   errors?: Error
   url?: string
   token?: string
}

class FormattedResponse {
   /**
    * Monta resposta negativa com mensagem
    *
    * Mounts negative response
    * @param {type} message
    * @return array
    */

   public static errorMessage(message: string): FormattedResponseInterface {
      const response = { success: false, message }
      return response
   }

   /**
    * Monta resposta negativa
    *
    * Mounts negative response
    * @param {type} message
    * @return array
    */
   public static error(e: any, message: string): FormattedResponseInterface {
      const response = {
         success: false,
         message,
         errors: e,
      }
      return response
   }
}

export default FormattedResponse
