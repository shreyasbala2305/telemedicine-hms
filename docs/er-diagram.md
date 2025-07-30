Tables:

users (id, name, email, role, password)

doctors (id, name, specialty, contact, availability)

patients (id, user_id, dob, gender, contact)

appointments (id, patient_id, doctor_id, date_time, status)

ehr_records (id, patient_id, file_url, notes, timestamp)

invoices (id, patient_id, amount, status, generated_on)

insurance_claims (id, patient_id, invoice_id, insurer, claim_status, submitted_at)

inventory_items (id, name, quantity, threshold)

notifications (id, recipient_id, type, message, sent_at)