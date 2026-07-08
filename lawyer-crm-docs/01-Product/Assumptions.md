# Assumptions

**Document ID:** DOC-ASSUMPTIONS-001

**Project:** Law Practice CRM & Consultation Automation Platform

**Version:** 1.0

**Status:** Draft

**Last Updated:** YYYY-MM-DD

**Author:** Product Team

---

# Purpose

This document captures all assumptions made during the planning, design, development, deployment, and future evolution of the Law Practice CRM & Consultation Automation Platform.

These assumptions act as the foundation for all business, technical, architectural, and operational decisions throughout the project lifecycle.

Any assumption that becomes invalid during development must be reviewed and updated across all related documentation.

This document should be read together with:

- PRD.md
- Scope.md
- Business-Goals.md
- Functional-Requirements.md
- System-Architecture.md
- Database-Overview.md

---

# Assumption Categories

The assumptions are grouped into the following categories:

- Business Assumptions
- User Assumptions
- Operational Assumptions
- Technical Assumptions
- Infrastructure Assumptions
- Security Assumptions
- Automation Assumptions
- Website Assumptions
- Chatbot Assumptions
- Appointment Assumptions
- Notification Assumptions
- Client Portal Assumptions
- Blog CMS Assumptions
- Analytics Assumptions
- Future Scalability Assumptions

---

# Business Assumptions

## ASS-001

### Title

Single Lawyer Practice

### Description

The platform is designed specifically for a single lawyer and a single law office.

There will only be one lawyer actively accepting appointments during Version 1.

No multi-lawyer scheduling logic is required.

Future expansion may allow additional lawyers without major architectural changes.

Priority

Critical

---

## ASS-002

Receptionist manages operations

The receptionist acts as the primary administrator of the platform.

Responsibilities include:

- Managing appointments
- Updating bookings
- Approving scheduling changes
- Managing blogs
- Managing FAQs
- Updating website information
- Recording payments
- Viewing analytics

Priority

Critical

---

## ASS-003

Clients interact digitally

Clients will primarily interact through

- Website
- Chatbot
- WhatsApp

Phone calls remain outside the system.

---

## ASS-004

Consultation duration

Default consultation duration

30 Minutes

The duration must remain configurable from the Settings module.

Future versions may support variable durations.

---

## ASS-005

Offline payments

Payments are not processed online.

The lawyer accepts

- Cash
- GPay
- Bank Transfer

The receptionist manually records payment status.

---

# User Assumptions

## ASS-006

Lawyer has WhatsApp

The lawyer owns a WhatsApp number connected through WAHA.

The lawyer regularly checks WhatsApp.

Appointment confirmation relies on WhatsApp communication.

---

## ASS-007

Clients have WhatsApp

Clients are expected to have a WhatsApp number.

WhatsApp is the primary notification channel.

SMS is not supported during Version 1.

---

## ASS-008

Clients provide accurate information

Clients are responsible for entering:

- Name
- Mobile Number
- Email
- Appointment details

Incorrect information may prevent successful communication.

---

## ASS-009

Receptionist has desktop access

The receptionist primarily uses

Desktop

Laptop

Tablet support is secondary.

---

# Appointment Assumptions

## ASS-010

Appointments require approval

Every appointment request requires lawyer confirmation.

Appointments are never automatically confirmed.

---

## ASS-011

Preferred time

Clients request a preferred slot.

Availability is verified before confirmation.

The requested slot is not guaranteed.

---

## ASS-012

Double booking prevention

Only one confirmed appointment can occupy a single consultation slot.

Slot locking must prevent race conditions.

---

## ASS-013

Manual override

Receptionists can override any appointment.

Every override must create an audit log.

Automation must synchronize with manual changes.

---

## ASS-014

Appointment lifecycle

Appointments follow predefined workflow states.

No state may be skipped without administrative action.

---

# Website Assumptions

## ASS-015

Responsive design

The website supports

