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
        while (target.classList[0] !== 'list') {
            target = target.parentNode;
        }

        target = target.querySelector('.cards');
        const dragEl = document.getElementById(data);
        let currentIndex = Number(document.getElementById(data).getAttribute('data-sort'));

        if (targetClassName === 'card') {
            console.log('card');
            console.log($event.target);
            console.log(dragEl);
            if (this.isBefore(dragEl, $event.target.parentNode)) {
                console.log('yes');
                $event.target.parentNode.parentNode.insertBefore(dragEl, $event.target.parentNode);
                currentIndex += 1;
            } else {
                console.log('no');
                $event.target.parentNode.parentNode.insertBefore(dragEl, $event.target.parentNode.nextSibling);
                currentIndex -= 1;
            }

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

        const newData = {
            _id: data,
            status: status,
            description: description,
            sort: currentIndex
        };

        // this solution or above?
        const iterateTarget = target.children;
        console.log(iterateTarget);

        for (let i = 0; i < iterateTarget.length; i++) {
            if (data === iterateTarget[i].getAttribute('id')) {
                console.log(i);
                newData.sort = i;
            }
        }

        this._card.changeMessage(newData);
        this._card.updateCard(newData).subscribe(response => {
            this.loading = false
        });

    }

    isBefore(firstNode, secondNode): boolean {
        if (firstNode.parentNode === secondNode.parentNode) {
            for (let cur = firstNode; cur; cur = cur.previousSibling) {
                if (cur === secondNode) {
                    return true;
                }
            }
        }
        return false;
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
