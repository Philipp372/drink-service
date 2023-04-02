import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BalanceData } from 'shared/BalanceData';
import { BalanceStatisticData } from 'shared/BalanceStatisticData';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { User } from 'shared/Users';
import { GlobalService } from '../global.service';

@Component({
  selector: 'balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.css']
})
export class BalancesComponent implements OnInit {
  get globalService() { return this._globalService }
  userList: User[] = []
  balanceData: BalanceData[] = []
  balanceDataGrouped: BalanceStatisticData[] = []
  displayedColumns: string[] = ['image', 'userName', 'currentBalanceAmount', 'overallBookingAmount', 'bookingCount', 'numberOfDrinksConsumed'];

  ngOnInit(): void {
    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/balances.json')
    .subscribe({
      next: (response) => {
        console.log('Firebase Balances:', response, ' // user length:',this.globalService.userList.length)
        this.balanceData = Object.values(response)

        let balanceDataGroupedTmp: BalanceStatisticData[] = []

        this.globalService.userList.forEach(user => {
          // Determine overallBookingAmountSum
          let overallBookingAmountSum:number = 0
          let balanceItemsForUser = this.balanceData.filter(balanceItem => balanceItem.userName === user.userName)
          balanceItemsForUser.forEach(balanceItem => overallBookingAmountSum += Number(balanceItem.amount) )

          // Determine current balance based on consumations and overall booked balance
          let amountConsumed:number = 0
          let numberOfDrinksConsumed:number = 0
          // Filter all bookings for user
          this.globalService.drinkBookings.filter(drinkBooking => drinkBooking.consumerUserName === user.userName).
          forEach(data => { // iteralte all bookings of user and sum up
            let drink = this.globalService.drinksData.filter(drinkItem => drinkItem.drinkId)[0]
            amountConsumed += Number(data.count * drink.price)
            numberOfDrinksConsumed += Number(data.count)
          })
          let currentBalance = overallBookingAmountSum - amountConsumed
          console.log('user=',user.userName,' // currentBalance=',currentBalance,' // overallBookingAmountSum=',overallBookingAmountSum, '// amountConsumed=',amountConsumed)

          let stats = new BalanceStatisticData(
            user.userName, 
            balanceItemsForUser.length, 
            currentBalance, 
            overallBookingAmountSum, 
            numberOfDrinksConsumed)
          balanceDataGroupedTmp.push(stats)

          this.balanceDataGrouped = balanceDataGroupedTmp
        })
        console.log('balanceDataGrouped: ',this.balanceDataGrouped)
      },
      error: (e) => {
      console.error(e)
      // Show error
      },
      complete: () => {}
    })
  }

  performBalanceBooking(bookingForm: NgForm) {
    console.log('performBalanceBooking() bookingForm.value=',bookingForm.value)

    let balanceBooking = new BalanceData(
      bookingForm.value.userName,
      'phil',
      bookingForm.value.amount,
      Date.now()
    )

    this.httpClient.post(
      'https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/balances.json'
      , balanceBooking
    )
    .subscribe({
      next: (v) => console.log('HttpClient performBalanceBooking subscribe next:',v),
      error: (e) => {
      console.error(e)
      // Show error
    },
      complete: () => {
        console.log('performBalanceBooking success')
        bookingForm.reset()

        this.openSnackBar()
      }
    })
    // this.httpClient.post('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/bookings.json', bookingForm.value).subscribe(response => console.log(response))
  }

  openSnackBar() {
    this._snackBar.openFromComponent(SnackBarGlobalComponent, {
      duration: 115  * 1000, // 5 seconds
    });
  }

  constructor(
    private httpClient: HttpClient, 
    private _globalService: GlobalService,
    private _snackBar: MatSnackBar) {
    console.log('user count:',_globalService.userList.length)
    this.userList = this._globalService.userList

    this.openSnackBar()
  }
}

@Component({
  selector: 'snack-bar-global',
  templateUrl: '../snack-bar-global.html',
  styles: [
    `
    :host {
      display: flex;
    }
    .snack-bar-global {
      color: white;
      font-weight: bold;
      width: 75%;
    }
    .snack-bar-global-button {
      text-align: right;
      width: 25%
    }
  `,
  ],
})
export class SnackBarGlobalComponent {
  snackBarRef = inject(MatSnackBarRef);
}
