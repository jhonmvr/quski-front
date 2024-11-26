import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habilitante-operacion',
  templateUrl: './habilitante-operacion.html',
  styleUrls: ['./habilitante-operacion.scss']
})
export class HabilitanteOperacionComponent {
  @Input() detalle: any;
  @Input() referencia: any;
  @Input() operacionMadre: any;
  @Input() cedula: string; // Nuevo Input para manejar el número de cédula

  varHabilitante = { proceso: 'CLIENTE', referencia: '' };

  setProceso(proceso: string, referencia: any): void {
    this.varHabilitante.proceso = proceso;
    this.varHabilitante.referencia = referencia;
  }
}
