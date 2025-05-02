import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// D3.js is imported directly in the chart component

import { AppComponent }       from './app.component';
import { LoginComponent }     from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SummaryComponent }   from './pages/summary/summary.component';
import { ReportsComponent }   from './pages/reports/reports.component';
import { TopMenuComponent }   from './shared/components/top-menu/top-menu.component';
import { ChartComponent }     from './shared/components/chart/chart.component';

import { AuthGuard }          from './core/guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SummaryComponent,
    ReportsComponent,
    TopMenuComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,       // required for <router-outlet> and routerLink
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule    // required for API requests
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}