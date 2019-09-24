import { Component, OnInit, Input } from '@angular/core';
import BoardState from 'src/game/BoardState';
import { TreasureCard, FloodCard, FLOOD_CARDS, TREASURE_CARDS, WATER_LEVELS } from 'src/game/boardElements';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input()
  board:BoardState;
  treasureDiscard:TreasureCard;
  floodDiscard:FloodCard;
  waterLevel:number;

  constructor() { }

  ngOnInit() {
    this.waterLevel = WATER_LEVELS[this.board.waterLevel];
    this.treasureDiscard = getTopCard(this.board.treasureDiscard, TREASURE_CARDS);
    this.floodDiscard = getTopCard(this.board.floodDiscard, FLOOD_CARDS);
  }

}

function getTopCard<T>(cards:number[], source:ReadonlyArray<T>):T {
  if (cards.length === 0) {
    return null;
  } else {
    return source[cards[cards.length - 1]];
  }
}
