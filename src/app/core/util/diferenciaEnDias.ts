import { DatePipe } from '@angular/common';

export class diferenciaEnDias{
    private fechaInicio : Date;
    private fechaFin : Date;
    constructor(fechaInicio?:Date,fechaFin?:Date){
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }

    obtenerDias(){
        let diferencia = this.fechaFin.getTime() - this.fechaInicio.getTime();
        return diferencia /(1000*60*60*24) ;
        
    }

     convertirStringAFecha(fecha:string){
        if(fecha){
            let pipe = new DatePipe('en-US');
            let fechaI = pipe.transform(fecha, 'yyyy-MM-dd');
            var fechaInicio = fechaI.split("-");
            if(fechaInicio.length>=2){
                let fechadesde = new Date(Number.parseInt(fechaInicio[0]), Number.parseInt(fechaInicio[1])-1,Number.parseInt( fechaInicio[2]));
                return fechadesde;
            }
           
        }
       
    }

     convertirFechaAString(fecha:Date){
        if(fecha){
            let dia:string = fecha.getDate().toString();
            let mes:string =(fecha.getMonth()+1).toString();
            let ano = fecha.getFullYear();

            if((fecha.getMonth()+1)<10){
                mes="0"+mes;
                
            }
            if(fecha.getDate()<10){
                dia="0"+dia;
            }

            return ano+"-"+mes+"-"+dia;
        }
    }
     convertirFechaAStringDiaMesYear(fecha:Date){
        if(fecha){
            let dia:string = fecha.getDate().toString();
            let mes:string =(fecha.getMonth()+1).toString();
            let ano = fecha.getFullYear();

            if((fecha.getMonth()+1)<10){
                mes="0"+mes;
                
            }
            if(fecha.getDate()<10){
                dia="0"+dia;
            }

            return dia+"-"+mes+"-"+ano;
        }
    }

}