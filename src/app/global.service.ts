import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { DrinkBooking } from 'shared/DrinkBooking';
import { DrinksData } from 'shared/DrinksData';
import { User } from 'shared/Users';

@Injectable({
  providedIn: 'root'
})
export class GlobalService implements OnInit {

  // breakpoints: string[] = [Breakpoints.WebLandscape]
  // isSmallScreen: boolean = false

  private _loggedIn: boolean = false
  get loggedIn() {
    return this._loggedIn
  }
  set loggedIn(flag) {
    this._loggedIn = flag
  }

  private _userList: User[] = []
  get userList() {
    return this._userList
  }
  set userList(data) {
    this._userList = data
  }

  private _drinkBookings: DrinkBooking[] = []
  get drinkBookings() {
    return this._drinkBookings
  }
  set drinkBookings(data) {
    this._drinkBookings = data
  }

  private _drinksData: DrinksData[] = []
  get drinksData() {
    return this._drinksData
  }
  set drinksData(data) {
    this._drinksData = data
  }

  ngOnInit(): void {
    // this.responsive.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.HandsetPortrait])
    //   .subscribe(result => {
    //     console.log("responsive observe result:", result);

    //     if (result.matches) {
    //       this.breakpoints = Object.values(result)
    //       this.isSmallScreen = true
    //       console.log("screens matches isSmallScreen=", this.isSmallScreen);
    //     } else {
    //       this.isSmallScreen = false
    //     }
  // });
}

  constructor(private httpClient: HttpClient, private responsive: BreakpointObserver) {
    console.warn("GlobalService constructor")
    
    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/users.json')
    .subscribe({
      next: (response) => {
        console.log('Firebase Users:', response)
        let personArray = Object.values(response)
        console.log('personArray: ',personArray)
        this.userList = personArray
      },
      error: (e) => {
      console.error(e)
      // Show error
      },
      complete: () => {}
    })

    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/drinks.json').subscribe( response => {
      console.log('drinks response:',response)
      let receivedDrinkData: DrinksData[] = Object.values(response)
      this._drinksData = receivedDrinkData
    })

    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/bookings.json').subscribe(
      {
        next: (response) => {
          console.log('DrinkService HttpClient next() drinkBookings response=',response)
          this.drinkBookings = Object.values(response)
        },
      error: (e) => {
      console.error(e)
      // Show error
    },
      complete: () => {
        console.log('DrinkService drinkBookings complete()')
        // console.log("cardColumns=",this.cardColumns," isSmallScreen=", this.globalService.isSmallScreen)

      }
  })
}
}
