import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TileState } from 'src/../../shared/game/BoardState';
import { Tile, TILES, Treasure, TREASURES } from 'src/../../shared/game/boardElements';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {

  @Output()
  click = new EventEmitter();
  @Input("tile")
  tileState:TileState;
  tile:Tile;
  @Input()
  highlight:boolean;

  constructor() { }

  ngOnInit() {
    this.tile = this.tileState ? TILES[this.tileState.id] : null;
  }

}
