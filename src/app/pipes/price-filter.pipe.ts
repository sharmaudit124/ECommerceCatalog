import { Pipe, PipeTransform } from '@angular/core';
import { HelpService } from '../shared/help.service';

@Pipe({
  name: 'priceFilter'
})
export class PriceFilterPipe implements PipeTransform {
  constructor(private help: HelpService){}
  transform(value: any, minPrice: any, maxPrice:any ): any {
    if(value.length === 0){    
      return value
    }
    if (minPrice) {
      value = value.filter(function(item :any) {
        return item.price >= +minPrice;
      });
    } 
    if (maxPrice) {
      value = value.filter(function(item :any) {
        return item.price <= +maxPrice;
      });
    }
    this.help.setPresentProductList(value);
    // console.log(value,'priceFilterList'); 
    // console.log(typeof value);
     
    return  value;
  }

}
