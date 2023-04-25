import { Card } from './card.interface';
export interface GridCell {
  x: number;
  y: number;
  card: Card | null;
  highlighted?: boolean;
}
