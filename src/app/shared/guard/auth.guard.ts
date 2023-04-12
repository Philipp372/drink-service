import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GlobalService } from "../../global.service";
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  
  constructor(
    public globalService: GlobalService,
    public router: Router
  ){ }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(this.globalService.loggedIn !== true) {
      this.router.navigate(['auth/login'])
      return false
    }
    return true;
  }
}