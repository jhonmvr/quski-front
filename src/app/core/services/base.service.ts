import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Page } from '../model/page';
import { Parametro } from '../model/Parametro';
import { throwError } from 'rxjs';
import { BaseWrapper } from '../model/basewrapper';
import { environment } from '../../../environments/environment';
import { ReNoticeService } from './re-notice.service';
import { AuthDialogComponent } from '../../views/partials/custom/auth-dialog/auth-dialog.component';

export class BaseService {
  public headers: HttpHeaders;
  // public optionsOld: RequestOptions;
  public options;
  public services: any;
  public params: HttpParams;
  public http: HttpClient;
  // public httpOld:Http;
  public parametros: Array<Parametro>;

  public segRootContextUrl: string;
  public segResourcesUrl: string;
  public appRootContextUrl: string;
  public appResourcesUrl: string;
  public crmResourcesUrl: string;
  public appWebSocketUrl: string;
  public menuServiceUrl: string;
  public userRolServiceUrl: string;

  public genericResourcesUrl: string;
  public mongoDb: string;
  public mongoAlertaColeccion: string;

  public keyUnencrypt: string;

  public idleStart: string;
  public idelTimeout: string;
  public versionFront: string;

  public softBaseBankUrl:string;  

  constructor() {
    this.params = new HttpParams();
    if (localStorage.getItem('reUser')) {
      this.headers= new HttpHeaders({ 'Content-Type': 'application/json' });
      //console.log("Hola, creaste los headers");
      if( localStorage.getItem( environment.authTokenKey ) ){
        this.headers=new HttpHeaders({ 
          'Authorization':environment.authprefix+ localStorage.getItem(environment.authTokenKey),
          'Content-Type': 'application/json' }
          );
      }
      this.options = {
          headers: this.headers,
      };
    }
  }

