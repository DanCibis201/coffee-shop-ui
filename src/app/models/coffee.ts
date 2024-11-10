import { Order } from "./order";
import { Review } from "./review";

export interface Coffee {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    reviews?: Review[];
    orders?: Order[];
  }