import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { GameManagerService } from '../game-manager.service';
import BoardState, { PlayerState } from 'src/game/BoardState';
import { ROLES } from 'src/game/boardElements';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnChanges {

  @Input()
  board:BoardState;
  @Input()
  highlightTiles:number[];
  @Output()
  clickTile = new EventEmitter<number>();
  pawns:any[];

  constructor(private gameManager:GameManagerService) { }

  ngOnChanges({board:boardChg}:SimpleChanges) {
    if (boardChg) {
      const { previousValue, currentValue } = boardChg;
      if (!previousValue || previousValue.players !== currentValue.players) {
        this.pawns = this.board.players.map(player => ({
          ...player,
          role: ROLES[player.role],
          position: calcPawnPos(player)
        }));
      }
    }
  }

}

function calcPawnPos(player:PlayerState) {
  const xOffset = (player.role % 3) * 4 - 4 - 1.5;
  const yOffset = Math.floor(player.role / 3) * 4 - 2 - 2.5;
  
  return {
    left: calcPawnAxis(player.x) + xOffset + "%",
    top: calcPawnAxis(player.y) + yOffset + "%"
  }
}

function calcPawnAxis(pos) {
  return ((pos * 2 + 1) / .12);
}
