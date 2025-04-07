export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
}