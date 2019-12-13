import { Component, OnInit } from '@angular/core';
import { SavedGameService } from '../saved-game.service';
import { getInitialBoard } from 'src/game/gameEngine';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { DIFFICULTIES, ROLES } from 'src/game/boardElements';
import GameMetadata, { PlayerOptions, initGame } from 'src/game/GameMetadata';
import BoardState from 'src/game/BoardState';

@Component({
  selector: 'app-new-game',
  templateUrl: './new-game.component.html',
  styleUrls: ['./new-game.component.css']
})
export class NewGameComponent implements OnInit {

  difficulties = DIFFICULTIES;
  roles = ROLES;
  players:FormArray = new FormArray([
    this.generatePlayerFormGroup(), this.generatePlayerFormGroup()
  ])
  options = new FormGroup({
    difficulty: new FormControl('1', [Validators.required, Validators.pattern(/^\d$/), Validators.min(0), Validators.max(DIFFICULTIES.length - 1)]),
    players: this.players
  });

  constructor(private savedGameService:SavedGameService, private router:Router) { }

  ngOnInit() {
    
  }

  generatePlayerFormGroup() {
    return new FormGroup({
      name: new FormControl('', Validators.maxLength(20)),
      role: new FormControl('')
    });
  }

  addPlayer() {
    this.players.push(this.generatePlayerFormGroup());
  }

  removePlayer(i:number) {
    this.players.removeAt(i);
  }

  onSubmit() {
    if (this.options.valid && this.players.length >= 2 && this.players.length <= 4) {
      const playerOptions:PlayerOptions[] = this.players.controls.map((group:FormGroup) => ({
        name: group.controls.name.value,
        role: group.controls.role.value === "" ? null : parseInt(group.controls.role.value)
      }));
      const difficulty = parseInt(this.options.value.difficulty);


      const game:GameMetadata = initGame(difficulty, playerOptions);
      const board:BoardState = getInitialBoard(game);
      const id:string = this.savedGameService.newGame(game, board);
      this.router.navigate(["/game", id]);
    }
  }

}
