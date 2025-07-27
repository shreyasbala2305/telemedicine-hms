###### **Auth Service**

POST /auth/login

POST /auth/register

GET  /auth/validate



###### **Patient Service**

GET  /patients

POST /appointments

GET  /appointments/{id}

GET  /records/{patientId}



###### **Billing Service**

POST /bills

POST /claims

GET  /bills/{patientId}



###### **AI Triage Service**

POST /predict

