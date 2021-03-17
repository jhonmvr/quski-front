// Angular
import { Component, OnInit } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
import { AlertaAprobadorWrapper } from '../../../../app/core/interfaces/AlertaAprobadorWrapper';
import { SharedService } from '../../../../app/core/services/shared.service';
import { environment } from '../../../../environments/environment';
// Services
// Widgets model
import { LayoutConfigService, SparklineChartOptions } from '../../../core/_base/layout';
import { Widget4Data } from '../../partials/content/widgets/widget4/widget4.component';

@Component({
	selector: 'kt-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	chartOptions1: SparklineChartOptions;
	chartOptions2: SparklineChartOptions;
	chartOptions3: SparklineChartOptions;
	chartOptions4: SparklineChartOptions;
	widget4_1: Widget4Data;
	widget4_2: Widget4Data;
	widget4_3: Widget4Data;
	widget4_4: Widget4Data;

	constructor(private layoutConfigService: LayoutConfigService, private sharedService: SharedService) {
	}

	ngOnInit(): void {
		let keyUnencrypt = atob( localStorage.getItem(environment.prefix +'RE011'));
		let tiempoAprobador =atob(localStorage.getItem('localRE017')).replace(keyUnencrypt,'');
		//let tiempoSupervisor =atob(localStorage.getItem('localRE018')).replace(keyUnencrypt,'');
		if(tiempoAprobador){
			setInterval(() => { 
				let roles = atob(localStorage.getItem('localRE019')).replace(keyUnencrypt,'');
				if(roles.split(',').find(p=> p == localStorage.getItem('re1002'))){
					let x :AlertaAprobadorWrapper = {
						codigoBpm: 'string',
						codigSoftbank: 'string',
						proceso: 'string',
						aprobador: 'string',
						tiempoInicio: new Date,
						tiempoTranscurrido: new Date
					}
					this.sharedService.cargarDatos(x);
				}
			 },Number(tiempoAprobador)*1000 * 60);
		}
		
	}

}
