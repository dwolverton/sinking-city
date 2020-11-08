import { Component, OnInit } from '@angular/core';
import { SavedGameService } from '../saved-game.service';
import Game from 'src/../../shared/game/Game';
import GameMetadata from 'src/../../shared/game/GameMetadata';
import { Role, ROLES, DIFFICULTIES } from 'src/../../shared/game/boardElements';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  games:GameMetadata[] = [];

  constructor(private savedGameService:SavedGameService) { }

  ngOnInit() {
    this.games = this.savedGameService.listMetadata();
  }

  roleDisplay(role:number):string {
    return ROLES[role].name;
  }

  difficultyDisplay(difficulty:number):string {
    return DIFFICULTIES[difficulty];
  }

}
