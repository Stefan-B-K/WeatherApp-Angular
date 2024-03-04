import { Component, Input } from '@angular/core';
import { DailyWeather, OpenWeather, Units, WeatherService } from "../../services/weather.service";
import { AsyncPipe, DatePipe, DecimalPipe, NgForOf, NgIf } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { Observable } from "rxjs";
import { UiService } from "../../services/ui.service";
import { MatListModule } from "@angular/material/list";

@Component({
       selector: 'app-forecast',
       standalone: true,
       imports: [
              DatePipe,
              DecimalPipe,
              NgForOf,
              NgIf,
              MatGridListModule,
              AsyncPipe,
              MatListModule
       ],
       templateUrl: './forecast.component.html',
       styleUrl: './forecast.component.css'
})
export class ForecastComponent {
       @Input()
       weatherData: OpenWeather | null = null;

       units$: Observable<Units> = new Observable<Units>;
       screenWidth$ = new Observable<number>;

       constructor (private weather: WeatherService, private ui: UiService) {
              this.units$ = weather.units$
              this.screenWidth$ = ui.screenWidth$
       }

       temperatureUnits (units: Units): string {
              return units === 'metric' ? '°C' : '°F'
       }

       time1970toDate (dt: number): string {
              return new Date(dt * 1000).toISOString()
       }

        fiveDayForecast(): DailyWeather[] {
              return this.weatherData?.daily.slice(1, 6) ?? []
       }
}
