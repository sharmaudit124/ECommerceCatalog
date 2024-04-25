import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../shared/api.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  pinCodeData: any
  constructor(private activeRouter: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder) { }
  pinForm: FormGroup = new FormGroup({
    pinCode: new FormControl('')
  });
  singleProductData!: any;
  found!: boolean;
  notFound!: boolean;
  submitted = false;
  productPrice:any;
  ngOnInit(): void {
    this.api.getProductById(this.activeRouter.snapshot.params['productCode'],sessionStorage.getItem('token'))
      .subscribe({
        next: res => {
          this.singleProductData = res;
          //console.log(this.singleProductData);
    
          //console.log(res)
        },
        error: err => {//Nothing to do
          alert('serverdown')
        }
      })
      this.api.getProductPrice(this.activeRouter.snapshot.params['productCode'],sessionStorage.getItem('token'))
      .subscribe({
        next: res=> {
          this.productPrice=res;
        }
      })

    this.found = false;
    this.notFound = false;

    this.pinForm = this.formBuilder.group(
      {
        pinCode: ['', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(7),
          Validators.pattern(/^\d+$/)
        ]
        ]
      });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.pinForm.controls;
  }
  pinCodeMessage !: any;
  getPinCodeDetails() {
    this.submitted = true;
    if (this.pinForm.invalid) {
      return;
    }
    this.found = false;
    this.notFound = false;
    this.api.getDaysByPinCode(this.pinForm.value.pinCode,sessionStorage.getItem('token'))
      .subscribe({
        next: res => {
          this.pinCodeData = res;
          if (this.pinCodeData == null) {
            this.notFound = true;
            this.pinCodeMessage = "Service is not availabe at given pin-code"
          } else {
            this.found = true;
            this.pinCodeMessage = "Your Order will be delivered to you within " + this.pinCodeData.noOfDays + " Days";
            console.log(this.pinCodeData)
          }
          this.submitted=false;
        },
        error: err => {//Nothing to do Server down

        }
      })
  }

  clearValues(){
    this.pinForm.reset();
    this.submitted=false;
    this.found=false;
    this.notFound=false;
  }
}
