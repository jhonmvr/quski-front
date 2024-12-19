import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReNoticeService } from '../../../../core/services/re-notice.service';
import { BehaviorSubject } from 'rxjs';
import { ComprobanteDesembolsoService } from '../../../../core/services/comprobante-desembolso.service';
import { SoftbankService } from '../../../../core/services/quski/softbank.service';
import { ComprobantePagoService } from '../../../../core/services/comprobante-pago.service';
export interface ComprobantePagoDto {
  id?: number;
  idNegociacion?: {id:number};
  tipo: string;
  valor: number;
  observacion?: string;
}
@Component({
  selector: 'kt-comprobante-pago',
  templateUrl: './comprobante-pago.component.html',
  styleUrls: ['./comprobante-pago.component.scss']
})
export class ComprobantePagoComponent implements OnInit {
  idNegociacionObj :BehaviorSubject<number | null> =  new BehaviorSubject<number | null>(null);
  @Output()
  totalComprobantes = new EventEmitter<number>();

  @Input() set idNegociacion( id :  any){
    this.idNegociacionObj.next( id );
  }

  get idNegociacion():any {
    return this.idNegociacionObj.getValue();
  }
  
  @Input() flagEdit = false;

  catBanco;
  
 
  selectedOption: string;
  formData: ComprobantePagoDto = { tipo: '', valor: 0 };
  columnsToDisplay: string[] = ['tipo', 'valor', 'actions'];
  dataSource = new MatTableDataSource<ComprobantePagoDto>();

  constructor(private comprobantePagoService:ComprobantePagoService,
    private sof:SoftbankService,
    private sinNotSer: ReNoticeService){

  }
  ngOnInit(): void {
    this.sof.consultarBancosCS().subscribe( (data:any) =>{
      this.catBanco = data.catalogo;
      
    })
    if(this.idNegociacionObj){
      this.idNegociacionObj.subscribe(value=>{
       
        this.listComprobantesByidNegociacion(value);
      });
    }
    
    
  }



  listComprobantesByidNegociacion(idNegociacion){
    if (idNegociacion === null) {
      return;
    }
    this.comprobantePagoService.listAllByIdNegociacion(idNegociacion).subscribe(p=>{
      let lista = p as Array<any>;
      this.updateDisplayedColumns();
      this.dataSource.data = p;
      this.dataSource._updateChangeSubscription();
      this.emitTotalComprobantes();

    });
  }

  emitTotalComprobantes() {
    const total = this.dataSource.data.reduce((sum, item) => sum + item.valor, 0);
    this.totalComprobantes.emit(total);
  }
  
  updateDisplayedColumns() {
    if (!this.dataSource.data.length) {
      return;
    }
  
    const columnsWithData = new Set<string>();
  
    // Itera sobre todos los elementos en dataSource.data para encontrar campos con datos
    this.dataSource.data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
          columnsWithData.add(key);
        }
      });
    });
  
    // Convertir el Set a array y agregar la columna de acciones
    this.columnsToDisplay = Array.from(columnsWithData).filter(field => field !== 'id' && field !== 'fecha').concat('actions');
  }
  
   
  addRecord() {
  /*   if (this.dataSource.data.length >= 3) {
      this.sinNotSer.setNotice("Solo puedes agregar hasta 3 comprobantes de desembolso", 'warning');
      return;
    } */

    if (!this.selectedOption) {
      this.sinNotSer.setNotice("SELECCIONA UNA OPCION", 'warning');
      return;
    }
    /* if (this.formData.valor === 0) {
      this.sinNotSer.setNotice("EL VALOR DEBE SER MAYOR A CERO", 'warning');
      return;
    } */
    if (this.formData.observacion === '') {
      this.sinNotSer.setNotice("COMPLETE LA OBSERVACION", 'warning');
      return;
    }

    const nuevoComprobante: ComprobantePagoDto = {
      ...this.formData,
      tipo: this.selectedOption,
      idNegociacion: { id: this.idNegociacion }
    };

    this.comprobantePagoService.agregarComprobante(nuevoComprobante).subscribe(nuevo => {
      console.log("el nuevo guardado", nuevo);
      this.listComprobantesByidNegociacion(this.idNegociacion);
    });

    this.formData = { tipo: '', valor: 0 };
  }

  deleteRecord(record: ComprobantePagoDto) {
    console.log("borrar",record);
    this.comprobantePagoService.eliminarComprobante(record.id).subscribe(p=>{
      this.listComprobantesByidNegociacion(this.idNegociacion);
    })
    
    /* const index = this.dataSource.data.indexOf(record);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    } */
  }

  validateDecimal(value: number) {
    this.formData.valor = parseFloat(value.toFixed(2));
  }
}