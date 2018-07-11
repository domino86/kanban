import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from '../../app.config';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CardService {

    uri: string;

    constructor(private _http: HttpClient,
                private _config: AppConfig

    ) {
        this.uri = this._config.getBaseUrl();
    }

    getCards() {
        return this._http.get(`${this.uri}/todos`, httpOptions);
    }

    addCard(data) {
        console.log(data);
        return this._http.post(`${this.uri}/todos`, data, httpOptions);
    }

}


