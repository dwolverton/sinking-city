import { Injectable } from '@angular/core';
import BoardState from 'src/game/BoardState';
import { BehaviorSubject } from 'rxjs';
import { getInitialBoard } from 'src/game/gameEngine';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  readonly board$:BehaviorSubject<BoardState> = new BehaviorSubject(null);
  private _board:BoardState = null;

  constructor() {
    this.updateBoard(getInitialBoard(4));
  }

  private updateBoard(board:BoardState) {
    this._board = board;
    this.board$.next(board);
  }

  get board():BoardState {
    return this._board;
  }

}
