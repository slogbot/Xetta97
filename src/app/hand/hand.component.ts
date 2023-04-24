// src/app/hand/hand.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { Card } from '../interfaces/card.interface';
import { Hand } from '../interfaces/hand.interface';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {
  @Input() playerId!: string;
  hand!: Hand;

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.hand = this.gameStateService.getHand(this.playerId);
  }
}
