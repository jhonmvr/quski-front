import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
interface FormData {
  option: string;
  banco?: string;
  numeroCuenta?: string;
  identificacion?: string;
  nombre?: string;
  valor: number;
}
@Component({
  selector: 'kt-comprobante-desembolso',
  templateUrl: './comprobante-desembolso.component.html',
  styleUrls: ['./comprobante-desembolso.component.scss']
})
export class ComprobanteDesembolsoComponent implements OnInit {
 
  selectedOption: string;
  formData: FormData = { option: '', valor: 0 };
  bancos: string[] = ['Banco 1', 'Banco 2', 'Banco 3'];
  displayedColumns: string[] = ['option', 'banco', 'numeroCuenta', 'identificacion', 'nombre', 'valor', 'actions'];
  columnsToDisplay: string[] = ['option', 'valor', 'actions'];
  dataSource = new MatTableDataSource<FormData>();

  constructor(){

  }
  ngOnInit(): void {
    
  }
  updateDisplayedColumns() {
    if (this.selectedOption === 'TRANSFERENCIA') {
      this.columnsToDisplay = ['option', 'banco', 'numeroCuenta', 'identificacion', 'nombre', 'valor', 'actions'];
    } else {
      this.columnsToDisplay = ['option', 'valor', 'actions'];
    }
  }
  addRecord() {
    this.dataSource.data.push({ ...this.formData, option: this.selectedOption });
    this.dataSource._updateChangeSubscription();
    this.formData = { option: '', valor: 0 };
  }

  deleteRecord(record: FormData) {
    const index = this.dataSource.data.indexOf(record);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
    }
  }

  validateDecimal(value: number) {
    this.formData.valor = parseFloat(value.toFixed(2));
  }
}