import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface SummaryData {
  energyDistribution: any[];
  chargingTime: any[];
  metrics: {
    batteryHealth: { value: number; trend: number; trendDirection: string };
    energyEfficiency: { value: number; unit: string; trend: number; trendDirection: string };
    co2Avoided: { value: number; unit: string; trend: number; trendDirection: string };
    costSavings: { value: number; unit: string; trend: number; trendDirection: string };
  };
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  private apiUrl = 'http://ev-clean-energy.us-east-2.elasticbeanstalk.com/api/summary';
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  getSummaryData(): Observable<SummaryData> {
    if (!this.authService.isLoggedIn()) {
      return throwError(() => new Error('User not logged in'));
    }

    const headers = {
      Authorization: `Bearer ${this.authService.getToken()}`
    };
    
    return this.http.get<SummaryData>(this.apiUrl, {headers})
      .pipe(
        tap((data: SummaryData) => {
          console.log('Summary Data received:', JSON.stringify(data, null, 2));
        }),
        catchError(error => {
          console.error('Error fetching summary data:', error);
          return throwError(() => error);
        })
      );
  }
}
