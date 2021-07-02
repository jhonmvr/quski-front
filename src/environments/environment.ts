// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	isMockEnabled: true, // You have to switch this, when your real back-end is done
    authTokenKey: 'authce9d77b308c149d5992a80073637e4d5',
    authKey: 'authcekey',
    prefix:'local',
    authprefix:'relative ',
    paramsize:19,
    aplicacion:'1',
    wsProtocol:'ws',
    hashWebSocketKey:"RE2000",
    alertGlobalKey:"001",
    alertSpecificKey:"002",
    auditGlobalKey:"003",
    DATE_FORMAT:'dd/MM/yyyy',
    DATE_FORMAT_SOFTBANK:'yyyy-MM-dd',
    userKey:"RE2001",
    rolKey:"re1002",
    rolName:"re1001",
    rootKey:"quski-front/",
    mongoHabilitanteCollection:'documento-habilitante',
    appkey:"QUSKIBPM",
    agenciakey:"reAgencia",
    /** @SOFTBANK @DESARROLLO @JHON **/
    //app_p : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9nZW5lcmljLXJlbGF0aXZlLXJlc3QvcmVzb3VyY2VzL3JlbGF0aXZlL2dldFJlbGF0aXZl',
    /** @SOFTBANK @DESARROLLO @JEROHAM **/
    //app_p : 'aHR0cDovL2xvY2FsaG9zdDo4MDgwL2dlbmVyaWMtcmVsYXRpdmUtcmVzdC9yZXNvdXJjZXMvcmVsYXRpdmUvZ2V0UmVsYXRpdmU',
    /** @AUTENTICACION **/
    //seg_a :"aHR0cDovLzE4Ni42OS4xNjcuMjY6MTk5MS9hcGkvc2VndXJpZGFkL2xvZ2lu",
    /** @SEGURIDAD_RESOURCES **/
    //seg_r :"aHR0cDovLzE4Ni42OS4xNjcuMjY6MTk5MS9hcGkvc2VndXJpZGFkLw",
    //agente supervisor
    //abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
    
      //SOFTBANK PRUEBAS
      app_p : 'aHR0cDovL2FwcC5xdXNraS5lYzoxODQ4MC9nZW5lcmljLXJlbGF0aXZlLXJlc3QvcmVzb3VyY2VzL3JlbGF0aXZlL2dldFJlbGF0aXZl',
      //agente supervisor
      abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
      //autenticacion 
      seg_a :"aHR0cDovL2FwcC5xdXNraS5lYzoxODA5NC9Tb2Z0YmFua0FQSS9hcGkvc2VndXJpZGFkL2xvZ2lu",
      //seguridad-resources
      seg_r :"aHR0cDovL2FwcC5xdXNraS5lYzoxODA5NC9Tb2Z0YmFua0FQSS9hcGkvc2VndXJpZGFkLw==",
      //catalogo rol
      cat_r:"aHR0cHM6Ly9hcHAucXVza2kuZWM6Mjg4ODgvU29mdGJhbmtBUEkvYXBpL2NhdGFsb2dvL3JvbA=="


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
