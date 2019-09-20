import { Component, OnInit, Input } from '@angular/core';
import { TileState } from 'src/game/BoardState';
import { Tile, TILES, Treasure, TREASURES } from 'src/game/boardElements';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {

  @Input("tile")
  tileState:TileState;
  tile:Tile;
  treasure:Treasure

  constructor() { }

  ngOnInit() {
    this.tile = this.tileState ? TILES[this.tileState.id] : null;
    this.treasure = this.tile && this.tile.treasure !== null ? TREASURES[this.tile.treasure] : null;
  }

}
