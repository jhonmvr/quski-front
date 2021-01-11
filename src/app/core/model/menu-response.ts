export class MenuResponse {
   // opcionId: string;
   // opcionPadre: string;
   // nombre: string;
   // url: string;
   // nivel: string;
   // icono: string;
   // accesoModulo: string;
   // translate: string;
   // subMenu: MenuResponse[];
    id: number;
    idPadre: number;
    nombre: string;
    detalle: string;
    icono: string;
    uri: string;
    orden: number;
    tieneImagen: boolean;
    esReporte: boolean;
    urlReporte: string;
    imagen: string;
    activo: boolean;
    esParteRol: boolean;
    direccion: string;
    children: MenuResponse[];
}