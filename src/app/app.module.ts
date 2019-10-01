import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { TileComponent } from './tile/tile.component';
import { PlayerBoardComponent } from './player-board/player-board.component';
import { PlayerCardComponent } from './player-card/player-card.component';
import { PlayComponent } from './play/play.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FloodCardComponent } from './flood-card/flood-card.component';
import { NewGameComponent } from './new-game/new-game.component';
import { GameListComponent } from './game-list/game-list.component';
import { WindowComponent } from './window/window.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TileComponent,
    PlayerBoardComponent,
    PlayerCardComponent,
    PlayComponent,
    DashboardComponent,
    FloodCardComponent,
    NewGameComponent,
    GameListComponent,
    WindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
