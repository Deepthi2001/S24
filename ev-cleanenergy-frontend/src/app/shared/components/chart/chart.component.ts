import { Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges, OnChanges, AfterViewInit, inject } from '@angular/core';
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
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() chartKey!: string;
  @Input() data: ChartDataPoint[] = [];
  chartTitle = '';
  
  private hostElement: ElementRef = inject(ElementRef);
  private svg: any;
  private margin = {top: 30, right: 30, bottom: 70, left: 60};
  private width = 460 - this.margin.left - this.margin.right;
  private height = 400 - this.margin.top - this.margin.bottom;
  private resizeObserver: ResizeObserver | null = null;

  ngOnInit(): void {
    // Set chart title based on chart key
    switch(this.chartKey) {
      case 'battery-capacity':
      case 'cycle-life':
        this.chartTitle = 'Battery Capacity Over Time';
        break;
      case 'charging-time':
        this.chartTitle = 'Charge Time Comparison';
        break;
      case 'energy-usage':
        this.chartTitle = 'Daily Energy Usage';
        break;
      case 'efficiency':
        this.chartTitle = 'Energy Efficiency';
        break;
      case 'cost-comparison':
        this.chartTitle = 'Cost Per Mile Comparison';
        break;
      case 'energy-distribution':
        this.chartTitle = 'Energy Sources & Distribution';
        break;
      default:
        this.chartTitle = this.chartKey.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Only proceed if we have data
    if (!this.data || this.data.length === 0) {
      console.warn(`No data provided for chart: ${this.chartKey}`);
      return;
    }
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

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Chart changes detected:', {
      chartKey: this.chartKey,
      data: this.data,
      changes
    });
    
    if ((changes['data'] && !changes['data'].firstChange) || 
        (changes['chartKey'] && !changes['chartKey'].firstChange)) {
      this.updateChart();
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

  private updateChart(): void {
    console.log('Updating chart:', {
      chartKey: this.chartKey,
      data: this.data,
      element: this.hostElement?.nativeElement
    });

    if (!this.hostElement?.nativeElement) {
      console.error('Host element not found');
      return;
    }

    this.updateChartDimensions();
    this.createChart();
  }

  private createChart(): void {
    if (!this.data || this.data.length === 0) {
      console.warn(`No data for chart: ${this.chartKey}`);
      return;
    }
    
    // Log data for debugging
    console.log(`Creating chart ${this.chartKey} with data:`, this.data);

    // Clear previous chart
    const container = this.hostElement.nativeElement.querySelector('.chart-container');
    if (!container) {
      console.error('Chart container not found');
      return;
    }

    // Update dimensions based on container
    this.updateChartDimensions();

    // Remove any existing SVG
    d3.select(container).selectAll('svg').remove();
    
    // Create new SVG with updated dimensions
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.width + this.margin.left + this.margin.right} ${this.height + this.margin.top + this.margin.bottom}`)
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
      case 'energy-distribution':
        this.createPieChart();
        break;
      case 'charging-time':
        this.createLineChart();
        break;
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
    console.log('Creating pie chart with data:', this.data);
    
    // Set up pie chart dimensions
    const radius = Math.min(this.width, this.height) / 2;
    
    // Clear existing content and reposition the SVG group to center the pie chart
    this.svg.selectAll('*').remove();
    this.svg.attr('transform', `translate(${this.width / 2},${this.height / 2})`);
    
    // Set up color scale with a fixed color scheme
    const colorScheme = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'];
    const color = d3.scaleOrdinal()
      .domain(this.data.map(d => d.x))
      .range(colorScheme);
    
    // Compute the position of each group on the pie
    const pie = d3.pie<ChartDataPoint>()
      .sort(null)
      .value(d => d.y);
    
    const data_ready = pie(this.data);
    
    // Build the pie chart with a slightly larger radius
    const arcGenerator = d3.arc<any>()
      .innerRadius(radius * 0.4) // Make it a donut chart
      .outerRadius(radius * 0.8);
    
    // Add the arcs with transitions
    const paths = this.svg
      .selectAll('path')
      .data(data_ready)
      .enter()
      .append('path');
    
    paths
      .attr('d', arcGenerator)
      .attr('fill', (d: any) => color(d.data.x) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.9)
      .on('mouseover', function(this: SVGPathElement) {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function(this: SVGPathElement) {
        d3.select(this).style('opacity', 0.9);
      });
    
    // Add the labels with better positioning
    const labelArc = d3.arc<any>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);
    
    const labels = this.svg
      .selectAll('.label')
      .data(data_ready)
      .enter()
      .append('text')
      .attr('class', 'label');
    
    labels
      .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#333')
      .style('font-weight', 'bold')
      .text((d: any) => `${d.data.x}\n${Math.round((d.data.y / d3.sum(this.data, d => d.y)) * 100)}%`);
    
    // Add a title
    this.svg.append('text')
      .attr('x', 0)
      .attr('y', -radius - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(this.chartTitle);
  }
  
  private getYAxisLabel(): string {
    switch(this.chartKey) {
      case 'battery-capacity':
      case 'cycle-life':
        return 'Capacity (%)';
      case 'charging-time':
        return 'Time (minutes)';
      case 'energy-usage':
        return 'Energy (kWh)';
      case 'efficiency':
        return 'Efficiency (%)';
      case 'cost-comparison':
        return 'Cost ($/mile)';
      case 'energy-distribution':
        return 'Percentage (%)';
      default:
        return 'Value';
    }
  }
}