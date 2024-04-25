import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  
  transform(value: any, searchedVal: any): any {
    if(value.length === 0){
      return value
    }
    return value.filter(function(item: any){
      return item.brand.indexOf(searchedVal) > -1
    });
  }

}
