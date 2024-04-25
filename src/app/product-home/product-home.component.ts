import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, UrlHandlingStrategy } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { HelpService } from '../shared/help.service';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.css']
})
export class ProductHomeComponent implements OnInit {
  priceRangeForm: FormGroup = new FormGroup({
    minVal: new FormControl(''),
    maxVal: new FormControl(''),
  });
  submitted = false;
  minVal: any;
  maxVal: any;
  minRange: any;
  maxRange: any;
  rate: any
  selectedBrand: any;
  selectedPrice: any;
  result: any;
  showMinVal: any;
  showMaxVal: any;
  searchForm: FormGroup = new FormGroup({
    searchText: new FormControl('')
  });
  constructor(private auth: AuthService, private api: ApiService, private router: Router, private formBuilder: FormBuilder, private toast: NgToastService, private help: HelpService) {
    this.api.getAllProductPrices(sessionStorage.getItem('token'))
      .subscribe({
        next: res => {
          this.priceList = res;
          this.help.setPresentPriceList(res);
          console.log("product prices", res);

        }
      })
  }
  productList: any = [];
  priceList!: any[];
  brands: any = [];
  container: any = [];


  ngOnInit(): void {
    //  This is the common part .
    this.selectedBrand = ''
    this.searchForm = this.formBuilder.group(
      {
        searchText: ['', [Validators.required, Validators.pattern('^[a-zA-Z1-9].*')]
        ]
      });
    // Common part ends here
    if (localStorage.getItem('searchedItem') != null || localStorage.getItem('brandItem') != null || localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null) {

      //-- Only search Item
      if (localStorage.getItem('searchedItem') != null && localStorage.getItem('brandItem') == null && localStorage.getItem('minPrice') == null && localStorage.getItem('maxPrice') == null) {
        console.log('search part');
        this.searchForm.setValue({
          searchText: localStorage.getItem('searchedItem')
        });
        this.api.getProducts(localStorage.getItem('searchedItem'))
          .subscribe({
            next: res => {
              this.productList = res;
              this.help.setPresentProductList(res);
              for (let item of this.help.getPresentProductList()) {
                let val = this.getPrice(item.productCode);
                item.price = val;
              }
            },
            error: err => {
            },
            complete: () => {
              console.log('3');
              this.productList = this.help.getPresentProductList();
              this.brands = [];
              for (var brandList of this.productList) {
                this.brands.push(brandList.brand);
              }
              this.brands = Array.from(new Set(this.brands));
              this.submitted = false;
            }
          })
      }
      // Only Brand
      if (localStorage.getItem('searchedItem') == null && localStorage.getItem('brandItem') != null && localStorage.getItem('minPrice') == null && localStorage.getItem('maxPrice') == null) {
        this.getAllProductsList();
        this.selectedBrand = localStorage.getItem('brandItem');
      }
      // Only Price
      if (localStorage.getItem('searchedItem') == null && localStorage.getItem('brandItem') == null && localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null) {
        if (localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null) {
          this.getAllProductsList();
          this.minRange = localStorage.getItem('minPrice');
          this.maxRange = localStorage.getItem('maxPrice');
          this.showMinVal = this.minRange;
          //console.log(this.minRange, "minRange");
          this.showMaxVal = this.maxRange;
          //console.log(this.maxRange, "maxRange");
        }
      }
      //Only Search + Brand
      if (localStorage.getItem('searchedItem') != null && localStorage.getItem('brandItem') != null && localStorage.getItem('minPrice') == null && localStorage.getItem('maxPrice') == null) {
        this.searchForm.setValue({
          searchText: localStorage.getItem('searchedItem')
        });
        this.api.getProducts(localStorage.getItem('searchedItem'))
          .subscribe({
            next: res => {
              this.productList = res;
              this.help.setPresentProductList(res);
              for (let item of this.help.getPresentProductList()) {
                let val = this.getPrice(item.productCode);
                item.price = val;
              }
            },
            error: err => {
            },
            complete: () => {
              console.log('3');
              this.productList = this.help.getPresentProductList();
              this.brands = [];
              for (var brandList of this.productList) {
                this.brands.push(brandList.brand);
              }
              this.brands = Array.from(new Set(this.brands));
              this.submitted = false;
            }
          })
        this.selectedBrand = localStorage.getItem('brandItem')
      }

      // Only search + Price
      if (localStorage.getItem('searchedItem') != null && localStorage.getItem('brandItem') == null && (localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null)) {

        this.searchForm.setValue({
          searchText: localStorage.getItem('searchedItem')
        });
        this.api.getProducts(localStorage.getItem('searchedItem'))
          .subscribe({
            next: res => {
              this.productList = res;
              this.help.setPresentProductList(res);
              for (let item of this.help.getPresentProductList()) {
                let val = this.getPrice(item.productCode);
                item.price = val;
              }
            },
            error: err => {
            },
            complete: () => {
              console.log('3');
              this.productList = this.help.getPresentProductList();
              this.brands = [];
              for (var brandList of this.productList) {
                this.brands.push(brandList.brand);
              }
              this.brands = Array.from(new Set(this.brands));
              this.submitted = false;
            }
          })
        if (localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null) {
          this.minRange = localStorage.getItem('minPrice');
          this.maxRange = localStorage.getItem('maxPrice');
          this.showMinVal = this.minRange;
          this.showMaxVal = this.maxRange;
        }
      }

      // Only brand + price
      if (localStorage.getItem('searchedItem') == null && localStorage.getItem('brandItem') != null && (localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null)) {
        this.getAllProductsList();
        this.selectedBrand = localStorage.getItem('brandItem');
        if (localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null) {
          this.minRange = localStorage.getItem('minPrice');
          this.maxRange = localStorage.getItem('maxPrice');
          this.showMinVal = this.minRange;
          this.showMaxVal = this.maxRange;
        }
      }

      // search + brand + price
      if (localStorage.getItem('searchedItem') != null && localStorage.getItem('brandItem') != null && (localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null)) {
        this.searchForm.setValue({
          searchText: localStorage.getItem('searchedItem')
        });
        this.api.getProducts(localStorage.getItem('searchedItem'))
          .subscribe({
            next: res => {
              this.productList = res;
              this.help.setPresentProductList(res);
              for (let item of this.help.getPresentProductList()) {
                let val = this.getPrice(item.productCode);
                item.price = val;
              }
            },
            error: err => {
            },
            complete: () => {
              console.log('3');
              this.productList = this.help.getPresentProductList();
              this.brands = [];
              for (var brandList of this.productList) {
                this.brands.push(brandList.brand);
              }
              this.brands = Array.from(new Set(this.brands));
              this.submitted = false;
            }
          })
        this.selectedBrand = localStorage.getItem('brandItem')
        if (localStorage.getItem('minPrice') != null || localStorage.getItem('maxPrice') != null) {
          this.minRange = localStorage.getItem('minPrice');
          this.maxRange = localStorage.getItem('maxPrice');
          this.showMinVal = this.minRange;
          this.showMaxVal = this.maxRange;
        }
      }
    }
    else {
      console.log('all part');

      this.api.getPseudoProducts()
        .subscribe({
          next: res => {
            console.log('1');
            this.productList = res;
            this.help.setPresentProductList(res);
            for (let item of this.help.getPresentProductList()) {
              let val = this.getPrice(item.productCode)
            //--------
              // if(val== undefined && this.checkUserLoggedIn()){
              //   location.reload();
              //   console.log('reloading....');
              // }
              console.log(item.productCode, val);
              item.price = val;
            }
          },
          error: err => {//Nothing to do
          },
          complete: () => {
            console.log('3');
            this.brands = [];
            for (var brandList of this.productList) {
              this.brands.push(brandList.brand);
            }
            this.brands = Array.from(new Set(this.brands));
          }
        })

    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }
  getSearchedProducts() {
    this.selectedBrand = ''
    localStorage.removeItem('brandItem');
    localStorage.removeItem('minPrice');
    localStorage.removeItem('maxPrice');
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    localStorage.setItem('searchedItem', this.searchForm.value.searchText);
    this.api.getProducts(this.searchForm.value.searchText)
      .subscribe({
        next: res => {
          this.productList = res;
          this.help.setPresentProductList(res);
          for (let item of this.help.getPresentProductList()) {
            let val = this.getPrice(item.productCode);
            item.price = val;
          }
        },
        error: err => {
        },
        complete: () => {
          console.log('3');
          this.productList = this.help.getPresentProductList();
          this.brands = [];
          for (var brandList of this.productList) {
            this.brands.push(brandList.brand);
          }
          this.brands = Array.from(new Set(this.brands));
          this.submitted = false;
        }
      })
  }
  searchByBrand() {
    //console.log(this.help.getPresentProductList(), 'brand filter');
    console.log(this.selectedBrand);
    localStorage.setItem('brandItem', this.selectedBrand)
  }
  clearAll() {
    localStorage.clear();
    this.submitted = false;
    location.reload();
  }

  getPriceValues() {
    if (localStorage.getItem('minPrice') != null && this.priceRangeForm.value.minVal == null) {
      console.log(this.priceRangeForm.value.minVal);
      this.minRange = localStorage.getItem('minPrice');
    }
    else {
      this.minRange = this.priceRangeForm.value.minVal;
    }
    this.showMinVal = this.minRange;
    localStorage.setItem('minPrice', this.minRange);
    if (localStorage.getItem('maxPrice') != null && this.priceRangeForm.value.maxVal == null) {
      this.maxRange = localStorage.getItem('maxPrice')
    }
    else {
      this.maxRange = this.priceRangeForm.value.maxVal;
    }
    this.showMaxVal = this.maxRange;
    localStorage.setItem('maxPrice', this.maxRange);
    if (this.maxRange == undefined) {
      localStorage.removeItem('maxPrice');
    }
    if (this.minRange == undefined) {
      localStorage.removeItem('minPrice');
    }
  }
  Check() {
    if (this.checkUserLoggedIn()) {
    }

  }
  findBySpecField(data: any, reqField: any, value: any, resField: any) {
    this.container = data;
    for (var i = 0; i < this.container?.length; i++) {
      if (this.container[i][reqField] == value) {
        return (this.container[i][resField]);
      }
    }

  }

  getPrice(val: any) {
    const ans = this.findBySpecField(this.help.getPresentPriceList(), 'productCode', val, 'price');
    return ans;
  }

  checkUserLoggedIn() {
    return this.auth.isUserLoggedIn();
  }


  getAllProductsList() {
    this.api.getPseudoProducts()
      .subscribe({
        next: res => {
          console.log('1');
          this.productList = res;
          this.help.setPresentProductList(res);
          for (let item of this.help.getPresentProductList()) {
            let val = this.getPrice(item.productCode);
//-------
            // if(val== undefined && this.checkUserLoggedIn()){
              
            //     location.reload();
            //     console.log('reloading....');
            //   }
            console.log(item.productCode, val);
            item.price = val;
          }
        },
        error: err => {//Nothing to do
        },
        complete: () => {
          console.log('3');
          this.brands = [];
          for (var brandList of this.productList) {
            this.brands.push(brandList.brand);
          }
          this.brands = Array.from(new Set(this.brands));
        }
      })
  }

  isMinValPresent() {
    if (localStorage.getItem('minPrice') != null)
      return true;

    return false;
  }
  isMaxValPresent() {
    if (localStorage.getItem('maxPrice') != null)
      return true;

    return false;
  }

  // showBrandFilter(){
  //   if(localStorage.getItem('searchedItem')!=null)
  //     return true;
  //   return false;
  // }
  clearPriceFilter() {
    localStorage.removeItem('minPrice');
    localStorage.removeItem('maxPrice');
    this.isMinValPresent();
    this.isMaxValPresent();
    this.priceRangeForm.reset();
  }
}




