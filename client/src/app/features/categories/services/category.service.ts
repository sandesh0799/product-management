import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly API_URL = `${environment.apiUrl}/categories`;
    constructor(private http: HttpClient) { }

    // Method to fetch the categories
    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.API_URL);
    }
}
