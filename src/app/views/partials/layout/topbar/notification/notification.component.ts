// Angular
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {WebSocketSubject} from 'rxjs/webSocket';
import { Subject, BehaviorSubject } from 'rxjs';
import { Notificacion } from '../../../../../core/model/notificacion';
import { NotificacionService } from '../../../../../core/services/notificacion.service';
import { environment } from '../../../../../../environments/environment';
import { WebsocketUtilService } from '../../../../../core/services/websocket-util.service';
import { ReNoticeService } from '../../../../../core/services/re-notice.service';
import { MatDialog } from '@angular/material';
import { AuthDialogComponent } from '../../../custom/auth-dialog/auth-dialog.component';

@Component({
	selector: 'kt-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {

	// Show dot on top of the icon
	@Input() dot: string;

	// Show pulse on icon
	@Input() pulse: boolean;

	@Input() pulseLight: boolean;

	// Set icon class name
	@Input() icon = 'flaticon2-bell-alarm-symbol';
	@Input() iconType: '' | 'success';

	// Set true to icon as SVG or false as icon class
	@Input() useSVG: boolean;

	// Set bg image path
	@Input() bgImage: string;

	// Set skin color, default to light
	@Input() skin: 'light' | 'dark' = 'light';

	@Input() type: 'brand' | 'success' = 'success';

	listaNotificacion:BehaviorSubject<Array<Notificacion>> =new BehaviorSubject(new Array<Notificacion>());
	qtyNotificacion:BehaviorSubject<number> =new BehaviorSubject(0);
	listaShow;
	qtyShow;
	notif:Array<Notificacion>;

	/**COnfiguracion websocket */
	/** Never forget to unsubscribe from the observables to prevent memory leaks!*/
	unsubscribe$: Subject<boolean> = new Subject();
	/**FIN COnfiguracion notififaciones */

	/**
	 * Component constructor
	 *
	 * @param sanitizer: DomSanitizer
	 */
	constructor(private ns:NotificacionService,private ws: WebsocketUtilService, private noticeService:ReNoticeService,
		public dialog: MatDialog) {
		ns.setParameter();
		ws.setParameter();
		this.listaShow=this.listaNotificacion.asObservable();
		this.qtyShow=this.qtyNotificacion.asObservable();
	}

	ngOnDestroy() {
		this.unsubscribe$.next(true);
		this.unsubscribe$.complete();
	  }

	ngOnInit() {
		this.notif=new Array<Notificacion>();
		this.listaNotificacion.next(null);
		this.qtyNotificacion.next(null);
		//console.log('xxxxxxxxxxxxxxxxxxxxx+>NotificationComponent Proceso de generacion de websocket: ' );
		this.ns.getAlertas(environment.alertSpecificKey).subscribe((datoEnc:any)=>{
			//console.log('xxxxxxxxxxxxxxxxxxxxx+>NotificationComponent getAlertas generacion de websocket: ' +  datoEnc);
			if( datoEnc && datoEnc.entidades){
				//console.log('xxxxxxxxxxxxxxxxxxxxx+>PDatos actuales: ' + JSON.stringify( datoEnc ) );
				let dato = datoEnc.entidades;
				for (let index = 0; index < dato.length; index++) {
					const msg = JSON.parse(atob(dato[index]));
					//console.log('xxxxxxxxxxxxxxxxxxxxx+>PDatos actuales: ' + JSON.stringify( msg ) );
					let n:Notificacion= new Notificacion();
					n.mensaje=msg.descripcion;
					n.codigo=msg.codigo;
					n.fecha=msg.fecha;
					n.url=msg.url;
					this.notif.push( n );
				}
				this.listaNotificacion.next( this.notif );
				this.qtyNotificacion.next( this.notif.length );
			}
			
			this.ws.messages.subscribe(msg => {	
				//console.log('xxxxxxxxxxxxxxxxxxxxx+>NotificationComponent entra en subscribe: '  );
				let n:Notificacion= new Notificacion();
				if( msg && msg.mensaje &&  !msg.tipo ){
					let obj=JSON.parse(atob( msg.mensaje));
					console.log( "NotificationComponent mi obj: " + JSON.stringify(obj) );  
					if( obj.codigo=== environment.alertSpecificKey ){
						n.mensaje=obj.descripcion;
						n.codigo=obj.codigo;
						n.fecha=obj.fecha;
						n.url=obj.url;
						this.notif.push( n );
						this.listaNotificacion.next( this.notif );
						this.qtyNotificacion.next( this.notif.length );
					} else if( obj.codigo=== environment.auditGlobalKey ){
						console.log( "NotificationComponent redicrecciona a audit: " ); 
						n.mensaje=obj.descripcion;
						n.codigo=obj.codigo;
						n.fecha=obj.fecha;
						n.url=obj.url; 
						this.ns.setListaAudit( n );	
					}
				} else if( msg && msg.mensaje &&  msg.tipo ) {
					console.log( "NotificationComponent redicrecciona a notif global: " ); 
					let obj=JSON.parse(atob( msg.mensaje)); 
					n.mensaje=obj.descripcion;
					n.codigo=obj.codigo;
					n.fecha=obj.fecha;
					n.url=obj.url;
					this.ns.setListaNotificacion( n );	
				}
			}, error=>{
				if(  error.error ){
					this.noticeService.setNotice(error.error.codError + ' - ' + error.error.msgError  , 'error');
				} else if(  error.statusText ){
					this.noticeService.setNotice("Error " + error.statusText + " - " + error.message, 'error');
				} else {
					this.noticeService.setNotice("Error al cargar las notificaciones o alertas", 'error');
				}
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

	backGroundStyle(): string {
		if (!this.bgImage) {
			return 'none';
		}

		return 'url(' + this.bgImage + ')';
	}

	

}
