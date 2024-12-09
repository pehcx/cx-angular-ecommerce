interface Category {
    id: number;
    name: string;
}

export class Product {
    id: number;
    name: string;
    image_url: string;
    stock: number;
    price: number;
    created_at: string;
    updated_at: string;
    product_categories: Category[];
    stocks: number;
}