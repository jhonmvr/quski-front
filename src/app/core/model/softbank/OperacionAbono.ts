import { Rubros } from './Rubros'

export class OperacionAbono  {
    numeroOperacion: string         // "2020001984",
    idAgencia: string               // "2",
    codigoUsuario: string           // "ADMIN",
    idTipoIdentificacion: number    // 1,
    identificacion: string          // "1311066441",
    nombreCliente: string           // "PABLO RAFAEL VÉLEZ FRANCO",
    rubros: Rubros[]
    constructor(){
        this.rubros = new Array<Rubros>();
    }
}