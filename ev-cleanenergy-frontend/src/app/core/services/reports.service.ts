import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
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
  
  // Mock data as fallback
  private mockData: ReportsData = {
    batteryCapacity: [
      { x: 'Jan', y: 95 },
      { x: 'Feb', y: 92 },
      { x: 'Mar', y: 90 },
      { x: 'Apr', y: 87 },
      { x: 'May', y: 85 },
      { x: 'Jun', y: 83 },
      { x: 'Jul', y: 80 }
    ],
    energyUsage: [
      { x: 'Mon', y: 45 },
      { x: 'Tue', y: 38 },
      { x: 'Wed', y: 42 },
      { x: 'Thu', y: 35 },
      { x: 'Fri', y: 50 },
      { x: 'Sat', y: 25 },
      { x: 'Sun', y: 20 }
    ],
    efficiency: [
      { x: 'City', y: 92 },
      { x: 'Highway', y: 86 },
      { x: 'Combined', y: 89 }
    ],
    costComparison: [
      { x: 'Gasoline', y: 0.15 },
      { x: 'EV (Grid)', y: 0.05 },
      { x: 'EV (Solar)', y: 0.02 }
    ],
    descriptions: {
      batteryCapacity: 'This chart tracks battery capacity retention over time. The data shows a gradual decline from 95% in January to 80% in July, which is significantly better than industry standards. Most EV batteries typically degrade to 70% capacity after similar usage periods. This data is collected from our fleet of monitored vehicles and represents average values across different battery technologies.',
      energyUsage: 'This chart displays the average daily energy consumption of EVs in our network. Usage peaks on Fridays (50 kWh) and is lowest on weekends (20-25 kWh), reflecting typical commuting patterns. The data is collected from charging sessions and helps optimize charging infrastructure deployment and energy distribution planning.',
      efficiency: 'This chart compares energy efficiency across different driving conditions. City driving achieves the highest efficiency (92%) due to regenerative braking opportunities, while highway driving is slightly less efficient (86%). The combined average efficiency of 89% demonstrates the overall effectiveness of modern EV powertrains compared to internal combustion engines which typically operate at 20-30% efficiency.',
      costComparison: 'This chart compares the cost per mile of different vehicle power sources. Gasoline vehicles cost approximately $0.15 per mile, while grid-charged EVs cost only $0.05 per mile. Solar-charged EVs achieve the lowest cost at just $0.02 per mile, representing a 87% cost reduction compared to gasoline vehicles. These figures are based on current energy prices and average vehicle efficiencies.'
    }
  };
  
  getReportsData(): Observable<ReportsData> {
    // Try to get data from API if user is logged in
    if (this.authService.isLoggedIn()) {
      const headers = {
        Authorization: `Bearer ${this.authService.getToken()}`
      };
      return this.http.get<ReportsData>(this.apiUrl,{headers})
        .pipe(
          catchError(error => {
            console.error('Error fetching reports data:', error);
            // Fallback to mock data if API call fails
            return of(this.mockData);
          })
        );
    }
    
    // Fallback to mock data if not logged in
    return of(this.mockData);
  }
}
