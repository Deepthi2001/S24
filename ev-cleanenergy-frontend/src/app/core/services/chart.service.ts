import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChartData } from '../../shared/models/chart-data.model';

@Injectable({ providedIn: 'root' })
export class ChartService {
  private api = 'http://localhost:3000/api/chart';
  constructor(private http: HttpClient) {}
  getData(key: string): Observable<any> {
    return this.http.get<any>(`${this.api}/${key}`);
  }
}