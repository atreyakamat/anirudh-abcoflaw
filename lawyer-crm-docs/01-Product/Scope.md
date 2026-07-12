# Scope

**Document ID:** DOC-SCOPE-001

**Project:** Law Practice CRM & Consultation Automation Platform

**Version:** 1.0

**Status:** Draft

**Last Updated:** YYYY-MM-DD

**Author:** Product Team

---

# Purpose

The purpose of this document is to clearly define the boundaries of the Law Practice CRM & Consultation Automation Platform.

A software project without a clearly defined scope often grows beyond its original intent, leading to delays, increased costs, changing priorities, and uncertainty during development. This document establishes what will be included in Version 1 of the platform, what will intentionally be excluded, and what has been planned for future releases.

The scope described here acts as a reference point for the client, designers, developers, testers, and future contributors. Any feature that falls outside this document should be treated as a change request or considered for a future version unless formally approved.

This document should be read alongside:

- PRD.md
- Business-Goals.md
- Assumptions.md
- Functional-Requirements.md
- Roadmap.md

---

# Project Overview

The Law Practice CRM & Consultation Automation Platform is a modern web-based application designed specifically for a **single law practice**.

The objective is not simply to build a website, but to build a complete digital ecosystem that manages every stage of the consultation journey—from the moment a potential client visits the website until the consultation is completed and archived.

The platform combines a professional public-facing website with an internal administration dashboard, an appointment scheduling engine, automation workflows, a chatbot, and a lightweight client portal.

Every component is connected through a centralized backend so that all users interact with a single source of truth.

The system is intentionally designed to reduce repetitive administrative work, improve communication, and create a seamless experience for both the lawyer and the client.

---

# Project Vision

Version 1 focuses on solving one problem exceptionally well:

> "Allow a lawyer to efficiently manage consultations while providing a smooth and professional experience for clients."

Rather than attempting to become a complete legal case management system from day one, this project focuses on building a strong operational foundation that can be expanded over time.

Future features such as case management, AI assistants, online payments, document vaults, and mobile applications have already been considered during the architectural design, but they are intentionally excluded from Version 1 to maintain development focus.

---

# Product Scope

Version 1 of the platform consists of the following major modules.

## Public Website

The platform will include a modern, responsive, SEO-optimized website representing the lawyer and the legal practice.

The website is intended to establish trust, provide information, educate prospective clients, and encourage consultation bookings.

The public website will include the following pages:

- Home
- About
- Practice Areas
- Blog
- Blog Details
- FAQs
- Testimonials
- Contact
- Consultation Booking
- Privacy Policy
- Terms & Conditions
- 404 Page

Every page must be mobile responsive and optimized for search engines.

---

## Consultation Booking System

The consultation booking module is the core feature of the platform.

Clients will be able to request consultations using two different methods:

### Method 1

Traditional consultation booking form.

### Method 2

AI-powered conversational chatbot.

Regardless of which method is used, every inquiry follows exactly the same workflow and is stored within the same database.

The system will collect:

- Full Name
- Mobile Number
- Email Address
- Preferred Date
- Preferred Time
- Brief Description
- Document Upload (Optional)

Once submitted, the inquiry enters the appointment workflow.

---

## Appointment Management

The platform will provide a complete appointment lifecycle.

Appointments are not automatically confirmed.

Instead, they pass through multiple stages of validation and approval.

The lifecycle includes:

- Inquiry Submitted
- Pending Review
- Pending Lawyer Confirmation
- Lawyer Accepted
- Lawyer Suggested New Time
- Lawyer Rejected
- Waiting Client Confirmation
- Confirmed
- Upcoming
- Reminder Sent
- Checked In
- Completed
- Follow-up
- Archived

Every transition between these states is recorded in the audit trail.

---

## WhatsApp Automation

The system will integrate with WAHA to automate communication between the lawyer, receptionist, and clients.

Examples include:

- Inquiry acknowledgment
- Lawyer confirmation request
- Appointment confirmation
- Appointment reminders
- Reschedule notifications
- Cancellation notifications

The backend remains the source of truth, while n8n orchestrates these communication workflows.

