# Kraftgene AI Web Platform & Enterprise Customer Portal — kraftgeneai.ca

> **System:** Enterprise Web Platform & Customer Portal
> **Production URL:** https://www.kraftgeneai.ca/
> **Version:** 2.4.0 (2026 Edition)
> **Publisher:** Kraftgene AI Inc. - Yu Nong

---

## 1. Executive Summary

The Kraftgene AI Web Platform (https://www.kraftgeneai.ca/) serves as the central SaaS hub, authentication provider, customer portal, and API billing gateway for Kraftgene AI's Industrial Digital Twin platforms.

It bridges industrial operators with real-time neural simulation platforms (Grid Distribution, Grid Transmission, Oil & Gas Pipelines) and provides automated subscription management, API quota enforcement, team role management, and secure telemetry ingestion.

---

## 2. Core Capabilities & Customer Portal Architecture

### 🔐 Authentication & Identity Management
- **Multi-Factor Security:** Built-in 2FA (TOTP/SMS) verification, OTP validation, and email password reset workflows.
- **Enterprise Session Guard:** SessionGuard React wrappers enforce JWT validation and role-based access control (RBAC).
- **JWT Authorization:** Issues signed HS256 JWT tokens for microservice authentication across Copilot engines and Digital Twin backends.

### 📊 Customer Portal (`/dashboard`)
- **Digital Twin Command Center:** Unified launcher for Digital Twin platforms:
  - `grid-distribution-platform`: IEEE 118-bus distribution feeder twin
  - `grid-platform`: High-voltage transmission cascade simulation
  - `pipeline-platform`: SCADA oil & gas hydraulic network twin
- **Data & Professional Services:** On-demand data stream analytics and professional consulting request management.
- **Organization & Team Hub:** Sub-account invitation system (`/api/team/invite`) and multi-user seat management.

### 💳 Stripe Billing & Quota Engine
- **Stripe Integration:** Native checkout session creation, webhook listeners, and customer self-serve billing portal (`/api/stripe/portal`).
- **Copilot Prompt Quota Tracker:** Automated rate-limiting endpoint (`/api/copilot/quota`) tracking monthly prompt usage per customer tier before routing requests to Azure OpenAI deployments.

### 🚁 Telemetry Ingestion & UAV Surveillance
- **Batch Meter Ingestion:** High-throughput telemetry ingestion route (`/api/telemetry/ingest`).
- **Automated Wildfire & UAV Uploads:** FLIR/Optical drone image report uploads (`/api/reports/automated-wildfire` & `/api/upload-uav`).

---

## 3. Project Directory Structure

```
WEBSITE/
├── .azure-static-web-apps-*.yml   # Azure Static Web Apps CI/CD Deployment
├── app/                           # Next.js App Router
│   ├── admin/                     # System Administration Panel
│   ├── api/                       # Enterprise REST API Routes
│   │   ├── admin/                 # User Management, 2FA, Reset Controls
│   │   ├── auth/                  # Login, Register, Session Authentication
│   │   ├── checkout/              # Purchase Workflows
│   │   ├── copilot/               # Prompt Quota Verification Engine
│   │   ├── data-services/         # Data Analytics Endpoints
│   │   ├── preferences/           # User UI Preferences
│   │   ├── register/              # Customer Onboarding
│   │   ├── reports/               # Wildfire & UAV Surveillance Processing
│   │   ├── services/              # Custom Professional Service Requests
│   │   ├── stripe/                # Checkout, Webhooks, Customer Billing Portal
│   │   ├── team/                  # Organization & Seat Invitations
│   │   ├── telemetry/             # Smart Meter & SCADA Ingest Route
│   │   ├── upload-uav/            # Drone Imagery Ingestion
│   │   └── user/                  # Business Profiles, Password, OTP, Documents
│   ├── dashboard/                 # Secure Customer Portal
│   │   ├── data-services/         # Data Service Modules
│   │   ├── digital-twins/         # Digital Twin Launchpad
│   │   ├── grid-distribution-platform/ # Distribution Feeder Portal
│   │   ├── grid-platform/         # Transmission Grid Portal
│   │   ├── pipeline-platform/     # Oil & Gas SCADA Portal
│   │   ├── professional-services/ # Enterprise Support & Consulting
│   │   └── settings/              # Account & Organization Settings
│   ├── login/                     # Authentication View
│   ├── globals.css                # Global Tailwind CSS Styles
│   ├── layout.tsx                 # Root Web Layout
│   └── page.tsx                   # Main Landing Page (kraftgeneai.ca)
├── components/                    # Reusable React UI Components
│   ├── admin/                     # Admin View Controls
│   ├── ui/                        # UI Primitives
│   ├── OnboardingWizard.jsx       # Customer Setup Wizard
│   ├── SessionGuard.tsx           # Route Protection Guard
│   ├── SubscriptionPlans.tsx      # Tier Pricing Table
│   └── theme-provider.tsx         # Dark/Light Theme Manager
├── hooks/                         # Custom React Hooks
├── lib/                           # Core Library Wrappers
│   ├── notifications.ts           # Email & SMS Gateway Integration
│   ├── prisma.ts                  # Database ORM Client
│   └── utils.ts                   # Helper Functions
├── prisma/                        # Database Schema Definitions
│   └── schema.prisma              # PostgreSQL / MySQL Entity Model
└── package.json                   # Web Dependencies
```

---

## 4. Environment Configuration Template

Below is the required `.env` environment layout for deployment setup (all sensitive secret keys have been omitted for security):

```env
# Website & Application Configuration
NEXT_PUBLIC_APP_URL=https://www.kraftgeneai.ca
NODE_ENV=production

# Database (Prisma ORM)
DATABASE_URL=your_database_connection_string_here

# JWT Authentication Secret
JWT_SECRET=your_jwt_secret_key_here

# Stripe Payment Gateway
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# AI & Copilot Service Integrations
COPILOT_BACKEND_URL=your_copilot_backend_url_here

# Notification Services (Email / SMS)
SMTP_HOST=your_smtp_host_here
SMTP_PORT=587
SMTP_USER=your_smtp_user_here
SMTP_PASSWORD=your_smtp_password_here
```

---

## 5. Build & Deployment Instructions

### Local Development Setup
```bash
# 1. Install dependencies
npm install

# 2. Push database schema via Prisma
npx prisma db push

# 3. Start Next.js development server
npm run dev
```

### Production Build
```bash
# Generate optimized production build
npm run build

# Start production server
npm start
```

### Azure Static Web Apps CI/CD
Deployments are automatically executed via GitHub Actions workflow targeting Azure Static Web Apps (`.github/workflows/azure-static-web-apps-*.yml`).

---

## 6. Copyright & Proprietary Notice

**Copyright © 2026 Kraftgene AI Inc. All rights reserved.**

This web platform, source code, dashboard components, API endpoints, and associated software architectures are the exclusive proprietary property of **Kraftgene AI Inc.** (https://www.kraftgeneai.ca/).

*UNAUTHORIZED COPYING, DECOMPILATION, REVERSE ENGINEERING, MODIFICATION, DISTRIBUTION, OR REPRODUCTION OF THIS SOFTWARE, IN WHOLE OR IN PART, VIA ANY MEDIUM, IS STRICTLY PROHIBITED WITHOUT EXPRESS WRITTEN CONSENT FROM KRAFTGENE AI INC.*

### Corporate Contacts
- **Official Website:** https://www.kraftgeneai.ca/
- **Customer Support & Enterprise Inquiries:** customer@kraftgeneai.ca
