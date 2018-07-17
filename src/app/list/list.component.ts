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
    status = false;

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

        if (targetClassName === 'card') {
            console.log('card');
            const cardEl = $event.target.parentNode.parentNode;
            console.log(cardEl);
            console.log(dragEl);
            if (this.isBefore(dragEl, cardEl)) {
                console.log('yes');
                target.insertBefore(dragEl, cardEl);
            } else {
                console.log('no');
                target.insertBefore(dragEl, cardEl.nextSibling);
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
            sort: 0
        };

        const iterateTarget = target.children;
        console.log(iterateTarget);

        for (let i = 0; i < iterateTarget.length; i++) {
            console.log(i);
            newData.sort = i;
            newData.description = '';
            if (data === iterateTarget[i].getAttribute('id')) {
                newData._id = data;
                newData.status = status;
                newData.description = description;
                console.log(newData);
                // this._card.changeMessage(newData);
                this._card.updateCard(newData).subscribe(() => {
                    this.loading = false
                });
            } else {
                newData._id = iterateTarget[i].getAttribute('id');
                newData.status = this.list.status;
                newData.description = iterateTarget[i].textContent;
                console.log(newData);
                this._card.updateCard(newData).subscribe(() => {
                    this.loading = false
                });
            }
        }

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

    dragStart(ev) {
        ev.dataTransfer.setData('card', ev.target.id);
    }

    checkExists(id) {
        this._card.getCard(id).subscribe(() => {
            this.status = true;
        }, () => {
            this.status = false;
        });
    }


}
