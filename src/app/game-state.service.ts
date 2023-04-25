// Import necessary dependencies
import { Injectable } from '@angular/core';
import { Card } from './interfaces/card.interface';
import { Player } from './interfaces/player.interface';
import { Deck } from './interfaces/deck.interface';
import { GridCell } from './interfaces/grid-cell.interface';
import { Hand } from './interfaces/hand.interface';



@Injectable({
  providedIn: 'root',
})
export class GameStateService {
  // Declare private properties to hold players, board, and current turn
  private players: Player[] = [];
  private board!: GridCell[][];
  private currentPlayerIndex: number = 0;
  private phase: number = 1;
  private selectedFriendlyCard: Card | null = null;
  private selectedMovementCard: Card | null = null;
  private selectedAttackerCard: Card | null = null;
  private selectedDefenderCard: Card | null = null;
  private highlightedCells: GridCell[] = [];





  constructor() {
    // Initialize the game state when the service is instantiated
    this.initializeGameState();
  }

  // Initialize the game state with default players, board, and turn
  private initializeGameState(): void {
    this.players = this.createPlayers();
    this.board = this.createBoard();
    this.dealCards();
  }

  // Create players with default data (can be replaced with server data later)
  private createPlayers(): Player[] {
    // Implement logic to create players and their decks
    // This can include hardcoding player data or fetching data from the server


    const player1: Player = {
      id: '1',
      name: 'Player 1',
      deck: this.createDeck('1'),
      hand: { cards: [], maxSize: 5 },
      mana: 20, // Add this line
    };

    const player2: Player = {
      id: '2',
      name: 'Player 2',
      deck: this.createDeck('2'),
      hand: { cards: [], maxSize: 5 },
      mana: 20,
    };


    return [player1, player2];
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////

  // Create a deck with default data (can be replaced with server data later)
  private createDeck(owner: string): Deck {
    const cards: Card[] = [
      { id: '1', name: 'Card 1', stats: { attack: 4, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '2', name: 'Card 2', stats: { attack: 3, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '3', name: 'Card 3', stats: { attack: 2, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '4', name: 'Card 4', stats: { attack: 1, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '5', name: 'Card 5', stats: { attack: 1, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '6', name: 'Card 6', stats: { attack: 1, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '7', name: 'Card 7', stats: { attack: 1, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '8', name: 'Card 8', stats: { attack: 1, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '9', name: 'Card 9', stats: { attack: 1, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },
      { id: '10', name: 'Card 10', stats: { attack: 1, defense: 1, movement: 3, range:2, cost:6 }, owner, hasMoved: false, hasAttacked: false },

    ];

    const deck: Deck = {
      id: '1',
      name: 'Default Deck',
      cards,
    };

    return deck;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////
getDeck(playerId: string): Deck {
  const player = this.players.find((player) => player.id === playerId);
    if (!player) {
      throw new Error('Player not found');
  }
  return player.deck;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
// Add this method to your GameStateService class
getHand(playerId: string): Hand {
  const player = this.players.find((player) => player.id === playerId);
  if (!player) {
    throw new Error('Player not found');
  }
  return player.hand;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
dealCards(): void {
  this.players.forEach((player) => {
    const dealtCards: Card[] = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * player.deck.cards.length);
      const card = player.deck.cards.splice(randomIndex, 1)[0];
      dealtCards.push(card);
    }
    player.hand.cards = dealtCards;
  });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
drawCard(playerId: string): void {
  const player = this.players.find((player) => player.id === playerId);
  if (!player) {
    throw new Error('Player not found');
  }
  if (player.deck.cards.length > 0 && player.hand.cards.length <5) {
    const randomIndex = Math.floor(Math.random() * player.deck.cards.length);
    const drawnCard = player.deck.cards.splice(randomIndex, 1)[0];
    player.hand.cards.push(drawnCard);
  }
  else if( player.hand.cards.length >4){
    console.log('Hand is at full capacity')
  }
  else {
    console.log('Deck is empty');
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
private increaseMana(player: Player, amount: number): void {
  player.mana += amount;
}
getMana(playerId: string): number {
  const player = this.players.find((player) => player.id === playerId);
  if (!player) {
    throw new Error('Player not found');
  }
  return player.mana;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
switchPlayer(): void {
  this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  this.selectedFriendlyCard = null;
  this.selectedMovementCard = null;
  this.selectedAttackerCard = null;
  this.selectedDefenderCard = null;
  this.increaseMana(this.getCurrentPlayer(), 2);
  this.phase = 1;
  const currentPlayer = this.getCurrentPlayer();
  if (currentPlayer.hand.cards.length < 6) {
    this.drawCard(currentPlayer.id);
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
switchPhase(): void {
    // If moving from phase 2 to phase 1, reset the `hasMoved` and 'hasAttacked' flag for all cards
    if (this.phase === 2) {
      this.board
        .flatMap(row => row)
        .filter(cell => cell.card)
        .forEach(cell => {
          if (cell.card) {
            cell.card.hasMoved = false;
            cell.card.hasAttacked = false;
          }
        });
    }
  this.phase = (this.phase % 3) + 1;
  this.selectedFriendlyCard = null;
  this.selectedMovementCard = null;
  this.selectedAttackerCard = null;
  this.selectedDefenderCard = null;
  this.clearHighlights();

}
//////////////////////////////////////////////////////////////////////////////////////////////////////
getCurrentPlayer(): Player {
  return this.players[this.currentPlayerIndex];
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
getCurrentPhase(): number {
  return this.phase;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
selectCardInHand(card: Card, isFriendly: boolean, playerId: string): void {
  if (this.phase === 1 && this.getCurrentPlayer().id === playerId) {
    if (isFriendly) {
      if (this.selectedFriendlyCard === card) {
        this.selectedFriendlyCard = null;
      } else {
        this.selectedFriendlyCard = card;
      }
      console.log(this.selectedFriendlyCard);
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
playCardToBoard(selectedCard: Card, playerId: string, targetCell: GridCell): void {
  if (this.phase === 1 && this.getCurrentPlayer().id === playerId) {
    const player = this.players.find(player => player.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Check if the player has enough mana to play the card
    if (player.mana >= selectedCard.stats.cost) {
      // Subtract the card cost from the player's mana
      player.mana -= selectedCard.stats.cost;

      // Remove the card from the player's hand
      const index = player.hand.cards.indexOf(selectedCard);
      if (index !== -1) {
        player.hand.cards.splice(index, 1);
      }

      // Place the card on the target cell
      targetCell.card = selectedCard;

      // Reset the selected card
      this.selectedFriendlyCard = null;
    } else {
      console.log("Not enough mana to play this card");
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
selectCardOnBoard(card: Card, playerId: string): void {
  if (this.phase !== 2 && this.phase !== 3) {
    console.log("Not allowed to select card on the board in this phase");
    return;
  }

  const currentPlayerId = this.getCurrentPlayer().id;

  if (this.phase === 2 && card.owner === playerId && playerId === currentPlayerId) {
    if (this.selectedMovementCard === card) {
      this.selectedMovementCard = null;
      this.clearHighlights(); // Add this line
    } else {
      this.selectedMovementCard = card;
      this.highlightValidMoves(card); // Add this line
    }
    console.log("Card selected for movement:", this.selectedMovementCard);

//Select Cards For Combat
  } else if (this.phase === 3 && playerId === currentPlayerId) {
    if (card.owner === playerId) {
      if (this.selectedAttackerCard === card) {
        this.selectedAttackerCard = null;
      } else {
        this.selectedAttackerCard = card;
      }
      console.log("Card selected for attack:", this.selectedAttackerCard);
    } else {
      if (this.selectedDefenderCard === card) {
        this.selectedDefenderCard = null;
      } else {
        this.selectedDefenderCard = card;
      }
      console.log("Card selected for defense:", this.selectedDefenderCard);
    }
  } else {
    console.log("Invalid card selection");
  }
}

getSelectedAttackerCard(): Card | null {
  return this.selectedAttackerCard;
}
getSelectedDefenderCard(): Card | null {
  return this.selectedDefenderCard;
}
getSelectedBoardCard(): Card | null {
  return this.selectedMovementCard;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
moveCardToCell(selectedCard: Card, targetCell: GridCell): void {
  if (this.phase !== 2 || !selectedCard || targetCell.card || selectedCard.hasMoved) {
    console.log("Invalid move");
    return;
  }

  const currentCell = this.board
    .flatMap(row => row)
    .find(cell => cell.card === selectedCard);

  if (!currentCell) {
    console.log("Current cell not found");
    return;
  }

  const path = this.bfsPathfinding(currentCell, targetCell);
  if (path && path.length <= selectedCard.stats.movement + 1) {
    currentCell.card = null;
    targetCell.card = selectedCard;
    selectedCard.hasMoved = true;

    // Deselect the card and clear highlights
    this.selectedMovementCard = null;
    this.clearHighlights(); // Add this line
  } else {
    console.log("Invalid move: Exceeds movement range or no valid path");
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
private bfsPathfinding(start: GridCell, end: GridCell): GridCell[] | null {
  const queue: GridCell[][] = [[start]];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const path = queue.shift() as GridCell[];
    const cell = path[path.length - 1];

    if (cell === end) {
      return path;
    }

    const key = `${cell.x},${cell.y}`;
    if (visited.has(key)) {
      continue;
    }
    visited.add(key);

    const neighbors = this.getNeighbors(cell);
    for (const neighbor of neighbors) {
      if (!visited.has(`${neighbor.x},${neighbor.y}`) && !neighbor.card) {
        queue.push([...path, neighbor]);
      }
    }
  }

  return null;
}
////////////////////////////////////////////////////////////////////////////////////////////////////
private getNeighbors(cell: GridCell): GridCell[] {
  const x = cell.x;
  const y = cell.y;
  const neighbors: GridCell[] = [];

  if (x > 0) {
    neighbors.push(this.board[y][x - 1]);
  }
  if (x < this.board[0].length - 1) {
    neighbors.push(this.board[y][x + 1]);
  }
  if (y > 0) {
    neighbors.push(this.board[y - 1][x]);
  }
  if (y < this.board.length - 1) {
    neighbors.push(this.board[y + 1][x]);
  }

  return neighbors;
}
////////////////////////////////////////////////////////////////////////////////////////////////////
private getCellByCard(card: Card): GridCell | null {
  for (const row of this.board) {
    for (const cell of row) {
      if (cell.card === card) {
        return cell;
      }
    }
  }
  return null;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
combat(): void {
  if (!this.selectedAttackerCard || !this.selectedDefenderCard) {
    console.log("Both attacker and defender cards must be selected");
    return;
  }
  if (this.selectedAttackerCard.hasAttacked) {
    console.log("This card has already attacked");
    return;
  }
  const attackerCell = this.getCellByCard(this.selectedAttackerCard);
  const defenderCell = this.getCellByCard(this.selectedDefenderCard);

  if (!attackerCell || !defenderCell) {
    console.log("Couldn't find attacker or defender on the board");
    return;
  }

  const distance = Math.abs(attackerCell.x - defenderCell.x) + Math.abs(attackerCell.y - defenderCell.y);
  const attackerRange = this.selectedAttackerCard.stats.range;

  if (distance > attackerRange) {
    console.log("Defender is out of range");
    return;
  }

  const attackerRoll = Math.floor(Math.random() * 6) + 1;
  const defenderRoll = Math.floor(Math.random() * 6) + 1;

  const attackerTotal = this.selectedAttackerCard.stats.attack + attackerRoll;
  const defenderTotal = this.selectedDefenderCard.stats.defense + defenderRoll;

  console.log(`Attacker roll: ${attackerRoll}, Total: ${attackerTotal}`);
  console.log(`Defender roll: ${defenderRoll}, Total: ${defenderTotal}`);

  if (attackerTotal > defenderTotal) {
    console.log("Attacker wins!");
    // Remove the defender card from the board
    if (defenderCell) {
      defenderCell.card = null;
    }
    this.selectedAttackerCard.hasAttacked = true;
  } else if (attackerTotal < defenderTotal) {
    console.log("Defender wins!");
    // Remove the attacker card from the board
    if (attackerCell) {
      attackerCell.card = null;
    }
  } else {
    console.log("It's a tie!");
    // Both cards are removed from the board
    if (attackerCell) {
      attackerCell.card = null;
    }
    if (defenderCell) {
      defenderCell.card = null;
    }
  }

  // Deselect both cards after combat
  this.selectedAttackerCard = null;
  this.selectedDefenderCard = null;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
  // Create a game board with default data (can be replaced with server data later)
  private createBoard(): GridCell[][] {
    const width = 9;
    const height = 9;

    const cells: GridCell[][] = [];

    for (let y = 0; y < height; y++) {
      const row: GridCell[] = [];
      for (let x = 0; x < width; x++) {
        row.push({ x, y, card: null });
      }
      cells.push(row);
    }

    return cells;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

  // Getter methods to fetch the current game state
  getPlayers(): Player[] {
    return this.players;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////
  getBoard(): GridCell[][] {
    return this.board;
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////
getSelectedFriendlyCard(): Card | null {
  return this.selectedFriendlyCard;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
highlightValidMoves(selectedCard: Card): void {
  if (!selectedCard || selectedCard.hasMoved) {
    return;
  }

  const currentCell = this.board
    .flatMap(row => row)
    .find(cell => cell.card === selectedCard);

  if (!currentCell) {
    console.log("Current cell not found");
    return;
  }

  // Clear previous highlights
  this.clearHighlights();

  // Loop through all cells and check if they are valid for moving the selected card
  for (const row of this.board) {
    for (const cell of row) {
      if (cell.card) {
        continue;
      }

      const path = this.bfsPathfinding(currentCell, cell);
      if (path && path.length <= selectedCard.stats.movement + 1) {
        // Add a 'highlighted' property to the cell and set it to true
        (cell as any).highlighted = true;
        this.highlightedCells.push(cell);
      }
    }
  }
}

// Call this function when a card is deselected
clearHighlights(): void {
  for (const cell of this.highlightedCells) {
    (cell as any).highlighted = false;
  }
  this.highlightedCells = [];
}
}
