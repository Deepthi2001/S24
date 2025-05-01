import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from '../../shared/components/top-menu/top-menu.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  standalone: true,
  imports: [CommonModule, TopMenuComponent, ChartComponent]
})
export class SummaryComponent {}