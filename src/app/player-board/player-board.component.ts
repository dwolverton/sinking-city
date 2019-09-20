import { Component, OnInit, Input } from '@angular/core';
import { PlayerState } from 'src/game/BoardState';
import { Role, ROLES, TreasureCard, TREASURE_CARDS } from 'src/game/boardElements';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.css']
})
export class PlayerBoardComponent implements OnInit {

  @Input()
  player:PlayerState;
  role:Role;
  cards:TreasureCard[];

  constructor() { }

  ngOnInit() {
    this.role = ROLES[this.player.role];
    this.cards = this.player.cards.map(id => TREASURE_CARDS[id]);
  }

}
