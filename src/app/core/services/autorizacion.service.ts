import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BaseWrapper } from '../model/basewrapper';
import { environment } from '../../../environments/environment';
import { RolWrapper } from '../model/rol-wrapper';
import { UsuarioAuth } from '../model/usuario-auth';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../auth/_models/user.model';
import { Address } from '../auth/_models/address.model';
import {  SocialNetworks } from '../auth/_models/social-networks.model';
import { MenuResponse } from '../model/menu-response';
import { ItemView } from '../model/item-view';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Logout } from '../auth/_actions/auth.actions';




@Injectable({
  providedIn: 'root'
})
export class AutorizacionService extends BaseService {

  constructor(_http:HttpClient,private router: Router,private store: Store<AppState>) {
    super();
    this.http=_http;
  }


  public login( authData):Observable<BaseWrapper>{
    //console.log("=========> ejecuta login");
    let wp={
      "entidad":{
        "idUsuario":authData.email,
        "contrasena":authData.password
      }
    }
    return this.http.post<BaseWrapper>( atob(environment.seg_a), wp);
  }

  public getRelative(token:string):Observable<any>{
    //console.log("=========> ejecuta relative");
    
    const headersLoc= new HttpHeaders({'Authorization':environment.authprefix+ token, 'Content-Type': 'application/json' });
    const params = new HttpParams()
    .set("prefix",environment.prefix )
    let optionsLoc = {
      headers: headersLoc,
      params:params
    };
    //console.log("===>getRelative optionsLoc " + JSON.stringify( optionsLoc ));
    return this.http.get<any>( atob(environment.app_p) , optionsLoc);
  }

  public getPerfil(token:string, usuario:string):Observable<Array<RolWrapper>>{
    //console.log("=========> ejecuta getperfil");
   
    const paramsLoc = new HttpParams()
    .set("usuario", usuario)
    .set("tipo", "EXTERNO" );
    let headersLoc= new HttpHeaders({'Authorization':environment.authprefix+ token, 'Content-Type': 'application/json' });
    let url=atob(environment.seg_r)+ "reusRestController/rese010";
    let optionsLoc = {
      headers: headersLoc,
      params:paramsLoc
    };
    //console.log("===>getRelative getPerfil " + JSON.stringify( optionsLoc ));
    return this.http.get<Array<RolWrapper>>(url,optionsLoc);
  }

  public serverLogin(authData): Observable<UsuarioAuth>{
		return this.login( authData )
		.pipe( 
			switchMap( usuariowp=>this.getRelative( usuariowp.token )
			.pipe(
				switchMap( dataParam=>this.getPerfil( usuariowp.token,usuariowp.entidad.idUsuario )
					.pipe(  
						switchMap( dataPerfiles=>this.userReturn( usuariowp,dataParam,dataPerfiles, authData )
					) )) ) ) );
	}

