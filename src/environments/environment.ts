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
    paramsize:14,
    aplicacion:'1',
    wsProtocol:'ws',
    hashWebSocketKey:"RE2000",
    alertGlobalKey:"001",
    alertSpecificKey:"002",
    auditGlobalKey:"003",
    DATE_FORMAT:'dd/MM/yyyy',
    userKey:"RE2001",
    rolKey:"re1002",
    rolName:"re1001",
    rootKey:"quski-front/",
    mongoHabilitanteCollection:'documento-habilitante',
    appkey:"QUSKIBPM",
    agenciakey:"reAgencia",
    //SOFTBANK desarollo
    //parametros
    //app_p : 'aHR0cDovL2FwaWd3LnF1c2tpLmVjOjg0ODAvZ2VuZXJpYy1yZWxhdGl2ZS1yZXN0L3Jlc291cmNlcy9yZWxhdGl2ZS9nZXRSZWxhdGl2ZQo=',
    //agente supervisor
    //abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
    //autenticacion 
    //seg_a :"aHR0cDovLzIwMS4xODMuMjM4LjczOjE5OTEvYXBpL3NlZ3VyaWRhZC9sb2dpbg==",
    //seguridad-resources
    //seg_r :"aHR0cDovLzIwMS4xODMuMjM4LjczOjE5OTEvYXBpL3NlZ3VyaWRhZC8="
    
      //SOFTBANK PRUEBAS
    //parametros
    app_p : 'aHR0cDovLzEwLjM3LjEwLjE4MDo4NDgwL2dlbmVyaWMtcmVsYXRpdmUtcmVzdC9yZXNvdXJjZXMvcmVsYXRpdmUvZ2V0UmVsYXRpdmU',
    //agente supervisor
    abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
    //autenticacion 
    seg_a :"aHR0cDovLzEwLjM3LjEwLjU4OjgwOTQvU29mdGJhbmtBUEkvYXBpL3NlZ3VyaWRhZC9sb2dpbgo=",
    //seguridad-resources
    seg_r :"aHR0cDovLzEwLjM3LjEwLjU4OjgwOTQvU29mdGJhbmtBUEkvYXBpL3NlZ3VyaWRhZC8="

    //DESARROLLO
    //parametros
    //app_p : 'aHR0cDovL2xvY2FsaG9zdDo4MDgwL2dlbmVyaWMtcmVsYXRpdmUtcmVzdC9yZXNvdXJjZXMvcmVsYXRpdmUvZ2V0UmVsYXRpdmU=',
    //agente supervisor
    //abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
    //autenticacion 
    //seg_a :"aHR0cDovLzIwMS4xODMuMjM4LjczOjE5OTEvYXBpL3NlZ3VyaWRhZC9sb2dpbg==",
    //seguridad-resources
    //seg_r :"aHR0cDovLzIwMS4xODMuMjM4LjczOjE5OTEvYXBpL3NlZ3VyaWRhZC8="
    //pruebas
    //cpu : 'aHR0cDovLzE4Ni40LjE5OS4xNzY6MTg0ODAvbWlkYXMtb3JvLXJlc3QvcmVzb3VyY2VzL3JlbGF0aXZlL2dldFJlbGF0aXZl',
    //abu : 'aHR0cDovL2xvY2FsaG9zdDo4MDgwL21pZGFzLW9yby1yZXN0L3Jlc291cmNlcy9hZ2VudGVSZXN0Q29udHJvbGxlci9hZ2VudGVPclN1cGVydmlzb3JCeVVzZXJuYW1l',
    //asau :"aHR0cDovLzE4Ni40LjE5OS4xNzY6MTg0ODAvY29yZS1zZWN1cml0eS13ZWIvcmVzb3VyY2VzL2F1dGVudGljYWNpb24vc3MwMDE=",
    //asar :"aHR0cDovL2xvY2FsaG9zdDo4MDgwL2NvcmUtc2VjdXJpdHktd2ViL3Jlc291cmNlcy8="
   
    //preproduccion
    //cpu : 'aHR0cDovLzE4Ni40LjE5OS4xNzY6MTg0ODAvbWlkYXMtb3JvLXJlc3QvcmVzb3VyY2VzL3JlbGF0aXZlL2dldFJlbGF0aXZl',
    //abu : 'aHR0cDovL2xvY2FsaG9zdDo4MDgwL21pZGFzLW9yby1yZXN0L3Jlc291cmNlcy9hZ2VudGVSZXN0Q29udHJvbGxlci9hZ2VudGVPclN1cGVydmlzb3JCeVVzZXJuYW1l',
    //asau :"aHR0cDovLzE4Ni40LjE5OS4xNzY6MTg0ODAvY29yZS1zZWN1cml0eS13ZWIvcmVzb3VyY2VzL2F1dGVudGljYWNpb24vc3MwMDE=",
    //asar :"aHR0cDovL2xvY2FsaG9zdDo4MDgwL2NvcmUtc2VjdXJpdHktd2ViL3Jlc291cmNlcy8="
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
