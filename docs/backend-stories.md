# Backend Engineer User Stories — Workspace Flow

## Overview

The Backend Engineer is responsible for implementing the API layer, business logic, data access, and backend services following Clean Architecture and Domain-Driven Design principles.

This document reflects the new product direction: **an AI-assisted developer workspace that transforms repository metadata and unstructured notes into structured project context.**

---

## Epic 0: User Authentication & Account Management

**Priority**: Must Have (MVP)  
**Status**: ✅ Implemented  
**Backend Effort**: 11 story points

### Completed

- ✅ US-BE-0.1: User Domain Model & Repository (ABC contract, EntityId, Email VO)
- ✅ US-BE-0.2: User Registration with email verification
- ✅ US-BE-0.3: JWT Authentication Service (access + refresh tokens)
- ✅ US-BE-0.4: User Login with rate limiting (5 attempts/min)
- ✅ US-BE-0.5: Password Reset (request + confirm)
- ✅ US-BE-0.6: Refresh Token endpoint
- ✅ US-BE-0.7: Email Verification endpoint
- ✅ US-BE-0.8: Password Validator (domain layer)

---

## Epic 1: Project & Workspace Management

**Priority**: Must Have (MVP)  
**Effort**: 8 story points  
**Owner**: Backend Engineer

### Backend Tasks

**US-BE-1.1: Project Domain Model & Repository**

- **As a** Backend Engineer,
- **I want to** implement the Project domain model and repository,
- **So that** users can create and manage workspaces for their projects.

**Acceptance Criteria**:

- Given the domain layer structure
- When I implement the Project entity
- Then it includes: id, user_id, name, description, github_repo_url (optional), created_at, updated_at
- And the repository interface (ABC) defines only the operations needed
- And user ownership is enforced at the domain level

**Technical Notes**:

- `domain/entities/project_entity.py`
- `domain/repositories/project_repository.py` (ABC, no BaseRepository)
- `infrastructure/models/project_model.py`
- `infrastructure/repository/project_repository_impl.py`
- One user can have multiple projects
- A project is the **workspace unit** — everything else belongs to a project

**Effort**: 2 SP

---

**US-BE-1.2: Project CRUD API Endpoints**

- **As a** Backend Engineer,
- **I want to** implement CRUD endpoints for projects,
- **So that** users can manage their workspaces.

**Acceptance Criteria**:

- Given an authenticated user
- When calling project endpoints
- Then the following are available:
  - `POST /api/v1/projects` — Create project
  - `GET /api/v1/projects` — List user's projects
  - `GET /api/v1/projects/{id}` — Get project details
  - `PUT /api/v1/projects/{id}` — Update project
  - `DELETE /api/v1/projects/{id}` — Delete project (cascade notes, tasks)
- And all endpoints verify user ownership
- And proper error codes are returned (403, 404, 409)

**Technical Notes**:

- Use cases: `CreateProjectUseCase`, `GetProjectByIdUseCase`, `ListUserProjectsUseCase`, `UpdateProjectUseCase`, `DeleteProjectUseCase`
- Inject via FastAPI `Depends()` directly (no service wrapper)
- Validate project name uniqueness per user

**Effort**: 3 SP

---

**US-BE-1.3: Project Alembic Migration**

- **As a** Backend Engineer,
- **I want to** create the database migration for the projects table,
- **So that** the persistence layer is ready.

**Acceptance Criteria**:

- Migration creates `projects` table with: id (UUID PK), user_id (FK → users), name, description, github_repo_url, created_at, updated_at
- Index on user_id
- Unique constraint on (user_id, name)

**Effort**: 1 SP

---

**US-BE-1.4: Project Tests**

- **As a** Backend Engineer,
- **I want to** write tests for project functionality,
- **So that** the workspace foundation is reliable.

**Acceptance Criteria**:

- Unit tests for domain entity validation
- Unit tests for use cases (mocked repository)
- Integration tests for API endpoints
- Test ownership enforcement
- Coverage > 80%

**Effort**: 2 SP

---

## Epic 2: Quick Notes

