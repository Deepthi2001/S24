import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../shared/components/chart/chart.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, ChartComponent]
})
export class DashboardComponent implements OnInit {
  // No need for services, using hardcoded data directly in the template
  
  ngOnInit(): void {
    // Nothing to initialize
  }
}