  public dataURItoBlob(dataURI) {
    var byteString = atob(dataURI);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ab]);
    return blob;
  }
  public setParameter() {
           localStorage.setItem('setRE000', 'true');
           this.keyUnencrypt = atob( localStorage.getItem(environment.prefix +'RE011'));
           //Url de acceso al rootcontext de seguridad core-security-web
           this.segRootContextUrl = atob(localStorage.getItem( environment.prefix +  'RE001')).replace(this.keyUnencrypt, '');
           //Url de acceso al resources de seguridad core-security-web
           this.segResourcesUrl = atob(localStorage.getItem( environment.prefix + 'RE002')).replace(this.keyUnencrypt, '');
           //Full url para datos de usuario por rol core-security-web
           this.userRolServiceUrl = atob(localStorage.getItem( environment.prefix + 'RE003')).replace(this.keyUnencrypt, '');
           //Full url par datos del servicio core-security-web
           this.menuServiceUrl = atob(localStorage.getItem( environment.prefix + 'RE004')).replace(this.keyUnencrypt, '');
           //Path al rootcontext de la app 
           this.appRootContextUrl = atob(localStorage.getItem( environment.prefix + 'RE005')).replace(this.keyUnencrypt, '');
           //Path al resources de la app
           this.appResourcesUrl = atob(localStorage.getItem( environment.prefix + 'RE006')).replace(this.keyUnencrypt, '');

           this.appRootContextUrl = 'http://localhost:8080/quski-oro-rest/';
           //Path al resources de la app
           this.appResourcesUrl = 'http://localhost:8080/quski-oro-rest/resources/';

           //Full url al servidor de websocket generic-relative-core
           this.appWebSocketUrl = atob(localStorage.getItem( environment.prefix + 'RE007')).replace(this.keyUnencrypt, '');
           //Path contextroot generic-relative-core
           this.genericResourcesUrl = atob(localStorage.getItem( environment.prefix + 'RE008')).replace(this.keyUnencrypt, '');

           this.appWebSocketUrl = 'ws://localhost:8080/generic-relative-rest/relativews/';
           this.genericResourcesUrl = 'http://localhost:8080/generic-relative-rest/resources/';
           
           //object storage 
           this.mongoDb = atob(localStorage.getItem( environment.prefix + 'RE009')).replace(this.keyUnencrypt, '');
           this.mongoAlertaColeccion = atob(localStorage.getItem( environment.prefix + 'RE010')).replace(this.keyUnencrypt, '');
           //parametros quski
           this.crmResourcesUrl = atob(localStorage.getItem( environment.prefix + 'RE012')).replace(this.keyUnencrypt, '');
           //parametros cloudstudio
           this.softBaseBankUrl = atob(localStorage.getItem( environment.prefix + 'RE013')).replace(this.keyUnencrypt, '');
           
  } 
  
  /* public setParameter() {
    localStorage.setItem('setRE000', 'true');
    this.keyUnencrypt = atob( localStorage.getItem(environment.prefix +'RE011'));
    //Url de acceso al rootcontext de seguridad core-security-web
    this.segRootContextUrl = 'http://localhost:28080/core-security-web/';
    //Url de acceso al resources de seguridad core-security-web
    this.segResourcesUrl = 'http://localhost:28080/core-security-web/resources/';
    //Full url para datos de usuario por rol core-security-web
    this.userRolServiceUrl = 'http://localhost:28080/core-security-web/resources/usuarioRolRestController/getEntitiesByUsuario';
    //Full url par datos del servicio core-security-web
    //Path al rootcontext de la app 
    this.appRootContextUrl = 'http://localhost:28080/quski-oro-rest/';
    //Path al resources de la app
    this.appResourcesUrl = 'http://localhost:28080/quski-oro-rest/resources/';
    //Full url al servidor de websocket generic-relative-core
    this.appWebSocketUrl = 'ws://localhost:28080/generic-relative-rest/relativews/';
    //Path contextroot generic-relative-core
    //this.genericResourcesUrl = 'http://186.4.199.176:18080/generic-relative-rest/resources/';
    this.genericResourcesUrl = 'http://localhost:28080/generic-relative-rest/resources/';
    //object storage 
    this.mongoDb = atob(localStorage.getItem( environment.prefix + 'RE009')).replace(this.keyUnencrypt, '');
    this.mongoAlertaColeccion = atob(localStorage.getItem( environment.prefix + 'RE010')).replace(this.keyUnencrypt, '');
    //parametros quski
    this.crmResourcesUrl = 'http://localhost:28080/quski-oro-satelite-crm-rest/resources/';
    //parametros cloudstudio
    this.softBaseBankUrl = atob(localStorage.getItem( environment.prefix + 'RE013')).replace(this.keyUnencrypt, '');
  } */
  

  public getSystemDate() {
    this.options = { headers: this.headers };      
    return this.http.get(
      this.genericResourcesUrl + 'parametroRestController/getSystemDate',
      this.options
    );
  }
  public setHeaderWithSegToken(token: string) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    });
  }

  /**
   * Metodo que setea los parametros de busqueda necesarios para la paguinacion
   * @param page: Page
   * @param page = page.pageNumber
   * @param pageSize = page.size  *
   * @returns this.params = new HttpParams();
   * @see mira un ejemplo en AgenciaListComponent
   * @author Jhon Romero
   */
  public setSearchParams(page: Page) {
    this.params = new HttpParams();
    this.params = this.params.set('page', '' + page.pageNumber);
    this.params = this.params.append('pageSize', '' + page.size);
    if (page.sortFields && page.sortFields !== '') {
      this.params = this.params.append('sortFields', page.sortFields);
    }
    if (page.sortDirections && page.sortDirections !== '') {
      this.params = this.params.append('sortDirections', page.sortDirections);
    }
    this.params = this.params.append('isPaginated', page.isPaginated);
  }

  public getAllPaginatedUrl(page: Page, url: string) {
    this.setSearchParams(page);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(url, this.options);
  }

  public findByPkurl(id: string, serviceUrl: string) {
    this.params = new HttpParams();
    this.params = this.params.set('id', id);
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public findByParams(params: HttpParams, serviceUrl: string) {
    this.params = params;
    this.options = { headers: this.headers, params: this.params };
    return this.http.get(serviceUrl, this.options);
  }

  public manageurl(entidad, serviceUrl: string) {
    this.options = { headers: this.headers };
    const dataEnvio = { entidad: entidad };
    return this.http.post<any>(serviceUrl, dataEnvio, this.options);
  }

   public manageGenericUrl(wrapper: BaseWrapper, serviceUrl: string) {
    //console.log('==> manageGenericUrlxx ' + JSON.stringify(wrapper));
    //console.log('==> url ' + serviceUrl);
    this.options = { headers: this.headers };
    return this.http.post<BaseWrapper>(serviceUrl, wrapper, this.options);
  }

  public generateToken() {
    
    // if (!localStorage.getItem(AppConfig.TOKEN_KEY)) {
    //   localStorage.removeItem(AppConfig.TOKEN_KEY);
    //   localStorage.removeItem(AppConfig.EXPIRATION_TOKEN_KEY);
    //   localStorage.removeItem(AppConfig.REFRESH_TOKEN_KEY);
    //   return this.getToken(user, password);
    // } else if (localStorage.getItem(AppConfig.EXPIRATION_TOKEN_KEY)) {
    //   return this.refreshToken();
    // }
  }



  public callGenericServiceAPIJSON() {
    // this.params = new HttpParams();
    // const headers = new Headers({
    //   'Content-Type': 'application/json',
    //   Accept: 'application/json',
    //   Authorization:
    //     AppConfig.authorizationPrefixApi +
    //     localStorage.getItem(AppConfig.TOKEN_KEY)
    // });
    // this.params.set('grant_type', 'client_credentials');
    // this.options = { headers: headers, params: this.params };
    // return this.http.post(
    //   this.segApiUrl + service + '/' + version,
    //   data,
    //   this.options
    // );
  }

  public callGenericServiceAPIJXML() {
    // this.params = new HttpParams();
    // const headers = new Headers({
    //   'Content-Type': 'text/xml',
    //   Accept: 'text/xml',
    //   Authorization:
    //     AppConfig.authorizationPrefixApi +
    //     localStorage.getItem(AppConfig.TOKEN_KEY)
    // });
    // this.params.set('grant_type', 'client_credentials');
    // this.options = { headers: headers, params: this.params };
    // return this.http.post(
    //   this.segApiUrlToken + service + '/' + version,
    //   data,
    //   this.options
    // );
  }

  findBytebyIdUrl(url: string, id: string, fileType: string) {
    //console.log('findBytebyIdUrl');
    this.params = new HttpParams();
    this.params.set('id', id);
    this.params.set('fileType', fileType);
    this.options = {
      headers: this.headers,
      params: this.params,
      responseType: 'blob'
    };
    //console.log('findBytebyIdUrl options ' + this.options);
    return this.http.get(
      url + '?id=' + id + '&codigo=' + fileType,
      this.options
    );
  }

  public notifyService() {
    // this.getTokenCore().subscribe(rData => {
    //   this.params = new HttpParams();
    //   const headers = new Headers({
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //     Authorization: AppConfig.authorizationPrefixApi
    //   });
    //   this.options = { headers: headers, params: this.params };
    //   return this.http.post(
    //     this.apiUrlService +
    //       'ssagw/gestor-notificacion-rest/v1.0/notificationRestController/sendMessages',
    //       rData,
    //     this.options
    //   );
    // });
  }

  public notifyServiceSeguridad() {
    // this.getToken(null, null).subscribe(token => {
    //   this.envioNotificacion(data, token).subscribe(respuesta => {});
    // });
  }



  

}
