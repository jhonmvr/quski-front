export class MenuResponse {
    opcionId: string;
    opcionPadre: string;
    nombre: string;
    url: string;
    nivel: string;
    icono: string;
    accesoModulo: string;
    translate: string;
    subMenu: MenuResponse[];
}