import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { TopMenuComponent } from '../../shared/components/top-menu/top-menu.component';
import { ReportsService, ReportsData } from '../../core/services/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: true,
  imports: [CommonModule, ChartComponent, TopMenuComponent]
})
export class ReportsComponent implements OnInit {
  reportsData: ReportsData | null = null;
  loading = true;
  error = false;

  private reportsService = inject(ReportsService);

  ngOnInit(): void {
    this.loadReportsData();
  }

  private loadReportsData(): void {
    this.loading = true;
    this.error = false;

    // Debug: Check if token exists
    console.log('Current token:', this.reportsService['authService'].getToken());

    this.reportsService.getReportsData().subscribe({
      next: (data) => {
        this.reportsData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reports data:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
}