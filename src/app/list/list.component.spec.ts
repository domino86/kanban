import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { CardComponent } from '../card/card.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { CardService } from '../shared/services/card.service';
import { AppConfig } from '../app.config';

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ListComponent, CardComponent ],
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
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        component.list = {
            name: 'Todo',
            status: 'todo',
            cards: []
        };
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
