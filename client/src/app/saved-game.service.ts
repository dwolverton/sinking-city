import { Injectable } from '@angular/core';
import BoardState from 'src/../../shared/game/BoardState';
import Game from 'src/../../shared/game/Game';
import { sortBy } from 'lodash';
import GameMetadata from 'src/../../shared/game/GameMetadata';

@Injectable({
  providedIn: 'root'
})
export class SavedGameService {

  constructor() {}

  getNextId():string {
    let nextId:number = parseInt(localStorage.getItem('nextId')) || 1;
    localStorage.setItem('nextId', String(nextId + 1));
    return String(nextId);
  }

  newGame(game:GameMetadata, board:BoardState):string {
    game.id = this.getNextId();
    this.saveMetadata(game.id, game);
    this.saveBoard(game.id, board);
    return game.id;
  }

  getBoard(id:string):BoardState {
    return this.get("board-" + id);
  }

  saveBoard(id:string, board:BoardState):void {
    this.set("board-" + id, board);
  }

  getMetadata(id:string):GameMetadata {
    return this.get("game-" + id);
  }

  saveMetadata(id:string, metadata:GameMetadata):void {
    this.set("game-" + id, metadata);
  }

  listGameIds():string[] {
    const ids:string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key:string = localStorage.key(i);
      if (key.startsWith("game-")) {
        ids.push(key.substring(5));
      }
    }
    return sortBy(ids);
  }

  listMetadata():GameMetadata[] {
    return this.listGameIds().map(this.getMetadata.bind(this));
  }

  private set(key:string, value:any):void {
    const raw = JSON.stringify(value);
    localStorage.setItem(key, raw);
  }

  private get(key:string):any {
    const raw:string = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw);
    }
    return null;
  }
}
