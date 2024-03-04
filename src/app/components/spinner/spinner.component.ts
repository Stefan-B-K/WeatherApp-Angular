import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf } from "@angular/common";
import { Observable } from "rxjs";
import { WeatherService } from "../../services/weather.service";


@Component({
       selector: 'app-spinner',
       standalone: true,
       imports: [AsyncPipe, NgIf],
       templateUrl: './spinner.component.html',
       styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

       @Input({ required: false })
       color: string | null = null;

       isLoading$ = new Observable<boolean>;

       constructor (private weather: WeatherService) {
              this.isLoading$ = weather.isLoading$
       }
}
