import { Provincia } from './Provincia';

export class Canton {
    id: string;
    codigoCanton: string;
    codigoProvincia: string;
    estado: string;
    nombreCanton: string;
    provincia: Provincia;
    constructor(){
        //this.provincia = new Provincia()[];
    }
}