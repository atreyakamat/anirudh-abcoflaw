# Decoupled Event-Driven Architecture — n8n Integration

## Core Architecture Principles

1. **NestJS owns Business Rules:** Validation, security guards, status state machines, database transactions, and data integrity remain inside NestJS services.
2. **n8n Orchestrates External Services:** Email dispatches, SMS notifications, Google Calendar sync, Telegram alerts, and OpenAI LLM processing are handled by n8n workflows.
3. **Event-Driven Decoupling:** When a business domain event occurs (e.g. `appointment.created`), NestJS dispatches an in-memory event via `EventEmitter2`. The `AutomationsService` catches the event, generates a cryptographically signed HMAC payload, and POSTs to the designated n8n webhook listener.

## Reliability & Security Mechanisms

- **HMAC Signature Validation:** Webhook requests include header `X-Webhook-Signature: sha256(...)`. n8n workflows verify signatures before processing.
- **Idempotency:** Webhook payloads include unique `eventId` and `timestamp`. Duplicate requests within 5 minutes are discarded.
- **Dead Letter Queue (DLQ):** Failed webhook dispatches are logged to `AutomationLog` table with status `RETRYING` or `FAILURE` for manual dashboard retry.
