import { Component, OnInit, Input } from '@angular/core';
import { FloodCard, FLOOD_CARDS } from 'src/../../shared/game/boardElements';

@Component({
  selector: 'app-flood-card',
  templateUrl: './flood-card.component.html',
  styleUrls: ['./flood-card.component.css']
})
export class FloodCardComponent implements OnInit {

  @Input()
  card:FloodCard;
  @Input()
  cardId:number;
  @Input()
  flip:number = 0;

  constructor() { }

  ngOnInit() {
    if (typeof this.cardId === 'number' && !this.card) {
      this.card = FLOOD_CARDS[this.cardId];
    }
  }

}
