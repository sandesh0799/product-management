import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();

    show(): void {
        this.loadingSubject.next(true);
        console.log('show')
    }

    hide(): void {
        this.loadingSubject.next(false);
        console.log('hide')
    }
}
