import { Component, Input, OnInit, ElementRef, AfterViewInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface ChartDataPoint {
  x: string;
  y: number;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() chartKey!: string;
  data: ChartDataPoint[] = [];
  chartTitle = '';
  
  private hostElement: ElementRef = inject(ElementRef);
  private svg: any;
  private margin = {top: 30, right: 30, bottom: 70, left: 60};
  private width = 460 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private resizeObserver: ResizeObserver | null = null;
  
  // Hardcoded chart data
  private mockData: { [key: string]: ChartDataPoint[] } = {
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

  ngOnInit(): void {
    // Set chart title based on chart key
    switch(this.chartKey) {
      case 'cycle-life':
        this.chartTitle = 'Battery Capacity Over Time';
        break;
      case 'charging-time':
        this.chartTitle = 'Charging Time by Battery Level';
        break;
      case 'energy-usage':
        this.chartTitle = 'Daily Energy Usage';
        break;
      case 'efficiency':
        this.chartTitle = 'Energy Efficiency by Driving Condition';
        break;
      case 'energy-distribution':
        this.chartTitle = 'Clean Energy Distribution';
        break;
      case 'carbon-savings':
        this.chartTitle = 'Carbon Savings by Quarter';
        break;
      case 'cost-comparison':
        this.chartTitle = 'Cost per Mile Comparison';
        break;
      default:
        this.chartTitle = this.chartKey.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Get data from hardcoded values
    this.data = this.mockData[this.chartKey] || [];
    // Create chart after data is set
    setTimeout(() => this.createChart(), 0);
  }

  ngAfterViewInit(): void {
    // Set up resize observer to make chart responsive
    this.resizeObserver = new ResizeObserver(() => {
      this.updateChartDimensions();
      if (this.data.length > 0) {
        this.createChart();
      }
    });
    
    const chartContainer = this.hostElement.nativeElement.querySelector('.chart-container');
    if (chartContainer) {
      this.resizeObserver.observe(chartContainer);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private updateChartDimensions(): void {
    const chartContainer = this.hostElement.nativeElement.querySelector('.chart-container');
    if (!chartContainer) return;
    
    const containerWidth = chartContainer.clientWidth;
    const containerHeight = chartContainer.clientHeight || 400; // Default height if not set
    
    this.width = containerWidth - this.margin.left - this.margin.right;
    this.height = containerHeight - this.margin.top - this.margin.bottom;
  }

  private createChart(): void {
    if (!this.data || this.data.length === 0) return;
    
    // Clear previous chart
    d3.select(this.hostElement.nativeElement).select('.chart-container svg').remove();
    
    // Create SVG
    this.svg = d3.select(this.hostElement.nativeElement).select('.chart-container')
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    
    // Add chart title
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(this.chartTitle);

    // Determine chart type based on chartKey
    switch(this.chartKey) {
      case 'efficiency':
        this.createHorizontalBarChart();
        break;
      case 'cycle-life':
        this.createLineChart();
        break;
      case 'energy-distribution':
        this.createPieChart();
        break;
      default:
        this.createBarChart();
    }
  }

  private createBarChart(): void {
    // X axis
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(this.data.map(d => d.x))
      .padding(0.2);
    
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
        .attr('transform', 'translate(-10,0)rotate(-45)')
        .style('text-anchor', 'end');
    
    // Add X axis label
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + 50)
      .attr('text-anchor', 'middle')
      .text(this.getXAxisLabel());
    
    // Y axis
    const maxY = d3.max(this.data, d => d.y) || 0;
    const y = d3.scaleLinear()
      .domain([0, maxY * 1.1]) // Add 10% padding
      .range([this.height, 0]);
    
    this.svg.append('g')
      .call(d3.axisLeft(y));
    
    // Add Y axis label
    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -(this.height / 2))
      .attr('text-anchor', 'middle')
      .text(this.getYAxisLabel());
    
    // Bars
    this.svg.selectAll('mybar')
      .data(this.data)
      .enter()
      .append('rect')
        .attr('x', (d: ChartDataPoint) => x(d.x) as number)
        .attr('y', (d: ChartDataPoint) => y(d.y))
        .attr('width', x.bandwidth())
        .attr('height', (d: ChartDataPoint) => this.height - y(d.y))
        .attr('fill', '#4e79a7')
        .attr('rx', 4) // Rounded corners
        .attr('ry', 4);
  }

  private createHorizontalBarChart(): void {
    // X axis
    const maxY = d3.max(this.data, d => d.y) || 0;
    const x = d3.scaleLinear()
      .domain([0, maxY * 1.1]) // Add 10% padding
      .range([0, this.width]);
    
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x));
    
    // Add X axis label
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + 40)
      .attr('text-anchor', 'middle')
      .text(this.getYAxisLabel()); // Swapped for horizontal
    
    // Y axis
    const y = d3.scaleBand()
      .range([0, this.height])
      .domain(this.data.map(d => d.x))
      .padding(0.2);
    
    this.svg.append('g')
      .call(d3.axisLeft(y));
    
    // Add Y axis label
    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -(this.height / 2))
      .attr('text-anchor', 'middle')
      .text(this.getXAxisLabel()); // Swapped for horizontal
    
    // Bars
    this.svg.selectAll('mybar')
      .data(this.data)
      .enter()
      .append('rect')
        .attr('x', 0)
        .attr('y', (d: ChartDataPoint) => y(d.x) as number)
        .attr('width', (d: ChartDataPoint) => x(d.y))
        .attr('height', y.bandwidth())
        .attr('fill', '#4e79a7')
        .attr('rx', 4) // Rounded corners
        .attr('ry', 4);
  }

  private getXAxisLabel(): string {
    switch(this.chartKey) {
      case 'cycle-life':
        return 'Month';
      case 'charging-time':
        return 'Battery Level';
      case 'energy-usage':
        return 'Day of Week';
      case 'efficiency':
        return 'Driving Condition';
      default:
        return 'Category';
    }
  }

  private createLineChart(): void {
    // X axis
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(this.data.map(d => d.x))
      .padding(0.2);
    
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(x));
    
    // Add X axis label
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + 40)
      .attr('text-anchor', 'middle')
      .text(this.getXAxisLabel());
    
    // Y axis
    const maxY = d3.max(this.data, d => d.y) || 0;
    const y = d3.scaleLinear()
      .domain([0, maxY * 1.1]) // Add 10% padding
      .range([this.height, 0]);
    
    this.svg.append('g')
      .call(d3.axisLeft(y));
    
    // Add Y axis label
    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -40)
      .attr('x', -(this.height / 2))
      .attr('text-anchor', 'middle')
      .text(this.getYAxisLabel());
    
    // Add the line
    const line = d3.line<ChartDataPoint>()
      .x(d => (x(d.x) as number) + x.bandwidth() / 2)
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX); // Smooth curve
    
    this.svg.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#4e79a7')
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Add the points
    this.svg.selectAll('dot')
      .data(this.data)
      .enter()
      .append('circle')
        .attr('cx', (d: ChartDataPoint) => (x(d.x) as number) + x.bandwidth() / 2)
        .attr('cy', (d: ChartDataPoint) => y(d.y))
        .attr('r', 5)
        .attr('fill', '#4e79a7')
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5);
  }
  
  private createPieChart(): void {
    // Set up pie chart dimensions
    const radius = Math.min(this.width, this.height) / 2;
    
    // Reposition the SVG group to center the pie chart
    this.svg.attr('transform', `translate(${this.width / 2 + this.margin.left},${this.height / 2 + this.margin.top})`);
    
    // Set up color scale
    const color = d3.scaleOrdinal()
      .domain(this.data.map(d => d.x))
      .range(d3.schemeCategory10);
    
    // Compute the position of each group on the pie
    const pie = d3.pie<ChartDataPoint>()
      .value(d => d.y);
    
    const data_ready = pie(this.data);
    
    // Build the pie chart
    const arcGenerator = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius * 0.8);
    
    // Add the arcs
    this.svg
      .selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('path')
        .attr('d', arcGenerator)
        .attr('fill', (d: any) => color(d.data.x) as string)
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);
    
    // Add the labels
    const labelArc = d3.arc<any>()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 0.8);
    
    this.svg
      .selectAll('myLabels')
      .data(data_ready)
      .enter()
      .append('text')
        .text((d: any) => d.data.x)
        .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', 'white');
    
    // Add percentage labels
    const percentageArc = d3.arc<any>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);
    
    const total = d3.sum(this.data, d => d.y);
    
    this.svg
      .selectAll('myPercentages')
      .data(data_ready)
      .enter()
      .append('text')
        .text((d: any) => `${Math.round((d.data.y / total) * 100)}%`)
        .attr('transform', (d: any) => `translate(${percentageArc.centroid(d)})`)
        .style('text-anchor', 'middle')
        .style('font-size', '10px');
  }
  
  private getYAxisLabel(): string {
    switch(this.chartKey) {
      case 'cycle-life':
        return 'Capacity (%)';
      case 'charging-time':
        return 'Time (min)';
      case 'energy-usage':
        return 'Energy (kWh)';
      case 'efficiency':
        return 'Efficiency (%)';
      case 'energy-distribution':
        return 'Energy Distribution';
      default:
        return 'Value';
    }
  }
}