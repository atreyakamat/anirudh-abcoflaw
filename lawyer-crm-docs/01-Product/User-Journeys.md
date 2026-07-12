````md
# User Journeys

> Document ID: DOC-USER-JOURNEYS-001

| Property | Value |
|----------|-------|
| Project | Law Practice CRM & Consultation Automation Platform |
| Version | 1.0 |
| Status | Draft |
| Owner | Product Team |
| Last Updated | YYYY-MM-DD |

---

# Purpose

This document defines every major journey a user can take while interacting with the Law Practice CRM & Consultation Automation Platform.

A user journey is more than a sequence of screens. It represents the complete experience of a user from the moment they begin an interaction until they achieve their objective. Each journey documents the user's intentions, actions, emotions, decisions, system responses, potential failure points, and expected outcomes.

Understanding user journeys allows designers to build intuitive interfaces, developers to understand workflow dependencies, testers to create realistic scenarios, and stakeholders to validate that the platform satisfies business goals.

Every feature developed for the platform should support one or more of the journeys described in this document.

---

# Journey Overview

The platform currently supports the following primary journeys.

| Journey ID | Journey | Primary Persona |
|------------|---------|-----------------|
| UJ-001 | Client Books Consultation via Website | Client |
| UJ-002 | Client Books Consultation via Chatbot | Client |
| UJ-003 | Receptionist Reviews Inquiry | Receptionist |
| UJ-004 | Lawyer Reviews Appointment | Lawyer |
| UJ-005 | Appointment Confirmation Workflow | Lawyer & Client |
| UJ-006 | Client Reschedules Appointment | Client |
| UJ-007 | Lawyer Changes Availability | Lawyer |
| UJ-008 | Receptionist Manually Overrides Appointment | Receptionist |
| UJ-009 | Consultation Completion | Lawyer |
| UJ-010 | Blog Publishing Workflow | Lawyer |
| UJ-011 | Payment Recording Workflow | Receptionist |
| UJ-012 | Client Portal Journey | Client |

---

# Journey UJ-001

# Client Books Consultation Through Website

## Objective

Allow a prospective client to request a legal consultation using the public website.

---

## Persona

Client

---

## Trigger

The client visits the lawyer's website and decides to book a consultation.

---

## Preconditions

- Website is online.
- Booking page is accessible.
- Consultation slots exist.
- Backend services are operational.

---

## Main Flow

1. Client visits the Home page.

2. Client reads information about the lawyer.

3. Client reviews services.

4. Client decides to schedule a consultation.

5. Client opens the consultation booking page.

6. Client fills in:

- Name
- Phone Number
- Email
- Preferred Date
- Preferred Time
- Short Description
- Optional Document Upload

7. Client submits the inquiry.

8. System validates the information.

9. Database stores the inquiry.

10. Appointment enters "Pending Review."

11. n8n workflow begins.

12. Lawyer receives WhatsApp notification.

13. Client receives acknowledgment.

---

## Success Outcome

The client receives confirmation that the inquiry has been successfully submitted and is awaiting lawyer approval.

---

## Failure Scenarios

- Invalid phone number.
- Missing required fields.
- File upload exceeds size limit.
- Backend unavailable.
- Duplicate appointment request.

---

## Business Rules

- Appointments are never automatically confirmed.
- Lawyer approval is mandatory.
- Every inquiry generates an audit log.
- Every inquiry receives a unique reference number.

---

# Journey UJ-002

# Client Books Consultation Using Chatbot

## Objective

Allow visitors to schedule consultations through an AI-powered chatbot.

---

## Flow

1. Visitor opens chatbot.

2. Chatbot greets visitor.

3. Chatbot answers FAQs.

4. Chatbot determines user intent.

5. User requests consultation.

6. Chatbot asks qualifying questions.

7. Chatbot collects booking information.

8. Chatbot validates responses.

9. Backend stores inquiry.

10. Same appointment workflow begins.

---

## Notes

The chatbot never provides legal advice.

Its role is limited to:

- FAQs
- Qualification
- Booking
- Guidance

---

# Journey UJ-003

# Receptionist Reviews New Inquiry

## Objective

Allow the receptionist to review incoming consultation requests before further processing.

---

## Flow

1. Dashboard notification appears.

2. Receptionist opens inquiry.

3. Reviews client information.

4. Reviews uploaded documents.

5. Reviews requested appointment.

6. Validates completeness.

7. Forwards request to lawyer.

---

