import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DrinkBooking } from 'shared/DrinkBooking';
import { DrinksService } from '../list-of-drinks/drinks.service';
import { DrinkStatisticData } from 'shared/DrinkStatisticData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  drinkBookings: DrinkBooking[] = []

  overallDrinkCount: number = 0
  overallBookingsCount: number = 0
  drinkConsumationData: DrinkStatisticData[] = []

  constructor(private drinkService: DrinksService, private httpClient: HttpClient) {
    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/bookings.json').subscribe(
      {
        next: (response) => {
          console.log('Dashboard HttpClient next() response=',response)
          this.drinkBookings = Object.values(response)
          this.overallBookingsCount = this.drinkBookings.length
          
          this.overallDrinkCount = 0

          this.drinkService.drinksData.forEach(drink => {
            let allBookingsForSingleDrink = this.drinkBookings.filter(booking => booking.drinkId === drink.drinkId)
            
            // let drinkConsumationCount : DrinkBooking = allBookingsForSingleDrink.reduce(book => book.count)
            let drinkConsumationCount = 0
            
            allBookingsForSingleDrink.forEach(item => drinkConsumationCount += item.count)
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
        },
        error: (e) => {
        console.error(e)
        // Show error
      },
        complete: () => {
          console.log('Dashboard HttpClient complete()')

        }
      }
    )
  }

}
