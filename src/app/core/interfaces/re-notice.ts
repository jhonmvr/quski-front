export declare type TipoNotificacion = 'success' | 'error' | 'info' | 'warning' | 'clear';
export interface ReNotice {
    type?: TipoNotificacion ;
    message: string;
}