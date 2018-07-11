import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './card/card.component';
import { ListComponent } from './list/list.component';

import { AppConfig } from './app.config';
import { CardService } from './shared/services/card.service';

@NgModule({
    declarations: [
        AppComponent,
        BoardComponent,
        CardComponent,
        ListComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule
    ],
    providers: [
        AppConfig,
        CardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
