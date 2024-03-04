import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CityData, CityLocation, Units, WeatherService } from "../../services/weather.service";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { Observable } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";


@Component({
       selector: 'app-city-search',
       standalone: true,
       imports: [
              AsyncPipe,
              FormsModule,
              MatButtonModule,
              MatIconModule,
              NgIf,
              MatButtonToggleModule,
              NgClass,
              MatMenuModule,
              NgForOf
       ],
       templateUrl: './city-search.component.html',
       styleUrl: './city-search.component.css'
})
export class CitySearchComponent implements OnInit {
       city: string = ''
       location: CityLocation | null = null
       isShowingInput = true;

       units$ = new Observable<Units>;
       isLoading$ = new Observable<boolean>;
       savedCities$ = new Observable<CityData[]>;
       error$: Observable<string> | null = new Observable<string>;

       @Output() onGetWeatherForCity = new EventEmitter<string>()
       @Output() onGetWeatherForLocation = new EventEmitter<CityLocation>()
       @Output() onClearWeatherData = new EventEmitter<string>()

       constructor (private weather: WeatherService) {
              this.savedCities$ = weather.savedCities$
              this.isLoading$ = weather.isLoading$
              this.units$ = weather.units$
              this.weather.location$
                     .subscribe(location => {
                            if (!location) return
                            this.location = location
                            this.city = this.cityWithCountry(this.city.split(', ')[0], location!.country)
                     })
              this.error$ = this.weather.error$
       }

       ngOnInit (): void {
              const savedCities = localStorage.getItem('saved-cities')
              if (!!savedCities) {
                     const citiesArray: CityData[] = JSON.parse(savedCities)
                     if (citiesArray.length === 1) this.weatherForSavedCity(citiesArray[0])
              }
       }


       toggleUnits (newValue: Units) {
              this.weather.setUnits(newValue)
              if (!this.isShowingInput) {
                     this.onGetWeatherForLocation.emit(this.location!)
              }
       }

       weatherForInputCity () {
              if (!this.city.trim().length) return
              this.weather.clearStore()
              this.isShowingInput = false;
              this.onGetWeatherForCity.emit(this.city)
       }

       weatherForSavedCity (cityData: CityData) {
              this.city = this.cityWithCountry(cityData.city, cityData.location.country)
              this.location = cityData.location
              this.weather.clearStore()
              this.isShowingInput = false;
              this.onGetWeatherForLocation.emit(cityData.location)
       }

       showSearch () {
              this.weather.clearStore()
              this.onClearWeatherData.emit()
              this.city = this.city.split(', ')[0]
              this.isShowingInput = true;
       }

       citySaved () {
              let cityName = this.city.split(', ')[0]
              const savedCities = localStorage.getItem('saved-cities')
              let citiesArray: CityData[] = !!savedCities ? JSON.parse(savedCities) : []
              return !!citiesArray.find(el => el.city === cityName)
       }

       saveDeleteCityData () {
              if (!this.city.trim().length) return
              this.weather.saveDeleteCityData(this.city)
       }

       private cityWithCountry (city: string, countryCode: string) {
              let countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode)
              return city + ', ' + countryName
       }
}
