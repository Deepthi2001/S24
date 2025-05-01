import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { TopMenuComponent } from '../../shared/components/top-menu/top-menu.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: true,
  imports: [CommonModule, ChartComponent, TopMenuComponent]
})
export class ReportsComponent {}