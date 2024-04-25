import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../shared/api.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { Validation } from '../validation';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  submitted = false;
  signUpForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    confirmPass: new FormControl('')
  });
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private api: ApiService, private router: Router, private toast: NgToastService) { }
  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
        ],
        firstName: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
        lastName: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
        password: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]],
        confirmPass: ['', [Validators.required, Validators.pattern(".*\\S.*[a-zA-z0-9 ]")]]
      },
      {
        validators: [Validation.match('password', 'confirmPass')]
      }
    );
  }
  get f(): { [key: string]: AbstractControl } {
    return this.signUpForm.controls;
  }
  user = new User();
  registerNow() {
    this.submitted = true;
    if (this.signUpForm.invalid) {
      return;
    }

    this.api.addUserToDatabase(this.user)
      .subscribe({
        next: res => {
          this.signUpForm.reset();
          this.toast.success({ detail: "Successfull!", summary: 'Registration Successfull.', duration: 3000 });
          this.redirectToLoginPage();
        },
        error: err => {
          console.log(err)
          if (!this.isServerDown(err)) {
            this.toast.info({ detail: "Duplicate Values!", summary: 'Please Try Again Enter with new Values.', duration: 3000 });
          } else {
            this.toast.warning({ detail: "Server Down!", summary: 'Please Check Your Connection.', duration: 3000 });
          }

        }
      }
      )
  }

  redirectToLoginPage() {
    this.router.navigate(['login']);
  }
  isServerDown(error: HttpErrorResponse): boolean {
    if (error.status !== 0)
      return false;
    return true;
  }
}

