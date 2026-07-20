Here is a comprehensive map and architectural breakdown of the GIIN Loan Service Platform. This detailed overview covers every module (page/tab), the data structure, and the complete end-to-end workflow to guide your UI/UX design and subsequent mobile/web app development.1. System OverviewThe GIIN Loan Service is a comprehensive Borrower Management System designed to track the entire lifecycle of a loan. It handles everything from the initial borrower application and administrative approval to active loan tracking, automated reminders, document generation (invoices/receipts), and high-level financial reporting.2. System Architecture (Pages & Modules)The system is currently divided into 12 distinct modules (represented as tabs in the spreadsheet). For a web/mobile app, these can be translated into specific screens, backend tables, or background processes.A. Frontend / User-Facing Modules


Incoming Request (Application Form): This is the intake portal where borrowers apply for a loan.


Data Collected: Timestamp, Borrower Full Name, National ID / Passport #, Student ID (REGNO), Phone Number, Email Address, Requested Principal Amount, Duration, Collateral Item Type, Collateral Description, Upload Photos of Collateral, and Collateral Password.
B. Administrative & Core Database Modules


Approval Center: The administrative queue where new loan applications from the "Incoming Request" module are reviewed. Admins can see the requested amounts and borrower details to approve or reject the loan.

Main Tracker (GIIN LOAN SERVICE - Professional Borrower Management Tracker V2): The core database of all active and historical loans. Once a loan is approved, it lives here.


Data Tracked: Borrower Name, National ID, Student ID, Phone Number, Email Address, Loan Date, Due Date, Principal Amount (RWF), Interest Rate (%), Interest Amount (RWF), Total Repayment (RWF), Collateral Details (Item, S/N, Description, Password), and Payment Status (Pending/Completed).

Approved Migrations: A database table used for handling legacy data, historical records, or migrating approved loans from older systems into the current tracker.

Settings: The configuration center for the app. It holds global variables and dropdown lists, such as the accepted "Collateral Types" (Laptop, Smartphone, Tablet, Vehicle).
C. Operations & Communications Modules


Reminders: An action center that tracks active loans against their Due Dates. It calculates "Days Left" and determines what actions need to be taken (e.g., sending an email).


Data Tracked: Borrower Name, Due Date, Total Repayment, Payment Status, Email Address, Days Left, Email Subject, Email Body, Action.

Reminder Template: A configuration page where admins can set up the standard text for email notifications (e.g., "Urgent: Loan Repayment Reminder").

Invoice Template: A dynamic document generator. It pulls data (Borrower Name, Collateral, Financials) from the Main Tracker to generate a formal invoice for the borrower when payment is due.

Receipt Template: Similar to the invoice, this generates a formal receipt (Financial Summary, Paid Amount, Dates) to be emailed to the borrower once their Payment Status changes to "Completed".
D. Analytics & Reporting Modules


Dashboard: The visual UI for administrators. It displays high-level KPIs, charts, and summaries (e.g., Total Outstanding, Pending Borrowers) without exposing the raw database rows.

Calc_Data: The backend calculation engine that powers the Dashboard. It aggregates data from the Main Tracker to calculate:


KPI Data: RWF Values, USD Values.

Payment Status: Counts of Pending vs. Completed loans.

Borrower Breakdown: Total repayment amounts grouped by borrower.

Pending Borrowers: A live list of users who have not yet paid.

Monthly Tracker: A financial reporting module that aggregates the system's performance on a month-by-month basis.


Data Tracked: Month, Total Loans, Borrowed Amount, Expected Repayment, Collected Amount, Outstanding Amount, Total Interest.
3. End-to-End System Workflow (How it Functions)To build the mobile and web app, the system should follow this chronological workflow:Phase 1: Application & Intake


A borrower opens the app/web portal and fills out the Incoming Request form.

They provide their personal info, requested amount, and upload photos/details of their collateral.

The system logs this request with a timestamp.
Phase 2: Review & Approval


An administrator logs into the system and navigates to the Approval Center.

The admin reviews the pending applications, checking the collateral and requested amounts.

If approved, the system automatically calculates the Interest Rate, Interest Amount, and Total Repayment based on the requested duration, and moves the record into the Main Tracker.
Phase 3: Active Loan Management


The loan is now live in the Main Tracker with a status of "Pending".

The Dashboard updates automatically via the Calc_Data engine to reflect the new expected revenue and the new pending borrower.

The Monthly Tracker logs the new principal amount and expected interest for that specific month.
Phase 4: Monitoring & Notifications


As the Due Date approaches, the system's Reminders module calculates the "Days Left".

When the timeline hits a specific threshold (e.g., 3 days before due), the system merges the borrower's data with the Reminder Template and dispatches an automated email/push notification.

The admin can also use the Invoice Template to generate and send a formal PDF invoice requesting payment.
Phase 5: Repayment & Closing


The borrower makes a payment.

The admin updates the Payment Status in the Main Tracker from "Pending" to "Completed".

This status change triggers the Receipt Template, which generates a final PDF receipt and emails it to the borrower.

The Dashboard and Monthly Tracker update instantly, shifting the funds from "Expected/Outstanding" to "Collected". The borrower is removed from the active reminders queue.
Next Steps for UI/UX & DevelopmentWhen feeding this to your UI/UX agent, you should instruct them to design three primary interfaces:


Borrower Portal (Mobile/Web): Focused purely on the Incoming Request form, uploading collateral photos, and viewing their own Receipts/Invoices.

Admin Dashboard (Web/Tablet): Focused on the Dashboard visualizations, the Approval Center queue, and the Reminders action list.

Admin Database View (Web): A secure, tabular view of the Main Tracker, Settings, and Monthly Tracker for deep data.