import { Canton } from './Canton';

export class Parroquia {    
        id: string;
        codigoCanton: string;
        codigoParroquia: string;
        codigoProvincia : string;
        estado: string;
        nombreParroquia: string;
        canton: Canton;
        constructor(){
                this.canton = new Canton();
        }
}