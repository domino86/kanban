import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {

    baseUrl: string;

    constructor() {
        this.baseUrl = 'http://localhost:3000/backend';
    }

    public getBaseUrl() {
        return this.baseUrl;
    }

}
