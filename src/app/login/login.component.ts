import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { User } from '../user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  invalidLogin = false;
  @Input() error: string | null | undefined;
  constructor(private auth: AuthService, private formBuilder: FormBuilder, private api: ApiService, private router: Router, private toast: NgToastService) { }
  user: User = new User();
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
        ],
        password: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]]
      });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
  loginNow() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    console.log(this.user.username, this.user.password)
    this.auth.authenticateUser(this.user.username, this.user.password).subscribe({
      next: data => {
        this.router.navigate(['product-home'])
        //.then(() => this.ngOnInit());
        console.log("Login-successfull");
        this.toast.success({ detail: "LoggedIn", summary: 'You are logged in.', duration: 3000 });
        this.invalidLogin = false
      },
      error: err => {
        this.invalidLogin = true
        //this.error = err.message;

        if (!this.isServerDown(err)) {
          this.toast.error({ detail: "NOT FOUND", summary: 'Invalid Credentials.', duration: 3000 });
        } else {
          this.toast.warning({ detail: "Server Down!", summary: 'Please Check Your Connection.', duration: 3000 });
        }
      }
    }
    )
  }
  redirectToproductHomePage() {
    this.router.navigate(['product-home']);
  }
  isServerDown(error: HttpErrorResponse): boolean {
    if (error.status !== 0)
      return false;
    return true;
  }
}
