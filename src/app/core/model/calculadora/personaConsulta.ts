export class PersonaConsulta  {
    tipoIdentificacion: string; // "C"
    identificacion: string      // "1234567890"
    tipoConsulta: string        // "CC"
    calificacion:string         // "N"
    constructor(cedula?:string){
      this.tipoIdentificacion = "C";
      this.calificacion = "N";
      this.tipoConsulta = "CC";
      if(cedula){
        this.identificacion = cedula;
      }
    }
  }