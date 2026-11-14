# COPILOT TASK: Training Records Management Application

## 1. Your Role

Act as an autonomous Senior Full-Stack Developer, Software Architect, QA Engineer and DevOps Engineer.

Your responsibility is to design, develop, test and deploy a complete, production-ready Training Records Management Application.

Do not limit your work to generating code or providing recommendations. Work directly in the project workspace, create and modify files, execute commands, run tests, identify problems and fix them.

The application must be deployed successfully to a cloud environment.

## 2. Application Requirements

Build a Training Records Management Application with two types of access.

### Public Users

Public users must be able to access the application without authentication.

They must be able to:
- View all training records.
- Search training records.
- Filter by date, trainer and subject.
- Navigate records using pagination.
- Open Google Colab links in a new tab.
- Open optional dataset links in a new tab.

### Administrator

Only an authenticated administrator can:
- Log in using email/username and password.
- Access the administration area.
- Add new training records.

There must be no public registration.

### Training Record Fields

| Field | Mandatory |
|---|---|
| Date | Yes |
| Trainer | Yes |
| Subject | Yes |
| Topic | Yes |
| Colab Link | Yes |
| Dataset Link | No |
| Additional Notes | No |

Implement proper validation and user-friendly error messages.

## 3. Technology Stack

Use the following technologies:

- Next.js with App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Auth.js Credentials authentication
- Zod
- Tailwind CSS
- shadcn/ui

Deployment:
- Vercel for application hosting.
- Neon for PostgreSQL database hosting.
- GitHub for source control.

Use Next.js for frontend and backend functionality. Do not introduce unnecessary Express services, microservices or additional infrastructure.

## 4. Architecture and Security

Before implementing, verify the architecture and resolve potential problems.

Mandatory requirements:

1. All database operations must execute server-side.
2. All create operations must verify administrator authorization server-side.
3. Public users must never be able to create records through direct API calls.
4. Passwords must be securely hashed using Argon2 or bcrypt.
5. Use secure session management and cookies.
6. Add login rate limiting.
7. Validate all inputs on the server.
8. Validate external URLs and permit HTTPS links only.
9. Prevent duplicate form submissions.
10. Never expose database credentials or application secrets.
11. Use environment variables for all deployment-specific configuration.
12. Configure database connection pooling appropriately for serverless deployment.
13. Implement safe error handling.
14. Configure database migrations and backups.

Do not rely exclusively on hiding admin buttons or protecting frontend routes.

## 5. Development Approach

Work in the following phases.

### Phase 1: Project Analysis and Planning

- Inspect the existing workspace.
- Identify whether this is a new or existing project.
- Review the available dependencies and environment.
- Identify technical risks and potential blockers.
- Finalize the architecture.
- Create the initial project structure.

Do not start implementation until the major architectural decisions and risks are documented.

### Phase 2: Project Initialization

- Initialize Next.js and TypeScript.
- Configure Tailwind CSS and shadcn/ui.
- Configure Prisma.
- Configure environment variables.
- Establish the database connection.
- Create the initial database schema.

### Phase 3: Database Implementation

Create the User and TrainingRecord models.

Implement:
- Prisma migrations.
- Initial administrator seeding.
- Appropriate indexes.
- Database constraints.
- Connection pooling.

Never commit actual credentials.

### Phase 4: Public Application

Implement:
- Public records page.
- Responsive records table.
- Search.
- Filtering.
- Pagination.
- External link handling.
- Empty and error states.

### Phase 5: Administrator Authentication

Implement:
- Login page.
- Credentials authentication.
- Secure password verification.
- Session management.
- Server-side authorization.
- Protected admin routes.

### Phase 6: Record Management

Implement:
- Admin-only record creation form.
- Client-side and server-side validation.
- URL validation.
- Success and failure notifications.
- Database persistence.
- Duplicate-submission prevention.

### Phase 7: Quality Assurance

Perform:
- TypeScript checks.
- ESLint checks.
- Automated tests.
- Authorization tests.
- Validation tests.
- Production build.
- End-to-end tests.

Fix all critical and high-priority issues before proceeding.

### Phase 8: Cloud Deployment

Deploy the application to Vercel and connect the production Neon PostgreSQL database.

Configure:
- Production environment variables.
- Database connection.
- Production migrations.
- Initial administrator account.
- HTTPS.
- Production build settings.

Never assume that deployment is successful just because the deployment command completed.

Verify the deployed application using its actual production URL.

## 6. Mandatory Progress Reporting

I want to see development progress throughout the implementation.

Create a file named PROGRESS.md in the project root.

Update it whenever a significant task is completed.

Use the following format:

# Project Progress

## Current Status
- Current phase:
- Overall completion:
- Current task:
- Next task:

## Phase Tracking

- [ ] Phase 1: Project Analysis and Planning
- [ ] Phase 2: Project Initialization
- [ ] Phase 3: Database Implementation
- [ ] Phase 4: Public Application
- [ ] Phase 5: Administrator Authentication
- [ ] Phase 6: Record Management
- [ ] Phase 7: Quality Assurance
- [ ] Phase 8: Cloud Deployment

## Completed Work
List completed features and files.

## Issues Identified
List problems discovered and their solutions.

## Outstanding Issues
List unresolved issues and their severity.

## Test Results
Record the actual commands executed and their results.

## Deployment Status
Record the deployment URL and production verification results.

### Progress Reporting Rules

1. Send me a short progress update after completing every phase.
2. Update PROGRESS.md at the same time.
3. Explain important architectural decisions.
4. Report problems immediately when discovered.
5. Explain the root cause and proposed resolution.
6. Do not hide failed tests or unresolved issues.
7. Do not mark a phase complete until its acceptance criteria pass.
8. Show the actual test/build results rather than reporting assumed success.
9. If blocked by an external dependency, explain precisely what access or authorization is needed.
10. Continue with independent tasks while waiting for non-blocking dependencies.

Provide progress updates in the Copilot Agent conversation as well as in PROGRESS.md.

## 7. Acceptance Criteria

The application is complete only when all of the following are verified:

- Public users can access records without logging in.
- Administrator login works.
- Unauthorized users cannot access admin functionality.
- Administrator can create a training record.
- All required fields are validated.
- Optional fields work correctly.
- Records persist in PostgreSQL.
- Newly created records appear on the public page.
- Search, filters and pagination work.
- Colab and dataset links work.
- Application builds successfully.
- Automated tests pass.
- Production deployment is successful.
- Production database connection works.
- Main workflows have been tested against the deployed application.

## 8. Final Deliverables

Provide:

1. Complete source code.
2. GitHub repository.
3. Production application URL.
4. Database schema and migration details.
5. Administrator initialization instructions.
6. Environment variable documentation.
7. Test execution report.
8. Deployment instructions.
9. Backup and recovery instructions.
10. Known limitations, if any.

## 9. Important Execution Rules

- Do not stop after creating the architecture.
- Do not stop after creating the frontend.
- Do not provide only code snippets.
- Do not leave mock data as the final implementation.
- Do not claim a feature works without testing it.
- Do not claim deployment success without verifying the production URL.
- Do not ask me to perform coding tasks that you can perform yourself.
- Ask for my intervention only when actual account authorization, external credentials, a paid-service decision or an important product decision is required.
- Never request that I paste passwords or secret keys into the conversation.

Start with Phase 1 now. Report your initial findings and then proceed through the phases systematically.