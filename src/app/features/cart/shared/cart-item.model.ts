import { Product } from "../../products/shared/product.model";

export class CartItem {
    id: number;
    product_id: number;
    quantity: number;
    products: Product;
}