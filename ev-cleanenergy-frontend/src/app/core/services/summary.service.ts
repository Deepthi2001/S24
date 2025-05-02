import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
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
  private apiUrl = 'http://localhost:3000/api/summary';
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  
  // Mock data as fallback
  private mockData: SummaryData = {
    energyDistribution: [
      { x: 'Solar', y: 45 },
      { x: 'Wind', y: 25 },
      { x: 'Hydro', y: 15 },
      { x: 'Geothermal', y: 10 },
      { x: 'Biomass', y: 5 }
    ],
    chargingTime: [
      { x: '0%', y: 0 },
      { x: '20%', y: 10 },
      { x: '40%', y: 18 },
      { x: '60%', y: 25 },
      { x: '80%', y: 35 },
      { x: '100%', y: 45 }
    ],
    metrics: {
      batteryHealth: {
        value: 92,
        trend: 2,
        trendDirection: 'up'
      },
      energyEfficiency: {
        value: 4.2,
        unit: 'mi/kWh',
        trend: 0.3,
        trendDirection: 'up'
      },
      co2Avoided: {
        value: 1240,
        unit: 'kg',
        trend: 120,
        trendDirection: 'up'
      },
      costSavings: {
        value: 345,
        unit: '$',
        trend: 42,
        trendDirection: 'up'
      }
    },
    benefits: [
      {
        icon: '🌍',
        title: 'Environmental Impact',
        description: 'Your EV has prevented 1.2 tons of CO₂ emissions this year, equivalent to planting 60 trees.'
      },
      {
        icon: '💸',
        title: 'Financial Savings',
        description: 'You\'ve saved approximately $1,200 in fuel costs compared to a conventional vehicle.'
      },
      {
        icon: '⚙️',
        title: 'Maintenance Reduction',
        description: 'EVs require 50% less maintenance than conventional vehicles, saving you time and money.'
      },
      {
        icon: '🔄',
        title: 'Energy Independence',
        description: 'Your clean energy sources provide 85% of your charging needs, reducing grid dependency.'
      }
    ]
  };
  
  getSummaryData(): Observable<SummaryData> {
    // Try to get data from API if user is logged in
    if (this.authService.isLoggedIn()) {
      const headers = {
        Authorization: `Bearer ${this.authService.getToken()}`
      };
      return this.http.get<SummaryData>(this.apiUrl,{headers})
        .pipe(
          catchError(error => {
            console.error('Error fetching summary data:', error);
            // Fallback to mock data if API call fails
            return of(this.mockData);
          })
        );
    }
    
    // Fallback to mock data if not logged in
    return of(this.mockData);
  }
}
