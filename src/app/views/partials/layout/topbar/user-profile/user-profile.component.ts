// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { BehaviorSubject, Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { environment } from '../../../../../../environments/environment';
import { WebsocketUtilService } from '../../../../../core/services/websocket-util.service';
import { TranslateService } from '@ngx-translate/core';
import { AutorizacionService } from '../../../../../core/services/autorizacion.service';
	
@Component({
	selector: 'kt-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
	// Public properties
	user$: Observable<User>;
	datos;

	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private translate: TranslateService, private auth:AutorizacionService,
		private store: Store<AppState>, 
		private ws:WebsocketUtilService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.user$ = this.store.pipe(select(currentUser));
		const us = new DatosUsuario( localStorage.getItem('re1002'),localStorage.getItem('nombreAgencia'),
		'','');
		this.datos = us;
	}

	/**
	 * Log out
	 */
	logout() {
		this.store.dispatch(new Logout());
		this.auth.logout();
		this.ws.close();
	}

	
}
export class DatosUsuario{
	perfil;
	agencia;
	centroCostos;
	ambiente;
	email;
	telefono;
	constructor(perfil,
		agencia,
		centroCostos,
		ambiente){
			this.perfil = perfil;
			this.agencia = agencia;
			this.centroCostos =centroCostos;
			this.ambiente = ambiente;

	}
}