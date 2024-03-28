
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment.sandbox';
import { COUNTRIES, CURRENCIES } from 'src/app/data-store';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare var CheckoutWebComponents: any;

@Component({
  selector: 'app-payment-component',
  templateUrl: './payment-component.component.html',
  styleUrls: ['./payment-component.component.scss']
})
export class PaymentComponentComponent implements OnInit {
  Currencies = CURRENCIES.map(currency => currency.iso4217);
  Countries = COUNTRIES;
  PaymentMethods = ['card','googlepay','applepay','sofort','eps','giropay','multibanco','ideal','knet','p24']
  baseUrl = window.location.origin;

  paymentSession: any; 
  storedPayments: any;

  constructor(private checkoutService: CheckoutService, private cd: ChangeDetectorRef) {}

  detailsForm = new FormGroup({
    name: new FormControl('Syed Hasnain', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
    email: new FormControl('smhasnain1996@gmail.com', [Validators.required, Validators.minLength(6), Validators.email]),
    amount: new FormControl('10', [Validators.required, Validators.max(50000)]),
    currency: new FormControl('EUR', [Validators.required]),
    country: new FormControl('DE', [Validators.required]),
    threeDS: new FormControl(true),
    capture: new FormControl(true),
    disabledPaymentMethods: new FormControl([])
  });

  ngOnInit() {
    // Initialize the payment form on component initialization
    this.initializePaymentForm();
    const form = document.getElementById("payment-form");
    const instance = this;
    if(form)
     form.addEventListener("submit", function (event) {
       event.preventDefault();
       instance.storedPayments.submit();
     });
  }

  async initializePaymentForm() {

    console.log(this.detailsForm.controls.disabledPaymentMethods.value)
    // Build the payment session request based on form values
    const paymentSessionRequestBodyRegular = {
      amount: 10,
      currency: this.detailsForm.controls.currency.value,
      reference: 'Order_' + Math.floor(Math.random() * 1000) + 1,
      '3ds': {
        enabled: this.detailsForm.controls.threeDS.value
      },
      capture: this.detailsForm.controls.capture.value,
      billing: {
        address: {
          country: this.detailsForm.controls.country.value
        }
      },
      payment_type:'Regular',
      payment_method_configuration: {
        card: {
           store_payment_details: "enabled"
        }
     },
      customer: {
        name: this.detailsForm.controls.name.value,
        email: this.detailsForm.controls.email.value
      },
      success_url: `${this.baseUrl}/success`,
      failure_url: `${this.baseUrl}/failure`,
      processing_channel_id: environment.processingChannelId,
      disabled_payment_methods:this.detailsForm.controls.disabledPaymentMethods.value
      
    };

    const paymentSessionRequestBodyRecurring = {
      amount: 10,
      currency: this.detailsForm.controls.currency.value,
      reference: 'Order_' + Math.floor(Math.random() * 1000) + 1,
      '3ds': {
        enabled: this.detailsForm.controls.threeDS.value
      },
      capture: this.detailsForm.controls.capture.value,
      billing: {
        address: {
          country: this.detailsForm.controls.country.value
        }
      },
      payment_type:'Recurring',
      payment_method_configuration: {
        card: {
           store_payment_details: "enabled"
        }
     },
      customer: {
        name: this.detailsForm.controls.name.value,
        email: this.detailsForm.controls.email.value
      },
      success_url: `${this.baseUrl}/success`,
      failure_url: `${this.baseUrl}/failure`,
      processing_channel_id: environment.mikiAccountPC,
      disabled_payment_methods:this.detailsForm.controls.disabledPaymentMethods.value
      
    };

    const paymentSessionRequestBodyUnscheduled = {
      amount: 10,
      currency: this.detailsForm.controls.currency.value,
      reference: 'Order_' + Math.floor(Math.random() * 1000) + 1,
      '3ds': {
        enabled: this.detailsForm.controls.threeDS.value
      },
      capture: this.detailsForm.controls.capture.value,
      billing: {
        address: {
          country: this.detailsForm.controls.country.value
        }
      },
      payment_type:'Unscheduled',
      payment_method_configuration: {
        card: {
           store_payment_details: "enabled"
        }
     },
      customer: {
        name: this.detailsForm.controls.name.value,
        email: this.detailsForm.controls.email.value
      },
      success_url: `${this.baseUrl}/success`,
      failure_url: `${this.baseUrl}/failure`,
      processing_channel_id: environment.mikiAccountPC,
      disabled_payment_methods:this.detailsForm.controls.disabledPaymentMethods.value
      
    };

    // Make the API request and store the payment session
    try {
      const session = await from(this.checkoutService.requestPaymentSession(paymentSessionRequestBodyRegular)).toPromise();
      this.paymentSession = session;

      await this.initializeCheckoutWebComponents();
    } catch (error) {
      console.error('Error fetching payment session:', error);
    }
  }

  async initializeCheckoutWebComponents() {
    const ckoComponent = await CheckoutWebComponents({
      publicKey: environment.checkoutPublicKey,
      environment: environment.environment,
      paymentSession: this.paymentSession,
      onPaymentCompleted: (paymentMethod: any,paymentResponse: any) => {
        const element = document.getElementById('successful-payment-message');
        console.log(paymentResponse)
        if (element) element.innerHTML = `${paymentMethod.type} payment completed <br>Your payment id is: <span class="payment-id">${paymentResponse.id}</span>`;
      },
      onChange: (PaymentComponent: any) => {
        console.log(PaymentComponent?.isValid())
        this.cd.detectChanges();
      },
      onSubmit:(PaymentComponent: any) =>{
        console.log(PaymentComponent)
      },
      onError: (paymentMethod: any,error: any) => {
        const element = document.getElementById('error-message');
        if (element) element.innerHTML = `${paymentMethod.name} error <br>Error occurred: <pre class="error-object">${error}</pre>`;
      }
    });

   
    const payments = ckoComponent.create("payments");
    

    if(this.storedPayments){
      this.storedPayments.unmount();
    }

      this.storedPayments  =  payments.mount(document.getElementById("payments"));
    
     
     
     
  }
}

``


