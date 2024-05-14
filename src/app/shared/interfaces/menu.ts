export interface Menu {

    name: string;
  selections: string[];
}

export const menuSections: Menu [] = [
  { name: 'Man', selections: ['T-shirt', 'Hoodies', 'Trousers'] },
  { name: 'Woman', selections: ['Dresses', 'Skirts', 'Jackets'] },
  { name: 'Child', selections: ['Tops', 'Shorts', 'Shoes'] }
];

