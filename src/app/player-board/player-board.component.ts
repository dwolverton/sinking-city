import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { PlayerState } from 'src/game/BoardState';
import { Role, ROLES, TreasureCard, TREASURE_CARDS } from 'src/game/boardElements';
import { ACTION_NAMES, AvailableAction } from 'src/game/actions';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.css']
})
export class PlayerBoardComponent implements OnInit, OnChanges {

  @Output()
  cardClick:EventEmitter<TreasureCard> = new EventEmitter();
  @Output()
  playerClick:EventEmitter<PlayerState> = new EventEmitter();
  @Output()
  doAction:EventEmitter<AvailableAction> = new EventEmitter();
  @Input()
  player:PlayerState;
  @Input()
  highlightCards:number[];
  @Input()
  highlightPlayers:number[];
  @Input()
  selectedPlayers:number[];
  @Input()
  actions:AvailableAction[];
  @Input()
  inProgressAction:AvailableAction;
  @Input()
  actionsRemaining:number;
  role:Role;
  cards:TreasureCard[];
  ACTION_NAMES = ACTION_NAMES;

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

  playerClicked(player:PlayerState) {
    this.playerClick.emit(player);
  }

  actionClicked(action:AvailableAction) {
    this.doAction.emit(action);
  }

}
