import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

  onLogin(loginForm: NgForm) {
    console.log(loginForm.value);

    this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/users.json').subscribe(response => console.log(response))
  }
}
