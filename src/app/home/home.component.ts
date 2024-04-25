import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToProdHome() {
    this.router.navigate(['product-home'])
  }
  redirectToLogin() {
    this.router.navigate(['login']);
  }
  redirectToRegister() {
    this.router.navigate(['sign-up']);
  }
}
