interface Category {
    id: number;
    name: string;
}

interface ProductCategory {
    categories: Category;
}

interface Stock {
    available_quantity: number;
    reserved_quantity: number;
}

export class Product {
    id: number;
    name: string;
    image_url: string;
    price: number;
    created_at: string;
    updated_at: string;
    product_categories: ProductCategory[];
    stocks: Stock[];
}