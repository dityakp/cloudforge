# CloudForge - DevOps Assignment

Welcome to **CloudForge**, a robust, containerized two-tier web application (FastAPI + Next.js) deployed on AWS using modern DevOps practices.

This repository demonstrates a production-grade workflow including **Infrastructure as Code (Terraform)**, **CI/CD Automation (GitHub Actions)**, **Docker Best Practices**, and **Cloud Monitoring**.

---

## 🏗️ Architecture

The application runs on AWS Fargate (Serverless Containers) for maximum scalability and minimal management overhead.

*   **Frontend**: Next.js (Port 3000)
*   **Backend**: FastAPI (Port 8000)
*   **Infrastructure**:
    *   **VPC**: Custom VPC with 2 Public Subnets across 2 Availability Zones (High Availability).
    *   **Load Balancer**: Internet-facing Application Load Balancer (ALB) routing traffic based on path (`/api/*` -> Backend, `/*` -> Frontend).
    *   **Compute**: ECS Cluster running Fargate tasks.
    *   **Storage**: ECR for Docker images, S3 + DynamoDB for Terraform State.
    *   **Monitoring**: CloudWatch Log Groups & CPU Alarms (>70%) with SNS alerts.

---

## 🚀 Workflows (How it Works)

We use **GitHub Actions** to automate everything. There are two main workflows:

### 1. Continuous Integration (`ci-develop.yml`)
*   **Trigger**: Push to `develop` branch (or pull requests).
*   **Actions**:
    1.  **Tests**: Runs `pytest` (Backend) and `npm test` (Frontend).
    2.  **Infrastructure Check**: Runs `terraform apply` to ensure the ECR repositories exist.
    3.  **Build & Push**: Builds Docker images and pushes them to ECR with `latest` and `dityakp/feature/dockerization` tags.
    *   **Result**: Validates code quality and prepares artifacts.

### 2. Continuous Deployment (`cd-main.yml`)
*   **Trigger**: Push to `main` branch.
*   **Actions**:
    1.  **Infrastructure Sync**: Runs `terraform apply` (using Remote State) to provision/update VPC, ALB, and ECS.
    2.  **Deployment**: Pushes new images to ECR and forces an ECS Service update.
    3.  **Rolling Update**: ECS drains old tasks and spins up new ones with zero downtime.
    *   **Result**: Live application updated at the ALB URL.

### 3. Destruction (`destroy-infra.yml`)
*   **Trigger**: Manual (GitHub Actions > Run Workflow).
*   **Action**: Runs `terraform destroy` to tear down all AWS resources and save costs.

---

## 🛠️ How to Run Locally

You can run the full stack locally using Docker Compose.

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/dityakp/cloudforge.git
    cd cloudforge
    ```

2.  **Start Services**:
    ```bash
    docker-compose up --build
    ```

3.  **Access App**:
    *   Frontend: `http://localhost:3000`
    *   Backend API: `http://localhost:8000/api/health`

---

## ☁️ Infrastructure as Code (Terraform)

All infrastructure is defined in the `terraform/` directory.

**State Management**:
We use a **Remote Backend** (S3 + DynamoDB) to store the state file. This allows GitHub Actions and local developers to share the same infrastructure state without conflicts.
*   **Bucket**: `cloudforge-tf-state-164971840296`
*   **Lock Table**: `cloudforge-tf-locks`

**Key Files**:
*   `main.tf`: VPC, Subnets, Security Groups.
*   `ecs.tf`: Cluster, Services, Task Definitions.
*   `alb.tf`: Load Balancer and Target Groups.
*   `monitoring.tf`: CloudWatch Alarms.

---

## ✅ Deployment Checklist

To deploy changes:
1.  **Feature Branch**: Make changes in `feature/dockerization` (or your feature branch).
2.  **Merge to Develop**: This triggers the **CI** pipeline (Test + Build).
3.  **Merge to Main**: This triggers the **CD** pipeline (Deploy to AWS).

**Live URL**: `http://cloudforge-alb-956666774.ap-south-1.elb.amazonaws.com`

---

## 🛡️ Security & Best Practices used
*   **Docker**: Multi-stage builds and **non-root users** (`appuser`) for security.
*   **IAM**: Least Privilege execution roles for ECS tasks.
*   **Networking**: Security Groups strictly limit traffic (ALB -> ECS only).
*   **Secrets**: AWS Credentials stored in GitHub Secrets.

---

*Verified by [Aditya Kumar Prasad](https://github.com/dityakp)*
