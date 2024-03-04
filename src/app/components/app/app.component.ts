import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from "../spinner/spinner.component";
import { Observable } from "rxjs";
import { CityLocation, OpenWeather, WeatherService } from "../../services/weather.service";
import { ForecastComponent } from "../forecast/forecast.component";
import { CapitalizePipe } from "../../pipes/capitalize.pipe";
import { CurrentWeatherComponent } from "../current-weather/current-weather.component";
import { CitySearchComponent } from "../city-search/city-search.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { UiService } from "../../services/ui.service";
import { animate, style, transition, trigger } from "@angular/animations";


@Component({
       selector: 'app-root',
       standalone: true,
       imports: [
              CommonModule,
              CurrentWeatherComponent, CitySearchComponent, SpinnerComponent, ForecastComponent,
              CapitalizePipe, MatGridListModule
       ],
       providers: [WeatherService],
       templateUrl: './app.component.html',
       styleUrl: './app.component.css',
       animations: [
              trigger('fade', [
                     transition(':enter', [
                            style({ opacity: 0 }),
                            animate('300ms 100ms', style({opacity: 1}))
                     ]),
                     transition(':leave', [
                            style({ opacity: 1 }),
                            animate(200, style({opacity: 0}))
                     ])
              ])
       ]
})
export class AppComponent implements OnInit {

       weatherData$: Observable<OpenWeather> | null = null;
       error$: Observable<string> | null = new Observable<string>;


       constructor (private weather: WeatherService, private ui: UiService) {
              this.error$ = this.weather.error$
       }

       getWeatherForCity (city: string) {
              this.weatherData$ = this.weather.getWeatherForCity(city)
       }

       getWeatherDataForLocation (location: CityLocation) {
              this.weatherData$ = this.weather.getWeatherForLocation(location)
       }

       clearWeatherData () {
              this.weatherData$ = null
       }


       ngOnInit () {
              this.ui.screenWidthResizedTo(window.innerWidth)
       }

       @HostListener('window:resize', ['$event'])
       onResize (event: Event) {
              this.ui.screenWidthResizedTo(window.innerWidth)
       }
}