## Alternate Flow

Receptionist requests additional information from the client before forwarding.

---

# Journey UJ-004

# Lawyer Reviews Appointment

## Objective

Allow the lawyer to make a decision regarding a consultation request.

---

## Flow

1. Lawyer receives WhatsApp message.

2. Message contains appointment summary.

3. Lawyer chooses:

- Confirm
- Reject
- Suggest New Time

4. Backend updates appointment state.

5. Receptionist receives notification.

6. Client receives updated status.

---

## Business Rules

Lawyer decisions always take priority over automation.

---

# Journey UJ-005

# Appointment Confirmation

## Flow

Client

↓

Booking Request

↓

Receptionist Review

↓

Lawyer Review

↓

Confirmed

↓

Reminder Scheduled

↓

Consultation

↓

Completed

↓

Archived

---

## Notifications

Client receives:

- Confirmation
- Reminder
- Reschedule updates
- Cancellation updates

---

# Journey UJ-006

# Client Requests Reschedule

## Flow

Client

↓

Portal

↓

Request New Time

↓

Receptionist Review

↓

Lawyer Approval

↓

Updated Appointment

↓

Client Notification

---

## Rules

- Completed appointments cannot be rescheduled.
- Requests are logged.
- Old appointment history remains visible.

---

# Journey UJ-007

# Lawyer Changes Availability

## Flow

Lawyer

↓

WhatsApp

↓

"Unavailable Tomorrow"

↓

Backend

↓

Calendar Updated

↓

Affected Appointments Detected

↓

Receptionist Notified

↓

Clients Notified

---

# Journey UJ-008

# Receptionist Manual Override

Automation is designed to assist operations—not replace human judgment.

The receptionist may override:

- Appointment Status
- Date
- Time
- Client Notes
- Payment Status

Every override requires:

- Reason
- Timestamp
- User
- Audit Log

---

# Journey UJ-009

# Consultation Completion

After consultation:

Lawyer

↓

Open Dashboard

↓

Appointment

↓

Completed

↓

Private Notes

↓

Follow-up Date (Optional)

↓

Archive

↓

Analytics Updated

---

# Journey UJ-010

# Blog Publishing

Lawyer

↓

Create Draft

↓

Rich Editor

↓

SEO Metadata

↓

Preview

↓

Publish

↓

Website Updated

↓

Search Index Updated

---

# Journey UJ-011

# Payment Recording

Receptionist

↓

Appointment

↓

Payment Section

↓

Choose Method

↓

Enter Amount

↓

Reference Number

↓

Save

↓

Receipt Generated

↓

Audit Log

---

# Journey UJ-012

# Client Portal

Client Login

↓

Dashboard

↓

Upcoming Appointment

↓

Appointment History

↓

Documents

↓

Profile

↓

Reschedule

↓

Logout

---

# Journey Success Metrics

The following KPIs measure the effectiveness of user journeys.

| Journey | KPI |
|----------|-----|
| Website Booking | Inquiry Completion Rate |
| Chatbot | Conversation Completion Rate |
| Appointment | Confirmation Time |
| Portal | Login Frequency |
| Blog | Article Views |
| Payment | Recording Accuracy |

---

# Journey Design Principles

Every journey within the platform should satisfy the following principles.

## Simplicity

Users should never be required to perform unnecessary actions.

---

## Transparency

The system should always communicate:

- Current Status
- Next Step
- Expected Outcome

---

## Recoverability

Mistakes should be recoverable.

Examples include:

- Undo
- Retry
- Manual Override
- Validation Messages

---

## Accessibility

All journeys should remain usable across:

- Desktop
- Tablet
- Mobile

---

## Security

Sensitive actions should always require authentication and authorization.

---

## Performance

The system should respond quickly enough that users never feel uncertain about whether an action has succeeded.

---

# Journey Dependencies

These journeys depend on:

- Authentication
- Appointment Engine
- Calendar Module
- Notification Engine
- WAHA
- n8n
- PostgreSQL
- Dashboard
- Client Portal

---

# Related Documents

- Personas.md
- Functional-Requirements.md
- Business-Rules.md
- State-Machines.md
- Appointment-System.md
- Chatbot-Overview.md
- Notifications.md
- APIs.md

---

# Approval

| Role | Name | Status |
|------|------|--------|
| Product Owner | TBD | Pending |
| Lawyer | TBD | Pending |
| Receptionist | TBD | Pending |
| Development Team | TBD | Pending |

```
````
