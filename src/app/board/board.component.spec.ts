import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CardService } from '../shared/services/card.service';

import { BoardComponent } from './board.component';
import { ListComponent } from '../list/list.component';
import { CardComponent } from '../card/card.component';

import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppConfig } from '../app.config';

describe('BoardComponent', () => {
    let component: BoardComponent;
    let fixture: ComponentFixture<BoardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BoardComponent, ListComponent, CardComponent ],
            providers: [
                HttpTestingController,
                HttpClient,
                HttpHandler,
                CardService,
                AppConfig
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BoardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
