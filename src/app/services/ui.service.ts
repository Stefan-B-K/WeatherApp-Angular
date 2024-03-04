import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({
       providedIn: 'root'
})
export class UiService {

       private screenWidth = new BehaviorSubject<number>(0)
       screenWidth$: Observable<number> = this.screenWidth.asObservable();

       constructor () { }

       screenWidthResizedTo (newWidth: number) {
              this.screenWidth.next(newWidth)
       }
}
