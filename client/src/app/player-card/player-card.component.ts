import { Component, OnInit, Input } from '@angular/core';
import { TreasureCard } from 'src/game/boardElements';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css']
})
export class PlayerCardComponent implements OnInit {

  @Input()
  card:TreasureCard
  @Input()
  highlight:boolean
  @Input()
  flip:number = 0;

  constructor() { }

  ngOnInit() {
  }

}
