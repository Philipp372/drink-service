import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, OnInit } from '@angular/core';
import { DrinkBooking } from 'shared/DrinkBooking';
import { DrinksData } from 'shared/DrinksData';
import { User } from 'shared/Users';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalService implements OnInit {

  firebaseUserData: any; // Save logged in user data
  firebaseUserIdToken: string = ''

  private _loggedInUser?: any = JSON.parse(localStorage.getItem('user')!);
  get loggedInUser() {
    return this._loggedInUser
  }
  set loggedInUser(data) {
    this._loggedInUser = data
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    console.warn('isLoggedIn user=',JSON.stringify(user))
    return user !== null && user.emailVerified !== false ? true : false;
  }

  private _loggedIn: boolean = this.isLoggedIn
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

  private _allDataLoaded: boolean = false
  get allDataLoaded() {
    return this._allDataLoaded
  }
  set allDataLoaded(data) {
    this._allDataLoaded = data
  }

  ngOnInit(): void {
  }

  constructor(
    private httpClient: HttpClient, 
    private responsive: BreakpointObserver,
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
    ) {
      console.warn("GlobalService constructor")

      const user = JSON.parse(localStorage.getItem('user')!);
      if (user) {
        this._loggedIn = true
        this.firebaseUserIdToken = user.stsTokenManager.accessToken
      }
      console.warn('GlobalService constructor user=',JSON.stringify(user))

      /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      console.warn("GlobalService AuthState subscribe() user=",JSON.stringify(user))
      if (user) {
        this.firebaseUserData = user;
        localStorage.setItem('user', JSON.stringify(this.firebaseUserData));
        JSON.parse(localStorage.getItem('user')!);

        let callback = () => {
          console.warn('callback router navigate dashboard 1')
          this.router.navigate(['/dashboard']);
        }
        this.loadAllData(callback)
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.warn('SignIn success result=',JSON.stringify(result))
/*{
    "kind": "identitytoolkit#VerifyPasswordResponse",
    "localId": "Oiofp0qfXePGUVirau8f5R8oJOh2",
    "email": "philipp.r@icloud.com",
    "displayName": "",
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2ZGE4NmU4MWJkNTllMGE4Y2YzNTgwNTJiYjUzYjUzYjE4MzA3NzMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHJpbmtzZXJ2aWNlLTExZmRlIiwiYXVkIjoiZHJpbmtzZXJ2aWNlLTExZmRlIiwiYXV0aF90aW1lIjoxNjgyMjYyMzM2LCJ1c2VyX2lkIjoiT2lvZnAwcWZYZVBHVVZpcmF1OGY1UjhvSk9oMiIsInN1YiI6Ik9pb2ZwMHFmWGVQR1VWaXJhdThmNVI4b0pPaDIiLCJpYXQiOjE2ODIyNjIzMzYsImV4cCI6MTY4MjI2NTkzNiwiZW1haWwiOiJwaGlsaXBwLnJAaWNsb3VkLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJwaGlsaXBwLnJAaWNsb3VkLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.TM5naAFz7SSZ43LA4B0p-iiWrFPZtiRezFC-y03bc8YY-sv6460bNhQu--xwiSbo1A3vgDaoksF5-UkliFX3U-y7l5-J8ae3dBkrC2NLB3K22zcpp6dTZhkGjvWK4Iehjo30OntFseX7R_UbX2cISRI6lWW6v9K1Q5WcZJUp3k2HIA8opPE98QVU1uSLGiSQJRiSSOY3FT8hNljmfCAdai8hdpKD0zEepvlglOvcLcBRzPP5Fm1cJHHnw1GtN0Z1KKLohrdXYrRQPwfP9_Y7CO-U3F6-ttf6gQXb6mD9SCR-wVbqkMtD1B8TeSWfuO5J6qlKssGTWDM7cXgQo8X5-g",
    "registered": true,
    "refreshToken": "APJWN8eXzWuoAZz3W9hqbpUFPea1zt7Ptbi75qVaZRG6PD8_ljw9bUxSRdqgYbWkELutG9JJK3-ZB2TyHECcg8zLmLTIjFqyIXmVDy_g0NwUnZYtIOw4tTS3Kv9bXX0A4n49yBxHwQp-fU8kkLAMDtkowCLtHr-oJEHU7yVhCCJeN8TbssjalEhTIrVDQJbnriWloYmZg1FhJQmoJaBTVpz9B_s7nbt69Q",
    "expiresIn": "3600"
}*/

        this.SetUserData(result.user);

        this.loggedIn = true

        let callback = () => {
          console.warn('callback router navigate dashboard 2')
          this.router.navigate(['/dashboard']);
        }
        this.loadAllData(callback)

        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['/dashboard']);
          }
        });
      })
      .catch((error) => {
        console.warn('SignIn ERROR')
        window.alert(error.message);
      });
  }

  SignOut() {
    return this.afAuth.signOut().then(() => {
      console.warn('SignOut success')
      localStorage.removeItem('user');
      this.loggedIn = false
      this.router.navigate(['auth/login']);
    });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: FirebaseUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  loadAllData(callback: () => void): void {
    console.warn('loadAllData()')    

    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=' + this.firebaseUserIdToken)
    .subscribe({
      next: (response) => {
        console.log('Firebase Users:', response)
        let personArray = Object.values(response)
        console.log('personArray: ',personArray)
        this.userList = personArray
        this.userListBooking = personArray.filter(user => user.bookingAllowed === true)

        this.checkAllDataLoaded(callback)
      },
      error: (e) => {
      console.error(e)
      // Show error
      },
      complete: () => {}
    })

    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/drinks.json?auth=' + this.firebaseUserIdToken).subscribe( response => {
      console.log('drinks response:',response)
      let receivedDrinkData: DrinksData[] = Object.values(response)
      this._drinksData = receivedDrinkData

      this.checkAllDataLoaded(callback)
    })

    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/bookings.json?auth=' + this.firebaseUserIdToken).subscribe({
        next: (response) => {
          console.log('DrinkService HttpClient next() drinkBookings response=',response)
          this.drinkBookings = Object.values(response)

          this.checkAllDataLoaded(callback)
        },
      error: (e) => {
      console.error(e)
      // Show error
    },
    complete: () => {
      console.log('DrinkService drinkBookings complete() drinkBookings=',this.drinkBookings.length)
      // console.log("cardColumns=",this.cardColumns," isSmallScreen=", this.globalService.isSmallScreen)
    }
    })
  }

  checkAllDataLoaded(callback: () => void): void {
    console.warn('checkAllDataLoaded() drinksData.length=',this._drinksData.length, ' // userList.length=',this.userList.length, ' // drinkBookings=',this.drinkBookings.length, ' // callback=',callback)
    if (this._drinksData && this._drinksData.length > 0 && this.drinkBookings && this.drinkBookings.length > 0 &&
      this.userList && this.userList.length > 0 && callback) {
        this._allDataLoaded = true
        callback()
      }
  }
}



