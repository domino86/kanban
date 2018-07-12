import { Component, Input, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { CardSchema } from '../cardschema';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
    @Input() card: CardSchema;
    @Output() updatedCard: EventEmitter<any>;
    @Output() deletedCard: EventEmitter<any>;
    @ViewChild('editCardInput') cardInput: ElementRef;
    editable: boolean;

    constructor(private _card: CardService) {
        this.editable = false;
        this.updatedCard = new EventEmitter<any>();
        this.deletedCard = new EventEmitter<any>();
    }

    ngOnInit() {
    }

    dragStart(ev) {
        ev.dataTransfer.setData('card', ev.target.id);
    }

    editCard(event) {
        this.editable = true;
        this.cardInput.nativeElement.value = this.card.description = event.target.textContent;
    }

    deleteCard(event) {
        console.log(event);
        const id = event.target.parentElement.id;
        this._card.deleteCard(id).subscribe(response => {
            console.log(response);
            this.deletedCard.emit(id);
        }, (error) => {
             console.log(error);
        });
    }

    onEnter(value: string) {
        const data = {
            _id: this.card._id,
            status: this.card.status,
            description: value
        };
        this._card.updateCard(data).subscribe(response => {
            console.log(response);
            this.editable = false;
            this.updatedCard.emit(data);
        });
    }

}
