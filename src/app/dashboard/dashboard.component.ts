import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DrinkBooking } from 'shared/DrinkBooking';
import { DrinkStatisticData } from 'shared/DrinkStatisticData';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // myBreakpoint: number = 0
  // cardColumns: number = this.globalService.isSmallScreen ? 1 : 3
  drinkBookings: DrinkBooking[] = []

  overallDrinkCount: number = 0
  overallBookingsCount: number = 0
  overallCost: number = 0
  drinkConsumationData: DrinkStatisticData[] = []

  ngOnInit() {
  //   this.myBreakpoint = (window.innerWidth <= 400) ? 1 : 6;
  }
  // handleSize(event: UIEvent) {
  //   console.log('handleSize() event=', event)
  //   this.myBreakpoint = (event.target && event.target?.innerWidth <= 400) ? 1 : 6;
  // }

  constructor(private globalService: GlobalService) {
    this.prepareDashboardData()
  }
  
  prepareDashboardData() {
    if (this.globalService.drinkBookings) {
      console.log('Dashboard constructor drinkBookings=', this.drinkBookings.length, " // drinksData=",this.globalService.drinksData.length)
      this.drinkBookings = this.globalService.drinkBookings
      this.overallBookingsCount = this.drinkBookings.length
      
      this.overallDrinkCount = 0

      this.globalService.drinksData.forEach(drink => {
        let allBookingsForSingleDrink = this.drinkBookings.filter(booking => booking.drinkId === drink.drinkId)
        
        // let drinkConsumationCount : DrinkBooking = allBookingsForSingleDrink.reduce(book => book.count)
        let drinkConsumationCount = 0
        
        allBookingsForSingleDrink.forEach(item => {
          drinkConsumationCount += item.count
          this.overallCost += item.count*drink.price
        })
        this.overallDrinkCount += drinkConsumationCount
        

        let statData = new DrinkStatisticData(
          drink.drinkId, 
          drink.name, 
          drinkConsumationCount,
          allBookingsForSingleDrink.length,
          drink.imageUrl,
          drink.imageSize)
          this.drinkConsumationData.push(statData)

          console.log('allBookingsForSingleDrink drinkId=',drink.drinkId, ' // drinkConsumationCount=',drinkConsumationCount, ' // bookingCount=',allBookingsForSingleDrink.length,' // this.overallDrinkCount=',this.overallDrinkCount)
      })
    }
  }

  calculateWidth(imageSize: number){
    return 60*imageSize
  }
}
