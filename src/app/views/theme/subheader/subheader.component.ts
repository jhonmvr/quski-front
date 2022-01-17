// Angular
import { Component, OnInit } from '@angular/core';
// Layout
import { LayoutConfigService } from '../../../core/_base/layout';
// Object-Path
import * as objectPath from 'object-path';
import { BandejaOperacionesProcesoComponent } from '../../pages/apps/negociacion/bandeja-operaciones-proceso/bandeja-operaciones-proceso.component';
import { BehaviorSubject } from 'rxjs';

@Component({
	selector: 'kt-subheader',
	templateUrl: './subheader.component.html',
})
export class SubheaderComponent implements OnInit {
	// Public properties
	// subheader layout
	layout: string;
	fluid: boolean;
	clear: boolean;
	mostratContenido: BehaviorSubject<boolean>;
	contenido:Contenido;

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService) {
		this.mostratContenido = new BehaviorSubject<boolean>(false);
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.layoutConfigService.datosContrato.subscribe(datos => {
			if (datos) {
				this.mostratContenido.next(true);
				this.contenido = {
					nombre: datos.nombre,
					cedula: datos.cedula,
					numeroCredito: datos.numeroCredito,
					codigoBPM: datos.codigoBPM,
					monto: datos.monto,
					plazo: datos.plazo,
					tipoCredito: datos.tipoCredito,
					numeroCuenta: datos.numeroCuenta,
					nombreAsesor: datos.nombreAsesor,
					numeroCreditoAnterior: datos.numeroCreditoAnterior
				}
			} else {
				this.mostratContenido.next(false);
			}
		});
		const config = this.layoutConfigService.getConfig();

		this.layout = objectPath.get(config, 'subheader.layout');
		this.fluid = objectPath.get(config, 'footer.self.width') === 'fluid';
		this.clear = objectPath.get(config, 'subheader.clear');
	}
}

export class Contenido {
	nombre: any;
	cedula: any;
	numeroCredito: any;
	codigoBPM: any;
	monto: any;
	plazo: any;
	tipoCredito: any;
	numeroCuenta: any;
	nombreAsesor: any;
	numeroCreditoAnterior: any;
}