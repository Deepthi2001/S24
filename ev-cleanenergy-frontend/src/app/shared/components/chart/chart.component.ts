import { Component, Input, OnInit } from '@angular/core';
import { ChartService } from '../../../core/services/chart.service';
import { ChartType, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() chartKey!: string;
  chartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'bar'>['options'] = {};
  chartType: ChartType = 'bar';

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    this.chartService.getData(this.chartKey).subscribe(data => {
      this.chartData = {
        labels: data.map((d: any) => d.x),
        datasets: [
          {
            label: this.chartKey === 'cycle-life' ? 'Capacity (%)' : 'Time (min)',
            data: data.map((d: any) => d.y ?? d.composite ?? d.graphite)
          }
        ]
      };
      this.chartOptions = { responsive: true, maintainAspectRatio: false };
    });
  }
}