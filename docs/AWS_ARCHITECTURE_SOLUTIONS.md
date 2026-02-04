# SNSMON-AI AWS Architecture & Solutions List

**Region**: ap-southeast-3 (Jakarta, Indonesia)
**Last Updated**: 2026-02-04

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                    INTERNET                                              │
└─────────────────────────────────────────┬───────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
            ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
            │  CloudFront  │      │   Route 53   │      │     WAF      │
            │    (CDN)     │      │    (DNS)     │      │  (Firewall)  │
            └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
                   │                     │                     │
                   └─────────────────────┼─────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              VPC (10.0.0.0/16)                                          │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                            PUBLIC SUBNETS                                          │  │
│  │  ┌─────────────────────────────┐      ┌─────────────────────────────┐             │  │
│  │  │   AZ-A (10.0.1.0/24)        │      │   AZ-B (10.0.2.0/24)        │             │  │
│  │  │  ┌───────────────────────┐  │      │  ┌───────────────────────┐  │             │  │
│  │  │  │  Application Load     │  │      │  │  Application Load     │  │             │  │
│  │  │  │     Balancer          │  │      │  │     Balancer          │  │             │  │
│  │  │  └───────────┬───────────┘  │      │  └───────────┬───────────┘  │             │  │
│  │  │  ┌───────────┴───────────┐  │      │  ┌───────────┴───────────┐  │             │  │
│  │  │  │     NAT Gateway       │  │      │  │     NAT Gateway       │  │             │  │
│  │  │  └───────────────────────┘  │      │  └───────────────────────┘  │             │  │
│  │  └─────────────────────────────┘      └─────────────────────────────┘             │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                               │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                           PRIVATE SUBNETS                                          │  │
│  │  ┌─────────────────────────────┐      ┌─────────────────────────────┐             │  │
│  │  │   AZ-A (10.0.10.0/24)       │      │   AZ-B (10.0.20.0/24)       │             │  │
│  │  │  ┌───────────────────────┐  │      │  ┌───────────────────────┐  │             │  │
│  │  │  │    ECS Cluster        │  │      │  │    ECS Cluster        │  │             │  │
│  │  │  │  ┌─────┐  ┌─────┐    │  │      │  │  ┌─────┐  ┌─────┐    │  │             │  │
│  │  │  │  │ API │  │ Web │    │  │      │  │  │ API │  │ Web │    │  │             │  │
│  │  │  │  └─────┘  └─────┘    │  │      │  │  └─────┘  └─────┘    │  │             │  │
│  │  │  │  ┌─────────────────┐  │  │      │  │  ┌─────────────────┐  │  │             │  │
│  │  │  │  │    Crawler      │  │  │      │  │  │    Crawler      │  │  │             │  │
│  │  │  │  └─────────────────┘  │  │      │  │  └─────────────────┘  │  │             │  │
│  │  │  └───────────────────────┘  │      │  └───────────────────────┘  │             │  │
│  │  └─────────────────────────────┘      └─────────────────────────────┘             │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
│                                         │                                               │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │                           DATA LAYER SUBNETS                                       │  │
│  │  ┌─────────────────────────────┐      ┌─────────────────────────────┐             │  │
│  │  │   AZ-A (10.0.100.0/24)      │      │   AZ-B (10.0.200.0/24)      │             │  │
│  │  │  ┌───────────────────────┐  │      │  ┌───────────────────────┐  │             │  │
│  │  │  │   RDS PostgreSQL      │◄─┼──────┼─►│   RDS PostgreSQL      │  │             │  │
│  │  │  │   (Primary)           │  │      │  │   (Standby)           │  │             │  │
│  │  │  └───────────────────────┘  │      │  └───────────────────────┘  │             │  │
│  │  │  ┌───────────────────────┐  │      │  ┌───────────────────────┐  │             │  │
│  │  │  │   ElastiCache Redis   │◄─┼──────┼─►│   ElastiCache Redis   │  │             │  │
│  │  │  │   (Primary)           │  │      │  │   (Replica)           │  │             │  │
│  │  │  └───────────────────────┘  │      │  └───────────────────────┘  │             │  │
│  │  └─────────────────────────────┘      └─────────────────────────────┘             │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              AWS MANAGED SERVICES                                        │
│                                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Amazon     │  │   Amazon     │  │   Amazon     │  │   Amazon     │               │
│  │   Bedrock    │  │     S3       │  │  OpenSearch  │  │     SQS      │               │
│  │   (AI/ML)    │  │  (Storage)   │  │  (Search)    │  │   (Queue)    │               │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Amazon     │  │   Amazon     │  │    AWS       │  │    AWS       │               │
│  │    SNS       │  │   Lambda     │  │  Secrets     │  │ CloudWatch   │               │
│  │  (Notify)    │  │ (Serverless) │  │   Manager    │  │ (Monitoring) │               │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘               │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. AWS Solutions List

