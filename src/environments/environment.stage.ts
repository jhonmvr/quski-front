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
 //app_p : 'aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC9xdXNraS1nZW5lcmljLzEuMC4wL3JlbGF0aXZlL2dldFJlbGF0aXZl',
 //agente supervisor
 //abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
 //autenticacion 
 //seg_a :"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQvbG9naW4=",
 //seguridad-resources
 //seg_r :"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQv",
 //catalogo rol
 //cat_r:"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9jYXRhbG9nby9yb2w=",
 //apigw
 //api_t:"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC90b2tlbg==",
 
 //apitoken:'blVZekRtZmdaelYyWmdEWWZCRklMbDVaNGJ3YToxdWRYQXV2bWFfc0dpcG5yUFhLbWpSb21HR0lh',


 //PRE-PRODUCCION
 app_p : 'aHR0cDovLzEwLjM3LjEwLjE4MDo4NDgwL2dlbmVyaWMtcmVsYXRpdmUtcmVzdC9yZXNvdXJjZXMvcmVsYXRpdmUvZ2V0UmVsYXRpdmU=',
 //agente supervisor
 abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
 //autenticacion 
 seg_a :"aHR0cDovLzEwLjM3LjEwLjE1MDo4MDk0L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQvbG9naW4=",
 //seguridad-resources
 seg_r :"aHR0cDovLzEwLjM3LjEwLjE1MDo4MDk0L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQv",
 //catalogo rol
 cat_r:"aHR0cDovLzEwLjM3LjEwLjE1MDo4MDk0L1NvZnRiYW5rQVBJL2FwaS9jYXRhbG9nby9yb2w=",
 //catalogo division politica
 cat_dp:"aHR0cDovLzEwLjM3LjEwLjE1MDo4MDk0L1NvZnRiYW5rQVBJL2FwaS9jYXRhbG9nby9kaXZpc2lvbnBvbGl0aWNh",
 //apigw
 api_t:"aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC90b2tlbg",
 
 apitoken:'eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkE9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbkBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImFkbWluIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJhcGxpY2FjaW9ubG9naW4iLCJpZCI6NywidXVpZCI6ImE1ZTEyYjAxLWJlNTctNDZjMi1hMjgxLTU4MDM0MDQ1ODY0OCJ9LCJpc3MiOiJodHRwczpcL1wvYXBpZ3cucXVza2kuZWM6OTQ0M1wvb2F1dGgyXC90b2tlbiIsInRpZXJJbmZvIjp7fSwia2V5dHlwZSI6IlNBTkRCT1giLCJwZXJtaXR0ZWRSZWZlcmVyIjoiIiwic3Vic2NyaWJlZEFQSXMiOltdLCJwZXJtaXR0ZWRJUCI6IiIsImlhdCI6MTYyODMyMDMzNiwianRpIjoiODIxYTA2MTEtY2EwMi00YmFhLTliYjctNjQ0OTY3ODYwOWNjIn0=.HSxrsmAHYo5ZzukNpucPQlonsTrMSCOeTaNRwso1xWGONi44f8zuP-2ZMcKNOgArlZ4qzWzmySpfD1xHpGMjoMUk4qhSgAjxVnsVvp1DDycieLOLf1INbXBhT3BgimRWZxNkxsGyLK-q6H_HyiSQIoBGeuHBuV28Z7xrGqQYV7h3L-BH15fU6B7ZmrXZidRiu9723w80eLVC0y7RBx8fEP3L13DeWv1N6QsL7KtSSzmFxhgwyBZgOlhslPBzgZn12DxirlCtJ-37a1xtXp9n6afuFSrQHwIh_MD8y9NnD0umTMVg5Z6WCkjh5Bagx8gssHu3SVvNHqEw_Ixa_9BXmg==',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
