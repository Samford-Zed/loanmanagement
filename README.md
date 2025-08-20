                                                               LoanMS — Loan Management System

A sleek, role-based Loan Management System for banks and MFIs. Customers can apply for loans and track EMI schedules. Admins can review applications, approve/reject, mark repayments as paid, and view customers — all with a modern React UI and a secure Spring Boot API.

                                                                     ✨ Highlights

Modern UI: React + Vite + Tailwind for a fast, clean, responsive interface

Secure API: Spring Boot 3, Spring Security (JWT), Role-based access (ADMIN / CUSTOMER)

EMI Engine: Accurate EMI calculation, auto-generated due dates & schedules

Two Portals:

Customer: Apply, view “My Loans”, repayment schedule, profile

Admin: Applications list, approve/reject, mark repayment paid, customers list

Clean Domain: JPA entities for User, Loan, Repayment + repositories & services

DX-Friendly: Simple local setup, clear endpoints, and friendly error messages

                                                                  🧱 Tech Stack

Frontend

React + TypeScript + Vite

TailwindCSS + Lucide Icons

Axios for API calls

JWT stored client-side (AuthContext)

Backend

Spring Boot 3 (Web, Security, Validation)

Spring Data JPA

Database: PostgreSQL (recommended) or H2 for quick dev

JWT auth with filter chain

                                                                     🗂️ Project Structure
project/
├─ frontend/
│  └─ src/
│     ├─ components/
│     │  ├─ admin/             # Admin pages & modals
│     │  └─ customer/          # Customer dashboard & panels
│     ├─ contexts/             # AuthContext (login/register/jwt)
│     ├─ lib/                  # API clients (admin.ts, loans.ts, repayments.ts, api.ts)
│     └─ utils/                # format & calculation helpers
└─ backend/
   └─ src/main/java/com/example/loanmanagement/
      ├─ model/                # User, Loan, Repayment
      ├─ repository/           # LoanRepository, RepaymentRepository, UserRepository
      ├─ service/              # LoanService, AdminLoanService, etc.
      ├─ controller/           # LoanController, Admin* controllers
      ├─ security/             # JwtAuthFilter, config
      └─ util/                 # EmiCalculator, DateUtil

                                                                  🚀 Getting Started
1) Backend (Spring Boot)

Prereqs: JDK 17+, Maven, PostgreSQL (or use H2 to try it fast)

application.properties example (PostgreSQL):

server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/loanms
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# CORS (match your Vite dev port)
app.cors.allowed-origin=http://localhost:5173

# JWT
app.jwt.secret=change-me-super-secret
app.jwt.expiration=86400000


💡 Want super-quick try? Switch to H2:

spring.datasource.url=jdbc:h2:mem:loanms;MODE=PostgreSQL;DB_CLOSE_DELAY=-1
spring.datasource.driverClassName=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop


Run

# from backend root
mvn spring-boot:run


API will be at http://localhost:8080.

2) Frontend (React)

.env (frontend)

VITE_API_BASE_URL=http://localhost:8080


Run

# from frontend root
npm install
npm run dev


App at http://localhost:5173.

                                                                  🔐 Roles & Auth

CUSTOMER: /app — apply for loans, list “My Loans”, repayment schedule, profile

ADMIN: /admin — see applications, approve/reject, mark repayment paid, list customers

Auth flow:

Login returns JWT; stored by the client (AuthContext).

Each request sends Authorization: Bearer <token>.

Spring Security rejects unauthorized/forbidden access with clear 401/403.

📡 API Quick Reference
Customer

POST /api/auth/register — register {name,email,password}

POST /api/auth/login — login {email,password} → JWT

POST /api/loans/apply — apply for a new loan (customer)

GET /api/loans/my — current user’s loans

GET /api/loans/{loanId} — loan details

GET /api/loans/{loanId}/repayments — schedule for a loan

Admin

GET /api/admin/loans — all applications (with user info)

PUT /api/admin/loans/{id}/approve?remark=... — approve loan

PUT /api/admin/loans/{id}/reject?remark=... — reject loan

PUT /api/admin/repayments/{repaymentId}/pay — mark installment as PAID

GET /api/admin/customers — list users with role CUSTOMER

(optional if implemented) GET /api/admin/stats — dashboard stats

The frontend already wires these into:

Admin: Loan Applications, Customers, Reports, Settings

Customer: Apply Loan, My Loans, Payments / Repayment Schedule, Profile

                                                                  🧮 EMI & Schedule

EMI is computed with EmiCalculator.calculateEMI(principal, annualRate, tenureMonths)

Schedule is generated using DateUtil.generateDueDates(startDate, tenureMonths)

Each installment: principal + interest, and the Admin can mark a row PAID

Customer views live totals: paid count, total paid, remaining

                                                                  🧭 Using the App

Register & Login

Register as a new user and sign in (Customer).

Apply for Loan

Fill amount, loan type/purpose, tenure — submit.

Admin Reviews

Admin signs in → Applications → Approve/Reject → Optionally add remark.

Repayment

After approval, schedule is generated.

Admin can mark installments PAID; Customer sees status update in “Payments”.

                                                                     🖼️ Screens (what you’ll see)

Customer Dashboard: Active loans, totals, quick access to apply & view schedules

Apply Loan: Minimal form with inline validation

Payments (Schedule): EMI table with due date, principal, interest, status

Admin Dashboard: KPI cards + Applications table with actions & details modal

Customers: Real list fetched from backend (no more mock!)

                                                               🧪 Troubleshooting

CORS errors: Ensure app.cors.allowed-origin matches your Vite URL (usually http://localhost:5173).

JWT 401/403: Confirm Authorization: Bearer <token> is being sent; check token expiry.

Ports: Backend :8080, Frontend :5173. Update if you customized them.

“Failed to load …”: Inspect browser Network tab; verify the endpoint exists and returns JSON.

                                                                  🗺️ Roadmap

Payment gateway integration

Export schedules (CSV/PDF)

Admin analytics: charts & cohorts

Multi-tenancy and audit logs

Email/SMS notifications

                                                                        🤝 Contributing

PRs are welcome!

Keep PRs focused

Add clear commit messages

Include small screenshots/GIFs for UI changes

                                                                           📄 License

MIT — do as you wish, just keep the attribution.

                                                                           💬 Credits

Built with ♥️ using Spring Boot & React.
Thanks to the open-source community for the incredible tooling.

Quick Start TL;DR
# Backend
cd backend
mvn spring-boot:run

# Frontend
cd frontend
cp .env.example .env   # put VITE_API_BASE_URL=http://localhost:8080
npm i
npm run dev


Open http://localhost:5173
 and you’re in. Happy shipping! 🚀
