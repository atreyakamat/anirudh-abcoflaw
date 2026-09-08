# Booking API

> Status: **Current** — aligned with the implementation as of 2026-09-08.

## Purpose

Document every REST endpoint involved in creating and managing consultation bookings (appointments), including request/response schemas, authentication, status transitions, and error behavior.

## Scope

- `backend/src/modules/appointments/` (controller, service, DTOs)
- The chatbot's path into the same pipeline (`chatbot` module lead endpoint)
- Response envelope, error format, and the appointment status machine

## Conventions

- Base URL: `/api/v1` (see [REST.md](REST.md)).
- All responses are wrapped: `{ success: boolean, data: T, timestamp: string, path: string }`. Error responses: `{ success: false, message: string | string[], ... }` with an appropriate HTTP status.
- Validation uses the global `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true` — unknown fields are rejected, so send only the fields documented below.

## Endpoints

### Create appointment — `POST /appointments` (public)

Public booking form and staff bookings. Auth: none (session user id used when a cookie/bearer is present).

Request body (`CreateAppointmentDto`):

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `clientId` | string | no | Existing client; otherwise a client is looked up/created by `email` |
| `email` | string | yes* | *Required unless `clientId` is given; used to find or create the client |
| `phone` | string | no | |
| `firstName` / `lastName` | string | no | Defaults `Unknown` / `Client` when creating a new client |
| `description` | string | **yes** | Min 10 chars |
| `preferredDate` | ISO 8601 string | **yes** | e.g. `2026-09-20` |
| `preferredTime` | string | **yes** | `HH:MM`, 30-minute slots |
| `practiceArea` | string | no | Embedded into the description as `[Practice Area] …` (no dedicated column) |
| `source` | `WEBSITE` \| `CHATBOT` \| `RECEPTIONIST` \| `LAWYER` \| `CLIENT_PORTAL` | no | Defaults to `WEBSITE` |
| `documentIds` | string[] | no | Previously uploaded document IDs to link |

Behavior:

- Client resolved by `clientId` or `email` (auto-created from name/email/phone).
- 30-minute slot conflict check → **409 Conflict** if the date+time is already booked (active appointments only).
- Created with `status: PENDING_REVIEW` and a unique `referenceNumber`.
- An `appointment.created` transactional-outbox event is written atomically (drives n8n automation) and a status-history entry is recorded.

Response `data`: the created `Appointment` (includes `referenceNumber`).

### Chatbot lead / booking — `POST /chatbot/sessions/:id/lead` (public)

See [09-Chatbot/Booking-Flow.md](../09-Chatbot/Booking-Flow.md). When `email` + `preferredDate` + `preferredTime` are provided, this calls the same create pipeline with `source: CHATBOT` and returns `{ referenceNumber, appointment }`; otherwise it records a lead only.

### List appointments — `GET /appointments` (JWT: ADMIN, LAWYER, RECEPTIONIST)

Query params: `page`, `limit`, `sortBy` (default `createdAt`), `sortOrder`, `search` (matches reference number, description, client name/email), `startDate`, `endDate`, `status`, `clientId`. Returns a paginated result (`items`, `total`, `page`, `limit`, `totalPages`, …).

### Other reads (JWT: ADMIN, LAWYER, RECEPTIONIST)

| Endpoint | Purpose |
|----------|---------|
| `GET /appointments/today` | Today's non-archived appointments |
| `GET /appointments/upcoming?limit=` | Confirmed/upcoming/reminder-sent from today |
| `GET /appointments/status-counts` | Count per status |
| `GET /appointments/:id` | Single appointment with client, documents, payments, history, notes |

### Update appointment — `PUT /appointments/:id` (JWT: ADMIN, LAWYER, RECEPTIONIST)

Body: any of `description`, `preferredDate`, `preferredTime` (re-runs conflict check), `lawyerNote`.

### Update status — `PUT /appointments/:id/status` (JWT: ADMIN, LAWYER, RECEPTIONIST)

Body: `{ status: AppointmentStatus, reason?: string }`.

This is the **single** status-change endpoint. There are no separate `/confirm`, `/reject`, `/cancel`, or `/complete` routes — clients map convenience actions onto this endpoint:

| Action | Request body |
|--------|--------------|
| Confirm (lawyer) | `{ "status": "CONFIRMED" }` |
| Reject | `{ "status": "REJECTED", "reason": "…" }` |
| Cancel | `{ "status": "CANCELLED", "reason": "…" }` |
| Complete | `{ "status": "COMPLETED" }` |

Invalid transitions → **400 Bad Request**. Confirmed/completed transitions emit domain events and trigger the `APPOINTMENT_STATUS_UPDATED` n8n webhook. A history entry is always recorded.

### Add note — `POST /appointments/:id/notes` (JWT: ADMIN, LAWYER)

Body: `{ content: string }`.

### Delete — `DELETE /appointments/:id` (JWT: ADMIN)

Soft delete (`deletedAt` set). Returns **204 No Content**.

## Status Machine

```text
PENDING_REVIEW ──→ PENDING_LAWYER_CONFIRMATION ──→ CONFIRMED ──→ UPCOMING ──→ REMINDER_SENT ──→ COMPLETED ──→ ARCHIVED
       │                    │                          │             │               │                  │
       └──→ CANCELLED ──→ ARCHIVED                    └──→ CANCELLED / RESCHEDULED   └──→ CANCELLED    └──→ (terminal)
                                                  RESCHEDULED ──→ CONFIRMED / CANCELLED
                                                  REJECTED ──→ ARCHIVED
```

Source of truth: `validTransitions` in `backend/src/modules/appointments/appointments.service.ts`. `ARCHIVED` is terminal.

## Error Responses

| Status | When |
|--------|------|
| 400 | Validation failure; invalid status transition |
| 401 / 403 | Missing/invalid credentials or role |
| 404 | Appointment not found (or soft-deleted) |
| 409 | Time slot already booked |

## Known Conventions & Caveats

- `practiceArea` (create endpoint and chatbot lead) has **no database column**; the service prefixes it to the description using the `[Practice Area] …` convention. The `/book` form additionally embeds `[Mode: IN_PERSON|VIDEO_CALL]`.
- `preferredTime` conflicts are exact-match on the `HH:MM` string within the same calendar day.
- The public create endpoint is unauthenticated by design (public booking form); it creates/links client records by email.

## References

- `backend/src/modules/appointments/appointments.controller.ts`
- `backend/src/modules/appointments/appointments.service.ts`
- `backend/src/modules/appointments/dto/`
- `backend/src/modules/chatbot/` — chatbot path into this API
- `frontend/src/lib/api/client.ts` — frontend client (status actions map onto `PUT /:id/status`)
- [09-Chatbot/Booking-Flow.md](../09-Chatbot/Booking-Flow.md) · [07-Modules/Appointment-System.md](../07-Modules/Appointment-System.md) · [REST.md](REST.md)
