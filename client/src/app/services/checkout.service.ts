import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from 'src/environments/environment.sandbox';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
 
  constructor(private http:HttpClient) { 

   }
  
  requestPaymentSession(body:any):Observable<any>{

    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': environment.checkoutSecretKey})
    };
    return this.http.post<any>(`${environment.baseUrl}/payment-sessions`, body , httpOptions);
  }
}
