import { Component, Input } from '@angular/core';
import { ListSchema } from '../listschema';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent {
    @Input() list: ListSchema

    displayAddCard = false;
    loading = false;
    status = true;
    clickedCard = '';

    constructor(private _card: CardService) { }

    toggleDisplayAddCard() {
        this.displayAddCard = ! this.displayAddCard;
    }

    dragStart(ev) {
        ev.dataTransfer.setData('card', ev.target.id);
    }

    checkExists(id) {
        this.clickedCard = id;
        this._card.getCard(id).subscribe(() => {
            this.status = true;
        }, () => {
            this.status = false;
        });
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

        if (targetClassName === 'card' && dragEl) {
            const cardEl = $event.target.parentNode.parentNode;
            if (this.isBefore(dragEl, cardEl)) {
                target.insertBefore(dragEl, cardEl);
            } else {
                target.insertBefore(dragEl, cardEl.nextSibling);
            }

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
        const description = document.getElementById(data).textContent.trim();
        const newData = {
            _id: data,
            status: status,
            description: description,
            sort: 0
        };

        const iterateTarget = target.children;
        this.reIndexCards(iterateTarget, newData, status, description);
        this._card.changeMessage(newData);

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

    reIndexCards(html_coll, data, status, description) {
        for (let i = 0; i < html_coll.length; i++) {
            data.sort = i;
            data.description = '';
            if (data === html_coll[i].getAttribute('id')) {
                data._id = data;
                data.status = status;
                data.description = description;
                this._card.updateCard(data).subscribe(() => {
                    this.loading = false
                });
            } else {
                data._id = html_coll[i].getAttribute('id');
                data.status = this.list.status;
                data.description = html_coll[i].textContent.trim();
                this._card.updateCard(data).subscribe(() => {
                    this.loading = false
                });
            }
        }
    }

    onEnter(event, value: string) {
        if (value !== '') {
            this.loading = true;
            const data = {
                status: this.list.status,
                description: value,
                sort: this.list.cards.length
            };
            this._card.addCard(data).subscribe(response => {
                if (this.list.status === response['data'].status) {
                    this.list.cards.push(response['data']);
                    this.loading = false;
                }
            });
        }
    }

}
