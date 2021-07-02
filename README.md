# Eway Google Pay Sample App

## [Eway Rapid API Documentation](https://eway.io/api-v3/) 

A sample node.js app which demonstrates completing a Google Pay transaction with Eway.

## Onboarding

1. To enable [Google Pay](https://developers.google.com/pay/api/web/overview) on the account, login to **MyeWAY** http://au.myeway.com.
2. Go to `Google Pay Settings` page in `Settings > Google Pay Settings`.
3. Read and agree to the terms and conditions by checking the `"I agree to the terms and conditions"` box.
4. Enter the Google Pay Merchant ID. This is the ID you were provided once successfully onboarded on Google Pay. 
5. Click the **Activate** Button


## Integration  Guide

### *1. Prerequisites*

The merchant has been onboarded with Google Pay via MyEway, see onboarding guide for the details.

## App Credentials
Setup for Credentials and Endpoint for the app are located in the `payments.js` file. 
You will need to create a `.env` file with the keyValue pair for `APIKEY`, `PASS` and `TESTURL`.

### *2. Integration Steps (Responsive Shared Page)*

Google Pay is integrated into the Eway Responsive Shared Page. Once Google Pay is enabled and onboarded in MyEway, no further steps are required.

### *3. Integration Steps (Transparent Redirect)*

When using Transparent Redirect, the first step of generating an Access Code is the same as [Transparent Redirect](https://eway.io/api-v3/#transparent-redirect). 

To request an Access Code, make a server-side call to the CreateAccessCode method of Rapid API. The service will respond with an Access Code, a Form Action URL and the customer data.

The difference is that instead of sending the **Card Details** to the Form Action URL, you send the **Google Pay Network token**. 
You must include these 3 fields in your form-data request: 
- `EWAY_ACCESSCODE`
- `EWAY_PAYMENTTYPE`
- `EWAY_GOOGLEPAY_NETWORKTOKEN`


Where `EWAY_PAYMENTTYPE` is set to `GooglePay`.

You can find an example to Google Pay Network Token [here](https://developers.google.com/pay/api/web/guides/resources/payment-data-cryptography#token-response-example). 



> Example: 

``` html
<form method="POST" action="<<FormActionURL Goes Here>>" id="payment_form">
  <input type="hidden" name="EWAY_ACCESSCODE" value="<<AccessCode Goes Here>>" />
  <input type="hidden" name="EWAY_PAYMENTTYPE" value="GooglePay" />
   <input type="hidden" name="EWAY_GOOGLEPAY_NETWORKTOKEN" value="{{TOKEN}}" />
  <input type="submit" value="Process" text="Process" />
</form> 
```

Once the transaction has been processed, request the results from Eway using the Access Code. 

### *4. Integration Steps (Direct API)*

### Live endpoints

Type|Gateway URL|
----------|----------|
REST (POST)|https://api.ewaypayments.com/Transactions/

### Sandbox endpoints

Type|Gateway URL|
----------|----------|
REST (POST)|https://api.sandbox.ewaypayments.com/Transactions/

Rapid Plus API [Direct Connection](https://eway.io/api-v3/#direct-connection) can accept Google Pay Token to process Purchase / PreAuth payments. 
1. Call the Rapid plus endpoint `/Transactions` with a request that contains the payment instrument and the payment type: Google Pay. 
2. Send the Google pay token in the WalletDetails object > Token.

### Request Field Descriptions

> Example Google Pay Request

```json
{
    "paymentInstrument": {
        "paymentType": "GooglePay",
        "walletDetails": {
            "Token": "{  \"protocolVersion\": \"ECv2\",  \"signature\": \"MEQCIH6Q4OwQ0jAceFEkGF0JID6sJNXxOEi4r+mA7biRxqBQAiAondqoUpU\/bdsrAOpZIsrHQS9nwiiNwOrr24RyPeHA0Q\\u003d\\u003d\",  
            \"intermediateSigningKey\": {    \"signedKey\": \"{\\\"keyExpiration\\\":\\\"1542323393147\\\",\\\"keyValue\\\":\\\"MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE\/1+3HBVSbdv+j7NaArdgMyoSAM43yRydzqdg1TxodSzA96Dj4Mc1EiKroxxunavVIvdxGnJeFViTzFvzFRxyCw\\\\u003d\\\\u003d\\\"}\",    \"signatures\": [ \"MEYCIQCO2EIi48s8VTH+ilMEpoXLFfkxAwHjfPSCVED\/QDSHmQIhALLJmrUlNAY8hDQRV\/y1iKZGsWpeNmIP+z+tCQHQxP0v\" ]  },  \"signedMessage\": \"{\\\"tag\\\":\\\"jpGz1F1Bcoi\/fCNxI9n7Qrsw7i7KHrGtTf3NrRclt+U\\\\u003d\\\",\\\"ephemeralPublicKey\\\":\\\"BJatyFvFPPD21l8\/uLP46Ta1hsKHndf8Z+tAgk+DEPQgYTkhHy19cF3h\/bXs0tWTmZtnNm+vlVrKbRU9K8+7cZs\\\\u003d\\\",\\\"encryptedMessage\\\":\\\"mKOoXwi8OavZ\\\"}\"}"
        }
    },
    "Payment": {
        "TotalAmount": 100,
        "currencyCode": "AUD"
    },
    "Method": "ProcessPayment",
    "TransactionType": "Ecom"
}
```
1. The Method can be `ProcessPayment` for normal payment or `PreAuthorisation` for PreAuth payment. 
2. The response will include the tranasction result. 


## Specific Error Codes for Google Pay

Response Message|Reason
---|---
V6125|Selected Payment Type Not Enabled
S5017|Google Pay processing error
V7100|GooglePay Not Supported By Gateway
V7101|TokenCustomer and GooglePay should not coexist at the same time
V7102|Invalid GooglePay request, IntermediateSigningKey has no value
V7103|Invalid GooglePay request, Signature has no value
V7104|Invalid GooglePay request, Version number is not supported
V7105|Invalid GooglePay request, SignedMessage is null
V7106|Invalid GooglePay request, IntermediateSigningKey.SignedKey has no value
V7107|Invalid GooglePay request, IntermediateSigningKey.Signatures has no value
V7109|Invalid GooglePay request, GooglePay isn't available in your country
V7110|Invalid GooglePay GatewayMerchantId, GatewayMerchantId in GPay doesn't match with what was on-boarded in MyEway