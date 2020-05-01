// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// RxJS
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Store
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/reducers';
// Auth
import { AuthNoticeService, AuthService, Login } from '../../../../core/auth';
import { AutorizacionService } from '../../../../core/services/autorizacion.service';
import { environment } from '../../../../../environments/environment';
import * as uuid from 'uuid';
import { WebsocketUtilService } from '../../../../core/services/websocket-util.service';



/**
 * ! Just example => Should be removed in development
 */
const DEMO_PARAMS = {
	EMAIL: '',
	PASSWORD: ''
};

@Component({
	selector: 'kt-login',
	templateUrl: './login.component.html',
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {
	// Public params
	loginForm: FormGroup;
	loading = false;
	isLoggedIn$: Observable<boolean>;
	errors: any = [];

	private unsubscribe: Subject<any>;

	private returnUrl: any;

	// Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param router: Router
	 * @param auth: AuthService
	 * @param authNoticeService: AuthNoticeService
	 * @param translate: TranslateService
	 * @param store: Store<AppState>
	 * @param fb: FormBuilder
	 * @param cdr
	 * @param route
	 */
	constructor(
		private router: Router,
		private authRelative:AutorizacionService,
		private authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private store: Store<AppState>,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private route: ActivatedRoute,
		private ws:WebsocketUtilService
	) {
		this.authRelative.setParameter();
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.initLoginForm();

		// redirect back to the returnUrl before login
		this.route.queryParams.subscribe(params => {
			this.returnUrl = params.returnUrl || '/';
		});
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.authNoticeService.setNotice(null);
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initLoginForm() {
		// demo message to show
		/*if (!this.authNoticeService.onNoticeChanged$.getValue()) {
			const initialNotice = `Use account
			<strong>${DEMO_PARAMS.EMAIL}</strong> and password
			<strong>${DEMO_PARAMS.PASSWORD}</strong> to continue.`;
			this.authNoticeService.setNotice(initialNotice, 'info');
		}*/

		this.loginForm = this.fb.group({
			email: [DEMO_PARAMS.EMAIL, Validators.compose([
				Validators.required,
				//Validators.email,
				Validators.minLength(3),
				Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
			])
			],
			password: [DEMO_PARAMS.PASSWORD, Validators.compose([
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(100)
			])
			]
		});
	}

	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.loginForm.controls;
		/** check form */
		if (this.loginForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;

		const authData = {
			email: controls.email.value,
			password: controls.password.value
		};
		
		
		this.authRelative.serverLogin(authData).pipe( tap(
			usuarioAuth => {
				//console.log("=en tap termino validaciones con usuarioAuth " + JSON.stringify(usuarioAuth))
					if (usuarioAuth && usuarioAuth.existLogin ) {
						//console.log("=en tap termino exiete login " + usuarioAuth.accessToken );
						localStorage.setItem( environment.userKey, btoa( authData.email)  );
						localStorage.setItem( environment.authKey, btoa( ""+ usuarioAuth.id) );
						localStorage.setItem( environment.hashWebSocketKey,uuid.v4() )
						this.store.dispatch(new Login({authToken: usuarioAuth.accessToken}));
						//console.log("=socket ruta " + this.ws.appWebSocketUrl + localStorage.getItem( environment.hashWebSocketKey )+"?dummy=1" );
						this.ws.setParameter();
						this.ws.connect(this.ws.appWebSocketUrl + localStorage.getItem( environment.hashWebSocketKey )+"?dummy=1");
						this.ws.messages.subscribe(msg => {			
							console.log("Response from websocket: ",msg);
						});
						this.router.navigateByUrl(this.returnUrl); // Main page
					} else {
						this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN'), 'danger');
					}
				}

		), 
		takeUntil(this.unsubscribe),
		finalize(() => {
			this.loading = false;
			this.cdr.markForCheck();
		}) ).subscribe(data=>{},
			error=>{
				if( error.error ){
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN') + 
					' - ' + error.error.codError + ' - ' + error.error.msgError
				, 'danger');
				} else {
					this.authNoticeService.setNotice(this.translate.instant('AUTH.VALIDATION.INVALID_LOGIN') , 'danger');
				}
				
			});
		
	
	}

	/*
	public serverLogin(authData): Observable<UsuarioAuth>{
		
		return this.authRelative.login( authData.email, authData.password )
		.pipe( 
			switchMap( usuariowp=>this.authRelative.getRelative( usuariowp.token )
			.pipe(
				switchMap( dataParam=>this.authRelative.getPerfil( usuariowp.token,usuariowp.entidad.idUsuario )
					.pipe(  
						switchMap( dataPerfiles=>this.userReturn( usuariowp,dataParam,dataPerfiles, authData )
					) )) ) ) );
	}
	*/

	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.loginForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
	}

	/*
	private userReturn(  dataLogin,dataParam,dataRoles:Array<RolWrapper>, credential): Observable<any>{
        
        console.log( "++>FLAT MAP BUSCANDO PARAMETROS: " ) ;
        console.log( "++>FLAT MAP BUSCANDO PARAMETROS: dataLogin " + JSON.stringify(dataLogin) ) ;
        console.log( "++>FLAT MAP BUSCANDO PARAMETROS: dataParam " + JSON.stringify(dataParam) ) ;
        console.log( "++>FLAT MAP BUSCANDO PARAMETROS: dataRoles " + JSON.stringify(dataRoles) ) ;
        

        if( dataLogin && dataLogin.entidad  ){
            this.setRe000(dataParam);                                                        
            console.log( "++>termino busqueda de usuario canal: " + JSON.stringify( dataLogin)) ;
                      
            
            let x:UsuarioAuth=new UsuarioAuth();
            x.id=Math.random();
            x.username=credential.email;
            x.email=credential.email + "@quski.com.ec";
            x.fullname=credential.email;
            x.password=null;
			x.roles=['USER'];   
			x.accessToken=dataLogin.token;
            //localStorage.setItem("reUser",credential.email); 
            if( dataRoles ){
                let dataRolesFilter=dataRoles.filter(r=>r.estado==='A');
                console.log( "++>ROLES FILTRADOS " + JSON.stringify(dataRolesFilter) ) ;
                if( dataRolesFilter ){
					x.existLogin=true;
                    dataRolesFilter.forEach(r=>{
                        localStorage.setItem("reRol",r.id);
                        localStorage.setItem("re1001",r.codigoRol);
                        x.roles.push( r.id );
                        x.roles.push( r.nombre );
                    });
                }
            }
            
            return of(x);
        } else {
			
            console.log("===================retorna false: " + JSON.stringify( dataLogin ));  
			let y:UsuarioAuth=new UsuarioAuth();
			y.existLogin=false;
            if( !dataLogin || !dataLogin.entidad ){

                y.password="ERROR EN LOGIN, USUARIO O CLAVE INCORRECTO, O EL USUARIO ESTA INACTIVO";
                return of(y);
            } else {
                y.password="ERROR EN LOGIN, ERROR DESCONOCIDO CONSULTE A SU ADMINISTRADOR";
                return of(y);
            }
        }
	}
	*/
	
}
