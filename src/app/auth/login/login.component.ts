import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/global.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  constructor(private globalService: GlobalService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  prefillUser: string = ''
  prefillPassword: string = ''

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        console.log(params); // { orderby: "price" }
        this.prefillUser = params['user'];
        this.prefillPassword = params['password'];
      }
    );
  }

  onLogin(loginForm: NgForm) {
    console.log(loginForm.value);

    this.globalService.SignIn(loginForm.value.username, loginForm.value.password)

    // let userMatch = this.globalService.userList.filter(user => user.userName === loginForm.value.username && user.password === loginForm.value.password)
    // // console.log("userMatch=",JSON.stringify(userMatch))
    // this.globalService.loggedIn = userMatch.length === 1
    // this.globalService.loggedInUser = userMatch.length === 1 ? userMatch[0] : undefined
    // if (this.globalService.loggedIn) {
    //   this.router.navigate(['/dashboard'])
    // } else {
    //   console.error('user match error');
    // }

    // this.httpClient.get('https://drinkservice-11fde-default-rtdb.europe-west1.firebasedatabase.app/users.json').subscribe(response => console.log(response))
  }
}
