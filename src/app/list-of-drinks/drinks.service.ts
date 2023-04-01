import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DrinksData } from '../../../shared/DrinksData';

@Injectable({
  providedIn: 'root'
})
export class DrinksService {
  private _drinksData: DrinksData[] = [
    // {
    //   name: 'Bier 0.33l',
    //   price: 2.0,
    //   imageUrl: 'drink-beer.png',
    //   imageSize: 0.7,
    //   book: true
    // },
    // {
    //   name: 'Bier 0.5l',
    //   price: 2.5,
    //   imageUrl: 'drink-beer.png',
    //   imageSize: 1,
    //   book: true
    // },
    // {
    //   name: 'Radler 0.5l',
    //   price: 3,
    //   imageUrl: 'onepix.png',
    //   imageSize: 1,
    //   book: true
    // },{
    //   name: 'Radler 0.33l',
    //   price: 3,
    //   imageUrl: 'onepix.png',
    //   imageSize: 0.7,
    //   book: true
    // },{
    //   name: 'Spritzer',
    //   price: 3,
    //   imageUrl: 'drink-spritzer3.png',
    //   imageSize: 1,
    //   book: true
    // },{
    //   name: 'Prosecco',
    //   price: 3,
    //   imageUrl: 'onepix.png',
    //   imageSize: 1,
    //   book: true
    // },{
    //   name: 'Aperol Spritz',
    //   price: 3,
    //   imageUrl: 'drink-aperol.png',
    //   imageSize: 1,
    //   book: true
    // },{
    //   name: 'Weißwein',
    //   price: 3,
    //   imageUrl: 'drink-white-wine2.png',
    //   imageSize: 1,
    //   book: true
    // },
    // {
    //   name: 'Rotwein',
    //   price: 3,
    //   imageUrl: 'drink-red-wine2.png',
    //   imageSize: 1,
    //   book: true
    // },
    // {
    //   name: 'Mineral',
    //   price: 3,
    //   imageUrl: 'onepix.png',
    //   imageSize: 1,
    //   book: true
    // },
    // {
    //   name: 'Cola',
    //   price: 3,
    //   imageUrl: 'onepix.png',
    //   imageSize: 1,
    //   book: true
    // }
  ];

  get drinksData() {
    return this._drinksData
  }
  set drinksData(data) {
    this._drinksData = data
  }

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/drinks.json').subscribe( response => {
      console.log('drinks response:',response)
      let receivedDrinkData: DrinksData[] = Object.values(response)
      this._drinksData = receivedDrinkData
    })
  }
}
