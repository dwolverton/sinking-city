import { Injectable } from '@angular/core';
import BoardState from 'src/game/BoardState';
import { BehaviorSubject } from 'rxjs';
import { getInitialBoard, getValidActions } from 'src/game/gameEngine';
import { applyAction } from "src/game/gameEngine";
import { ActionDef, Action } from 'src/game/actions';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  readonly board$:BehaviorSubject<BoardState> = new BehaviorSubject(null);
  private _board:BoardState = null;
  readonly actions$:BehaviorSubject<ActionDef[]> = new BehaviorSubject([]);
  private _actions:ActionDef[] = [];

  constructor() {
    this.updateBoard(getInitialBoard(4, 1));
  }

  private updateBoard(board:BoardState) {
    this._board = board;
    this.board$.next(board);
    this._actions = getValidActions(board, board.currentPlayer);
    this.actions$.next(this._actions);
  }

  get board():BoardState {
    return this._board;
  }

  get actions():ActionDef[] {
    return this._actions;
  }

  doAction(actionType:ActionDef, player:number = null):void {
    player = player === null ? this._board.currentPlayer : player;

    let action:Action = new (<any>actionType)();


    const board = applyAction(this._board, action, player);
    this.updateBoard(board);
  }

}