  private userReturn(  dataLogin,dataParam,dataRoles:Array<RolWrapper>, credential): Observable<UsuarioAuth>{
        
    //console.log( "++>FLAT MAP BUSCANDO PARAMETROS: " ) ;
    //console.log( "++>FLAT MAP BUSCANDO PARAMETROS: dataLogin " + JSON.stringify(dataLogin) ) ;
    //console.log( "++>FLAT MAP BUSCANDO PARAMETROS: dataParam " + JSON.stringify(dataParam) ) ;
    //console.log( "++>FLAT MAP BUSCANDO PARAMETROS: dataRoles " + JSON.stringify(dataRoles) ) ;
    

    if( dataLogin && dataLogin.entidad  ){
        this.setRe000(dataParam);                                                        
        //console.log( "++>termino busqueda de usuario canal: " + JSON.stringify( dataLogin)) ;
                  
        
        let x:UsuarioAuth=new UsuarioAuth();
        x.id=dataLogin.entidad.idUsuario;
        x.username=credential.email;
        x.email=credential.email + "@quski.com.ec";
        x.fullname=credential.email;
        x.password=null;
        x.roles=['USER'];   
        x.accessToken=dataLogin.token;
        //localStorage.setItem("reUser",credential.email); 
        if( dataRoles ){
            let dataRolesFilter=dataRoles.filter(r=>r.estado==='A');
            //console.log( "++>ROLES FILTRADOS " + JSON.stringify(dataRolesFilter) ) ;
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
  
        //console.log("===================retorna false: " + JSON.stringify( dataLogin ));  
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


    getUserByToken(): Observable<User> {
        //console.log( "=====>mi getUserByToken " );
        const userId = atob(localStorage.getItem(environment.authKey));
        let url = atob( environment.seg_r ) + "reusRestController/rese002";
        //console.log( "=====>mi getUserByToken userId " + userId );
        if (!userId) {
            return of(null);
        }
        return this.findByPkurl(userId,url).pipe(
          map((result: any)=>{
            //console.log( "=====>findByPkurl usuario" + JSON.stringify( result ) );
            if( !result || !result.entidad ){
              return null;
            }
            let segUsuario=result.entidad;
            let user:User= new User();
            user.accessToken=localStorage.getItem(environment.authTokenKey);
            user.address=new Address();
            user.companyName="Relative";
            user.email=segUsuario.emailPrincipal;
            user.fullname=segUsuario.primerNombre+ " " + segUsuario.primerNombre;
            user.id=segUsuario.identificacion;
            user.occupation="ND";
            user.password=undefined;
            user.phone=segUsuario.telefonoPrincipal;
            user.pic="./assets/media/users/300_25.jpg";
            user.refreshToken=localStorage.getItem(environment.authTokenKey);
            user.roles=[2];
            user.socialNetworks=new SocialNetworks();
            user.username=segUsuario.idUsuario;
            
            return user;
          } )
        );
    }

    public athorizate(aplicacion):Observable<Array<any>> {
      //console.log("===================>athorizate parametros "  );
      const userId = atob(localStorage.getItem(environment.authKey));
      //console.log("athorizate parametros " +userId );
      //console.log("url autorizacion " + this.menuServiceUrl );
      let params = new HttpParams();
      params=params.set("idUsuario", userId.trim() );
      params=params.set("idAplicacion", aplicacion);
  
      let optionsLoc = {
        headers: new HttpHeaders({ 'Authorization':environment.authprefix+ localStorage.getItem( environment.authTokenKey ), 
        'Content-Type': 'application/json' }),
        params:params
      };
      return this.http.get( this.menuServiceUrl , optionsLoc).pipe(
        map((response: MenuResponse) => {
        //console.log( "!!!!!!!!!!!!!!!==respuesta authorizacion: " + JSON.stringify(response) );
        let paginatedListx = response;//.json();
        //console.log( "!!!!!!!!!!!!!!!==OPTION: " + JSON.stringify( paginatedListx ));
        let items: Array<any> = [];
        if (paginatedListx) {
         
          //console.log("submenues " + JSON.stringify(submenues));
          
          let submenues: Array<MenuResponse> = paginatedListx.subMenu;
          //console.log("recorriendo submenues " + submenues.length );
          for (var i = 0; i < submenues.length; i++) {
            if (Number(submenues[i].nivel) == 1) {
              let item = new ItemView();
              item.title = submenues[i].nombre;
              item.root = "true";
              item.bullet = 'dot';
              item.icon = submenues[i].icono;
              item.translate=submenues[i].translate;
              let opcionesMenu: Array<any> = [];
              let opciones: Array<any> = submenues[i].subMenu;
              if (opciones) {
                for (var j = 0; j < opciones.length; j++) {
                  let opcion = new ItemView();
                  opcion.title = opciones[j].nombre;
                  opcion.desc = opciones[j].nombre;
                  opcion.icon = opciones[j].icono;
                  opcion.page = opciones[j].url;
                  opcion.translate = opciones[j].translate;
                  opcionesMenu.push(opcion);
                }
                item.submenu = opcionesMenu;
              }
              items.push(item);
            }
          }
  
          
        }
        //console.log( "==gerneando menu: " + JSON.stringify(items));
        return items;
      },
        error => {
          ////console.log("==>despues de buscar usuario error  " + JSON.stringify(error));
          return error;
        }));
    }


  public logout(){
    this.removeRe000();
    this.router.navigate(['/']);
				window.location.reload(true);
				location.replace(environment.rootKey);
				//window.location.reload(true);
				this.router.navigate(['/']);
  }

  public logoutDialog(){
    console.log("===>logput ");
    console.log("===>logput " + this.store);
    this.store.dispatch(new Logout());
    this.removeRe000();
    this.router.navigate(['/']);
    window.location.reload(true);
    location.replace(environment.rootKey);;
    this.router.navigate(['/']);

  }

  
  
  public setRe000( re000 ){
    //console.log("=======================> llenmando parametros " );
    //console.log("=======================> llenmando parametros " + JSON.stringify( re000 ) );
    if( re000  ){ 
        for (var index = 1; index <= environment.paramsize; index++) {
            let key=environment.prefix + 'RE';
            if( index <10 ){
                key=key+'00'+index;
            } else {
                key=key+'0'+index; 
            }
            let p =re000[key];
            //console.log("llenando parametro " + key + " valor " + p);
            localStorage.setItem(key, p);
        }
    }
  }


  public removeRe000(  ){
		localStorage.removeItem("re1001");
    localStorage.removeItem("RE2000");
    localStorage.removeItem("RE2001");
		localStorage.removeItem("reRol");
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
	}



}