**Priority**: Must Have (MVP)  
**Effort**: 8 story points  
**Owner**: Backend Engineer

### Backend Tasks

**US-BE-2.1: ProjectNote Domain Model & Repository**

- **As a** Backend Engineer,
- **I want to** implement the ProjectNote domain model,
- **So that** users can capture quick ideas within their workspace.

**Acceptance Criteria**:

- Given the domain layer structure
- When I implement the ProjectNote entity
- Then it includes: id, project_id, content (text), note_type (enum: RAW, TASK, ARCHITECTURE_DECISION), is_enriched (bool), created_at, updated_at
- And new notes default to type RAW and is_enriched = false
- And a note belongs to exactly one project

**Technical Notes**:

- `domain/entities/project_note_entity.py`
- `domain/repositories/project_note_repository.py` (ABC)
- Enum `NoteType`: RAW, TASK, ARCHITECTURE_DECISION
- When a note is converted to a task or decision, it keeps existing but changes type

**Effort**: 2 SP

---

**US-BE-2.2: ProjectNote CRUD API Endpoints**

- **As a** Backend Engineer,
- **I want to** implement CRUD endpoints for notes,
- **So that** users can capture and manage ideas within their workspace.

**Acceptance Criteria**:

- Given an authenticated user who owns the project
- When calling note endpoints
- Then the following are available:
  - `POST /api/v1/projects/{project_id}/notes` — Create note
  - `GET /api/v1/projects/{project_id}/notes` — List project notes (with filters)
  - `GET /api/v1/notes/{id}` — Get note detail
  - `PATCH /api/v1/notes/{id}` — Update note content/type
  - `DELETE /api/v1/notes/{id}` — Delete note
- And notes can be filtered by `note_type`
- And results are sorted by created_at (newest first)
- And pagination is supported

**API Endpoints**:
```
POST /api/v1/projects/{project_id}/notes
Request: { content }
Response: { id, project_id, content, note_type, is_enriched, created_at }

GET /api/v1/projects/{project_id}/notes?type=RAW&page=1&size=50
Response: { items: [...], total, page, size }
```

**Effort**: 3 SP

---

**US-BE-2.3: Convert Note to Task or Architecture Decision**

- **As a** Backend Engineer,
- **I want to** implement an endpoint to convert a note into a task or architecture decision,
- **So that** users can act on their ideas.

**Acceptance Criteria**:

- Given an existing note of type RAW
- When the user calls `POST /api/v1/notes/{id}/convert`
- Then if target_type is TASK, a new Task is created from the note content
- And if target_type is ARCHITECTURE_DECISION, the note type changes to ARCHITECTURE_DECISION
- And the original note is marked as enriched
- And a 400 is returned if the note is already converted

**API Endpoint**:
```
POST /api/v1/notes/{id}/convert
Request: { target_type: "TASK" | "ARCHITECTURE_DECISION" }
Response: { message, created_entity_id (if task) }
```

**Effort**: 2 SP

---

**US-BE-2.4: Note Tests**

- **As a** Backend Engineer,
- **I want to** write tests for notes functionality.

**Effort**: 1 SP

---

## Epic 3: Lightweight Tasks

**Priority**: Must Have (MVP)  
**Effort**: 7 story points  
**Owner**: Backend Engineer

### Backend Tasks

**US-BE-3.1: Task Domain Model & Repository**

- **As a** Backend Engineer,
- **I want to** implement the Task domain model,
- **So that** users can track lightweight tasks within their workspace.

**Acceptance Criteria**:

- Given the domain layer structure
- When I implement the Task entity
- Then it includes: id, project_id, title, description (optional), status (enum), priority (enum), source_note_id (optional FK), created_at, updated_at
- And status enum: TODO, IN_PROGRESS, DONE
- And priority enum: LOW, MEDIUM, HIGH
- And a task belongs to exactly one project
- And source_note_id tracks which note generated the task (nullable)

**Technical Notes**:

