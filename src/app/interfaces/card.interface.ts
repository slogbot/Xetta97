export interface Card {
  id: string;
  name: string;
  stats: {
    attack: number;
    defense: number;
    movement: number;
    range: number;
    cost: number;

    // Other stats
  };
  // Other attributes
  owner: string; // Add this line

}
