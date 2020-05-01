import { Provincia } from "./Provincia";
import { Canton } from "./Canton";
import { Parroquia } from "./Parroquia";
export class TbQoAgencia {
    id: string;
    direccionAgencia: string;
    nombreAgencia: string;
    canton: Canton[];
    parroquia: Parroquia[];
    provincia: Provincia[];
    tbQoCreditoNegociacions: null
    constructor(){
    }
    
}