import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
//import { Http, Headers, Response,RequestOptions,HttpParams,ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TbQoTipoOro } from '../../model/quski/TbQoTipoOro';
import { DatePipe } from '@angular/common';


@Injectable({
    providedIn: 'root'
})
export class TipoOroService extends BaseService {

    constructor(_http: HttpClient) {
        super();
        this.http = _http;
        this.setParameter();
        //this.config =_config;
    }
    public persistEntity(oro: TbQoTipoOro) {
        let serviceUrl = this.appResourcesUrl + "tipoOroRestController/persistEntity";
        let wrapper = { entidad: oro }
        this.options = { headers: this.headers };
        return this.http.post(serviceUrl, wrapper, this.options);
    }
    public listAllEntities() {
        let serviceUrl = this.appResourcesUrl + "tipoOroRestController/listAllEntities";
        this.options = { headers: this.headers, params: this.params };
        return this.http.get(serviceUrl, this.options);
    }
}