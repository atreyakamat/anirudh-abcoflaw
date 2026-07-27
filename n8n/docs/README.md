# AB & Co. Legal CRM — Intelligent Automation Layer (n8n v1)

This directory contains the production-grade automation workflows, webhook listeners, AI legal assistants, and architecture documentation for the **AB & Co. Legal CRM & Consultation Platform**.

## Platform Overview

The automation layer decouples legal business rules (owned by NestJS backend) from operational orchestration and third-party integrations (handled by n8n).

```
                     ┌───────────────────────────┐
                     │   NestJS Backend Service  │
                     │  (Owns Business Rules)    │
                     └─────────────┬─────────────┘
                                   │ Domain Events (EventEmitter2)
                                   ▼
                     ┌───────────────────────────┐
                     │  Webhook Publisher Engine │
                     │  (HMAC Signed Headers)    │
                     └─────────────┬─────────────┘
                                   │ HTTP POST (Webhooks)
                                   ▼
                     ┌───────────────────────────┐
                     │   n8n Automation Engine   │
                     │   (Orchestrator v1)       │
                     └─────────────┬─────────────┘
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
┌──────────────────────┐ ┌───────────────────┐ ┌────────────────────┐
│ Telegram / SMS Alert │ │ Google Calendar   │ │ OpenAI LLM AI Nodes│
└──────────────────────┘ └───────────────────┘ └────────────────────┘
```

## Directory Structure

```
/n8n
├── /workflows
│   ├── appointment-created.json          # Intake & receptionist Telegram dispatch
│   ├── appointment-confirmed.json        # Google Calendar invite & client SMS
│   ├── appointment-reminder.json         # 24h & 2h automated consultation reminders
│   ├── lawyer-assigned.json              # Lawyer schedule update & case brief
│   ├── consultation-completed.json       # Completed event & feedback trigger
│   ├── feedback-request.json             # Post-consultation review request
│   ├── invoice-created.json              # Billing invoice PDF & payment link
│   ├── followup.json                     # 7-day post-consultation check-in
│   ├── ai-case-classification.json       # LLM practice area & priority classifier
│   ├── ai-draft-email.json               # LLM cancellation response draft
│   └── ai-meeting-summary.json           # LLM transcript summary & case notes
└── /docs
    ├── README.md                         # Quickstart & Directory Map
    ├── architecture.md                   # Decoupled Event-Driven Architecture
    └── environment.md                    # Environment Variable Reference
```

## Import Workflows into n8n

1. Access your n8n instance at `http://localhost:5678`.
2. Navigate to **Workflows -> Import from File**.
3. Select any `.json` workflow from `/n8n/workflows/`.
4. Ensure credentials for Telegram, Twilio, Google Calendar, and OpenAI are set up as documented in `environment.md`.
