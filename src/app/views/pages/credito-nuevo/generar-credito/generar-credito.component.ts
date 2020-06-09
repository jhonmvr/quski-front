import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';





@Component({
  selector: 'kt-generar-credito',
  templateUrl: './generar-credito.component.html',
  styleUrls: ['./generar-credito.component.scss'],
  
})


export class GenerarCreditoComponent implements OnInit {
  public formCreditoNuevo: FormGroup = new FormGroup({});
  public codigoOperacion = new FormControl('');
  public situacion = new FormControl('');
  public cedulaCliente = new FormControl('');
  public nombresCompletos = new FormControl('');
  idCreditoNegociacion;

  //observables
  enableDiaPagoButton;
  enableDiaPago = new BehaviorSubject<boolean>(false);
  constructor(private cns: CreditoNegociacionService) { 
    
  }

  ngOnInit() {
    this.enableDiaPagoButton = this.enableDiaPago.asObservable();
    this.enableDiaPago.next(true);
  }

  cargarDatosOperacion(){
   // this.cns.getCreditoNegociacionById(this.idCreditoNegociacion).subscribe((data:any)=>{
      
  //  })

  }

  getParams(){

  }
}
