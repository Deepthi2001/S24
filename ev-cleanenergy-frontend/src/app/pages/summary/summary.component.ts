import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from '../../shared/components/top-menu/top-menu.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { SummaryService, SummaryData } from '../../core/services/summary.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  standalone: true,
  imports: [CommonModule, TopMenuComponent, ChartComponent]
})
export class SummaryComponent implements OnInit {
  summaryData: SummaryData | null = null;
  loading = true;
  error = false;
  
  private summaryService = inject(SummaryService);
  
  ngOnInit(): void {
    this.loadSummaryData();
  }
  
  private loadSummaryData(): void {
    this.loading = true;
    this.error = false;
    
    // Debug: Check if token exists
    console.log('Current token:', this.summaryService['authService'].getToken());
    
    this.summaryService.getSummaryData().subscribe({
      next: (data) => {
        // Transform data for charts
        this.summaryData = {
          ...data,
          energyDistribution: data.energyDistribution?.map(item => ({
            x: item.x,
            y: Number(item.y)
          })) || [],
          chargingTime: data.chargingTime?.map(item => ({
            x: item.x,
            y: Number(item.y)
          })) || []
        };
        console.log('Transformed summary data:', this.summaryData);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading summary data:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}