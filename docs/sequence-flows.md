**✅ Appointment Flow**



1\. Patient logs in (auth-service)

2\. Patient books slot (patient-service)

3\. Slot availability checked in real-time

4\. Confirmation sent, EHR ID assigned



**✅ Billing Flow**



1\. Appointment ends

2\. patient-service triggers billing-service

3\. Bill generated using Drools

4\. Stripe/PayPal payment processed

5\. Status updated in patient history



