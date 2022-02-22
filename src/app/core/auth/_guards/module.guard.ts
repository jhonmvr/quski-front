// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Module reducers and selectors
import { AppState} from '../../../core/reducers/';
import { currentUserPermissions } from '../_selectors/auth.selectors';
import { Permission } from '../_models/permission.model';
import { find } from 'lodash';
import { MenuHorizontalService } from '../../_base/layout/services/menu-horizontal.service';
export const menu = {"menu":[{"id":35067,"idPadre":0,"nombre":"EN PROCESO","detalle":"EN PROCESO","icono":"","uri":"/","orden":0,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":false,"direccion":null,"children":[{"id":35068,"idPadre":35067,"nombre":"BANDEJA DE OPERACION EN PROCESO","detalle":"BANDEJA DE OPERACION EN PROCESO","icono":"","uri":"/negociacion/bandeja-operaciones","orden":0,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":true,"direccion":null,"children":null},{"id":35115,"idPadre":35067,"nombre":"BANDEJA GERENCIA","detalle":"BANDEJA GERENCIA","icono":"","uri":"/negociacion/bandeja-administracion","orden":0,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":true,"direccion":null,"children":null}]},{"id":35071,"idPadre":0,"nombre":"OPERACIONES","detalle":"OPERACIONES","icono":"","uri":"/","orden":0,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":false,"direccion":null,"children":[{"id":35072,"idPadre":35071,"nombre":"BANDEJA DE ADMINISTRACION DE OPERACIONES","detalle":"BANDEJA DE ADMINISTRACION DE OPERACIONES","icono":"","uri":"/credito-nuevo/lista-credito","orden":0,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":true,"direccion":null,"children":null}]},{"id":35080,"idPadre":0,"nombre":"TRAKING","detalle":"TRAKING","icono":"","uri":"/","orden":0,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":false,"direccion":null,"children":[{"id":35081,"idPadre":35080,"nombre":"LISTADO TRAKING","detalle":"LISTADO TRAKING","icono":"","uri":"/tracking/list-tracking","orden":0,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":true,"direccion":null,"children":null}]},{"id":35113,"idPadre":0,"nombre":"REGULARIZACIONES","detalle":"REGULARIZACIONES","icono":"","uri":"","orden":0,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":false,"direccion":null,"children":[{"id":35114,"idPadre":35113,"nombre":"DOCUMENTOS CLIENTE","detalle":"DOCUMENTOS CLIENTE","icono":"","uri":"/cliente/lista-cliente","orden":1,"tieneImagen":false,"esReporte":false,"urlReporte":null,"imagen":null,"activo":true,"esParteRol":true,"direccion":null,"children":null}]}],"existeError":false,"mensaje":null,"descripcion":null,"codigoServicio":"200","validaciones":null};
@Injectable()
export class ModuleGuard implements CanActivate {
    constructor(private store: Store<AppState>, private router: Router, 
		public menuHorService: MenuHorizontalService,) { }

    findUri(element,url){
        if(element.page == url){
            return true;
       }else if (element.submenu){
            var i;
            var result = false;
            for(i=0; result == false && i < element.submenu.length; i++){
                 result = this.findUri(element.submenu[i], url);
            }
            return result;
       }
       return false;        
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
        const moduleName = route.data.moduleName as Array<string>;
        var result = false;
        return of(true);
        if(moduleName && moduleName.length >0){
            moduleName.forEach(p=>{
                if (state.url.indexOf(p) !== -1) {
                    result = true;
                }
            });
            if(result)
                return of(result);
        }
      
        
        let x = this.findUri({submenu:this.menuHorService.menuList$.getValue()  },state.url);
        if(!x){
            this.router.navigateByUrl('/error/403');
        }
        return of(x);
    }

   
}
