import { Component, Inject } from '@angular/core';
import { DrinksData } from 'shared/DrinksData';
import { DrinksService } from './drinks.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from 'shared/Users';
import { DrinkBooking } from 'shared/DrinkBooking';

@Component({
  selector: 'app-list-of-drinks',
  templateUrl: './list-of-drinks.component.html',
  styleUrls: ['./list-of-drinks.component.css']
})
export class ListOfDrinksComponent {
  private _drinksData: DrinksData[] = [];
  displayedColumns: string[] = ['imageUrl', 'name', 'price', 'book'];

  get drinksData() {
    return this._drinksData
  }
  set drinksData(data) {
    this._drinksData = data
  }

  constructor(
    private service: DrinksService,
    public dialog: MatDialog
  ) {

  }
  
  ngOnInit(): void {
    this._drinksData = this.service.drinksData;
  }

  calculateWidth(imageSize: number){
    return 50*imageSize
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, drink: DrinksData): void {
    // this.dialog.drinkName = drinkName
    this.dialog.open(BookDrinkDialog, {
      width: '400px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { drink: drink }
    });
  }
}

@Component({
  selector: 'book-drink-dialog',
  templateUrl: 'book-drink-dialog.html',
  styleUrls: ['book-drink-dialog.css']
})
export class BookDrinkDialog {
  public drinkName: string = ""
  // drinkCountFormControl = new FormControl('')
  // personFormControl = new FormControl('');
  drinkCountList: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
  personList: User[] = [];

  constructor(public dialogRef: MatDialogRef<BookDrinkDialog>, @Inject(MAT_DIALOG_DATA) public data: DrinksData, private httpClient: HttpClient) {
    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/users.json').subscribe(response => {
      console.log('Firebase Users:', response)
      let personArray = Object.values(response)
      console.log('personArray: ',personArray)
      this.personList = personArray
      
    })
  }

  performBooking(bookingForm: NgForm) {
    console.log(bookingForm.value)

    let drinkCount: number = bookingForm.value.drinkCount
    let personsToBook: User[] = bookingForm.value.persons
    personsToBook.forEach(person => {
      let bookingObject: DrinkBooking = new DrinkBooking(
        'phil',
        person.userName,
        drinkCount,
        '',
        Date.now()
      )
      this.httpClient.post(
        'https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/bookings.json'
        , bookingObject
      )
      .subscribe({
        next: (v) => console.log('HttpClient DrinkBooking subscribe next:',v),
        error: (e) => {
        console.error(e)
        // Show error
      },
        complete: () => {
          console.log('DrinkBooking success')
          this.dialogRef.close()
        }
      })
      // this.httpClient.post('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/bookings.json', bookingForm.value).subscribe(response => console.log(response))
    })
  }
}
