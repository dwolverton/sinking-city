import { Component, OnInit } from '@angular/core';
import { SavedGameService } from '../saved-game.service';
import { getInitialBoard } from 'src/game/gameEngine';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {

  constructor(private savedGameService:SavedGameService, private router:Router) { }

  ngOnInit() {
    const id:number = this.savedGameService.saveGame(getInitialBoard(4, 0));
    this.router.navigate(["/game", id]);
  }

}
