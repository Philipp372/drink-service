import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BalanceData } from 'shared/BalanceData';
import { BalanceStatisticData } from 'shared/BalanceStatisticData';
import { GlobalService } from '../global.service';

@Component({
  selector: 'balances',
  templateUrl: './balances.component.html',
  styleUrls: ['./balances.component.css']
})
export class BalancesComponent implements OnInit {
  private globalService: GlobalService
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
          let overallBookingAmountSum = 0
          let balanceItemsForUser = this.balanceData.filter(balanceItem => balanceItem.userName === user.userName)
          balanceItemsForUser.forEach(balanceItem => overallBookingAmountSum += balanceItem.amount )

          // Determine current balance based on consumations and overall booked balance
          let amountConsumed = 0
          let numberOfDrinksConsumed = 0
          this.globalService.drinkBookings.filter(drinkBooking => drinkBooking.consumerUserName === user.userName).
          forEach(data => {
            let drink = this.globalService.drinksData.filter(drinkItem => drinkItem.drinkId)[0]
            amountConsumed += data.count * drink.price
            numberOfDrinksConsumed += data.count
          })
          let currentBalance = overallBookingAmountSum - amountConsumed

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

  constructor(private httpClient: HttpClient, private _globalService: GlobalService) {
    this.globalService = _globalService
  }
}
