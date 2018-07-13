import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CardSchema } from '../cardschema';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
    @Input() card: CardSchema;
    @Output() deletedCard: EventEmitter<any>;
    @ViewChild('editCardInput') cardInput: ElementRef;
    editable: boolean;

    constructor(private _card: CardService) {
        this.editable = false;
        this.deletedCard = new EventEmitter<any>();
    }

    ngOnInit() {
        this._card.currentMessage.subscribe(newData => {
            if (typeof(newData) !== 'undefined' && this.card._id === newData._id) {
                this.card = newData;
            }
        });
    }

    ngOnChanges() {

    }

    dragStart(ev) {
        ev.dataTransfer.setData('card', ev.target.id);
    }

    editCard(event) {
        this.editable = true;
        this.cardInput.nativeElement.value = this.card.description = event.target.textContent;
    }

    deleteCard(event) {
        const id = event.target.parentElement.id;
        this.deletedCard.emit(id);
    }

    onEnter(value: string) {
        if (value !== '') {
            const data = {
                _id: this.card._id,
                status: this.card.status,
                description: value
            };
            this._card.updateCard(data).subscribe(response => {
                this.editable = false;
                this.card = data;
            });
        } else {
            this.editable = true;
        }
    }

}
