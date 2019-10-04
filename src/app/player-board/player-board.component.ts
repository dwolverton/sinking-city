import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { PlayerState } from 'src/game/BoardState';
import { Role, ROLES, TreasureCard, TREASURE_CARDS } from 'src/game/boardElements';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.css']
})
export class PlayerBoardComponent implements OnInit, OnChanges {

  @Output()
  cardClick:EventEmitter<TreasureCard> = new EventEmitter();
  @Input()
  player:PlayerState;
  @Input()
  cardSelectionEnabled:boolean;
  role:Role;
  cards:TreasureCard[];

  constructor() { }

  ngOnInit() {
    this.role = ROLES[this.player.role];
  }

  ngOnChanges({player:playerChg}:SimpleChanges) {
    if (playerChg) {
      const { previousValue, currentValue } = playerChg;
      if (!previousValue || currentValue.cards !== previousValue.cards) {
        this.cards = this.player.cards.map(id => TREASURE_CARDS[id]);
      }
    }
  }

  cardClicked(card:TreasureCard) {
    this.cardClick.emit(card);
  }

}
