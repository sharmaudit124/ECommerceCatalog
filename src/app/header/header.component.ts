import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private auth: AuthService, private router:Router) { }

  ngOnInit(): void {
  }
  goToHome(){
    // location.reload();
    localStorage.clear();
    this.router.navigate(['home'])
  }
  logOut(){
    this.auth.logOutNow();
    localStorage.clear();
    location.reload();
    //sessionStorage.removeItem('token');
    this.router.navigate(['product-home'])
    
  }
  logIn(){
    this.router.navigate(['login'])
    //.then(() => this.ngOnInit());
  }
  checkUserLoggedIn(){
    return this.auth.isUserLoggedIn();
  }
}
