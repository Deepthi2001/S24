import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface ReportsData {
  batteryCapacity: any[];
  energyUsage: any[];
  efficiency: any[];
  costComparison: any[];
  descriptions: {
    batteryCapacity: string;
    energyUsage: string;
    efficiency: string;
    costComparison: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:3000/api/reports';
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  getReportsData(): Observable<ReportsData> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in'));
    }

    const headers = {
      Authorization: `Bearer ${this.authService.getToken()}`
    };
    
    return this.http.get<ReportsData>(this.apiUrl, {headers})
      .pipe(
        catchError(error => {
          console.error('Error fetching reports data:', error);
          return throwError(() => error);
        })
      );
  }
}
