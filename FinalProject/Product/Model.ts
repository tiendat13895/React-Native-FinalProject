export interface RootObject {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

export interface Result {
  id: string;
  productCode: string;
  productName: string;
  patternName: string;
  rangeName: string;
  unitName: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  capacity: number;
  unitPrice: number;
  categoryName: string;
}

export interface CartObject {
  carts: CartModel[];
}

export interface CartModel {
  id: string;
  productCode: string;
  productName: string;
  patternName: string;
  rangeName: string;
  unitName: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  capacity: number;
  unitPrice: number;
  categoryName: string;
  quantity: number;
  isChoode: boolean;
}
