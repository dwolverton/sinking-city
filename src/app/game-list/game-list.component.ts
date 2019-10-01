import { Component, OnInit } from '@angular/core';
import { SavedGameService } from '../saved-game.service';
import Game from 'src/game/Game';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {

  games:Game[] = [];

  constructor(private savedGameService:SavedGameService) { }

  ngOnInit() {
    this.games = this.savedGameService.listGames();
  }

}
