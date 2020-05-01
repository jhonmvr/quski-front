import { Parametro } from "./Parametro";

export class UsuarioAuth {
    
    
    id: number;
    username: string;
    password: string;
    email: string;
    accessToken: string='access-token-' + Math.random();
    refreshToken:string= 'access-token-' + Math.random();
    roles:string[] =['ADMIN'];
    pic:string= './assets/app/media/img/users/user4.jpg';
    fullname:string;
    existLogin:boolean;
    
    parametros:Parametro[];
}