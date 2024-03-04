import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import {
       BehaviorSubject,
       catchError,
       map,
       Observable, of,
       switchMap,
       tap,
       throwError,
       timeout,
} from "rxjs";

import { OpenWeatherMap_API } from "../../../private";

export  type CityData = {
       city: string,
       location: CityLocation
}

export type CityLocation = {
       lat: number,
       lon: number,
       country: string
}
export type OpenWeather = {
       current: CurrentWeather,
       daily: DailyWeather[]
}
type CurrentWeather = {
       temp: number,
       feels_like: number,
       weather: { description: string, icon: string }[]
}
export type DailyWeather = {
       dt: number,
       temp: { min: number, max: number },
       weather: { icon: string }[]
}
export type Units = 'metric' | 'imperial'


@Injectable()
export class WeatherService {

       private isLoading = new BehaviorSubject<boolean>(false);
       isLoading$ = this.isLoading.asObservable();

       private error = new BehaviorSubject<string>('');
       error$: Observable<string> | null = this.error.asObservable();

       private units = new BehaviorSubject<Units>('metric')
       units$: Observable<Units> = this.units.asObservable();

       private location = new BehaviorSubject<CityLocation | null>(null)
       location$: Observable<CityLocation | null> = this.location.asObservable();

       private savedCities = new BehaviorSubject<CityData[]>([])
       savedCities$: Observable<CityData[]> = this.savedCities.asObservable();

       private geoUrl = 'https://api.openweathermap.org/geo/1.0/direct'
       private weatherUrl = 'https://api.openweathermap.org/data/3.0/onecall'


       constructor (private http: HttpClient) {
              const savedCities = localStorage.getItem('saved-cities')
              if (!!savedCities) {
                     this.savedCities.next(JSON.parse(savedCities))
              }
       }


       setUnits (newValue: Units) {
              this.units.next(newValue)
       }

       clearStore () {
              this.error.next('')
              this.location.next(null)
       }

       getWeatherForCity (city: string): Observable<OpenWeather> {
              if (this.error.value.length) return of()
              this.isLoading.next(true)

              return this.getLocation(city)
                     .pipe(
                            map(coords => ({
                                   params: new HttpParams()
                                          .set('lat', coords.lat)
                                          .set('lon', coords.lon)
                                          .set('units', this.units.value)
                                          .set('appid', OpenWeatherMap_API)
                            })),
                            switchMap(params => this.http.get<OpenWeather>(this.weatherUrl, params)),
                            timeout(5000),
                            catchError(this.handleError),
                            tap(() => this.isLoading.next(false))
                     )
       }

       getWeatherForLocation (location: CityLocation): Observable<OpenWeather> {
              this.location.next(location)
              if (this.error.value.length) return of()
              this.isLoading.next(true)

              return this.http.get<OpenWeather>(this.weatherUrl, {
                            params: new HttpParams()
                                   .set('lat', location.lat)
                                   .set('lon', location.lon)
                                   .set('units', this.units.value)
                                   .set('appid', OpenWeatherMap_API)
                     })
                     .pipe(
                            timeout(5000),
                            catchError(this.handleError),
                            tap(() => this.isLoading.next(false))
                     )
       }

       saveDeleteCityData (city: string) {
              let cityName = city.split(', ')[0]
              const savedCities = localStorage.getItem('saved-cities')
              let citiesArray: CityData[] = !!savedCities ? JSON.parse(savedCities) : []
              const cityAlreadySaved: boolean = !!citiesArray.find(el => el.city === cityName)

              if (cityAlreadySaved) {
                     citiesArray = citiesArray.filter(el => el.city !== cityName)
              } else {
                     citiesArray.push({
                            city: cityName,
                            location: this.location.value!
                     })
              }
              localStorage.setItem('saved-cities', JSON.stringify(citiesArray, null, 0))
              this.savedCities.next(citiesArray)
       }

       private getLocation (city: string): Observable<CityLocation> {
              if (this.location.value) return of(this.location.value)
              return this.http
                     .get<CityLocation[]>(this.geoUrl, {
                            params: new HttpParams()
                                   .set('q', city)
                                   .set('appid', OpenWeatherMap_API)
                     })
                     .pipe(
                            timeout(5000),
                            catchError(this.handleError),
                            map(res => {
                                   if (!res.length) throw new Error("City not found")
                                   let location: CityLocation = {
                                          lat: res[0].lat,
                                          lon: res[0].lon,
                                          country: res[0].country
                                   }
                                   this.location.next(location)
                                   return location
                            })
                     )
       }

       private handleError = (error: { name: string, status: number }) => {
              if (error.name === 'TimeoutError') {
                     this.error.next("Connection error!")
              } else if (error.status > 499 && error.status < 600) {
                     this.error.next('Weather service is unavailable')
              } else if (error.status > 399 && error.status < 500) {
                     this.error.next('Weather service error')
              } else {
                     this.error.next("City not found")
              }
              this.isLoading.next(false)
              return throwError(() => error)
       }

}
