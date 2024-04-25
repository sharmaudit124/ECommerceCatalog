import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  constructor() { }
  productList !: any ;
  priceList: any = [];

  
  getPresentProductList() {
    console.log('get me hu', this.productList);
    return this.productList;
  }
  setPresentProductList(list: any) {
    this.productList = list;
    console.log('set me hu', this.productList);
  }

  getPresentPriceList() {
    return this.priceList;
  }
  setPresentPriceList(list: any) {
    this.priceList = list;
  }


}

