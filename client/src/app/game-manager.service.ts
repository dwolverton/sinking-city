import { Injectable } from '@angular/core';
import BoardState from 'src/game/BoardState';
import { BehaviorSubject } from 'rxjs';
import { getValidActions } from 'src/game/gameEngine';
import { applyAction } from "src/game/gameEngine";
import { Action, AvailableAction, ActionType } from 'src/game/actions';
import { SavedGameService } from './saved-game.service';
import Game from 'src/game/Game';
import GameMetadata from 'src/game/GameMetadata';

@Injectable({
  providedIn: 'root'
})
export class GameManagerService {

  readonly game$:BehaviorSubject<GameMetadata> = new BehaviorSubject(null);
  private _game:GameMetadata = null;
  readonly board$:BehaviorSubject<BoardState> = new BehaviorSubject(null);
  private _board:BoardState = null;
  readonly actions$:BehaviorSubject<AvailableAction[][]> = new BehaviorSubject([]);
  private _actions:AvailableAction[][] = [];

  constructor(private savedGameService:SavedGameService) {
  }

  loadGame(id:string):void {
    this._game = this.savedGameService.getMetadata(id);
    this.game$.next(this._game);
    this.updateBoard(this.savedGameService.getBoard(id));
  }

  private updateBoard(board:BoardState) {
    this._board = board;
    this.board$.next(board);
    this._actions = getValidActions(board);
    this.actions$.next(this._actions);
    // console.log("Available", this._actions);
  }

  get board():BoardState {
    return this._board;
  }

  get actions():AvailableAction[][] {
    return this._actions;
  }

  doAction(action:Action, player:number = null):void {
    player = player === null ? this._board.currentPlayer : player;
    const board = applyAction(this._board, action, player);
    this.updateBoard(board);
    this.savedGameService.saveBoard(this._game.id, this._board);
  }

}
