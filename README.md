# 🏥 Telemedicine + Hospital Management System (HMS)

A modern, full-stack microservices-based telemedicine and hospital management system designed to streamline healthcare operations — from appointment booking and billing to EHR, doctor scheduling, inventory, and real-time notifications.

---

## 🚀 Tech Stack

| Layer       | Tech Stack                      |
|-------------|---------------------------------|
| Frontend    | React.js + Tailwind CSS         |
| Backend     | Spring Boot (Java), Python (AI) |
| Databases   | PostgreSQL, MongoDB             |
| DevOps      | Docker, Terraform, AWS EKS      |
| APIs        | OpenAPI, Stripe, WebRTC, FHIR   |

---

## 📦 Microservices

| Service               | Description                             |
|------------------------|-----------------------------------------|
| `auth-service`         | JWT-based authentication & roles        |
| `patient-service`      | EHRs, profile management                |
| `doctor-service`       | Doctor info, availability               |
| `appointment-service`  | Scheduling and booking system           |
| `billing-service`      | Invoicing, insurance claims             |
| `inventory-service`    | Medical inventory (MongoDB)             |
| `notification-service` | Email/SMS/in-app alerts                 |
| `ai-triage-service`    | Symptom checker and specialist matcher  |

---

## 📚 Key Features

- 🔒 Role-based authentication using JWT
- 📅 Seamless doctor-patient appointment scheduling
- 🧾 Real-time billing and insurance claim flow
- 💊 Inventory tracking using NoSQL (MongoDB)
- 📨 Event-based notification delivery (email/SMS)
- 🤖 AI-based triage suggestions
- 📁 EHR uploads to S3 with metadata indexing
- 📊 Swagger-enabled API documentation

---

## ⚙️ Running the Project

### ▶️ Local Development
```bash
docker-compose up --build
```

Access Swagger UI for each microservice at:
```
http://localhost:8080/swagger-ui.html
```

---

### 📁 Project Structure
```
telemedicine-hms/
├── auth-service/
├── patient-service/
├── doctor-service/
├── appointment-service/
├── billing-service/
├── inventory-service/
├── notification-service/
├── ai-triage-service/
├── docs/
│   ├── specs/
│   └── architecture.md
├── docker-compose.yml
└── README.md
```

---

## 🧪 API Testing

Each service includes its own Swagger/OpenAPI spec. You can test endpoints using:
- Swagger UI (`/swagger-ui.html`)
- Postman collections
- cURL

---

## 🌐 Deployment (Cloud)

Deployed using **Terraform + AWS**:
- ☁️ EKS Cluster for microservices
- ☁️ RDS PostgreSQL for relational data
- ☁️ MongoDB Atlas (or local container)
- ☁️ S3 Bucket for file storage (EHR uploads)

```bash
cd devops/terraform
terraform init
terraform apply
```

---

## 📌 Documentation

- 📐 System Architecture – `/docs/architecture.md`
- 🔌 API Contracts (OpenAPI Spec) – `/docs/specs/`
- 🔁 Sequence Flow – Billing, Appointment, Triage
- ✅ Project Checklist – Setup & milestones

---

## 👨‍💻 Contributors

- **Developer**: Shreyas Balapure
- **Tech Stack**: Java, Spring Boot, React.js, Tailwind, PostgreSQL, Docker
- **Contact**: shreyashbalapure@gmail.com

---

## 📖 License

This project is open-source and available under the MIT License.