- `domain/entities/task_entity.py`
- `domain/repositories/task_repository.py` (ABC)
- Simpler than original Epic 3 — no position ordering, no optimistic locking
- Tasks are support for the workspace, not the product's center

**Effort**: 2 SP

---

**US-BE-3.2: Task CRUD API Endpoints**

- **As a** Backend Engineer,
- **I want to** implement CRUD endpoints for tasks,
- **So that** users can manage their tasks.

**Acceptance Criteria**:

- Given an authenticated user who owns the project
- When calling task endpoints
- Then the following are available:
  - `POST /api/v1/projects/{project_id}/tasks` — Create task
  - `GET /api/v1/projects/{project_id}/tasks` — List project tasks (filterable by status, priority)
  - `PATCH /api/v1/tasks/{id}` — Update task (partial update)
  - `DELETE /api/v1/tasks/{id}` — Delete task
- And status changes are simple PATCH operations
- And results support filtering and pagination

**API Endpoints**:
```
POST /api/v1/projects/{project_id}/tasks
Request: { title, description?, priority? }
Response: { id, title, description, status, priority, created_at }

GET /api/v1/projects/{project_id}/tasks?status=TODO&priority=HIGH&page=1&size=50

PATCH /api/v1/tasks/{id}
Request: { status?, title?, description?, priority? }
```

**Effort**: 3 SP

---

**US-BE-3.3: Task Tests**

- **As a** Backend Engineer,
- **I want to** write tests for task functionality.

**Effort**: 2 SP

---

## Epic 4: GitHub Integration

**Priority**: Must Have (MVP)  
**Effort**: 10 story points  
**Owner**: Backend Engineer

### Backend Tasks

**US-BE-4.1: GitHub OAuth Flow**

- **As a** Backend Engineer,
- **I want to** implement GitHub OAuth,
- **So that** users can connect their GitHub account.

**Acceptance Criteria**:

- Given GitHub OAuth App credentials
- When implementing OAuth flow
- Then I create endpoints for:
  - `GET /api/v1/integrations/github/authorize` — Redirect to GitHub
  - `GET /api/v1/integrations/github/callback` — Handle OAuth callback
  - `DELETE /api/v1/integrations/github/disconnect` — Remove connection
- And access token is stored encrypted in the database
- And the token is associated with the user (not the project)

**Technical Notes**:

- Use GitHub OAuth App (not GitHub App — simpler)
- Store encrypted token in `github_integrations` table
- Scopes needed: `repo` (read-only), `read:user`
- One GitHub connection per user, usable across projects

**Effort**: 3 SP

---

**US-BE-4.2: GitHub Repository Sync**

- **As a** Backend Engineer,
- **I want to** sync repository metadata from GitHub,
- **So that** the workspace has project context data to analyze.

**Acceptance Criteria**:

- Given a project linked to a GitHub repo
- When sync is triggered (on-demand via API)
- Then the system fetches:
  - Repository metadata (name, description, language, stars, default branch)
  - README content
  - File tree (top 2 levels)
  - Last 20 commits (sha, message, author, date)
- And the data is persisted as a `ProjectContextSnapshot`
- And the snapshot includes a `synced_at` timestamp
- And GitHub API rate limits are respected

**Technical Notes**:

- `infrastructure/github/github_client.py` — wraps GitHub REST API calls
- `application/use_cases/sync_github_repo.py`
- Use `requests` or `httpx` (no need for PyGitHub lib for this scope)
- Store raw sync data as JSON in the snapshot
- Endpoint: `POST /api/v1/projects/{project_id}/sync`

**API Endpoint**:
```
POST /api/v1/projects/{project_id}/sync
Response: { message: "Sync completed", snapshot_id }
```

**Effort**: 3 SP

---

**US-BE-4.3: GitHub Integration Model & Migration**

- **As a** Backend Engineer,
- **I want to** create the persistence layer for GitHub integrations and snapshots.

**Acceptance Criteria**:

- `github_integrations` table: id, user_id (FK), github_username, access_token_encrypted, created_at, updated_at
- `project_context_snapshots` table: id, project_id (FK), raw_data (JSONB), ai_analysis (JSONB, nullable), synced_at, created_at, updated_at
- Proper indexes and FK constraints

