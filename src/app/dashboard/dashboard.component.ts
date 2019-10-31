import { Component, Input, SimpleChanges } from '@angular/core';
import BoardState from 'src/game/BoardState';
import { TreasureCard, FloodCard, FLOOD_CARDS, TREASURE_CARDS, WATER_LEVELS, TREASURES } from 'src/game/boardElements';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  @Input()
  board:BoardState;
  treasureDiscard:TreasureCard;
  floodDiscard:FloodCard;
  waterLevel:number;
  treasures:any;

  constructor() { }

  ngOnChanges({board:boardChg}:SimpleChanges) {
    if (boardChg) {
      const { previousValue, currentValue }:{ previousValue:BoardState, currentValue:BoardState } = boardChg;
      this.waterLevel = WATER_LEVELS[currentValue.waterLevel];
      if (!previousValue || currentValue.treasureDiscard !== previousValue.treasureDiscard) {
        this.treasureDiscard = getTopCard(currentValue.treasureDiscard, TREASURE_CARDS);
      }
      if (!previousValue || currentValue.floodDiscard !== previousValue.floodDiscard) {
        this.floodDiscard = getTopCard(currentValue.floodDiscard, FLOOD_CARDS);
      }
      if (!previousValue || currentValue.treasuresCaptured !== previousValue.treasuresCaptured) {
        this.treasures = currentValue.treasuresCaptured.map((captured, i) => ({
          ... TREASURES[i], captured
        }));
      }
    }
  }

}

function getTopCard<T>(cards:number[], source:ReadonlyArray<T>):T {
  if (cards.length === 0) {
    return null;
  } else {
    return source[cards[cards.length - 1]];
  }
}
