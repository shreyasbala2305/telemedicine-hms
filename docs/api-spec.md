**Auth Service**

POST /auth/login
POST /auth/register
GET  /auth/validate

**Patient Service**

GET  /patients
POST /patients
GET  /records/{patientId}

**Doctor Service**

GET  /doctors
POST /doctors
PUT  /doctors/{id}/availability
GET  /doctors/specialty/{type}

**Appointment Service**

POST /appointments
GET  /appointments/patient/{id}
GET  /appointments/doctor/{id}

**Billing Service**

POST /bills
GET  /bills/{patientId}
POST /claims

**Notification Service**

POST /notify
POST /notify/appointment-confirmation

**AI Triage Service**

POST /predict