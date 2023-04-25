import { Component, OnInit } from '@angular/core';
import { GameStateService } from '../game-state.service';
import { GridCell } from '../interfaces/grid-cell.interface';
import { Card } from '../interfaces/card.interface';


@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit {
  board: GridCell[][];
  constructor(private gameStateService: GameStateService) {
    this.board = this.gameStateService.getBoard();


  }

  ngOnInit(): void {
    this.board = this.gameStateService.getBoard();

  }
  handleCellClick(clickedCell: GridCell): void {
    const currentPlayer = this.gameStateService.getCurrentPlayer();
    const selectedCard = this.gameStateService.getSelectedFriendlyCard();
    const selectedBoardCard = this.gameStateService.getSelectedBoardCard();

    if (selectedCard) {
      this.gameStateService.playCardToBoard(selectedCard, currentPlayer.id, clickedCell);
    } else if (selectedBoardCard) {
      this.gameStateService.moveCardToCell(selectedBoardCard, clickedCell);
    }
  }

  selectCardOnBoard(event: MouseEvent, card: Card): void {
    event.stopPropagation();
    const currentPlayer = this.gameStateService.getCurrentPlayer(); // Add this line
    this.gameStateService.selectCardOnBoard(card, currentPlayer.id); // Modify this line
  }



}
