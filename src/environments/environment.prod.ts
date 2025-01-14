export const environment = {
  production: true,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  authTokenKey: "authce9d77b308c149d5992a80073637e4d5",
  authKey: "authcekey",
  prefix: "local",
  authprefix: "relative ",
  paramsize: 21,
  aplicacion: "1",
  wsProtocol: "ws",
  hashWebSocketKey: "RE2000",
  alertGlobalKey: "001",
  alertSpecificKey: "002",
  auditGlobalKey: "003",
  DATE_FORMAT: "dd/MM/yyyy",
  DATE_FORMAT_SOFTBANK: "yyyy-MM-dd",
  userKey: "RE2001",
  rolKey: "re1002",
  rolName: "re1001",
  rootKey: "quski-front/",
  mongoHabilitanteCollection: "documento-habilitante",
  appkey: "QUSKIBPM",
  agenciakey: "reAgencia",
  idleTime: 1800,
  idleTimeOut: 45,
  user: "qskusr01",
  password: "qskqsk2k",
  access_token: "access_token",
  token_type: "token_type",
  //DESARROLLO
  //parametros
  //app_p : 'aHR0cDovL2xvY2FsaG9zdDo4MDgwL3F1c2tpLW9yby1yZXN0L3Jlc291cmNlcy9yZWxhdGl2ZS9nZXRSZWxhdGl2ZQ==',
  //agente supervisor
  //abu : 'aHR0cDovL2xvY2FsaG9zdDo4MDgwL21pZGFzLW9yby1yZXN0L3Jlc291cmNlcy9hZ2VudGVSZXN0Q29udHJvbGxlci9hZ2VudGVPclN1cGVydmlzb3JCeVVzZXJuYW1l',
  //autenticacion
  //seg_a :"aHR0cDovL2xvY2FsaG9zdDo4MDgwL2NvcmUtc2VjdXJpdHktd2ViL3Jlc291cmNlcy9hdXRlbnRpY2FjaW9uL3NzMDAz",
  //seguridad-resources
  //seg_r :"aHR0cDovL2xvY2FsaG9zdDo4MDgwL2NvcmUtc2VjdXJpdHktd2ViL3Jlc291cmNlcy8="

  //SOFTBANK
  //parametros
  //app_p : 'aHR0cHM6Ly9hcHAucXVza2kuZWM6Mjg4ODgvZ2VuZXJpYy1yZWxhdGl2ZS1yZXN0L3Jlc291cmNlcy9yZWxhdGl2ZS9nZXRSZWxhdGl2ZQ==',
  //agente supervisor
  //abu : 'aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==',
  //autenticacion
  //seg_a :"aHR0cHM6Ly9hcHAucXVza2kuZWM6Mjg4ODgvU29mdGJhbmtBUEkvYXBpL3NlZ3VyaWRhZC9sb2dpbg==",
  //seguridad-resources
  //seg_r :"aHR0cHM6Ly9hcHAucXVza2kuZWM6Mjg4ODgvU29mdGJhbmtBUEkvYXBpL3NlZ3VyaWRhZC8=",
  //catalogo rol
  //cat_r:"aHR0cHM6Ly9hcHAucXVza2kuZWM6Mjg4ODgvU29mdGJhbmtBUEkvYXBpL2NhdGFsb2dvL3JvbA=="

  //PRODUCCION APIGW
  app_p:
    "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC9xdXNraS1nZW5lcmljLzEuMC4wL3JlbGF0aXZlL2dldFJlbGF0aXZl",
  //agente supervisor
  abu: "aHR0cDovL2xvY2FsaG9zdDoyODA4MC9taWRhcy1vcm8tcmVzdC9yZXNvdXJjZXMvYWdlbnRlUmVzdENvbnRyb2xsZXIvYWdlbnRlT3JTdXBlcnZpc29yQnlVc2VybmFtZQ==",
  //autenticacion
  seg_a:
    "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQvbG9naW4=",
  //seguridad-resources
  seg_r:
    "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9zZWd1cmlkYWQv",
  //catalogo rol
  cat_r:
    "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9jYXRhbG9nby9yb2w=",
  //catalogo division politica
  cat_dp:
    "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzo5ODg4L1NvZnRiYW5rQVBJL2FwaS9jYXRhbG9nby9kaXZpc2lvbnBvbGl0aWNh",
  //apigw
  api_t: "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC90b2tlbg==",

  apitoken:
    "blVZekRtZmdaelYyWmdEWWZCRklMbDVaNGJ3YToxdWRYQXV2bWFfc0dpcG5yUFhLbWpSb21HR0lh",

  //get qr
  seg_p:
    "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC9xdXNraWF1dGgvMS4wL2dldFFSQ29kZQ==",
  //update registro qr
  seg_udf:
    "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC9xdXNraWF1dGgvMS4wL3VwZGF0ZU1mYQ==",
  //validar otp
  seg_vdf:
    "aHR0cHM6Ly9wbGF0YWZvcm1hLW9yby5xdXNraS5lYzoyODg4OC9xdXNraWF1dGgvMS4wL3ZlcmlmeVRvdHA=",
};
