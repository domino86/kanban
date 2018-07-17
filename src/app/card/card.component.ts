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
    @Input() clickedCard: string;
    @Input() index: number;
    @Input() status = true;
    @ViewChild('editCardInput') cardInput: ElementRef;
    editable = false;
    loading = false;
    newData = {};

    constructor(private _card: CardService) { }

    ngOnInit() {
        this._card.currentMessage.subscribe(newData => {
            if (typeof(newData) !== 'undefined' && this.card._id === newData._id) {
                this.newData = newData;
                this.card = newData;
            }
        });
    }

    toggleDrag(check: boolean) {
        console.log(this.cardInput.nativeElement.parentNode.parentNode.parentNode);
        this.cardInput.nativeElement.parentNode.parentNode.parentNode.setAttribute('draggable', check);
    }

    editCard(event) {
        event.preventDefault();
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

    onEnter(value: string) {
        this.loading = true;
        if (value !== '') {
            const data = {
                _id: this.card._id,
                status: this.card.status,
                description: value,
                sort: this.card.sort
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
