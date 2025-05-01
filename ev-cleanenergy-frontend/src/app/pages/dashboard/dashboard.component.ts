import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  summary: string = '';
  sourceUrl: string = 'https://www.sciencedaily.com/releases/2025/04/250418112806.htm';

  ngOnInit() {
    this.summary = `A joint team at POSTECH and KIER has developed a novel anode combining nano-sized tin particles with hard carbon that delivers both ultra-fast charging (capable of reaching 80% state-of-charge in just 20 minutes) and exceptional cycle stability (maintaining over 92% capacity after 1,500 cycles). By embedding tin nanoparticles into the carbon matrix, they achieve a 1.5-fold increase in volumetric energy density compared to conventional graphite anodes, while significantly reducing charge times and degradation rates. This breakthrough directly addresses two of the most critical barriers to electric vehicle adoption—slow recharge speeds and battery longevity—bringing us closer to fully realizing the potential of clean transportation.`;
  }
}