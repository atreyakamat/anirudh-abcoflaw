# Constraints

**Document ID:** DOC-CONSTRAINTS-001

**Project:** Law Practice CRM & Consultation Automation Platform

**Version:** 1.0

**Status:** Draft

**Last Updated:** YYYY-MM-DD

**Author:** Product Team

---

# Purpose

Every software project operates within a set of constraints. These constraints define the practical limitations that influence the project's architecture, technology choices, business processes, deployment strategy, timeline, and operational capabilities.

Rather than being viewed as obstacles, constraints help establish realistic expectations and guide technical decisions throughout the development lifecycle.

This document identifies all known constraints for Version 1 of the Law Practice CRM & Consultation Automation Platform.

Understanding these constraints ensures that the platform remains maintainable, scalable, secure, and aligned with the business objectives defined in the Product Requirements Document.

This document should be reviewed whenever new features are proposed, infrastructure changes are planned, or major architectural decisions are introduced.

---

# Constraint Categories

This document is divided into the following categories:

- Business Constraints
- Product Constraints
- Technical Constraints
- Infrastructure Constraints
- Authentication Constraints
- Automation Constraints
- WhatsApp Constraints
- Chatbot Constraints
- Client Constraints
- Security Constraints
- Legal Constraints
- Performance Constraints
- Operational Constraints
- Scalability Constraints
- Future Constraints

---

# Business Constraints

---

## CON-001

### Single Practice

The platform is designed exclusively for one lawyer and one legal practice.

The scheduling engine, dashboard, automation workflows, analytics, and permissions are all optimized for a single-practice environment.

Supporting multiple lawyers or multiple firms is intentionally outside the scope of Version 1.

Although the architecture should remain modular enough to support future expansion, no multi-tenancy logic should be introduced at this stage.

Priority

Critical

---

## CON-002

### Fixed Consultation Duration

Version 1 assumes that every consultation lasts thirty minutes.

This duration is configurable through the application settings, but appointments with different durations are not supported during the initial release.

Reason

Maintaining a fixed duration simplifies:

- Scheduling
- Calendar management
- Availability calculations
- Reminder workflows
- Conflict detection

---

## CON-003

### Manual Payment Recording

Payments are recorded manually by the receptionist.

The platform does not integrate with online payment gateways during Version 1.

Accepted payment methods include:

- Cash
- GPay
- Bank Transfer

Online payment processing is reserved for a future phase.

---

# Product Constraints

---

## CON-004

### Limited Client Portal

The client portal is intentionally lightweight.

Clients may:

- View appointments
- View appointment history
- Update profile
- Request rescheduling
- Cancel appointments

Clients cannot:

- Modify completed consultations
- Access lawyer notes
- Manage blog content
- View internal analytics

---

## CON-005

### Blog Ownership

The lawyer is the primary content owner.

The receptionist may publish or edit content only if granted permission.

Version 1 does not include:

- Multiple authors
- Editorial workflow
- Content approval process

---

# Technical Constraints

---

## CON-006

### Technology Stack

The project is constrained to the following technologies:

Frontend

- Next.js
- React
- Tailwind CSS
- TypeScript
- shadcn/ui

Backend

- NestJS

Database

- PostgreSQL

ORM

- Prisma

Authentication

- Firebase Authentication

Automation

- n8n

WhatsApp

- WAHA

Any change to the core stack requires architectural review.

---

## CON-007

### Single Source of Truth

The PostgreSQL database is the authoritative source of all business data.

No workflow, chatbot, WhatsApp message, or external service may become the primary source of business state.

All state changes must originate from the backend before external systems are updated.

---

# Infrastructure Constraints

---

## CON-008

### Self Hosted Deployment

Version 1 will be deployed on a self-hosted VPS or KVM environment.

Cloud-native services should not become mandatory dependencies.

The application must remain deployable using Docker Compose.

---

## CON-009

### Containerized Services

Every major component should run inside Docker containers.

Examples include:

- Backend
- Frontend
- PostgreSQL
- n8n
- WAHA
- Nginx Proxy Manager
- Uptime Kuma

