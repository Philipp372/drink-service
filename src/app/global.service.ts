import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, OnInit } from '@angular/core';
import { DrinkBooking } from 'shared/DrinkBooking';
import { DrinksData } from 'shared/DrinksData';
import { User } from 'shared/Users';

@Injectable({
  providedIn: 'root'
})
export class GlobalService implements OnInit {

  private _loggedInUser?: User | undefined
  get loggedInUser() {
    return this._loggedInUser
  }
  set loggedInUser(data) {
    this._loggedInUser = data
  }

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

  private _userListBooking: User[] = []
  get userListBooking() {
    return this._userListBooking
  }
  set userListBooking(data) {
    this._userListBooking = data
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
  }

  constructor(
    private httpClient: HttpClient, 
    private responsive: BreakpointObserver,
    // public afs: AngularFirestore, // Inject Firestore service
    // public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone // NgZone service to remove outside scope warning
    ) {
      console.warn("GlobalService constructor")

      /* Saving user data in localstorage when 
      logged in and setting up null when logged out */
      // this.afAuth.authState.subscribe((user) => {
      //   if (user) {
      //     this.userData = user;
      //     localStorage.setItem('user', JSON.stringify(this.userData));
      //     JSON.parse(localStorage.getItem('user')!);
      //   } else {
      //     localStorage.setItem('user', 'null');
      //     JSON.parse(localStorage.getItem('user')!);
      //   }
      // });
      
      this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/users.json')
      .subscribe({
        next: (response) => {
          console.log('Firebase Users:', response)
          let personArray = Object.values(response)
          console.log('personArray: ',personArray)
          this.userList = personArray
          this.userListBooking = personArray.filter(user => user.bookingAllowed === true)
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
