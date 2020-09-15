import { identifierModuleUrl } from '@angular/compiler';

export class ConsultaCliente {
  idTipoIdentificacion: number;  // 1,
  identificacion: string;  // 1311066441,
  constructor( cedula?: string ) {
    if(cedula){
      this.identificacion = cedula;
    }
    this.idTipoIdentificacion = 1;
   }
}