// Angular
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
// RxJS
import { filter, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
// NGRX
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
// Auth actions
import { AuthActionTypes, Login, Logout, Register, UserLoaded, UserRequested } from '../_actions/auth.actions';
import { AuthService } from '../_services/index';
import { AppState } from '../../reducers';
import { environment } from '../../../../environments/environment';
import { isUserLoaded } from '../_selectors/auth.selectors';
import { AutorizacionService } from '../../services/autorizacion.service';

@Injectable()
export class AuthEffects {
    @Effect({dispatch: false})
    login$ = this.actions$.pipe(
        ofType<Login>(AuthActionTypes.Login),
        tap(action => {
            //console.log( "login action set token localstorage " + JSON.stringify( action )  );
            localStorage.setItem(environment.authTokenKey, action.payload.authToken);
            //console.log( "login action get token localstorage " + localStorage.getItem(environment.authTokenKey)  );
            this.store.dispatch(new UserRequested());
        }),
    );

    @Effect({dispatch: false})
    logout$ = this.actions$.pipe(
        ofType<Logout>(AuthActionTypes.Logout),
        tap(() => {
            localStorage.removeItem(environment.authTokenKey);
            localStorage.removeItem("re1001");
            localStorage.removeItem("RE2000");
            localStorage.removeItem("RE2001");
            localStorage.removeItem("layoutConfig");
            localStorage.removeItem(environment.rolKey);
            localStorage.removeItem("setRE000"); 
            localStorage.removeItem("authcekey"); 
            for (var index = 1; index <= environment.paramsize; index++) {
                let key= environment.prefix + 'RE';
                if( index <10 ){
                    key=key+'00'+index;
                } else {
                    key=key+'0'+index; 
                }
                if( key != 'RE030' ){     
                    localStorage.removeItem(key);
                }
            }
            localStorage.clear();
            this.router.navigate(['/auth/login'], {queryParams: {returnUrl: this.returnUrl}});
                     
        })
    );

    @Effect({dispatch: false})
    register$ = this.actions$.pipe(
        ofType<Register>(AuthActionTypes.Register),
        tap(action => {
            console.log("==>register$ " + JSON.stringify(action));
            localStorage.setItem(environment.authTokenKey, action.payload.authToken);
        })
    );

    @Effect({dispatch: false})
    loadUser$ = this.actions$
    .pipe(
        ofType<UserRequested>(AuthActionTypes.UserRequested),
        withLatestFrom(this.store.pipe(select(isUserLoaded))),
        filter(([action, _isUserLoaded]) => !_isUserLoaded),
        //mergeMap(([action, _isUserLoaded]) => this.auth.getUserByToken()),
        mergeMap(([action, _isUserLoaded]) => this.authRelative.getUserByToken()),
        tap(_user => {
            //console.log("==>loadUser$ " + JSON.stringify(_user));
            if (_user) {
                this.store.dispatch(new UserLoaded({ user: _user }));
            } else {
                this.store.dispatch(new Logout());
            }
        })
      );

    @Effect()
    init$: Observable<Action> = defer(() => {        
        const userToken = localStorage.getItem(environment.authTokenKey);
        let observableResult = of({type: 'NO_ACTION'});
        if (userToken) {
            observableResult = of(new Login({  authToken: userToken }));
        }
        return observableResult;
    });

    private returnUrl: string;

    constructor(private actions$: Actions,
                private router: Router,
                private auth: AuthService,
                private authRelative: AutorizacionService,
                private store: Store<AppState>) {

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.returnUrl = event.url;
			}
		});
	}
}
