import { Deck } from "./deck.interface";
import { Hand } from "./hand.interface";
export interface Player {
  id: string;
  name: string;
  deck: Deck;
  hand: Hand;
  mana: number; // Add this line
}