**Effort**: 2 SP

---

**US-BE-4.4: GitHub Integration Tests**

- **As a** Backend Engineer,
- **I want to** write tests for GitHub integration (mocked HTTP calls).

**Effort**: 2 SP

---

## Epic 5: AI — Project Context Generation

**Priority**: Must Have (MVP)  
**Effort**: 8 story points  
**Owner**: Backend Engineer

### Backend Tasks

**US-BE-5.1: AI Provider Infrastructure**

- **As a** Backend Engineer,
- **I want to** implement the AI provider infrastructure,
- **So that** the system can generate project context from synced data.

**Acceptance Criteria**:

- Given the infrastructure layer
- When I implement the AI provider
- Then there is an ABC contract: `AiContextProvider` in domain with method `generate_project_context(raw_data: dict) -> dict`
- And a concrete implementation using Gemini Flash: `GeminiAiProvider`
- And the provider accepts raw sync data and returns structured analysis
- And the response includes: project summary, detected stack, architecture type, main modules, dependencies, potential issues
- And errors are handled gracefully (timeout, API errors)

**Technical Notes**:

- `domain/repositories/ai_context_provider.py` (ABC contract)
- `infrastructure/ai/gemini_ai_provider.py` (implementation)
- Use `google-generativeai` SDK
- API key in `.env` as `GEMINI_API_KEY`
- Prompt engineering: instruct model to return JSON with specific schema
- Temperature: 0.2 (low creativity, high accuracy)

**Expected AI output structure**:
```json
{
  "summary": "Brief project description",
  "stack": ["Python", "FastAPI", "PostgreSQL"],
  "architecture": "Clean Architecture with DDD",
  "modules": ["auth", "projects", "tasks"],
  "dependencies": ["sqlalchemy", "pydantic", "alembic"],
  "observations": ["No test files detected", "Missing CI/CD configuration"]
}
```

**Effort**: 3 SP

---

**US-BE-5.2: Generate Project Context Use Case**

- **As a** Backend Engineer,
- **I want to** implement the use case that triggers AI analysis after sync,
- **So that** the workspace displays meaningful project context.

**Acceptance Criteria**:

- Given a project with a synced snapshot (raw_data populated)
- When `POST /api/v1/projects/{project_id}/analyze` is called
- Then the latest snapshot's raw_data is sent to the AI provider
- And the AI response is stored in the snapshot's `ai_analysis` field
- And the endpoint returns the generated analysis
- And if no snapshot exists, a 400 error is returned
- And if AI fails, the error is logged and a 502 is returned

**Technical Notes**:

- `application/use_cases/generate_project_context.py`
- This is a separate action from sync (sync = fetch data, analyze = AI processing)
- Allows re-analyzing without re-syncing

**API Endpoint**:
```
POST /api/v1/projects/{project_id}/analyze
Response: { summary, stack, architecture, modules, dependencies, observations }
```

**Effort**: 2 SP

---

**US-BE-5.3: Get Project Context Endpoint**

- **As a** Backend Engineer,
- **I want to** expose the generated project context via API,
- **So that** the frontend can display it in the dashboard.

**Acceptance Criteria**:

- Given a project with an analyzed snapshot
- When `GET /api/v1/projects/{project_id}/context` is called
- Then the latest AI analysis is returned
- And if no analysis exists, a 404 is returned with a message suggesting to sync and analyze

**API Endpoint**:
```
GET /api/v1/projects/{project_id}/context
Response: { summary, stack, architecture, modules, dependencies, observations, analyzed_at }
```

**Effort**: 1 SP

---

**US-BE-5.4: AI Context Tests**

- **As a** Backend Engineer,
- **I want to** write tests for AI context generation (mocked AI provider).

**Effort**: 2 SP

---

## Epic 6: AI — Note Enrichment

**Priority**: Must Have (MVP)  
**Effort**: 6 story points  
**Owner**: Backend Engineer

### Backend Tasks

