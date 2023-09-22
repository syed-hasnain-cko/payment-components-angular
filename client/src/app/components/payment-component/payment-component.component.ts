import { ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import { from } from 'rxjs';



declare var CheckoutWebComponents: any;

@Component({
  selector: 'app-payment-component',
  templateUrl: './payment-component.component.html',
  styleUrls: ['./payment-component.component.scss']
})

export class PaymentComponentComponent implements OnInit {

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit() {
     this.initializePaymentForm();
  }

  async initializePaymentForm() {
    let paymentSession = {};
    let paymentSessionRequestBody = {
      "amount": 1000,
      "currency": "EUR",
      "reference": "ORD-123A",
      "billing": {
        "address": {
          "country": "DE"
        }
      },
      "customer": {
        "name": "John Smith",
        "email": "john.smith@example.com"
      },
      "success_url": "https://example.com/payments/success",
      "failure_url": "https://example.com/payments/failure",
      "processing_channel_id":"pc_oxr4t4p3nseejeqdjqk3pdlpm4"
    }

   const session = await from(this.checkoutService.requestPaymentSession(paymentSessionRequestBody)).toPromise()
   paymentSession = session;

    const checkoutWebComponents = await CheckoutWebComponents({
    
      publicKey: "pk_sbox_7za2ppcb4pw7zzdkfzutahfjl4t",
      environment: "sandbox",
      paymentSession,
      onPaymentCompleted: (paymentResponse: any, paymentMethod: any) => {
        const element = document.getElementById("successful-payment-message");
        if(element)
        element.innerHTML = `
          ${paymentMethod.type} completed <br>
          Your payment id is: <span class="payment-id">${paymentResponse.id}</span>
        `;
      },
      onChange: (paymentMethod: any) => {
        console.log("onValid:", paymentMethod.isValid(), " for ", paymentMethod.type);
      },
      onError: (error: any, paymentMethod: any) => {
        const element = document.getElementById("error-message");
        if(element)
        element.innerHTML = `
          ${paymentMethod.name} error <br>
          Error occurred: <pre class="error-object">${error}</pre>
        `;
      },
    });

    const payments = checkoutWebComponents.create("payments");

    const form = document.getElementById("payment-form");

    if(form)

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      payments.submit();
    });

    payments.mount(document.getElementById("payments"));
  }
}








