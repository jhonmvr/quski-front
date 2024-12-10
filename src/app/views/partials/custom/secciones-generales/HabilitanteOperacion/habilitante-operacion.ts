import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-habilitante-operacion',
  templateUrl: './habilitante-operacion.html',
  styleUrls: ['./habilitante-operacion.scss']
})
export class HabilitanteOperacionComponent implements OnInit, OnChanges {
  // BehaviorSubjects para inputs reactivos
  detalleSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  referenciaSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  operacionMadreSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  cedulaSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  estadoSubject: BehaviorSubject<string> = new BehaviorSubject<string>('DETALLE');

  varHabilitante = { proceso: 'CLIENTE', referencia: '' };

  @Input() detalle: any;
  @Input() referencia: any;
  @Input() operacionMadre: any;
  @Input() cedula: string;
  @Input() estado: string;

  ngOnInit(): void {
    // Observa los cambios combinados de los inputs y realiza acciones cuando cambien
    combineLatest([
      this.detalleSubject,
      this.referenciaSubject,
      this.operacionMadreSubject,
      this.cedulaSubject,
      this.estadoSubject
    ]).subscribe(([detalle, referencia, operacionMadre, cedula, estado]) => {
      console.log('Detalle:', detalle);
      console.log('Referencia:', referencia);
      console.log('Operación Madre:', operacionMadre);
      console.log('Cédula:', cedula);
      console.log('Estado:', estado);

      // Actualiza `varHabilitante` si es necesario
      this.varHabilitante.referencia = referencia || '';
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Propaga los cambios a los BehaviorSubjects
    if (changes.detalle) {
      this.detalleSubject.next(changes.detalle.currentValue);
    }
    if (changes.referencia) {
      this.referenciaSubject.next(changes.referencia.currentValue);
    }
    if (changes.operacionMadre) {
      this.operacionMadreSubject.next(changes.operacionMadre.currentValue);
    }
    if (changes.cedula) {
      this.cedulaSubject.next(changes.cedula.currentValue);
    }
    if (changes.estado) {
      this.estadoSubject.next(changes.estado.currentValue);
    }
  }

  setProceso(proceso: string, referencia: any): void {
    this.varHabilitante.proceso = proceso;
    this.varHabilitante.referencia = referencia;
  }
}
