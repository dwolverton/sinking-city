import { Component, OnInit } from '@angular/core';
import { SavedGameService } from '../saved-game.service';
import { getInitialBoard } from 'src/game/gameEngine';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DIFFICULTIES } from 'src/game/boardElements';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {

  difficulties = DIFFICULTIES;
  options = new FormGroup({
    playerCount: new FormControl('2', [Validators.required, Validators.pattern(/^\d$/), Validators.min(2), Validators.max(4)]),
    difficulty: new FormControl('1', [Validators.required, Validators.pattern(/^\d$/), Validators.min(0), Validators.max(DIFFICULTIES.length - 1)])
  });

  constructor(private savedGameService:SavedGameService, private router:Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.options.valid) {
      const id:number = this.savedGameService.saveGame(
        getInitialBoard(this.options.value.playerCount, this.options.value.difficulty));
      this.router.navigate(["/game", id]);
    }
  }

}
