import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ChartService {
  private platformId = inject(PLATFORM_ID);
  
  // Mock data for different chart types
  private mockData: { [key: string]: any[] } = {
    'cycle-life': [
      { x: 'Jan', y: 95 },
      { x: 'Feb', y: 92 },
      { x: 'Mar', y: 90 },
      { x: 'Apr', y: 87 },
      { x: 'May', y: 85 },
      { x: 'Jun', y: 83 },
      { x: 'Jul', y: 80 }
    ],
    'charging-time': [
      { x: '0%', y: 0 },
      { x: '20%', y: 10 },
      { x: '40%', y: 18 },
      { x: '60%', y: 25 },
      { x: '80%', y: 35 },
      { x: '100%', y: 45 }
    ],
    'energy-usage': [
      { x: 'Mon', y: 45 },
      { x: 'Tue', y: 38 },
      { x: 'Wed', y: 42 },
      { x: 'Thu', y: 35 },
      { x: 'Fri', y: 50 },
      { x: 'Sat', y: 25 },
      { x: 'Sun', y: 20 }
    ],
    'efficiency': [
      { x: 'City', y: 92 },
      { x: 'Highway', y: 86 },
      { x: 'Combined', y: 89 }
    ],
    'energy-distribution': [
      { x: 'Solar', y: 45 },
      { x: 'Wind', y: 25 },
      { x: 'Hydro', y: 15 },
      { x: 'Geothermal', y: 10 },
      { x: 'Biomass', y: 5 }
    ],
    'carbon-savings': [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 150 },
      { x: 'Q3', y: 180 },
      { x: 'Q4', y: 210 }
    ],
    'cost-comparison': [
      { x: 'Gasoline', y: 0.15 },
      { x: 'EV (Grid)', y: 0.05 },
      { x: 'EV (Solar)', y: 0.02 }
    ]
  };
  
  getData(key: string): Observable<any[]> {
    // Return mock data based on the key
    return of(this.mockData[key] || []);
  }
}
