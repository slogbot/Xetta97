import { Component, Input } from '@angular/core';
import { Player } from '../interfaces/player.interface';
import { GameStateService } from '../game-state.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent {
  @Input() player!: Player;

  constructor(public gameStateService: GameStateService) {}
}
