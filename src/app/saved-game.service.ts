import { Injectable } from '@angular/core';
import BoardState from 'src/game/BoardState';
import Game from 'src/game/Game';
import sortBy from 'lodash/sortBy';


@Injectable({
  providedIn: 'root'
})
export class SavedGameService {

  constructor() {}

  getGame(id:number):Game {
    const raw:string = localStorage.getItem("game-" + id);
    if (raw) {
      return { id, board: JSON.parse(raw) };
    }
    return null;
  }

  saveGame(board:BoardState, id:number = this.getNextId()):number {
    const raw = JSON.stringify(board);
    localStorage.setItem("game-" + id, raw);
    return id;
  }

  listGameIds():number[] {
    const ids:number[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      let key:string = localStorage.key(i);
      if (key.startsWith("game-")) {
        ids.push(+key.substring(5));
      }
    }
    return sortBy(ids);
  }

  listGames():Game[] {
    return this.listGameIds().map(this.getGame.bind(this));
  }

  private getNextId():number {
    let nextId:number = parseInt(localStorage.getItem('nextId')) || 1;
    localStorage.setItem('nextId', String(nextId + 1));
    return nextId;
  }
}
