import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../../environments/environment';
interface BulkUploadResponse {
    message: string;
    totalProducts: number;
}
@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly API_URL = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) { }

    getProducts(params?: any): Observable<{ products: Product[], total: number }> {
        return this.http.get<{ products: Product[], total: number }>(this.API_URL, { params });
    }

    getProductById(id: string): Observable<Product> {
        return this.http.get<Product>(`${this.API_URL}/${id}`);
    }

    createProduct(product: Partial<Product>): Observable<Product> {
        return this.http.post<Product>(`${this.API_URL}/add`, product);
    }

    updateProduct(id: string, product: Partial<Product>): Observable<Product> {
        return this.http.put<Product>(`${this.API_URL}/update/${id}`, product);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/delete/${id}`);
    }
    
    bulkUploadProducts(file: FormData): Observable<HttpEvent<BulkUploadResponse>> {
        return this.http.post<BulkUploadResponse>(`${environment.apiUrl}/bulk-upload/upload`, file, {
            reportProgress: true,
            observe: 'events'
        });
    }

    downloadReport(): Observable<Blob> {
        return this.http.get(`${environment.apiUrl}/reports/xlsx`, {
            responseType: 'blob'
        });
    }
}