import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CardSchema } from '../cardschema';
import { ListSchema } from '../listschema';
import { CardStore } from '../cardstore';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    @Input() list: ListSchema;
    @Input() cardStore: CardStore;
    displayAddCard = false;

    constructor(private _card: CardService) { }
    toggleDisplayAddCard() {
        this.displayAddCard = ! this.displayAddCard;
    }

    ngOnInit(): void {
        console.log(this.list.cards);
    }

    allowDrop($event) {
        $event.preventDefault();
    }

    drop($event) {
        $event.preventDefault();
        const data = $event.dataTransfer.getData('card');

        let target = $event.target;
        const targetClassName = target.className;

        while (target.className !== 'list') {
            target = target.parentNode;
        }

        target = target.querySelector('.cards');
        console.log(target.parentNode.children[0].getAttribute('status'));
        let status = target.parentNode.children[0].getAttribute('status');
        let description = document.getElementById(data).textContent;
        let newData = {
            _id: data,
            status: status,
            description: description
        };

        this._card.updateCard(newData).subscribe(data => {
            console.log(data);
        })

        if (targetClassName === 'card') {
            $event.target.parentNode.insertBefore(document.getElementById(data), $event.target);
        } else if (targetClassName === 'list__title') {
            if (target.children.length) {
                target.insertBefore(document.getElementById(data), target.children[0]);
            } else {
                target.appendChild(document.getElementById(data));
            }
        } else {
            target.appendChild(document.getElementById(data));
        }

    }

    onEnter(value: string) {
        console.log(value);
        const cardId =  this.cardStore.newCard(value);
        console.log(this.list.cards);

        const data = {
            status: this.list.status,
            description: value
        };
        this._card.addCard(data).subscribe(response => {
            this.list.cards.push(response['data']);
        });
    }

    updateCard(event) {
        console.log(event);
        this.list.cards.forEach((card, index) => {
            if (card['_id'] === event._id) {
                this.list.cards[index] = event;
            }
        });
        console.log(this.list.cards);
    }

    deleteCard(id) {
        console.log(id);
        this.list.cards.forEach((card, index) => {
            if (card['_id'] === id) {
                this.list.cards.splice(index, 1);
            }
        });
        console.log(this.list.cards);
    }


}