**US-BE-6.1: Note Classification Service**

- **As a** Backend Engineer,
- **I want to** implement AI-based note classification,
- **So that** the system can suggest what to do with a note.

**Acceptance Criteria**:

- Given a newly created note
- When the enrichment service processes it
- Then the AI classifies the note as one of: TASK, ARCHITECTURE_DECISION, GENERAL
- And returns a confidence score (0-1)
- And the suggestion is stored in the note metadata (not auto-applied)
- And if confidence < 0.7, no suggestion is shown

**Technical Notes**:

- Add `ai_suggestion` (JSONB, nullable) field to ProjectNote model
- `application/use_cases/enrich_note.py`
- Uses same `GeminiAiProvider` with a different prompt
- This runs **async after note creation** — does not block the response
- FastAPI `BackgroundTasks` for the async execution

**Enrichment flow**:
```
1. User creates note → 201 returned immediately
2. Background: AI classifies note
3. Background: ai_suggestion field updated
4. Frontend polls or fetches note to see suggestion
```

**AI suggestion format**:
```json
{
  "suggested_type": "TASK",
  "confidence": 0.89,
  "suggested_title": "Investigate Redis for caching"
}
```

**Effort**: 3 SP

---

**US-BE-6.2: Enrich Note Endpoint (manual trigger)**

- **As a** Backend Engineer,
- **I want to** allow manual re-enrichment of a note,
- **So that** users can ask the AI to re-classify if needed.

**Acceptance Criteria**:

- Given an existing note
- When `POST /api/v1/notes/{id}/enrich` is called
- Then the AI re-classifies the note
- And the ai_suggestion is updated
- And a 200 with the new suggestion is returned

**API Endpoint**:
```
POST /api/v1/notes/{id}/enrich
Response: { suggested_type, confidence, suggested_title }
```

**Effort**: 1 SP

---

**US-BE-6.3: Note Enrichment Migration**

- **As a** Backend Engineer,
- **I want to** add the `ai_suggestion` column to the notes table.

**Effort**: 1 SP

---

**US-BE-6.4: Note Enrichment Tests**

- **As a** Backend Engineer,
- **I want to** write tests for note enrichment (mocked AI).

**Effort**: 1 SP

---

## Epic 7: Activity Feed

**Priority**: Must Have (MVP)  
**Effort**: 5 story points  
**Owner**: Backend Engineer

### Backend Tasks

**US-BE-7.1: ActivityEvent Domain Model & Repository**

- **As a** Backend Engineer,
- **I want to** implement an activity event model,
- **So that** the workspace can display recent project activity.

**Acceptance Criteria**:

- Given the domain layer
- When I implement the ActivityEvent entity
- Then it includes: id, project_id, event_type (enum), title, metadata (JSON), created_at
- And event_type enum: COMMIT, NOTE_CREATED, TASK_CREATED, TASK_COMPLETED, CONTEXT_GENERATED, REPO_SYNCED
- And events are immutable (create-only, no update/delete)

**Technical Notes**:

- `domain/entities/activity_event_entity.py`
- `domain/repositories/activity_event_repository.py` (ABC: save, list_by_project)
- Events are created by other use cases (e.g., after sync, after note creation)
- Lightweight — just a log of what happened

**Effort**: 2 SP

---

**US-BE-7.2: Activity Feed API Endpoint**

- **As a** Backend Engineer,
- **I want to** expose the activity feed for a project,
- **So that** users can see what happened recently.

**Acceptance Criteria**:

- Given a project with activity events
- When `GET /api/v1/projects/{project_id}/activity` is called
- Then the last 50 events are returned (newest first)
- And pagination is supported
- And events can be filtered by type

**API Endpoint**:
```
GET /api/v1/projects/{project_id}/activity?type=COMMIT&page=1&size=50
Response: { items: [{ id, event_type, title, metadata, created_at }], total, page, size }
```

**Effort**: 2 SP

---

**US-BE-7.3: Activity Event Tests**

- **As a** Backend Engineer,
- **I want to** write tests for the activity feed.

