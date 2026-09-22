🌾 KisanSetu
Smart Farmer Procurement & Queue Management Platform

KisanSetu is a digital platform designed to simplify the agricultural procurement process by connecting farmers, procurement centres, officers, and authorities through a single system.

The platform helps farmers book procurement slots, track their queue and token, monitor procurement status, receive payment updates, and access important notifications. It also provides dedicated dashboards for officers and authorities to manage the complete procurement workflow.

🎯 Problem Statement

Traditional agricultural procurement can involve:

Long waiting times at procurement centres
Unorganized queues
Unclear token and slot information
Difficulty tracking procurement status
Lack of transparency in procurement prices
Delayed payment updates
Difficulties for farmers using complex digital systems
Poor connectivity in some rural areas

KisanSetu addresses these problems by providing a simple, centralized and farmer-friendly digital procurement platform.

💡 Our Solution

KisanSetu introduces a structured digital workflow:

Farmer
   ↓
Create Account
   ↓
Book Procurement Slot
   ↓
Select Crop & Quantity
   ↓
Find / Select Procurement Centre
   ↓
Receive Token
   ↓
Track Queue & ETA
   ↓
Visit Centre
   ↓
Officer Verifies Token
   ↓
Procurement Completed
   ↓
Authority Processes Payment
   ↓
Payment Status Updated
   ↓
Farmer Receives Notification

This reduces unnecessary waiting and provides better visibility throughout the procurement process.

🚀 Key Features
👨‍🌾 Farmer Module
Registration & Login

Farmers can create an account using their basic details and securely log in to the platform.

Slot Booking

Farmers can:

Select a crop
Enter quantity
Select a procurement centre
Select an available date and slot
Book a procurement appointment
Centre Selection

Farmers can view available procurement centres and select a suitable centre.

Token Generation

After booking, the farmer receives a unique token associated with the booking.

Example:

KS-6-20260922-1

The token can also be downloaded for use at the procurement centre.

Queue Tracking

Farmers can view:

Current queue
Token position
Booking status
Estimated waiting time
Procurement progress
Procurement Tracking

Farmers can track whether their procurement is:

Booked
   ↓
Approved / Confirmed
   ↓
In Progress
   ↓
Completed
Payment Tracking

After procurement is completed, the payment status can be updated by the authority.

The farmer can view the payment status from the dashboard.

Notifications

Farmers receive notifications for important events such as:

Booking confirmation
Procurement completion
Payment completion
Other important updates
Bengali / English Language Support

KisanSetu provides a language switcher allowing farmers to switch between:

English
বাংলা

The interface is designed to become more accessible to Bengali-speaking farmers.

👨‍💼 Officer Module

The officer dashboard is designed for procurement-centre staff.

Officers can:

Log in securely
View assigned procurement centre
View scheduled bookings
View farmer information
View queue
Verify farmer tokens
Start procurement
Complete procurement
Handle no-show cases
Manage availability/schedule
Update account information
Change password
Deactivate their account when required
Token Verification

The officer verifies the farmer's token before starting procurement.

Farmer arrives
      ↓
Officer checks token
      ↓
Token verified
      ↓
Procurement starts
      ↓
Procurement completed
🏛️ Authority / Admin Module

The authority dashboard provides centralized management of the procurement system.

Authorities can manage:

Farmers
Officers
Procurement centres
Crop prices
Bookings
Procurement records
Payments
System information
Officer Management

The authority can:

Add officers
View officers
View officer details
Manage officer status
Centre Management

Authorities can create and manage procurement centres and their schedules.

Price Management

Authorities can maintain current procurement prices for different crops and centres.

The farmer can see the applicable price before procurement.

Booking Management

Authorities can monitor the overall booking workflow and system activity.

Procurement Management

Authorities can view procurement records and their current status.

Payment Management

Authorities can update payment status after procurement is completed.

The actual bank/UPI payment can be handled through the authority's existing payment process, while KisanSetu maintains the corresponding digital status.

🤖 KisanSetu AI Farmer Assistant

KisanSetu also includes an AI-assisted farmer chatbot.

The chatbot can help farmers with common questions such as:

How do I book a slot?
What is my token number?
What is the procurement process?
What should I do if I miss my slot?
How can I check my booking?
How can I check my payment?
What documents are required?
What is the current procurement price?

The chatbot is designed as an assistance layer, not as a replacement for officers or authorities.

