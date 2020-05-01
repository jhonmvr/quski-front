// Angular
import { Component } from '@angular/core';
// Layout
import { OffcanvasOptions } from '../../../../core/_base/layout';
import { BehaviorSubject, Subject } from 'rxjs';
import { Notificacion } from '../../../../core/model/notificacion';
import { NotificacionService } from '../../../../core/services/notificacion.service';
import { WebsocketUtilService } from '../../../../core/services/websocket-util.service';
import { environment } from '../../../../../environments/environment';
import { ReNoticeService } from '../../../../core/services/re-notice.service';
import { MatDialog } from '@angular/material';
import { AuthDialogComponent } from '../../custom/auth-dialog/auth-dialog.component';

@Component({
	selector: 'kt-quick-panel',
	templateUrl: './quick-panel.component.html',
	styleUrls: ['./quick-panel.component.scss']
})
export class QuickPanelComponent {
	// Public properties
	offcanvasOptions: OffcanvasOptions = {
		overlay: true,
		baseClass: 'kt-quick-panel',
		closeBy: 'kt_quick_panel_close_btn',
		toggleBy: 'kt_quick_panel_toggler_btn'
	};

	listaNotificacionObserver:BehaviorSubject<Array<Notificacion>>;

	listaNotificacion:BehaviorSubject<Array<Notificacion>> =new BehaviorSubject(new Array<Notificacion>());
	listaAudit:BehaviorSubject<Array<Notificacion>> =new BehaviorSubject(new Array<Notificacion>());
	qtyNotificacion:BehaviorSubject<number> =new BehaviorSubject(0);
	listaShow;
	listaAuditShow;
	qtyShow;
	notif:Array<Notificacion>;
	audit:Array<Notificacion>;

	/**COnfiguracion websocket */
	/** Never forget to unsubscribe from the observables to prevent memory leaks!*/
	unsubscribe$: Subject<boolean> = new Subject();
	/**FIN COnfiguracion notififaciones */

	constructor(private ns:NotificacionService,private ws: WebsocketUtilService, private noticeService:ReNoticeService,
		public dialog: MatDialog) {
		ns.setParameter();
		ws.setParameter();
		
		this.listaShow=this.listaNotificacion.asObservable();
		this.listaAuditShow=this.listaAudit.asObservable();
		this.qtyShow=this.qtyNotificacion.asObservable();
		
	}

	ngOnInit() {
		this.notif=new Array<Notificacion>();
		this.audit=new Array<Notificacion>();
		this.listaNotificacion.next(null);
		this.qtyNotificacion.next(null);
		this.listaAudit.next(null);
		//console.log('xxxxxxxxxxxxxxxxxxxxx+>QuickPanelComponentProceso de generacion de websocket: ' );
		let inList= new Array<string>(); 
		inList.push(environment.alertGlobalKey);
		inList.push(environment.auditGlobalKey);
		this.ns.getAlertasIn( inList ).subscribe( (datoEnc:any)=>{
			//console.log('xxxxxxxxxxxxxxxxxxxxx+>QuickPanelComponentPDatos getAlertas generacion de websocket: ' +  datoEnc);
			if( datoEnc && datoEnc.entidades){
				//console.log('xxxxxxxxxxxxxxxxxxxxx+>QuickPanelComponentPDatos actuales: ' + JSON.stringify( datoEnc ) );
				let dato = datoEnc.entidades;
				for (let index = 0; index < dato.length; index++) {
					const msg = JSON.parse(atob(dato[index]));
					//console.log('xxxxxxxxxxxxxxxxxxxxx+>QuickPanelComponentPDatos actuales: ' + JSON.stringify( msg ) );
					let n:Notificacion= new Notificacion();
					n.mensaje=msg.descripcion;
					n.codigo=msg.codigo;
					n.fecha=msg.fecha;
					n.url=msg.url;
					if( msg.codigo === environment.alertGlobalKey ){
						this.notif.push( n );
					} else if( msg.codigo === environment.auditGlobalKey ){
						this.audit.push( n );
					}
				}
			}
			this.listaNotificacion.next( this.notif );
			this.qtyNotificacion.next( this.notif.length );
			this.listaAudit.next( this.audit );
			
			this.ns.getListaNotificacion().subscribe(data=>{
				//console.log("uuuuuuuuuuuuu>pta " + JSON.stringify( data ) );
				this.setData( data );
			});
			this.ns.getListaAudit().subscribe(data=>{
				//console.log("AAAAAAAAAAAAAAA>pta " + JSON.stringify( data ) );
				this.setData( data );
			});
		}, error=>{
			if(  error.error ){
				this.noticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
			} else if(  error.statusText && error.status==401 ){
				
				this.dialog.open(AuthDialogComponent, {
					data: {
						mensaje:"Error " + error.statusText + " - " + error.message
					}
				});
				
			} else {
				this.noticeService.setNotice("Error al cargar las notificaciones o alertas", 'error');
			}
		});
	}

	private setData(n:Notificacion) {	
		//console.log('xxxxxxxxxxxxxxxxxxxxx+>QuickPanelComponentPDatosmi entra en setData: ' + n.codigo  );
		if( n.codigo === environment.alertGlobalKey  ){
			this.notif.push( n );
			this.listaNotificacion.next( this.notif );
		} else if( n.codigo === environment.auditGlobalKey ){
			this.audit.push( n );
			this.listaAudit.next( this.audit );
		}	
		this.qtyNotificacion.next( this.notif.length );
	}

	ngOnDestroy() {
		this.unsubscribe$.next(true);
		this.unsubscribe$.complete();
	  }
}
