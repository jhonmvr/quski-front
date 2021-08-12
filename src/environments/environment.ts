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
    paramsize:21,
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
    idleTime:40000,
    idleTimeOut:10000,
    user:"qskusr01",
    password:"qskqsk2k",
    access_token:"access_token",
    token_type:"token_type",
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
      //app_p : 'aHR0cDovL2FwcC5xdXNraS5lYzoxODQ4MC9nZW5lcmljLXJlbGF0aXZlLXJlc3QvcmVzb3VyY2VzL3JlbGF0aXZlL2dldFJlbGF0aXZl',
      //agente supervisor
      //abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
      //autenticacion 
      //seg_a :"aHR0cDovL2FwcC5xdXNraS5lYzoxODA5NC9Tb2Z0YmFua0FQSS9hcGkvc2VndXJpZGFkL2xvZ2lu",
      //seguridad-resources
      //seg_r :"aHR0cDovL2FwcC5xdXNraS5lYzoxODA5NC9Tb2Z0YmFua0FQSS9hcGkvc2VndXJpZGFkLw==",
      //catalogo rol
      //cat_r:"aHR0cHM6Ly9hcHAucXVza2kuZWM6Mjg4ODgvU29mdGJhbmtBUEkvYXBpL2NhdGFsb2dvL3JvbA=="

 //PRODUCCION APIGW
 app_p : 'aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC9xdXNraS1nZW5lcmljLzEuMC4wL3JlbGF0aXZlL2dldFJlbGF0aXZl',
 //agente supervisor
 abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
 //autenticacion 
 seg_a :"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQvbG9naW4=",
 //seguridad-resources
 seg_r :"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQv",
 //catalogo rol
 cat_r:"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9jYXRhbG9nby9yb2w=",
 //apigw
 api_t:"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC90b2tlbg==",
 
 apitoken:'blVZekRtZmdaelYyWmdEWWZCRklMbDVaNGJ3YToxdWRYQXV2bWFfc0dpcG5yUFhLbWpSb21HR0lh',


 //PRE-PRODUCCION
 //app_p : 'aHR0cHM6Ly9hcGlndy5xdXNraS5lYzo4MjQzL3F1c2tpLWdlbmVyaWMvMS4wLjAvcmVsYXRpdmUvZ2V0UmVsYXRpdmU',
 //agente supervisor
 //abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
 //autenticacion 
 //seg_a :"aHR0cDovLzEwLjM3LjEwLjE1MDo4MDk0L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQvbG9naW4=",
 //seguridad-resources
 //seg_r :"aHR0cDovLzEwLjM3LjEwLjE1MDo4MDk0L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQv",
 //catalogo rol
 //cat_r:"aHR0cDovLzEwLjM3LjEwLjE1MDo4MDk0L1NvZnRiYW5rQVBJL2FwaS9jYXRhbG9nby9yb2w=",
 //apigw
 //api_t:"aHR0cHM6Ly8xMC4zNy4xMC4xODA6ODI0My90b2tlbg==",
 
 //apitoken:'NVJBWWtPWXl0WUlNc2FwX3o4QVp6R2JBc0hnYTpEYnUzWkhGVDRYaENFbWZIX001bkhKV3pESUVh',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
