import { Component, Input, OnInit } from '@angular/core';
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
    loading = false;

    constructor(private _card: CardService) { }

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
        this.loading = true;
        const data = $event.dataTransfer.getData('card');

        let target = $event.target;
        const targetClassName = target.classList[0];
        console.log(targetClassName);

        while (target.classList[0] !== 'list') {
            target = target.parentNode;
        }

        target = target.querySelector('.cards');

        if (targetClassName === 'card') {
            console.log('card');
            $event.target.parentNode.parentNode.insertBefore(document.getElementById(data), $event.target.parentNode);
        } else if (targetClassName === 'list__title') {
            if (target.children.length) {
                console.log('first');
                target.insertBefore(document.getElementById(data), target.children[0]);
            } else {
                console.log('at the end');
                target.appendChild(document.getElementById(data));
            }
        } else {
            target.appendChild(document.getElementById(data));
        }


        const status = target.parentNode.children[0].getAttribute('status');
        const description = document.getElementById(data).textContent.trim();
        let currentIndex = Number(document.getElementById(data).getAttribute('data-sort'));
        console.log(currentIndex);

        let newData = {
            _id: data,
            status: status,
            description: description,
            sort: currentIndex
        };

        let iterateTarget = target.children;

        for (let i = 0; i < iterateTarget.length; i++) {
            newData.sort = i;
            iterateTarget[i].setAttribute('data-sort', i);
            console.log(iterateTarget[i]);
        }

        this._card.changeMessage(newData);
        this._card.updateCard(newData).subscribe(response => {
            this.loading = false
        });

    }

    onEnter(value: string) {
        if (value !== '') {
            this.loading = true;
            const data = {
                status: this.list.status,
                description: value,
                sort: 0
            };
            this._card.addCard(data).subscribe(response => {
                this.list.cards.push(response['data']);
                this.loading = false;
            });
        }
    }


}
