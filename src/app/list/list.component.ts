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
        console.log(this.list);
    }

    allowDrop($event) {
        $event.preventDefault();
    }

    drop($event) {
        $event.preventDefault();
        const data = $event.dataTransfer.getData('card');

        let target = $event.target;
        const targetClassName = target.className;

        while (target.classList[0] !== 'list') {
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

        this._card.changeMessage(newData);
        this._card.updateCard(newData).subscribe(() => {});

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
        this._card.deleteCard(id).subscribe(() => {
            document.getElementById(id).remove();
        }, (error) => {
            console.log(error);
        })

    }


}
