 **✅ Appointment Booking Flow**

1. Patient logs in (auth-service)
2. Views available doctors (doctor-service)
3. Selects a slot (appointment-service)
4. Confirmation message sent (notification-service)

**✅ EHR Upload Flow**

1. Doctor uploads record via patient-service
2. File stored in AWS S3
3. Metadata saved in ehr_records

**✅ Billing & Claim Flow**

1. Appointment ends
2. Billing service triggered
3. Invoice created + claim submitted
4. Payment processed + notification sent