import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import{HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ProductHomeComponent } from './product-home/product-home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { FilterPipe } from './pipes/filter.pipe';
import { PriceFilterPipe } from './pipes/price-filter.pipe';
import { BasicAuthHttpInterceptorService } from './shared/basic-auth-http-interceptor.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    ProductHomeComponent,
    HeaderComponent,
    FooterComponent,
    ViewProductComponent,
    FilterPipe,
    PriceFilterPipe,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
  ],
  providers: [{provide:HTTP_INTERCEPTORS, useClass:BasicAuthHttpInterceptorService, multi:true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
