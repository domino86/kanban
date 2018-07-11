import { Component, OnInit } from '@angular/core';
import { CardStore } from '../cardstore';
import { ListSchema } from '../listschema';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
    cardStore: CardStore;
    lists: ListSchema[];
    constructor(private _card: CardService) { }
    setMockData(): void {
        this.cardStore = new CardStore();
        const lists: ListSchema[] = [
            {
                name: 'To Do',
                status: 'todo',
                cards: []
            },
            {
                name: 'Doing',
                status: 'doing',
                cards: []
            },
            {
                name: 'Done',
                status: 'done',
                cards: []
            }
        ]
        this.lists = lists;
    }

    ngOnInit() {
        this.setMockData();
        this.getBoards();
    }

    getBoards() {
        this._card.getCards().subscribe(data => {
            console.log(data);
        })
    }

}
