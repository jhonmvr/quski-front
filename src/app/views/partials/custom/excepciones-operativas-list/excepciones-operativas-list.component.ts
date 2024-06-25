import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ReNoticeService } from '../../../../core/services/re-notice.service';
import { BehaviorSubject } from 'rxjs';
import { ComprobanteDesembolsoService } from '../../../../core/services/comprobante-desembolso.service';
import { SoftbankService } from '../../../../core/services/quski/softbank.service';
import { ExcepcionOperativaService } from '../../../../core/services/quski/excepcion-operativa.service';
import { Page } from '../../../../core/model/page';
export interface ExcepcionOperativaDto {
  id?: number;
  idNegociacion?: {id:number};
  tipo: string;
  banco?: string;
  numeroCuenta?: string;
  identificacion?: string;
  nombre?: string;
  valor: number;
}
@Component({
  selector: 'kt-excepciones-operativas-list',
  templateUrl: './excepciones-operativas-list.component.html',
  styleUrls: ['./excepciones-operativas-list.component.scss']
})
export class ExcepcionesOperativasListComponent implements OnInit {

  idNegociacionObj :BehaviorSubject<number | null> =  new BehaviorSubject<number | null>(null);

  @Input() set idNegociacion( id :  any){
    this.idNegociacionObj.next( id );
  }

  get idNegociacion():any {
    return this.idNegociacionObj.getValue();
  }
  columnMap = new Map<string, string>();

  columnsToDisplay: string[] = ['tipo', 'valor', 'actions'];
  dataSource = new MatTableDataSource<ExcepcionOperativaDto>();

  constructor(private excepcionOperativaService:ExcepcionOperativaService,
    private sof:SoftbankService,
    private sinNotSer: ReNoticeService){

  }
  ngOnInit(): void {
    
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
    let page: Page = new Page();
    page.isPaginated = 'N'
    this.excepcionOperativaService.findAllByParams(page,  null, null, null,null, idNegociacion).subscribe(e=>{
      console.log("valor findAllByParams",e)
      let lista = e as Array<any>;
      
      this.dataSource.data = e.list;
      
      this.updateDisplayedColumns();
      this.dataSource._updateChangeSubscription();
    });
   
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
          const formattedKey = this.camelCaseToWords(key);
          columnsWithData.add(formattedKey);
          this.columnMap.set(formattedKey, key);
        }
      });
    });
  
    // Convertir el Set a array y agregar la columna de acciones
    this.columnsToDisplay = Array.from(columnsWithData).filter(field => 
      field !== 'Id' && field !== 'Codigo' && field !== 'Codigo Operacion' && field !== 'Fecha Respuesta' && field !== 'Fecha Solicitud'
      && field !== 'Id Negociacion'
    );
  }
  camelCaseToWords(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (firstChar) => firstChar.toUpperCase());
  }
  
   
}