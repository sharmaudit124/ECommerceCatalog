import { Injectable } from '@angular/core';
import { User } from '../user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient) { }
  baseUrl="http://localhost:8081/";

  addUserToDatabase(user:User): Observable<any>{
    return this.http.post(this.baseUrl+"register",user);
  }
  getProductPrice(code:any,AuthToken:any):Observable<any>{
    AuthToken=sessionStorage.getItem("token");
    const headers=new HttpHeaders().set("Authorization",AuthToken);
    return this.http.get(this.baseUrl+"productPrice?productCode="+code,{headers})
  }
  getAllProductPrices(AuthToken:any): Observable<any>{
    AuthToken=sessionStorage.getItem("token");
    const headers=new HttpHeaders().set("Authorization",AuthToken);
    return this.http.get(this.baseUrl+"productsPrice",{headers})
  }
  getUser(user: User): Observable<any>{
    return this.http.post(this.baseUrl+"login",user);
  }
  getPseudoProducts():Observable<any>{
    console.log('pseudo-products');
    
    return this.http.get<any>(this.baseUrl+"homeDisplay")
  }
  // getProducts(text:any,AuthToken:any):Observable<any>{
  //   AuthToken=sessionStorage.getItem("token");
  //   const headers=new HttpHeaders().set("Authorization",AuthToken);
  //   return this.http.get(this.baseUrl+"products/search/?text="+text,{headers});
  // }
  getProducts(text:any){
    return this.http.get(this.baseUrl+"products/search/?text="+text);
  }
  getAllProducts(tkn:any):Observable<any>{
    tkn=sessionStorage.getItem("token");
    const headers=new HttpHeaders().set("Authorization",tkn);
    return this.http.get<any>(this.baseUrl+"homeDisplay",{headers})
  }
  getProductById(id:any,tkn:any){
    tkn=sessionStorage.getItem("token");
    const headers=new HttpHeaders().set("Authorization",tkn);
    return this.http.get(this.baseUrl+"product/"+id,{headers});
  }
  getDaysByPinCode(code:any,authToken:any):Observable<any>{
    authToken=sessionStorage.getItem("token");
    const headers=new HttpHeaders().set("Authorization",authToken);
    return this.http.get(this.baseUrl+"pinCode/"+code,{headers});
  }
}
