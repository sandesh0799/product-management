export interface Product {
    _id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryId: string;
    category?: {
        id: string;
        name: string;
    };
    images?: string[];
    createdAt: string;
    updatedAt: string;
}
