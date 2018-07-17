import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CardService } from '../shared/services/card.service';
import { AppConfig } from '../app.config';

describe('CardComponent', () => {
    let component: CardComponent;
    let fixture: ComponentFixture<CardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CardComponent ],
            providers: [
                HttpTestingController,
                HttpClient,
                HttpHandler,
                CardService,
                AppConfig
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardComponent);
        component = fixture.componentInstance;
        component.card = {
            _id: 'test',
            status: 'todo',
            description: 'test',
            sort: 0
        }
        component.index = 0;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();

    });
});
