import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  authorization = 'Bearer sk_sbox_dqmcmja373yetcnwkrwi6x6biyv';
  baseURL = 'https://api.sandbox.checkout.com'
 
  constructor(private http:HttpClient) { 
    
  }

  requestPaymentSession(body:any):Observable<any>{

    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.authorization})
    };
    return this.http.post<any>(`${this.baseURL}/payment-sessions`, body , httpOptions);
  }
}
