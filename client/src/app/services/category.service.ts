import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  _id?: string;
  name: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response)
    );
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/add`, category).pipe(
      map(response => response.data)
    );
  }

  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/update/${id}`, category).pipe(
      map(response => response.data)
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`).pipe(
      map(() => undefined)
    );
  }
} 