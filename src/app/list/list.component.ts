import { Component, HostListener, Input, OnInit, EventEmitter } from '@angular/core';
import { CardSchema } from '../cardschema';
import { ListSchema } from '../listschema';
import { CardStore } from '../cardstore';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    @Input() list: ListSchema;
    @Input() cardStore: CardStore;
    displayAddCard = false;

    constructor(private _card: CardService) {

    }

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

        const status = target.parentNode.children[0].getAttribute('status');
        const description = document.getElementById(data).textContent;
        const newData = {
            _id: data,
            status: status,
            description: description
        };
        console.log(newData);

        this._card.changeMessage(newData);

        console.log(newData);
        this._card.updateCard(newData).subscribe(() => {
            this.list.cards.forEach((card, index) => {
                if (newData._id === card['_id']) {
                    this.list.cards[index]['_id'] = newData._id;
                    this.list.cards[index]['status'] = newData.status;
                    this.list.cards[index]['description'] = newData.description;
                }
            });
            // TODO update card
        });

    }

    onEnter(value: string) {
        if (value !== '') {
            const data = {
                status: this.list.status,
                description: value
            };
            this._card.addCard(data).subscribe(response => {
                this.list.cards.push(response['data']);
            });
        }
    }

    deleteCard(id) {
        console.log(id);
        const findStatus = this.list.cards.filter(item => item._id === id);
        console.log(findStatus);
        console.log(this.list.cards);

        this._card.deleteCard(id).subscribe(response => {
            this.list.cards = findStatus.filter(item => item.id !== id);
            }, (error) => {
            console.log(error);
        })

    }


}
