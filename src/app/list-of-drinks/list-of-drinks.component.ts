import { Component, Inject } from '@angular/core';
import { DrinksData } from 'shared/DrinksData';
import { DrinksService } from './drinks.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

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
  drinkCountFormControl = new FormControl('')
  personFormControl = new FormControl('');
  drinkCountList: number[] = [1, 2, 3, 4, 5, 6, 7, 8]
  personList: string[] = ['Gerhard', 'Richard', 'Herbert', 'Philipp', 'Craig', 'Stefan', 'Peter'];

  constructor(public dialogRef: MatDialogRef<BookDrinkDialog>, @Inject(MAT_DIALOG_DATA) public data: DrinksData) {}
}
