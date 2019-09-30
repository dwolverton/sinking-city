import { Injectable } from '@angular/core';
import BoardState from 'src/game/BoardState';
import { BehaviorSubject } from 'rxjs';
import { getInitialBoard, getValidActions } from 'src/game/gameEngine';
import { applyAction } from "src/game/gameEngine";
import { Action, AvailableAction, ActionType } from 'src/game/actions';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  readonly board$:BehaviorSubject<BoardState> = new BehaviorSubject(null);
  private _board:BoardState = null;
  readonly actions$:BehaviorSubject<AvailableAction[]> = new BehaviorSubject([]);
  private _actions:AvailableAction[] = [];

  constructor() {
    this.updateBoard(getInitialBoard(4, 1));
  }

  private updateBoard(board:BoardState) {
    this._board = board;
    this.board$.next(board);
    this._actions = getValidActions(board, board.currentPlayer);
    this.actions$.next(this._actions);
    console.log("Available", this._actions);
  }

  get board():BoardState {
    return this._board;
  }

  get actions():AvailableAction[] {
    return this._actions;
  }

  doAction(action:Action, player:number = null):void {
    player = player === null ? this._board.currentPlayer : player;


    const board = applyAction(this._board, action, player);
    this.updateBoard(board);
  }

}
