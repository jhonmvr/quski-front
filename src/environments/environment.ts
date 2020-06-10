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
    paramsize:13,
    aplicacion:'1',
    wsProtocol:'ws',
    hashWebSocketKey:"RE2000",
    alertGlobalKey:"001",
    alertSpecificKey:"002",
    auditGlobalKey:"003",
    DATE_FORMAT:'dd/MM/yyyy',
    userKey:"RE2001",
    rolKey:"re1002",
    rootKey:"/quski-front/",
    mongoHabilitanteCollection:'documento-habilitante',
    //DESARROLLO
    //parametros
    app_p : 'aHR0cDovL2xvY2FsaG9zdDo4MDgwL2dlbmVyaWMtcmVsYXRpdmUtcmVzdC9yZXNvdXJjZXMvcmVsYXRpdmUvZ2V0UmVsYXRpdmU=',
    //agente supervisor
    abu : 'aHR0cDovL2xvY2FsaG9zdDo4MDgwL21pZGFzLW9yby1yZXN0L3Jlc291cmNlcy9hZ2VudGVSZXN0Q29udHJvbGxlci9hZ2VudGVPclN1cGVydmlzb3JCeVVzZXJuYW1l',
    //autenticacion 
    seg_a :"aHR0cDovL2xvY2FsaG9zdDo4MDgwL2NvcmUtc2VjdXJpdHktd2ViL3Jlc291cmNlcy9hdXRlbnRpY2FjaW9uL3NzMDAz",
    //seguridad-resources
    seg_r :"aHR0cDovL2xvY2FsaG9zdDo4MDgwL2NvcmUtc2VjdXJpdHktd2ViL3Jlc291cmNlcy8="
    
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