**Effort**: 1 SP

---

## Epic 8: Dashboard API

**Priority**: Must Have (MVP)  
**Effort**: 4 story points  
**Owner**: Backend Engineer

### Backend Tasks

**US-BE-8.1: Project Dashboard Endpoint**

- **As a** Backend Engineer,
- **I want to** implement a dashboard endpoint per project,
- **So that** the frontend can render the workspace home view in a single call.

**Acceptance Criteria**:

- Given a project with data
- When `GET /api/v1/projects/{project_id}/dashboard` is called
- Then it returns an aggregated view:
  - Project info (name, description, repo URL)
  - Task counts by status (todo, in_progress, done)
  - Last 5 notes (newest)
  - Last 5 activity events
  - Context summary (if available): stack, architecture, summary
  - Last sync date (if connected to GitHub)
- And the response is optimized (single DB round-trip where possible)
- And response time is under 300ms

**API Endpoint**:
```
GET /api/v1/projects/{project_id}/dashboard
Response: {
  project: { id, name, description, github_repo_url },
  tasks: { todo: 5, in_progress: 2, done: 10 },
  recent_notes: [...],
  recent_activity: [...],
  context: { summary, stack, architecture } | null,
  last_synced_at: "2026-07-29T..." | null
}
```

**Effort**: 3 SP

---

**US-BE-8.2: Dashboard Tests**

- **As a** Backend Engineer,
- **I want to** write tests for the dashboard endpoint.

**Effort**: 1 SP

---

## Summary

### Total Backend Effort by Epic

| Epic | Story Points | Phase |
|------|-------------|-------|
| Epic 0: Authentication | 11 SP | ✅ Done |
| Epic 1: Projects & Workspace | 8 SP | MVP |
| Epic 2: Quick Notes | 8 SP | MVP |
| Epic 3: Lightweight Tasks | 7 SP | MVP |
| Epic 4: GitHub Integration | 10 SP | MVP |
| Epic 5: AI — Context Generation | 8 SP | MVP |
| Epic 6: AI — Note Enrichment | 6 SP | MVP |
| Epic 7: Activity Feed | 5 SP | MVP |
| Epic 8: Dashboard | 4 SP | MVP |
| **Total** | **67 SP** | |

### Suggested Implementation Order

```
Epic 0 (Done) → Epic 1 → Epic 2 → Epic 3 → Epic 4 → Epic 5 → Epic 6 → Epic 7 → Epic 8
                 ↑ Core CRUD ↑        ↑ Integration ↑     ↑ AI Layer ↑    ↑ Aggregation ↑
```

Epics 1, 2, 3 can be developed in parallel (no dependencies between them beyond Project existing).  
Epic 5 depends on Epic 4 (needs synced data).  
Epic 6 depends on Epic 2 (needs notes).  
Epic 7 is fed by Epics 2, 3, 4.  
Epic 8 aggregates everything.

### Architecture Principles

- Follow **Clean Architecture** with clear layer separation
- Each repository is a standalone **ABC contract** (no generic BaseRepository)
- Use cases injected directly via FastAPI `Depends()` (no service wrappers)
- **Domain validators** for business rules
- **Gemini Flash** as AI provider (abstracted behind ABC)
- Background tasks for non-blocking AI operations
- GitHub integration via REST API (no heavy SDK)
- All entities use **EntityId** value object for IDs
- Entities inherit from **BaseEntity** (id, created_at, updated_at)

### Technology Stack

- **Framework**: FastAPI (async)
- **Language**: Python 3.11+
- **Database**: PostgreSQL with SQLAlchemy (async) + Alembic
- **Authentication**: JWT (PyJWT)
- **Password Hashing**: SHA-256 pre-hash + bcrypt
- **AI Provider**: Google Gemini Flash (`google-generativeai`)
- **GitHub**: REST API with OAuth App
- **Email**: Resend
- **Testing**: pytest
- **Rate Limiting**: In-memory (upgradeable to Redis)

---

**Last Updated**: July 29, 2026  
**Version**: 2.0 — Workspace Flow
