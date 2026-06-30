# MedConnect: User Experience & Functionality Mapping

This document describes all user-facing functionalities of the **MedConnect** platform, mapping out the step-by-step experience of a new visitor exploring the application—from first arrival to role-based dashboard actions.

---

## Phase 1: Landing on the Homepage (First Impressions)

When a new visitor first arrives at the MedConnect platform, they experience a modern, dynamic landing interface:

### 1.1 Responsive Floating Navigation
* **Visual Experience:** The user sees a modern, pill-shaped navigation header ([Navbar.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/components/Navbar.tsx)) that is detached from the viewport top (`fixed top-4 w-[95%]`) and features a subtle background blur (`backdrop-blur-lg bg-background/80`) and rounded borders.
* **Interactions:**
  * Hovering over menu items (Home, Services, Doctors, About, Contact) highlights them with a smooth capsule shape.
  * On mobile views, the navbar collapses into a standard hamburger trigger which displays a slide-down modal navigation card.
  * Clear calls-to-action (CTAs) are highlighted: **Login** (ghost style) and **Register** (accent orange style).

### 1.2 Interactive Hero Presentation
* **Visual Experience:** The homepage ([Home.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/pages/Home.tsx)) utilizes clean gradients and floating elements.
* **Micro-Animations:**
  * Background light teals expand and contract (`animate-float`).
  * Floating statistic cards (showing **50K+ Patients** and **5K+ Doctors**) drift vertically to simulate an active, high-tech platform.
* **Core Actions:** 
  * The **"Make an appointment"** CTA buttons direct the visitor directly to register.
  * The **"Find Doctors"** button routes them to the search database.

### 1.3 Value and Trust Sections
* **Services Preview:** Three animated cards introduce the core pillars of the product: *Medical Records*, *Appointments*, and *Doctor Discovery*. Hovering over cards scales their icons and raises their container layout (`hover:-translate-y-2 hover:shadow-xl`).
* **Platform Metrics:** A statistics block shows counting parameters: **500+ Partner Hospitals**, **1,000+ Available Services**, **5,000+ Active Doctors**, and **50,000+ Happy Patients**.

---

## Phase 2: Exploration & Public Workflows

Visitors can browse and try out database features without requiring immediate registration.

### 2.1 Services Grid (`/services`)
Navigating to [Services.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/pages/Services.tsx) displays the product's full healthcare suite:
* **Interactive Catalog:** Displays six main cards with animated icons:
  1. *Online Appointments:* Quick booking, confirmations, rescheduling.
  2. *Digital Health Records:* Secure cloud storage, timeline views, sharing links.
  3. *Telemedicine Consultations:* HD video calls, secure messaging, e-prescriptions.
  4. *Secure Record Sharing:* QR codes, temporary access locks.
  5. *Smart Notifications:* Medication and calendar alerts.
  6. *Patient-Doctor Chat:* Encrypted chat interfaces.
* **Interactions:** A dynamic **"Learn More"** button on each card highlights on hover.

### 2.2 Doctor Search & Registry (`/doctors`)
The public directory [Doctors.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/pages/Doctors.tsx) lets visitors discover specialists:
* **Real-time Query Filtering:** A search box filters the list instantly as the user types, matching against names and specialties.
* **Specialty Pills:** Clicking filter buttons (e.g., *Cardiologist*, *Dermatologist*, *Neurologist*) isolates doctors of that specific specialty.
* **Detailed Cards:** Each card displays detailed credentials:
  * Profile avatar and specialty name.
  * Experience years and consultation fees (e.g., `₹800`, `₹600`).
  * Average ratings and review metrics (e.g., `★ 4.9 (342 reviews)`).
  * Video call availability indicators (`Video Consult` or location availability tags).
  * Fast action buttons: **Book** and **View Profile**.

### 2.3 Contact & Help Desk (`/contact`)
The customer support portal [Contact.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/pages/Contact.tsx) lets users reach out:
* **Message Dispatcher:** A contact form captures Name, Email, Phone, Subject, and Message. Submitting the form fires a visual toast confirmation (*"Message Sent! We'll get back to you within 24 hours"*).
* **Information Cards:** Displays support telephone numbers, emergency emails, office working hours, and physical address parameters.

---

## Phase 3: Registration and Session Access

### 3.1 Creating an Account (`/register`)
The sign-up card [Register.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/pages/Register.tsx) provides a fields registry:
* The user inputs their Full Name, Email, Phone, Role Type, Password, and Confirmation.
* **Role Selection:** A selector specifies whether they are signing up as a **Patient** or a **Doctor**.
* **Validation:** Submitting runs strict checks (passwords must match, password length must be at least 6 characters), alerting the user via toasts if verification fails.

### 3.2 Role-Based Routing (`/login`)
The login screen [Login.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/pages/Login.tsx) handles access. MedConnect routes users to their respective portal dashboards using keyword domain matching on their email input:
* **Doctor Redirect:** Entering an email with the word **`doctor`** (e.g., `doctor@test.com`) logs the user in and navigates them to the **Doctor Dashboard**.
* **Admin Redirect:** Entering an email with the word **`admin`** routes them to the **Admin Dashboard** view.
* **Patient Redirect:** Any other email routes them directly to the **Patient Dashboard**.

---

## Phase 4: Logged-in Dashboard Experiences

### 4.1 Patient Portal Dashboard (`/patient-dashboard`)
Logged-in patients see a consolidated view of their clinical vitals and appointments in [PatientDashboard.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/pages/PatientDashboard.tsx):
* **Vitals & Metrics:** Cards showing Appointments count, total Medical Records saved, unread Notifications, and an overall **Health Score (e.g., 85/100)**.
* **Upcoming Appointments:** Renders cards for active slots displaying Doctor name, specialty, date/time, and appointment type (e.g., *In-Person*, *Video Call*).
* **Recent Medical Records:** Lists recent documents (Blood Test, X-Ray, Prescriptions) with a quick **"View"** action.
* **Health Summary Indicators:** Live panels indicating Blood Pressure ("Normal"), Heart Rate ("72 bpm"), and duration since their last doctor checkup.
* **Quick Actions:** Easy access buttons to quickly book an appointment, upload a new record, or find new doctors.
* **Reminders Panel:** Alert notifications showing active notifications (e.g., "*Tomorrow at 10:30 AM with Dr. Sharma*").

### 4.2 Doctor Portal Dashboard (`/doctor-dashboard`)
Logged-in practitioners manage their daily clinical schedules in [DoctorDashboard.tsx](file:///d:/RAHUL/My%20Projects/Lovable%20Projects/MedConnect/client/src/pages/DoctorDashboard.tsx):
* **Performance Cards:** Displays Today's Patients count, Total Patient history, Pending File Reviews, and average rating scores (e.g., `4.8`).
* **Today's Consultation Queue:** Renders patient appointments by time, displaying consult types and status (`Confirmed`/`Pending`), with actions to **"Start"** or "View" the consultation.
* **Recent Patients Database:** Tabular view of recently seen patients, indicating visit dates and diagnosed conditions (e.g., *Follow-up*, *Checkup*).
* **Active Availability Status:** Displays active schedule indicators (e.g., green dot "Available") with actions to manage work shifts.
* **Weekly Metrics Tracker:** Quick views showing weekly counters: Total Consultations (42), New Patients (8), and Follow-ups (12).
* **Clinical Actions:** Fast triggers to upload new digital prescriptions, view records, or open practice analytics.