---

## Telegram Integration

Telegram is included exclusively as a testing and demonstration environment.

It allows the automation workflows to be validated without relying on production WhatsApp messaging.

Telegram functionality is not part of the production client experience.

---

## Receptionist Dashboard

The receptionist serves as the operational administrator of the platform.

The dashboard provides access to:

- Appointment management
- Client records
- Calendar
- Payment recording
- Blog management
- FAQ management
- Website content
- Notifications
- Analytics
- Audit logs
- Manual workflow overrides

The receptionist has full operational control but cannot modify core system configurations that require development changes.

---

## Lawyer Workspace

The lawyer interacts with the platform primarily through WhatsApp and a lightweight dashboard.

The lawyer can:

- View upcoming appointments
- Update availability
- Accept consultations
- Reject consultations
- Suggest alternate timings
- Publish blogs
- Add consultation notes
- Manage working hours

The lawyer's interactions automatically synchronize with the backend database.

---

## Client Portal

Clients receive limited authenticated access to the platform.

The portal allows them to:

- View upcoming appointments
- View appointment history
- Request rescheduling
- Cancel eligible appointments
- View uploaded documents (where permitted)
- Track appointment status

Clients cannot edit completed appointments or access internal notes.

---

## Blog Management System

The platform includes a lightweight content management system that enables the lawyer to publish legal articles.

Features include:

- Rich text editor
- Drafts
- Scheduled publishing
- Categories
- Tags
- SEO metadata
- Featured images
- Search
- Related articles

The blog serves both educational and marketing purposes.

---

## AI Chatbot

The chatbot is intentionally designed with a narrow and focused scope.

Its responsibilities include:

- Greeting visitors
- Answering predefined FAQs
- Guiding consultation bookings
- Asking qualifying questions
- Recommending that a consultation be booked where appropriate

The chatbot **does not provide legal advice**.

The architecture will support future integration with NVIDIA NIM or other AI models without redesigning the system.

---

## Analytics Dashboard

The platform provides operational insights including:

- Total inquiries
- Confirmed appointments
- Appointment completion rate
- Cancellation rate
- Reminder delivery statistics
- Blog performance
- Chatbot usage
- Website conversion metrics

These metrics help evaluate business performance over time.

---

# Explicitly Out of Scope

To ensure Version 1 remains focused and achievable, the following capabilities are intentionally excluded.

## Online Payments

Payments are recorded manually.

The platform will not process payments through payment gateways during Version 1.

---

## Case Management

The platform is not a legal case management system.

Legal files, hearings, litigation workflows, and case tracking are reserved for future phases.

---

## Video Consultation

Online meetings using Zoom, Google Meet, or Microsoft Teams are excluded from Version 1.

---

## Mobile Applications

Native Android and iOS applications are outside the scope of the first release.

The responsive web application will serve all users.

---

## AI Legal Advice

The chatbot will never provide legal advice.

Only the lawyer is responsible for legal opinions and consultation outcomes.

---

# Scope Boundaries

Every new feature request should be evaluated using the following questions:

1. Does it contribute directly to consultation management?
2. Does it improve client communication?
3. Does it reduce receptionist workload?
4. Can it be implemented without delaying the MVP?

If the answer is **No**, the feature should generally be scheduled for a future phase.

---

# Success Criteria

Version 1 will be considered successful when:

- Clients can book consultations without manual intervention.
- Lawyers can confirm appointments through WhatsApp.
- Receptionists can manage appointments from a centralized dashboard.
- Every workflow is synchronized with the database.
- The website presents a professional online presence.
- The blog can be independently managed.
- All major actions are recorded through audit logs.
- The platform is stable, secure, and production-ready.

---

# Scope Review

The scope defined in this document should be reviewed at the completion of each major milestone.

Changes to project scope must be documented, reviewed, approved, and reflected across the PRD, Functional Requirements, Architecture, and Roadmap documents.

---

# Approval

| Role | Name | Status |
|------|------|--------|
| Product Owner | TBD | Pending |
| Lawyer | TBD | Pending |
| Receptionist | TBD | Pending |
| Development Team | TBD | Pending |

---