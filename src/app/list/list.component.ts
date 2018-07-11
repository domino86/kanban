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

    }

    allowDrop($event) {
        $event.preventDefault();
    }

    drop($event) {
        $event.preventDefault();
        const data = $event.dataTransfer.getData('text');

        let target = $event.target;
        const targetClassName = target.className;

        while( target.className !== 'list') {
            target = target.parentNode;
        }
        target = target.querySelector('.cards');

        if(targetClassName === 'card') {
            $event.target.parentNode.insertBefore(document.getElementById(data), $event.target);
        } else if(targetClassName === 'list__title') {
            if (target.children.length) {
                target.insertBefore(document.getElementById(data), target.children[0]);
            }else {
                target.appendChild(document.getElementById(data));
            }
        } else {
            target.appendChild(document.getElementById(data));
        }

    }

    onEnter(value: string) {
        console.log(value);
        const cardId =  this.cardStore.newCard(value);
        this.list.cards.push({id: cardId, content: value});
        console.log(this.list.cards);

        const data = {
            status: this.list.status,
            description: value
        };
        this._card.addCard(data).subscribe(data => {
            console.log(data);
        });
    }


}
