import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response,RequestOptions,HttpParams,ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoTipoOro } from '../../model/quski//TbQoTipoOro';
import { DatePipe } from '@angular/common';


@Injectable({
    providedIn: 'root'
})
export class OroService extends BaseService {

    constructor(_http: HttpClient) {
        super();
        this.http = _http;
        this.setParameter();
        //this.config =_config;

    }


    public guardarOro(oro: TbQoTipoOro) {
        let serviceUrl = this.appResourcesUrl + "tipoOroRestController/persistEntity";
        let wrapper = { entidad: oro }
        this.options = { headers: this.headers };
        return this.http.post(serviceUrl, wrapper, this.options);
    }

    updateTipoOro(tbMiTipoOro) {
        let serviceUrl = this.appResourcesUrl + "tipoOroRestController/persistEntity";
        let wrapper = { entidad: tbMiTipoOro }
        this.options = { headers: this.headers };
        return this.http.post(serviceUrl, wrapper, this.options);

    }

    public listAllBanco() {

    }

    public findTipoOroByCedulaQuski(identificacionCliente: string, kilotaje: string, fechaNacimiento: Date) {
        let pipe = new DatePipe('en-US');
        let fdf = null;
        let fdff = new Date(fechaNacimiento);
        fdff.setMinutes(fdff.getMinutes() + fdff.getTimezoneOffset());
        fdf = pipe.transform(fdff, 'dd/MM/yyyy');
        console.log("INGRESA AL SERVICIO LAFECHA ES " + fdf)
        const serviceUrl = this.appResourcesUrl + 'integracionRestController/getInformacionOferta';
        this.params = new HttpParams()
            .set('perfilRiesgo', "1")
            
            .set('origenOperacion', "N")
            .set('riesgoTotal', "0.00")
            .set('fechaNacimiento', fdf)
            .set('perfilPreferencia', "B")
            .set('agenciaOriginacion', "020")
            .set('identificacionCliente', identificacionCliente)
            .set('calificacionMupi', "S")
            .set('coberturaExcepcionada', "0")
            .set('tipoJoya', "ANI")
            .set('descripcion', "BUEN ESTADO")
            .set('estadoJoya', "BUE")
            .set('tipoOroKilataje', kilotaje)//tomo del combo
            .set('pesoGr',"7.73")
            .set('tienePiedras', "S")
            .set('detallePiedras', "PIEDRAS")
            .set('descuentoPesoPiedras', "0.73")
            .set('pesoNeto', "7.00")
            .set('precioOro', "263.72")
            .set('valorAplicableCredito', "293.02")
            .set('valorRealizacion', '232.07')
            .set('numeroPiezas',"1")
            .set('descuentoSuelda', "0.00");
        this.options = { headers: this.headers, params: this.params };
        return this.http.get(serviceUrl, this.options);
    }



    public findByEstado(dataparam, estado: string, serviceUrl: string) {
        if (dataparam) {
        }
        this.setParameter();
        serviceUrl = this.appResourcesUrl + "tipoOroRestController/getEntityByEstado";
        this.params = new HttpParams()
        this.params.set("estado", estado);
        ////console.log("==> parametros obtenidos " +  this.params.toString() );
        this.options = { headers: this.headers, params: this.params };
        return this.http.get(serviceUrl, this.options);
    }




}