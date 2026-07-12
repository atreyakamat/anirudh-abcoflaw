# Project Context

> Single Source of Truth (SSOT)

---

| Project | Law Practice CRM & Consultation Automation Platform |
|----------|-----------------------------------------------------|
| Version | 1.0 |
| Status | Planning |
| Owner | TBD |
| Repository | lawyer-crm |
| Documentation Version | 1.0 |

---

# Introduction

The Law Practice CRM & Consultation Automation Platform is a modern, enterprise-grade software solution designed specifically for a single law practice.

The objective of the platform extends beyond creating a professional website. Instead, it aims to digitize the complete consultation lifecycle, improve communication between clients and the lawyer, reduce administrative workload, and establish a scalable technological foundation that can evolve into a comprehensive legal practice management platform.

Unlike traditional lawyer websites that simply present information and a contact form, this platform actively participates in the consultation workflow by coordinating appointment requests, automating communication, maintaining client records, and providing operational insights through a centralized administration dashboard.

The platform is intentionally designed as a **single-tenant application** for Version 1. While only one lawyer and one receptionist will actively use the system, the architecture is expected to remain modular and reusable so that future deployments for additional law firms can be achieved with minimal redevelopment.

---

# Product Philosophy

The software is built around one simple principle:

> Every interaction should reduce manual work while increasing transparency.

Technology should simplify the lawyer's day rather than introducing additional operational complexity.

Automation should assist human decision making rather than replacing it.

Every workflow should remain understandable, auditable, and recoverable.

Whenever uncertainty exists, the system should prioritize clarity over automation.

---

# Product Vision

To create a digital ecosystem that enables a lawyer to efficiently manage consultations, communicate with clients, maintain a professional online presence, and automate repetitive administrative work while preserving complete control over business operations.

The platform should become the central operating system of the law practice rather than simply acting as a marketing website.

---

# Mission Statement

The mission of this project is to modernize the client consultation experience without disrupting the lawyer's existing workflow.

The platform should:

- simplify appointment scheduling,
- improve client communication,
- eliminate repetitive administrative tasks,
- improve visibility into daily operations,
- establish a strong digital presence,
- create a scalable architecture for future expansion.

---

# Product Objectives

The project has six primary objectives.

## 1. Improve Client Experience

Prospective clients should be able to discover the lawyer online, understand the services offered, ask questions, and request consultations through a professional and intuitive interface.

Every interaction should inspire confidence and reduce friction.

---

## 2. Reduce Administrative Work

The receptionist should spend less time manually sending confirmations, updating appointments, maintaining spreadsheets, and coordinating schedules.

Automation should handle repetitive tasks while allowing manual intervention whenever required.

---

## 3. Centralize Information

All appointments, client details, uploaded documents, payment records, audit logs, blog articles, notifications, and workflow history should exist within a single centralized platform.

No operational information should be scattered across notebooks, spreadsheets, or messaging applications.

---

## 4. Improve Communication

Communication between the client, receptionist, and lawyer should remain consistent throughout the consultation lifecycle.

The system should automatically deliver notifications at the appropriate time while ensuring manual communication remains possible whenever exceptional situations arise.

---

## 5. Prepare for Future Expansion

Although Version 1 focuses on appointment management, the architecture should anticipate future additions such as:

- Case Management
- Online Payments
- AI Assistants
- Video Consultation
- Mobile Applications
- Multi-Lawyer Support
- Multi-Office Support

without requiring a complete architectural redesign.

---

## 6. Establish a Digital Brand

The website should become the primary digital identity of the law practice.

It should demonstrate professionalism, trustworthiness, and expertise while simultaneously acting as the primary channel for consultation requests.

---

# Target Audience

The platform serves three primary groups.

## Receptionist

The receptionist is the operational administrator of the platform.

Responsibilities include:

- managing appointments,
- reviewing inquiries,
- updating schedules,
- recording payments,
- managing blogs,
- updating FAQs,
- handling manual overrides,
- monitoring notifications,
- responding to operational exceptions.

---

## Lawyer

The lawyer is the service provider.

Primary responsibilities include:

- confirming appointments,
- updating availability,
- publishing blog articles,
- reviewing consultations,
- maintaining professional information.

The lawyer interacts with the system primarily through WhatsApp and a simplified dashboard.

---

## Client

The client is the consumer of legal consultation services.

The platform should allow clients to:

- learn about the lawyer,
- book consultations,
- receive confirmations,
- upload supporting documents,
- view appointment history,
- communicate efficiently with the practice.

The platform intentionally avoids exposing operational complexity to clients.

---

# Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Backend

- NestJS
- Prisma ORM
- PostgreSQL

---

## Authentication

Firebase Authentication

---

## Authorization

Role-Based Access Control

Roles:

- Receptionist
- Lawyer
- Client

---

## Automation

- n8n
- WAHA
- Telegram (Testing)

---

## Hosting

- VPS / KVM
- Docker Compose
- Portainer
- Nginx Proxy Manager
- Uptime Kuma

---

# Architectural Principles

The project follows several architectural principles.

## Single Source of Truth

The PostgreSQL database is the authoritative source of all business information.

External services such as WhatsApp, Telegram, chatbots, or automation engines must never independently modify business state.

---

## Backend Driven

Business logic belongs inside the backend.

The frontend displays information.

Automation orchestrates workflows.

Neither should contain critical business rules.

---

## Automation Assists Humans

Automation exists to reduce manual work.

Humans always retain final decision-making authority.

Receptionists can override automation.

Lawyers can override automation.

All overrides are recorded.

---

## Auditability

Every significant system action must be traceable.

Every modification should answer:

- Who performed the action?
- When was it performed?
- What changed?
- Why was it changed?
- Which workflow initiated the change?

---

## Security by Default

Every authenticated request must be verified.

Every sensitive operation requires authorization.

Every uploaded document must remain private unless explicitly shared.

---

## Simplicity First

Whenever multiple implementation approaches exist, preference should be given to the solution that is easiest to understand, maintain, and extend.

Complexity should only be introduced when justified by measurable business value.

---

# Repository Structure

This repository contains documentation covering:

- Product Management
- Functional Requirements
- Architecture
- Database Design
- Backend Design
- Frontend Design
- UI/UX
- Automation
- Chatbot
- APIs
- Testing
- Operations
- Future Roadmap

Each document is intended to be independently readable while contributing to the overall documentation ecosystem.

---

# Guiding Principle

> "Build Version 1 as if it will become Version 10."

Every decision made during planning should minimize technical debt, maximize maintainability, and prepare the platform for future evolution without sacrificing the simplicity required for the initial release.

---

# Revision History

| Version | Date | Author | Description |
|----------|------|--------|-------------|
| 1.0 | YYYY-MM-DD | Product Team | Initial project context document |
