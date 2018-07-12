import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from '../../app.config';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class CardService {

    uri: string;
    private messageSource = new BehaviorSubject({_id: '', status: '', description: ''});
    currentMessage = this.messageSource.asObservable();


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

    updateCard(data) {
        console.log(data);
        return this._http.put(`${this.uri}/todos`, data, httpOptions);
    }

    deleteCard(id) {
        return this._http.delete(`${this.uri}/todos/${id}`, httpOptions);
    }

    changeMessage(message) {
        this.messageSource.next(message)
    }

}


