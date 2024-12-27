import { Product } from "../../products/shared/product.model";

interface DeliveryAddress {
    id: number;
    delivery_id: number;
    full_name: string;
    line_1: string;
    line_2: string;
    postal_code: string;
    city: string;
}

interface Delivery {
    id: number;
    order_id: number;
    status: number;
    created_at: string;
    updated_at: string;
    delivery_addresses: DeliveryAddress[];
}

interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
    products: Product;
}

export class Order {
    id: number;
    user_id: string;
    status: number;
    created_at: string;
    updated_at: string;
    deliveries: Delivery[];
    order_items: OrderItem[];

    // Require additional mapping
    total: number;
}