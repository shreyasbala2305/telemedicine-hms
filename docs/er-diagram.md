###### **Tables:**

* users (id, name, email, role, password)
* patients (id, user\_id, dob, gender, contact)
* appointments (id, patient\_id, doctor\_id, date\_time, status)
* ehr\_records (id, patient\_id, file\_url, notes, timestamp)
* invoices (id, patient\_id, amount, status, generated\_on)
* inventory\_items (id, name, quantity, threshold)