Farmer
   ↓
AI Assistant
   ↓
General Guidance
   ↓
Actual system action
   ↓
KisanSetu application

The actual booking, procurement and payment workflows remain controlled by the KisanSetu system.

📊 Queue & ETA System

One of the important features of KisanSetu is digital queue management.

The system maintains the booking order based on:

Procurement centre
Booking date
Slot time
Booking sequence

The farmer can see their position in the queue.

The system can also calculate an estimated waiting time based on the centre's processing schedule and current queue.

This provides farmers with better visibility instead of requiring them to wait without knowing their approximate turn.

⏱️ No-Show Management

KisanSetu includes a no-show mechanism.

If a farmer does not arrive within the allowed grace period after their scheduled slot, the booking can be marked as a no-show by the officer.

This helps prevent unused procurement slots from blocking the queue.

The system can maintain the no-show history for monitoring.

💰 Procurement & Payment Workflow

The procurement and payment process is separated into two stages.

Stage 1 — Procurement
Farmer arrives
      ↓
Token verification
      ↓
Procurement starts
      ↓
Procurement completed
Stage 2 — Payment
Procurement completed
      ↓
Authority processes payment
      ↓
Payment status updated
      ↓
Farmer receives notification

This keeps the procurement-centre workflow and payment-authority workflow clearly separated.

🗄️ Database

KisanSetu uses PostgreSQL for persistent application data.

Major entities include:

Farmer
Officer
Authority
Centre
Centre Schedule
Crop
Crop Price
Booking
Procurement
Payment
Notification

Simplified relationship:

Farmer
   │
   └── Booking
          │
          ├── Centre
          ├── Crop
          └── Procurement
                    │
                    └── Payment

Officer
   │
   └── Centre

Authority
   │
   ├── Officer Management
   ├── Centre Management
   ├── Price Management
   ├── Procurement Management
   └── Payment Management

The Django backend communicates with PostgreSQL using Django's database layer and ORM where applicable.

🏗️ System Architecture

KisanSetu follows a three-layer web application architecture.

                 ┌─────────────────────┐
                 │       Farmer        │
                 │      Officer       │
                 │      Authority     │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend   │
                 │      Vite           │
                 └──────────┬──────────┘
                            │ REST API
                            ▼
                 ┌─────────────────────┐
                 │ Django REST API    │
                 │     Backend        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    PostgreSQL      │
                 │      Database      │
                 └─────────────────────┘


                 ┌─────────────────────┐
                 │ AI Farmer Assistant│
                 │  Chatbot Backend   │
                 └──────────┬──────────┘
                            │
                            ▼
                       Chatbot API



🛠️ Technology Stack
Frontend
React
Vite
JavaScript
HTML
CSS
REST API integration
Backend
Python
Django
Django REST Framework
Database
PostgreSQL
AI Assistant
Python
Chatbot API
Development Tools
Visual Studio Code
Git
GitHub
PostgreSQL
pgAdmin


📁 Project Structure
kisan-setu/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── farmer/
│   │   │   └── officer/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── translation/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── kisan-setu-backend/
│   ├── accounts/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   │
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   └── manage.py
│
├── chatbot-backend/
│   ├── app.py
│   ├── data/
│   │   └── mockData.json
│   ├── requirements.txt
│   └── test.py
│
└── .gitignore
🔄 Complete System Workflow
1. Farmer Registration
Farmer
  ↓
Registration Form
  ↓
Validation
  ↓
Database
  ↓
Account Created
2. Farmer Login
Login
  ↓
Authentication
  ↓
Farmer Dashboard
3. Slot Booking
Select Centre
      ↓
Select Crop
      ↓
Enter Quantity
      ↓
Select Date
      ↓
Select Slot
      ↓
Booking Created
4. Token Generation
Booking Created
      ↓
Unique Token Generated
      ↓
Farmer Can View / Download Token
5. Queue
Confirmed Bookings
      ↓
Ordered by Slot & Booking Sequence
      ↓
Current Queue
      ↓
ETA Calculation
6. Procurement
Farmer Arrives
      ↓
Officer Verifies Token
      ↓
Procurement Starts
      ↓
Procurement Completed
7. Payment
Procurement Completed
      ↓
Authority Processes Payment
      ↓
Payment Status Updated
      ↓
Farmer Gets Notification