### 2.1 Compute Services

| Service | Purpose | Configuration | Pricing Model |
|---------|---------|---------------|---------------|
| **Amazon ECS** | Container orchestration | Fargate / EC2 Launch Type | Per vCPU-hour, GB-hour |
| **Amazon EC2** | Virtual servers | t3.large, t3.xlarge, g5.xlarge | On-Demand / Reserved |
| **AWS Lambda** | Serverless functions | 128MB - 10GB memory | Per request + duration |
| **AWS Fargate** | Serverless containers | Auto-scaling enabled | Per vCPU-second |

### 2.2 Database Services

| Service | Purpose | Configuration | High Availability |
|---------|---------|---------------|-------------------|
| **Amazon RDS** | Primary database | PostgreSQL 15, db.r6g.large | Multi-AZ deployment |
| **Amazon ElastiCache** | In-memory cache | Redis 7.0, cache.r6g.large | Cluster mode enabled |
| **Amazon OpenSearch** | Full-text search & logs | t3.medium.search × 3 | 3-node cluster |
| **Amazon DynamoDB** | Key-value store (optional) | On-demand capacity | Global tables |

### 2.3 Storage Services

| Service | Purpose | Storage Class | Lifecycle |
|---------|---------|---------------|-----------|
| **Amazon S3** | Object storage | Standard, Intelligent-Tiering | 90 days → Glacier |
| **Amazon S3 Glacier** | Archive storage | Glacier Instant Retrieval | Long-term retention |
| **Amazon EBS** | Block storage | gp3 (3000 IOPS) | Snapshot backup |
| **Amazon EFS** | Shared file system | Standard (optional) | Cross-AZ access |

### 2.4 Networking & Content Delivery

| Service | Purpose | Configuration | Features |
|---------|---------|---------------|----------|
| **Amazon VPC** | Virtual network | 10.0.0.0/16, 6 subnets | Flow Logs enabled |
| **Application Load Balancer** | Load balancing | HTTP/HTTPS listeners | SSL termination |
| **Amazon CloudFront** | CDN | Edge locations | HTTPS only |
| **Amazon Route 53** | DNS management | Hosted zone | Health checks |
| **AWS NAT Gateway** | Outbound internet | High availability | Per AZ |
| **AWS Transit Gateway** | Network hub (optional) | Multi-VPC connectivity | Centralized routing |

### 2.5 Security Services

| Service | Purpose | Configuration | Features |
|---------|---------|---------------|----------|
| **AWS WAF** | Web application firewall | Managed rules | SQL injection, XSS protection |
| **AWS Shield** | DDoS protection | Standard (free) | Automatic mitigation |
| **AWS KMS** | Key management | Customer managed keys | Encryption at rest |
| **AWS Secrets Manager** | Secrets storage | Automatic rotation | API key management |
| **AWS Certificate Manager** | SSL/TLS certificates | Public certificates | Auto-renewal |
| **Amazon GuardDuty** | Threat detection | Continuous monitoring | ML-based detection |
| **AWS IAM** | Identity management | Roles, policies | Least privilege |
| **AWS Security Hub** | Security posture | Compliance checks | CIS benchmarks |

### 2.6 AI/ML Services

| Service | Purpose | Models | Use Case |
|---------|---------|--------|----------|
| **Amazon Bedrock** | Foundation models | Claude 3.5, Titan | Sentiment analysis, Crisis detection |
| **Amazon Comprehend** | NLP service | Pre-trained models | Entity extraction |
| **Amazon Translate** | Translation | Neural MT | Indonesian ↔ English |
| **Amazon SageMaker** | ML platform (optional) | Custom models | Fine-tuning SLM |

### 2.7 Application Integration

| Service | Purpose | Configuration | Throughput |
|---------|---------|---------------|------------|
| **Amazon SQS** | Message queue | Standard queue | Unlimited |
| **Amazon SNS** | Pub/sub messaging | Topic-based | Push notifications |
| **Amazon EventBridge** | Event bus | Scheduled rules | Cron jobs |
| **AWS Step Functions** | Workflow orchestration | State machines | Complex workflows |
| **Amazon API Gateway** | API management (optional) | REST/WebSocket | Rate limiting |

### 2.8 Management & Monitoring

| Service | Purpose | Features | Retention |
|---------|---------|----------|-----------|
| **Amazon CloudWatch** | Monitoring & logging | Metrics, Logs, Alarms | 15 months |
| **AWS CloudTrail** | API audit logging | All API calls | 90 days (S3 for longer) |
| **AWS Config** | Resource compliance | Configuration history | Compliance rules |
| **AWS Systems Manager** | Operations management | Parameter Store, Session Manager | Secure access |
| **AWS X-Ray** | Distributed tracing | Request tracing | Performance analysis |

