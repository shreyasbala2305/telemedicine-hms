**✅ Docker Setup**

* Each service has a Dockerfile
* docker-compose.yml for local development

docker-compose up --build

**✅ Terraform (AWS)**

Deploys:
* EKS cluster
* RDS PostgreSQL
* S3, IAM, Secrets
* Load balancer

cd devops/terraform
terraform init
terraform apply