import { Component, OnInit } from '@angular/core';
import { CardStore } from '../cardstore';
import { ListSchema } from '../listschema';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
    cardStore: CardStore;
    lists: ListSchema[];
    ready: boolean;

    constructor(private _card: CardService) {
        this.ready = false;
    }

    ngOnInit() {
        this.getBoards();
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
                name: 'In progress',
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

    getBoards() {
        this.setMockData();
        this._card.getCards().subscribe(data => {
            const response = data;
            if (response['data'].hasOwnProperty('docs')) {
                response['data'].docs.forEach((listResponse, index) => {
                    // TODO nicer than second loop
                    for (let list in this.lists) {
                        if (listResponse['status'] === this.lists[list].status) {
                            this.lists[list].cards.push(listResponse);
                        }
                    }
                    this.ready = true;
                })
                if (response['data']['docs'].length === 0) {
                    this.ready = true;
                }
            }
        })
    }

}
