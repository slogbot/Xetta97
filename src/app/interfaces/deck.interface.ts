import { Card } from './card.interface';
export interface Deck {
  id: string;
  name: string;
  cards: Card[];
}
