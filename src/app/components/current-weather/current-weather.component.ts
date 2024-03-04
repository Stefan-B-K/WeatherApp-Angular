import { Component, Input } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe, NgForOf, NgIf, TitleCasePipe } from "@angular/common";
import { OpenWeather, Units, WeatherService } from "../../services/weather.service";
import { MatGridListModule } from "@angular/material/grid-list";
import { Observable } from "rxjs";

@Component({
       selector: 'app-current-weather',
       standalone: true,
       imports: [
              DatePipe,
              DecimalPipe,
              TitleCasePipe,
              MatGridListModule,
              NgForOf,
              AsyncPipe,
              NgIf
       ],
       templateUrl: './current-weather.component.html',
       styleUrl: './current-weather.component.css'
})
export class CurrentWeatherComponent {
       @Input()
       weatherData!: OpenWeather;

       units$: Observable<Units> = new Observable<Units>;

       constructor (private weather: WeatherService) {
              this.units$ = weather.units$
       }

       temperatureUnits (units: Units): string {
              return units === 'metric' ? '°C' : '°F'
       }
}
