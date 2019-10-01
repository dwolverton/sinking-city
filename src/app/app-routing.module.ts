import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayComponent } from './play/play.component';
import { GameListComponent } from './game-list/game-list.component';
import { NewGameComponent } from './new-game/new-game.component';

const routes: Routes = [
  { path: '', component: GameListComponent },
  { path: 'new', component: NewGameComponent },
  { path: 'game/:gameId', component: PlayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
