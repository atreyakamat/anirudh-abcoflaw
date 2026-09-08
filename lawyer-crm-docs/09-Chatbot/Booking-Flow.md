# Chatbot Booking Flow

> Status: **Current** — aligned with the implementation as of 2026-09-08.

## Purpose

Define how a consultation request originating in the chatbot becomes an appointment in the Booking API, and where the chatbot's responsibility ends.

## Scope

- Website chatbot session lifecycle (session → messages → intent detection)
- Lead qualification and the hand-off to the Booking API
- The two chatbot surfaces that exist today (see "Chatbot Surfaces")
- Status lifecycle after a chatbot booking is created

## Chatbot Surfaces

Two chatbot implementations exist in the frontend:

| Surface | File | Backend-connected? | Booking path |
|---------|------|--------------------|--------------|
| **Information Assistant** (mounted on the public site) | `frontend/src/components/floating-chatbot.tsx` | No — canned local responses only | Link to the `/book` form |
| **Chatbot Widget** (backend-connected component) | `frontend/src/components/chatbot/chatbot-widget.tsx` | Yes — `chatbot` API module | Lead form → `POST /chatbot/sessions/:id/lead` → appointment creation |

The public website currently mounts the Information Assistant. The backend-connected widget is available but not mounted; any swap is a product decision.

## Booking Flow (backend-connected widget)

```text
Visitor opens chat
  │
  ▼
POST /api/v1/chatbot/sessions                     (creates ChatbotSession, source: "website")
  │
  ▼
POST /api/v1/chatbot/sessions/:id/messages        (message logged, intent detected)
  │
  ├─ intent = BOOK and session has no email yet
  │     → response.shouldCollectContact = true, intent.action = QUALIFY_LEAD
  │     → widget renders the lead / booking form
  │
  ▼
POST /api/v1/chatbot/sessions/:id/lead            (SubmitLeadDto)
  │
  ├─ email + preferredDate + preferredTime provided
  │     → ChatbotService calls AppointmentsService.create()
  │     → Appointment created with source: CHATBOT, status: PENDING_REVIEW
  │     → receptionist notification ("New Chatbot Booking") with reference number
  │     → response includes referenceNumber for the visitor
  │
  └─ contact details only (no date/time)
        → lead stored in ChatbotSession.metadata + receptionist notification
        → response: lead captured, no appointment
```

### Booking rules

- An appointment is only created when the lead includes **email, preferredDate, and preferredTime**. Anything less is stored as a lead for the team to follow up.
- Chatbot bookings go through the same `AppointmentsService.create()` pipeline as the `/book` form: client lookup/creation by email, 30-minute slot conflict check (409 on conflict), status history entry, and the transactional-outbox `appointment.created` automation event.
- `practiceArea` is embedded into the appointment description using the same `[Practice Area] …` convention as the `/book` form (the schema has no dedicated column).
- If no `message` is provided, the description defaults to `Consultation requested via chatbot`.
- `name` is split into first/last name for the client record; a missing name defaults to `Unknown Client`.

## API Contract Summary

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/v1/chatbot/sessions` | POST | Public | Create session |
| `/api/v1/chatbot/sessions/:id` | GET | Public | Get session |
| `/api/v1/chatbot/sessions/:id/messages` | POST | Public | Send message, get intent + response |
| `/api/v1/chatbot/sessions/:id/messages` | GET | Public | Message history |
| `/api/v1/chatbot/sessions/:id/lead` | POST | Public | Submit lead; creates appointment when booking fields present |
| `/api/v1/chatbot/sessions/:id/end` | POST | Public | End session |
| `/api/v1/chatbot/analytics` | GET | JWT + ADMIN/RECEPTIONIST | Session/lead counts |

All responses use the global envelope `{ success, data, timestamp, path }`. See [10-API/Booking.md](../10-API/Booking.md) for the appointment endpoints that the flow terminates in, and [10-API/REST.md](../10-API/REST.md) for general conventions.

## Appointment Status Lifecycle (post-booking)

Chatbot bookings start at `PENDING_REVIEW`, then follow the standard state machine:

```text
PENDING_REVIEW → PENDING_LAWYER_CONFIRMATION → CONFIRMED → UPCOMING → REMINDER_SENT → COMPLETED
                     │                          │
                     └→ REJECTED → ARCHIVED     └→ CANCELLED → ARCHIVED
```

See [02-Requirements/State-Machines.md](../02-Requirements/State-Machines.md) and the `validTransitions` map in `backend/src/modules/appointments/appointments.service.ts` (the source of truth).

## Qualifying Questions

The chatbot currently asks for name and email when a booking intent is detected (keyword match: book / appointment / schedule / consultation / meet). The lead form collects name, email, phone, optional practice area, optional preferred date/time, and an optional brief matter description. See [Qualifying-Questions.md](Qualifying-Questions.md).

## Alignment Decisions (2026-09-08)

The following drift was resolved in code:

1. The chatbot previously promised to "create a booking request" but only stored lead metadata; `BookingSource.CHATBOT` was never written. The lead endpoint now creates appointments through the Booking API.
2. The backend widget never submitted the lead — it only displayed a prompt. It now renders a lead/booking form and posts to the lead endpoint.
3. The backend canned "practice areas" answer listed areas that do not match the `/book` form. Both now use the canonical `PRACTICE_AREAS` list (`frontend/src/lib/constants/practice-areas.ts`).

## References

- `backend/src/modules/chatbot/` — controller, service, `SubmitLeadDto`
- `backend/src/modules/appointments/` — Booking API (see [10-API/Booking.md](../10-API/Booking.md))
- `frontend/src/components/chatbot/chatbot-widget.tsx` — backend-connected widget
- `frontend/src/components/floating-chatbot.tsx` — mounted Information Assistant
- `diagrams/booking-flow.mmd`, `diagrams/chatbot.mmd` — diagram placeholders
