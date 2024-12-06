import { Order } from "./order";
import { Review } from "./review";

export interface Coffee {
    id: string;
    name: string;
    price: number;
    description: string;
    intensity: number;
    imageUrl: string;
    type: number;
    brand: number;
    reviews?: Review[];
    orders?: Order[];
  }