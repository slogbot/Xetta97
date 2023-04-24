// src/app/deck/deck.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { Card } from '../interfaces/card.interface';
import { Deck } from '../interfaces/deck.interface';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {
  @Input() playerId!: string;
  deck!: Deck;

  constructor(private gameStateService: GameStateService) {}

  ngOnInit(): void {
    this.deck = this.gameStateService.getDeck(this.playerId);
  }
}
