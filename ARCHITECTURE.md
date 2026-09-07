# Supervisor Onboarding & Architecture Guide

Welcome to the **AB & Co. Legal CRM** project. This document serves as the onboarding guide and architectural blueprint for the engineering team and supervisors. It explains how our core technologies interact, our database strategy, and our automation pipeline.

---

## 1. High-Level Architecture

The system is a unified monorepo consisting of a public landing page, a client portal, an admin dashboard, and an automation layer.

- **Frontend:** Next.js 15 (React), Tailwind CSS v4, shadcn/ui.
- **Backend:** NestJS, Prisma ORM, PostgreSQL (Supabase).
- **Automation (n8n):** Workflow engine connecting our database to WhatsApp/Telegram via WAHA.
- **Authentication (Firebase):** Google SSO for client portals.

---

## 2. Database Strategy (Supabase vs Firebase)

We use a hybrid approach to get the best of both worlds, heavily prioritizing standard SQL for our core data.

### **Primary Database: Supabase (PostgreSQL)**
Supabase serves as our primary operational database. 
- **Why Supabase?** Our backend uses Prisma ORM, which thrives on relational SQL databases. Supabase provides a managed, ultra-fast PostgreSQL instance.
- **What is stored here?** Everything essential: Users (Internal Staff), Appointments, Blogs, Invoices, Client details, and Audit Logs.
- **n8n Synergy:** n8n has built-in, flawless PostgreSQL nodes. It can query our Supabase database directly (e.g., "Find all appointments for tomorrow") without passing through complex APIs.

### **Authentication Layer: Firebase**
We do not use Firebase for data storage (Firestore).
- **What is it used for?** Firebase is strictly used for the `Auth` module on the frontend, specifically for providing seamless **Google Sign-in** for external clients. 
- **Internal Staff:** Internal staff (admin, lawyers) authenticate via traditional Email/Password, which is validated directly against our Supabase PostgreSQL database using NestJS JWTs.

---

## 3. Automation & Bot Architecture (n8n & Telegram/WhatsApp)

Our goal is to act as a highly responsive digital assistant for booking and inquiries.

### The Flow:
1. **The Trigger:** A client messages the firm's Telegram Bot or WhatsApp number.
2. **The Listener (n8n):** n8n listens for incoming webhooks from Telegram/WAHA.
3. **The Processor:** 
   - n8n receives the message.
   - n8n queries **Supabase** to check the lawyer's availability or the client's existing records.
   - n8n formulates a response (or connects to an LLM node to generate a conversational reply).
4. **The Action:** n8n triggers an API call back to Telegram/WhatsApp to reply to the user.
5. **The Booking:** If the client confirms a time, n8n writes the appointment directly into the Supabase `Appointment` table and sends an email confirmation.

---

## 4. Local Development Ecosystem

To mimic the production environment locally, we run the frontend, backend, and n8n simultaneously. 

We have created a `start-all.bat` script in the root directory. When you run this script:
1. It opens a terminal running the NestJS Backend (`http://localhost:3001`).
2. It opens a terminal running the Next.js Frontend (`http://localhost:3000`).
3. It opens a terminal running n8n (`http://localhost:5678`).

*Note: Ensure you have `npx` installed globally and Docker running if you are running local instances of WAHA.*
