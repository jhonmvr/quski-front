
// export declare type TipoNotificacion = 'success' | 'error' | 'info' | 'warning';
export interface AlertaAprobadorWrapper {
    codigoBpm: string;
    codigSoftbank: string;
    proceso: string;
    aprobador: string;
    tiempoInicio: Date
    tiempoTranscurrido: Date
}