import { Component, Input, OnInit, OnChanges, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { CardSchema } from '../cardschema';

import { CardService } from '../shared/services/card.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnChanges {
    @Input() card: CardSchema;
    @Input() statusOnDrag: string;
    @Output() deletedCard: EventEmitter<any>;
    @ViewChild('editCardInput') cardInput: ElementRef;
    editable: boolean;

    constructor(private _card: CardService) {
        this.editable = false;
        this.deletedCard = new EventEmitter<any>();
    }

    ngOnInit() {
    }

    ngOnChanges(changes: any) {
        console.log(changes.statusOnDrag.currentValue);
        this.statusOnDrag = changes.statusOnDrag.currentValue;
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
        console.log(this.statusOnDrag);
        if (value !== '') {
            const data = {
                _id: this.card._id,
                status: this.statusOnDrag,
                description: value
            };
            console.log(data);
            this._card.updateCard(data).subscribe(response => {
                console.log(response);
                this.editable = false;
                this.card = data;
            });
        } else {
            this.editable = true;
        }
    }

}