Desktop

Tablet

Mobile

Responsive behaviour is mandatory.

---

## ASS-016

SEO Ready

All public pages must be optimized for search engines.

Every blog supports

- Meta Title
- Meta Description
- Canonical URL
- Open Graph Metadata

---

## ASS-017

Website uptime

Target availability

99%

Downtime should be minimized.

---

# Chatbot Assumptions

## ASS-018

Chatbot Scope

The chatbot only

- Answers FAQs
- Books consultations
- Collects qualifying information

Legal advice is never provided.

---

## ASS-019

Future AI

The chatbot architecture must support future integration with

NVIDIA NIM

OpenAI

Gemini

Local LLMs

without redesigning the platform.

---

# Blog Assumptions

## ASS-020

Lawyer authored content

Blogs are written by the lawyer.

Receptionist may publish or edit when authorized.

---

## ASS-021

SEO importance

The blog contributes significantly to

- SEO
- Organic traffic
- Legal education
- Client acquisition

---

# Automation Assumptions

## ASS-022

Automation engine

n8n is responsible only for orchestration.

Business rules remain inside the backend.

The backend is always the source of truth.

---

## ASS-023

WAHA

WAHA provides WhatsApp communication.

If WAHA is unavailable

Automation retries.

Failures are logged.

Administrators are notified.

---

## ASS-024

Telegram

Telegram is used exclusively during development and testing.

Production communication occurs through WhatsApp.

---

# Security Assumptions

## ASS-025

Firebase Authentication

Authentication is managed using Firebase Authentication.

Authorization is managed inside the backend.

---

## ASS-026

Role Based Access

Roles

Receptionist

Lawyer

Client

Permissions are enforced server-side.

---

## ASS-027

Audit logs

Every critical action creates an immutable audit record.

Audit logs are never editable.

---

# File Upload Assumptions

## ASS-028

Allowed file formats

- PDF

- DOCX

- JPG

- JPEG

- PNG

Maximum upload size

10 MB

---

## ASS-029

Storage

Development

Local Storage

Production

Cloud object storage

---

# Infrastructure Assumptions

## ASS-030

Deployment

The application is deployed on a self-hosted VPS/KVM environment.

---

## ASS-031

Containers

All services are containerized using Docker Compose.

---

## ASS-032

Monitoring

Infrastructure monitoring is handled through

Uptime Kuma

Application logging

Backend logs

n8n execution logs

---

# Analytics Assumptions

## ASS-033

Metrics

The platform collects

Appointment statistics

Conversion rates

Reminder statistics

Blog engagement

Chatbot usage

Payment records

---

# Client Portal Assumptions

## ASS-034

Client Access

Clients may

View appointments

View history

Request rescheduling

Cancel appointments

Update profile

Clients cannot modify completed consultations.

---

# Future Assumptions

## ASS-035

Case Management

Future versions may introduce complete case management.

Version 1 does not manage legal cases.

---

## ASS-036

Video Consultation

Future support for

Google Meet

Zoom

Microsoft Teams

---

## ASS-037

Online Payments

Future versions may integrate

Razorpay

Stripe

without affecting existing appointment workflows.

---

## ASS-038

AI Assistant

Future AI modules may

Summarize appointments

Draft blogs

Answer FAQs

Analyze appointment trends

Assist receptionist

without replacing lawyer decision-making.

---

# Summary

The assumptions documented here establish the operational and technical boundaries for Version 1 of the Law Practice CRM & Consultation Automation Platform.

Any change to these assumptions should trigger a review of the following documents:

- Product Requirements Document
- Functional Requirements
- Database Design
- API Specification
- Automation Specification
- Security Documentation
- UI/UX Documentation

---

# Approval

| Role | Name | Status |
|-------|------|--------|
| Product Owner | TBD | Pending |
| Lawyer | TBD | Pending |
| Receptionist | TBD | Pending |
| Development Team | TBD | Pending |