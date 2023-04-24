import { Component } from '@angular/core';
import { GameStateService } from './game-state.service';
import { Player } from './interfaces/player.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  players: Player[];

  constructor(public gameStateService: GameStateService) {
    this.players = gameStateService.getPlayers();
  }

}