### 2.9 Developer Tools

| Service | Purpose | Features |
|---------|---------|----------|
| **Amazon ECR** | Container registry | Docker image storage |
| **AWS CodePipeline** | CI/CD pipeline | Automated deployments |
| **AWS CodeBuild** | Build service | Docker builds |
| **AWS CodeDeploy** | Deployment automation | Blue/green deployments |
| **AWS CloudFormation** | Infrastructure as Code | Stack management |

### 2.10 Cost Management

| Service | Purpose | Features |
|---------|---------|----------|
| **AWS Cost Explorer** | Cost analysis | Forecasting, recommendations |
| **AWS Budgets** | Budget alerts | Threshold notifications |
| **AWS Savings Plans** | Cost optimization | Compute savings |
| **Reserved Instances** | Long-term discount | 1-year / 3-year terms |

---

## 3. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              DATA INGESTION FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Social     │     │   Crawler    │     │   Amazon     │     │   Amazon     │
  │   Media      │────►│   Workers    │────►│     SQS      │────►│   Lambda     │
  │   APIs       │     │   (ECS)      │     │   (Queue)    │     │  (Process)   │
  └──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                        │
        ┌───────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Amazon     │     │   Amazon     │     │   Amazon     │
  │   Bedrock    │────►│     RDS      │────►│  OpenSearch  │
  │   (AI/ML)    │     │  (Storage)   │     │   (Index)    │
  └──────────────┘     └──────────────┘     └──────────────┘
        │
        ▼
  ┌──────────────┐     ┌──────────────┐
  │   Amazon     │     │   Amazon     │
  │     S3       │     │     SNS      │────► Alerts & Notifications
  │  (Archive)   │     │  (Notify)    │
  └──────────────┘     └──────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              USER REQUEST FLOW                                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │    User      │     │  CloudFront  │     │     ALB      │     │   Dashboard  │
  │   Browser    │────►│    (CDN)     │────►│   (Load)     │────►│   (Next.js)  │
  └──────────────┘     └──────────────┘     └──────────────┘     └──────┬───────┘
                                                                        │
                                                                        ▼
                                            ┌──────────────┐     ┌──────────────┐
                                            │  ElastiCache │◄────│   API        │
                                            │   (Redis)    │     │  (NestJS)    │
                                            └──────────────┘     └──────┬───────┘
                                                                        │
        ┌───────────────────────────────────────────────────────────────┘
        │
        ▼
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   Amazon     │     │   Amazon     │     │   Amazon     │
  │     RDS      │     │  OpenSearch  │     │   Bedrock    │
  │   (Query)    │     │   (Search)   │     │   (Chat)     │
  └──────────────┘     └──────────────┘     └──────────────┘
