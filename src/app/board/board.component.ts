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
    ready: boolean;
    constructor(private _card: CardService) {
        this.ready = false;
    }
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
        this.getBoards();
    }

    getBoards() {
        this.setMockData();
        this._card.getCards().subscribe(data => {
            console.log(data);
            const response = data;
            if (response['data'].hasOwnProperty('docs')) {
                response['data'].docs.forEach(listResponse => {
                    console.log(listResponse);
                    for (let list in this.lists) {
                        console.log(this.lists[list]);
                        console.log(list);
                        if (listResponse['status'] === this.lists[list].status) {
                            this.lists[list].cards.push(listResponse);
                        }
                    }
                })
                console.log(this.lists);
            }
        })
    }

}
