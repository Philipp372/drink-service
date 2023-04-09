import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ListOfDrinksComponent } from './list-of-drinks/list-of-drinks.component';
import { RouterModule, Routes } from '@angular/router';
import { BookDrinkDialog } from './list-of-drinks/list-of-drinks.component'
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { BalancesComponent } from './balances/balances.component'
import { GlobalService } from './global.service';
import { LoginComponent } from './auth/login/login.component';
import { MatInputModule } from '@angular/material/input';
import { OnlyNumberDirective } from './only-number.directive'
import { MatSnackBar } from '@angular/material/snack-bar';


const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, },
  { path: 'list-of-drinks', component: ListOfDrinksComponent },
  { path: 'balances', component: BalancesComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  // { path: '', redirectTo: '/auth/login', pathMatch: 'full' },  
  { path: '**', component: LoginComponent },  // Wildcard route for a 404 page
]


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DashboardComponent,
    ListOfDrinksComponent,
    BookDrinkDialog,
    BalancesComponent,
    OnlyNumberDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    BrowserModule,
    MatCardModule,
    MatGridListModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    GlobalService,
    MatSnackBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