```

---

## 4. Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY LAYERS                                             │
└─────────────────────────────────────────────────────────────────────────────────────────┘

Layer 1: Edge Security
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ AWS Shield   │  │   AWS WAF    │  │  CloudFront  │  │   Route 53   │               │
│  │   (DDoS)     │  │  (Firewall)  │  │   (HTTPS)    │  │   (DNSSEC)   │               │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
Layer 2: Network Security
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   VPC        │  │  Security    │  │   Network    │  │   VPC Flow   │               │
│  │  Isolation   │  │   Groups     │  │    ACLs      │  │    Logs      │               │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
Layer 3: Application Security
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   IAM Roles  │  │  Secrets     │  │   AWS KMS    │  │     ACM      │               │
│  │  (Identity)  │  │   Manager    │  │ (Encryption) │  │   (TLS)      │               │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
Layer 4: Data Security
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  RDS         │  │  S3 Bucket   │  │  EBS Volume  │  │  Backup      │               │
│  │ Encryption   │  │  Encryption  │  │  Encryption  │  │  Encryption  │               │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
Layer 5: Monitoring & Audit
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │  GuardDuty   │  │  CloudTrail  │  │   Config     │  │  Security    │               │
│  │  (Threats)   │  │   (Audit)    │  │ (Compliance) │  │     Hub      │               │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. DR & Backup Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                     PRIMARY REGION: ap-southeast-3 (Jakarta)                            │
│                                                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   ECS        │  │   RDS        │  │  ElastiCache │  │  OpenSearch  │               │
│  │  Cluster     │  │  Multi-AZ    │  │   Cluster    │  │   Cluster    │               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
│         │                 │                 │                 │                        │
│         └─────────────────┼─────────────────┼─────────────────┘                        │
│                           │                 │                                          │
│                           ▼                 ▼                                          │
│                    ┌──────────────┐  ┌──────────────┐                                  │
│                    │  AWS Backup  │  │   S3 Bucket  │                                  │
│                    │   (Daily)    │  │  (Primary)   │                                  │
│                    └──────┬───────┘  └──────┬───────┘                                  │
│                           │                 │                                          │
└───────────────────────────┼─────────────────┼──────────────────────────────────────────┘
                            │                 │
                            │  Cross-Region   │  S3 Replication
                            │  Backup Copy    │
                            ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                      DR REGION: ap-southeast-1 (Singapore)                              │
│                                                                                         │
│                    ┌──────────────┐  ┌──────────────┐                                  │
│                    │  AWS Backup  │  │   S3 Bucket  │                                  │
│                    │   (Vault)    │  │   (Replica)  │                                  │
│                    └──────────────┘  └──────┬───────┘                                  │
│                                             │                                          │
│                                             ▼                                          │
│                                      ┌──────────────┐                                  │
│                                      │  S3 Glacier  │                                  │
│                                      │  (Archive)   │                                  │
│                                      └──────────────┘                                  │
│                                                                                         │
│  * Infrastructure not provisioned during normal operation                               │
│  * CloudFormation templates ready for rapid deployment                                  │
│  * RTO: 4-8 hours | RPO: 24 hours                                                      │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Service Matrix by Environment

| Service | Development | Staging | Production |
|---------|-------------|---------|------------|
| **ECS Cluster** | 1 task | 2 tasks | 4+ tasks (auto-scaling) |
| **RDS** | db.t3.micro (Single-AZ) | db.t3.medium (Single-AZ) | db.r6g.large (Multi-AZ) |
| **ElastiCache** | cache.t3.micro | cache.t3.small | cache.r6g.large (Cluster) |
| **OpenSearch** | t3.small.search × 1 | t3.medium.search × 2 | t3.medium.search × 3 |
| **S3** | Standard | Standard | Standard + Lifecycle |
| **CloudFront** | ❌ | ✅ | ✅ |
| **WAF** | ❌ | ✅ | ✅ |
| **GuardDuty** | ❌ | ❌ | ✅ |
| **Multi-AZ** | ❌ | ❌ | ✅ |
| **DR Backup** | ❌ | ❌ | ✅ |

---

## 7. Estimated Monthly Cost by Service

| Category | Service | Monthly Cost (USD) |
|----------|---------|-------------------|
| **Compute** | ECS/EC2 | $1,270 |
| **Database** | RDS PostgreSQL | $280 |
| **Cache** | ElastiCache Redis | $180 |
| **Search** | OpenSearch | $220 |
| **Storage** | S3 (6TB avg) | $150 |
| **Networking** | ALB, NAT, CloudFront | $139 |
| **Security** | WAF, Secrets Manager | $85 |
| **AI/ML** | Amazon Bedrock | $1,000 - $3,000 |
| **Integration** | SQS, SNS, Lambda | $90 |
| **Monitoring** | CloudWatch | $50 |
| **DR** | Cross-Region Backup | $345 |
| **Total** | | **$3,809 - $5,809** |

---

## 8. Quick Reference

### AWS CLI Commands

```bash
# ECS - Deploy new version
aws ecs update-service --cluster snsmon-prod --service api --force-new-deployment

# RDS - Create snapshot
aws rds create-db-snapshot --db-instance-identifier snsmon-prod --db-snapshot-identifier snsmon-manual-$(date +%Y%m%d)

# S3 - Sync backup
aws s3 sync s3://snsmon-data-jakarta s3://snsmon-backup-singapore --storage-class GLACIER

# CloudWatch - Get metrics
aws cloudwatch get-metric-statistics --namespace AWS/ECS --metric-name CPUUtilization --dimensions Name=ClusterName,Value=snsmon-prod --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 300 --statistics Average
```

### Infrastructure as Code

```hcl
# Terraform module structure
modules/
├── vpc/           # VPC, Subnets, NAT Gateway
├── ecs/           # ECS Cluster, Services, Tasks
├── rds/           # RDS PostgreSQL
├── elasticache/   # Redis Cluster
├── s3/            # Buckets, Lifecycle policies
├── security/      # WAF, Security Groups, IAM
├── monitoring/    # CloudWatch, Alarms
└── dr/            # Cross-region backup
```

---

## 9. Contact & Support

| Level | Response Time | Contact |
|-------|---------------|---------|
| P1 - Critical | 15 min | AWS Enterprise Support |
| P2 - High | 1 hour | Cloud Operations Team |
| P3 - Medium | 4 hours | Development Team |
| P4 - Low | 1 business day | Standard Support |

---

**Document Version**: 1.0
**Author**: SNSMON-AI Infrastructure Team
