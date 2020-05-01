export declare type TipoNotificacion = 'success' | 'error' | 'info' | 'warning';
export interface ReNotice {
    type?: TipoNotificacion ;
    message: string;
}