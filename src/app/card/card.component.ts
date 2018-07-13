import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CardSchema } from '../cardschema';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
    @Input() card: CardSchema;
    @Input() index: number;
    @ViewChild('editCardInput') cardInput: ElementRef;
    editable: boolean;
    loading = false;

    constructor(private _card: CardService) {
        this.editable = false;
    }

    ngOnInit() {
        this._card.currentMessage.subscribe(newData => {
            if (typeof(newData) !== 'undefined' && this.card._id === newData._id) {
                this.card = newData;
            }
        });
    }

    dragStart(ev) {
        ev.dataTransfer.setData('card', ev.target.id);
        this.checkExists(ev.target.id, (status) => {
            console.log(status);
            if (status === 404) {
                return false;
            }
        });
    }

    toggleDrag(check: boolean) {
        this.cardInput.nativeElement.parentNode.parentNode.setAttribute('draggable', check);
    }

    editCard(event) {
        event.preventDefault();
        console.log(event.target);
        this.editable = true;
        this.cardInput.nativeElement.value = this.card.description;
        this.toggleDrag(false);
    }

    closeCard(event) {
        event.stopPropagation();
        this.editable = false;
        this.cardInput.nativeElement.parentNode.parentNode.setAttribute('draggable', true);
        this.toggleDrag(true);
    }

    deleteCard(id) {
        this.loading = true;
        this._card.deleteCard(id).subscribe(() => {
            if (document.getElementById(id)) {
                document.getElementById(id).remove();
                this.toggleDrag(true);
                this.loading = false;
            }
        }, () => {
            this.toggleDrag(true);
            this.loading = false;
        })
    }

    checkExists(id, callback) {
        this._card.getCard(id).subscribe(card => {
            callback(card['status']);
        }, (error) => {
            callback(error['status']);
        });
    }

    onEnter(value: string) {
        this.loading = true;
        if (value !== '') {
            const data = {
                _id: this.card._id,
                status: this.card.status,
                description: value
            };

            this._card.updateCard(data).subscribe(() => {
                this.editable = false;
                this.card = data;
                this.loading = false;
            });

        } else {
            this.editable = true;
            this.loading = false;
        }

        this.toggleDrag(true);
    }

}
