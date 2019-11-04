import { Component, OnInit, Input } from '@angular/core';
import { Outcome } from 'src/game/BoardState';

@Component({
  selector: 'app-end-modal',
  templateUrl: './end-modal.component.html',
  styleUrls: ['./end-modal.component.css']
})
export class EndModalComponent implements OnInit {

  @Input()
  outcome:Outcome;
  text:string;
  imageUrl:string;

  constructor() { }

  ngOnInit() {
    if (this.outcome === Outcome.WIN) {
      this.text = "You saved the treasures of Hamtramck! You Win!!!!"
      this.imageUrl = "assets/win.gif";
    } else {
      this.text = "Alas, you lose! The city sank beneath the waves. You return with nothing."
      this.imageUrl = "assets/lose.gif";
    }
  }

}