This ensures consistent deployments across development, staging, and production environments.

---

# Authentication Constraints

---

## CON-010

### Firebase Authentication

Firebase Authentication is responsible only for identity verification.

Authorization logic, roles, and permissions remain under backend control.

The backend must never rely solely on the frontend for access control.

---

# Automation Constraints

---

## CON-011

### n8n Responsibility

n8n orchestrates workflows.

Business rules must remain inside the backend.

This separation ensures that replacing or upgrading the automation engine does not require rewriting business logic.

---

## CON-012

### Retry Strategy

External communication failures must never silently discard data.

Retries, logging, and administrator notifications are mandatory.

---

# WhatsApp Constraints

---

## CON-013

### WAHA Dependency

The platform depends on WAHA for WhatsApp communication.

Potential limitations include:

- Network interruptions
- WhatsApp Web session expiration
- Rate limits
- Device disconnection

The system must gracefully recover from these conditions.

---

## CON-014

### WhatsApp is a Communication Layer

WhatsApp messages are notifications only.

Receiving or sending a message does not itself modify appointment state.

Only validated backend actions may update the database.

---

# Chatbot Constraints

---

## CON-015

### No Legal Advice

The chatbot must never generate legal opinions or recommendations.

Its responsibilities are limited to:

- FAQs
- Consultation booking
- Qualifying questions
- Appointment assistance

All legal advice must come directly from the lawyer.

---

## CON-016

### Controlled AI Responses

Future AI integrations must operate within predefined guardrails.

Responses should prioritize factual information, transparency, and safe escalation to the lawyer where appropriate.

---

# File Upload Constraints

---

## CON-017

Allowed file types:

- PDF
- DOCX
- JPG
- JPEG
- PNG

Maximum upload size:

10 MB

Unsupported files should be rejected before upload.

---

# Performance Constraints

---

## CON-018

The platform should remain responsive under normal office usage.

Performance targets include:

- Initial page load under 2 seconds
- Dashboard interactions under 500 ms
- Appointment searches under 300 ms
- API responses under 500 ms

These targets assume recommended hosting specifications.

---

# Security Constraints

---

## CON-019

All authenticated routes require server-side authorization.

Client-side checks alone are insufficient.

Every sensitive operation must verify:

- User identity
- User role
- Resource ownership
- Business rules

---

## CON-020

Every critical system action must generate an immutable audit log.

Audit records include:

- User
- Timestamp
- Previous value
- New value
- Source
- Reason

Audit records cannot be edited or deleted through the application.

---

# Operational Constraints

---

## CON-021

Internet connectivity is required for:

- WhatsApp messaging
- Firebase Authentication
- Automation workflows

Limited offline functionality may be considered in future versions.

---

## CON-022

The receptionist remains responsible for handling exceptional scenarios such as:

- Lawyer unavailability
- Emergency cancellations
- Manual overrides
- Payment verification

Automation should assist—not replace—human decision-making.

---

# Scalability Constraints

---

## CON-023

Version 1 prioritizes simplicity over horizontal scalability.

The system should nevertheless follow modular architecture principles so that future enhancements can be introduced without significant redesign.

---

# Future Constraints

---

## CON-024

The following capabilities are intentionally deferred:

- Online payment gateway integration
- Case management
- Multi-lawyer scheduling
- Native mobile applications
- Video consultations
- AI-generated legal advice

These items will be evaluated in future phases based on business needs.

---

# Summary

The constraints documented in this file define the operational and technical boundaries of Version 1.

Any proposed feature, architectural decision, or infrastructure change should be evaluated against these constraints before implementation.

When a constraint changes, all dependent documents—including the PRD, Architecture, Database Design, and Automation Specification—must be reviewed to ensure consistency.

---

# Related Documents

- PRD.md
- Scope.md
- Business-Goals.md
- Assumptions.md
- Risks.md
- System-Architecture.md
- Security.md
- Deployment.md

---

# Approval

| Role | Name | Status |
|------|------|--------|
| Product Owner | TBD | Pending |
| Lawyer | TBD | Pending |
| Receptionist | TBD | Pending |
| Development Team | TBD | Pending |
