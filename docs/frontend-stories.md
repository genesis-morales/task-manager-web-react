# Frontend Engineer User Stories — Workspace Flow

## Overview

The Frontend Engineer is responsible for implementing the user interface, user experience, state management, and client-side functionality using React and TypeScript. This document reflects the new product direction: **an AI-assisted developer workspace that transforms repository metadata and unstructured notes into structured project context.**

---

## Epic 0: User Authentication & Account Management

**Priority**: Must Have (MVP)  
**Status**: Ready to implement  
**Frontend Effort**: 10 story points

### Frontend Tasks

**US-FE-0.1: Registration Form Component**

- **As a** Frontend Engineer,
- **I want to** create a user registration form,
- **So that** new users can sign up for the application.

**Acceptance Criteria**:

- Given the registration page
- When I create the registration form
- Then it includes fields for email, username, and password
- And it validates email format client-side
- And it validates password complexity (min 8 chars, uppercase, lowercase, number)
- And it shows validation errors inline
- And it displays loading state during submission
- And it shows success message and redirects to login
- And it informs user to check email for verification

**Technical Notes**:

- Use Ant Design Form component
- Implement Zod for validation schema
- Show password strength indicator
- Display API errors clearly (409 for duplicates, 400 for validation)
- Responsive design for mobile

**Effort**: 2 SP

---

**US-FE-0.2: Login Form Component**

- **As a** Frontend Engineer,
- **I want to** create a login form,
- **So that** users can authenticate.

**Acceptance Criteria**:

- Given the login page
- When I create the login form
- Then it includes fields for email and password
- And it validates required fields
- And it shows loading state during authentication
- And it stores JWT tokens securely
- And it redirects to workspace on success
- And it displays error for invalid credentials (401)
- And it displays rate limit message (429) after 5 failed attempts

**Technical Notes**:

- Use Ant Design Form component
- Store access_token and refresh_token in memory + localStorage
- Link to forgot password page
- Responsive design for mobile

**Effort**: 2 SP

---

**US-FE-0.3: Authentication State Management**

- **As a** Frontend Engineer,
- **I want to** implement authentication state management,
- **So that** the app knows when users are logged in.

**Acceptance Criteria**:

- Given the application structure
- When I implement auth state
- Then I create:
  - Auth context for user state (user data + tokens)
  - Actions for login, logout, token refresh
  - Persistent auth state across page reloads
- And expired tokens trigger automatic refresh
- And failed refresh triggers logout
- And API calls include Authorization header automatically

**Technical Notes**:

- Use Context API + useReducer (simple, no Redux needed for auth)
- Implement axios interceptor for auth header
- Implement axios interceptor for 401 → refresh token → retry
- Handle token expiry proactively (decode JWT exp claim)

**Effort**: 2 SP

---

**US-FE-0.4: Protected Routes**

- **As a** Frontend Engineer,
- **I want to** implement protected routes,
- **So that** unauthenticated users cannot access the workspace.

**Acceptance Criteria**:

- Given the routing configuration
- When I implement route protection
- Then unauthenticated users are redirected to login
- And authenticated users can access protected routes
- And redirect preserves the intended destination URL
- And loading state shows while checking auth

**Technical Notes**:

- Create ProtectedRoute wrapper component
- Use React Router v6
- Show loading spinner during auth check
- Public routes: /login, /register, /forgot-password, /reset-password, /verify-email

**Effort**: 1 SP

---

**US-FE-0.5: Password Reset Flow**

- **As a** Frontend Engineer,
- **I want to** implement password reset UI,
- **So that** users can recover their accounts.

**Acceptance Criteria**:

- Given forgot password and reset password pages
- When I implement the flow
- Then users can:
  - Request reset email with their email address
  - See confirmation message ("Check your email")
  - Click link in email to reach reset page
  - Enter new password (with validation)
  - See success message and redirect to login
- And expired tokens show clear error
- And password validation matches registration rules

**Technical Notes**:

- Two pages: ForgotPassword (`/forgot-password`), ResetPassword (`/reset-password?token=...`)
- Extract token from URL query parameter
- Responsive design for mobile

**Effort**: 2 SP

---

**US-FE-0.6: Email Verification Page**

- **As a** Frontend Engineer,
- **I want to** create an email verification page,
- **So that** users can confirm their email address.

**Acceptance Criteria**:

- Given the verify-email page
- When user arrives via email link
- Then the token is extracted from URL and sent to API
- And success shows "Email verified" with link to login
- And expired/invalid token shows clear error with option to resend

**Technical Notes**:

- Page: `/verify-email?token=...`
- Auto-submit on mount (no button needed)
- Show loading → success/error states

**Effort**: 1 SP

---

## Epic 1: Project & Workspace Management

**Priority**: Must Have (MVP)  
**Frontend Effort**: 8 story points

### Frontend Tasks

**US-FE-1.1: Projects List View**

- **As a** Frontend Engineer,
- **I want to** create a projects list view,
- **So that** users can see all their workspaces.

**Acceptance Criteria**:

- Given the projects page (home after login)
- When I create the projects list
- Then it displays:
  - Project cards with name, description, GitHub repo indicator
  - Last activity date
  - Action buttons (open, edit, delete)
- And empty state shows when no projects exist (with CTA to create)
- And loading skeleton displays while fetching

**Technical Notes**:

- Use Ant Design Card in responsive grid
- This is the **landing page** after login — not a sidebar item
- Cards should feel like "workspace entries", not generic CRUD items
- Show GitHub icon if repo is connected

**Effort**: 2 SP

---

**US-FE-1.2: Project Creation Modal**

- **As a** Frontend Engineer,
- **I want to** create a project creation modal,
- **So that** users can set up new workspaces.

**Acceptance Criteria**:

- Given the projects page
- When user clicks "New Project"
- Then a modal opens with:
  - Project name (required)
  - Description (optional)
  - GitHub repo URL (optional — can be added later)
- And it validates name uniqueness per user (409 from API)
- And it closes and refreshes list on success

**Technical Notes**:

- Use Ant Design Modal + Form
- GitHub URL field is optional — integration happens in Epic 4
- Keep it minimal — workspace starts empty and grows

**Effort**: 2 SP

---

**US-FE-1.3: Project Workspace Layout**

- **As a** Frontend Engineer,
- **I want to** create the workspace layout for a project,
- **So that** all workspace sections are accessible from one place.

**Acceptance Criteria**:

- Given a project workspace
- When user opens a project
- Then the layout includes:
  - Sidebar navigation: Dashboard, Notes, Tasks, Activity, Settings
  - Main content area
  - Project name in header/breadcrumb
  - Back to projects link
- And navigation highlights active section
- And layout is responsive (sidebar collapses on mobile)

**Technical Notes**:

- Use Ant Design Layout (Sider + Content)
- React Router nested routes: `/projects/:id/dashboard`, `/projects/:id/notes`, etc.
- Dashboard is the default view when opening a project
- Sidebar icons: home, edit, check-square, activity, settings

**Effort**: 3 SP

---

**US-FE-1.4: Project Settings Page**

- **As a** Frontend Engineer,
- **I want to** create a project settings page,
- **So that** users can edit or delete their project.

**Acceptance Criteria**:

- Given the project settings page
- When user navigates to settings
- Then they can:
  - Edit project name and description
  - See/modify GitHub repo URL
  - Delete project (with confirmation warning)
- And delete confirmation warns about cascading data loss
- And successful delete redirects to projects list

**Technical Notes**:

- Use Ant Design Form + Popconfirm for delete
- Include danger zone section for destructive actions
- Route: `/projects/:id/settings`

**Effort**: 1 SP

---

## Epic 2: Quick Notes

**Priority**: Must Have (MVP)  
**Frontend Effort**: 9 story points

### Frontend Tasks

**US-FE-2.1: Notes List View**

- **As a** Frontend Engineer,
- **I want to** create a notes list within the workspace,
- **So that** users can see all their captured ideas.

**Acceptance Criteria**:

- Given the notes section of a workspace
- When I create the notes list
- Then it displays:
  - Notes in reverse chronological order
  - Note content preview (truncated)
  - Note type badge (RAW, TASK, ARCHITECTURE_DECISION)
  - AI suggestion indicator (if enriched)
  - Created date
- And notes can be filtered by type
- And pagination is supported
- And empty state encourages capturing ideas

**Technical Notes**:

- Route: `/projects/:id/notes`
- Use Ant Design List with compact cards
- Type filter as tabs or segmented control (All | Raw | Tasks | Decisions)
- AI suggestion shows as subtle chip/badge

**Effort**: 2 SP

---

**US-FE-2.2: Quick Note Input**

- **As a** Frontend Engineer,
- **I want to** create a quick note input,
- **So that** users can capture ideas with minimal friction.

**Acceptance Criteria**:

- Given the notes section
- When user wants to add a note
- Then there is an always-visible input at the top
- And pressing Enter or clicking a button creates the note
- And the note appears immediately in the list (optimistic)
- And the input clears after submission
- And multiline is supported (Shift+Enter for newline)

**Technical Notes**:

- Think of it like a "tweet box" or Slack message input — low friction
- Use Ant Design Input.TextArea with auto-resize
- Optimistic UI: add to list immediately, revert on error
- This is the **core UX** of the notes feature — must feel instant

**Effort**: 2 SP

---

**US-FE-2.3: AI Suggestion Display & Action**

- **As a** Frontend Engineer,
- **I want to** display AI suggestions on notes and let users act on them,
- **So that** ideas can be converted into actions.

**Acceptance Criteria**:

- Given a note with an AI suggestion
- When the suggestion is available
- Then it displays:
  - Suggested action ("Convert to task?", "Save as architecture decision?")
  - Suggested title (if applicable)
  - Accept and Dismiss buttons
- And clicking Accept calls the convert endpoint
- And the note updates its type after conversion
- And dismissed suggestions don't reappear
- And notes without suggestions show nothing (no empty UI)

**Technical Notes**:

- Show suggestion as a subtle callout below the note content
- Only show if `ai_suggestion` is not null and confidence >= 0.7
- Accept button calls `POST /api/v1/notes/{id}/convert`
- After conversion, note type badge updates
- Poll notes or refetch after a few seconds to pick up async AI enrichment

**Effort**: 3 SP

---

**US-FE-2.4: Note Detail & Edit**

- **As a** Frontend Engineer,
- **I want to** allow users to view and edit note details,
- **So that** they can expand on their ideas.

**Acceptance Criteria**:

- Given a note in the list
- When user clicks on it
- Then a detail view/drawer opens showing:
  - Full content (editable)
  - Note type
  - AI suggestion (if any)
  - Created/updated dates
  - Delete button
- And changes save on blur or submit
- And delete has confirmation

**Technical Notes**:

- Use Ant Design Drawer (slide from right)
- Inline editing with auto-save (debounced 500ms)
- Delete with Popconfirm

**Effort**: 2 SP

---

## Epic 3: Lightweight Tasks

**Priority**: Must Have (MVP)  
**Frontend Effort**: 9 story points

### Frontend Tasks

**US-FE-3.1: Task Kanban Board**

- **As a** Frontend Engineer,
- **I want to** create a kanban board for tasks,
- **So that** users can visualize and manage their tasks.

**Acceptance Criteria**:

- Given the tasks section of a workspace
- When I create the kanban board
- Then it displays:
  - Three columns: TODO, IN_PROGRESS, DONE
  - Task cards with title, priority badge, source note indicator
  - Column headers with task counts
  - Drag-and-drop between columns
- And status updates on drop (PATCH to API)
- And mobile shows columns as tabs or horizontal scroll
- And empty columns show "No tasks" placeholder

**Technical Notes**:

- Route: `/projects/:id/tasks`
- Use @dnd-kit (lighter and better maintained than react-beautiful-dnd)
- Optimistic update on drop, revert on error
- Priority colors: LOW=gray, MEDIUM=blue, HIGH=orange
- If task came from a note, show small link icon

**Effort**: 3 SP

---

**US-FE-3.2: Task Creation**

- **As a** Frontend Engineer,
- **I want to** create tasks within the workspace,
- **So that** users can track work.

**Acceptance Criteria**:

- Given the tasks section
- When user clicks "Add Task" (per column or global)
- Then a form appears with:
  - Title (required)
  - Description (optional)
  - Priority selector (LOW, MEDIUM, HIGH)
  - Status pre-selected based on which column was clicked
- And task appears in the board immediately on save
- And form is minimal — no overwhelm

**Technical Notes**:

- Use Ant Design Modal or inline form at top of column
- Default priority: MEDIUM
- Keep it fast — no unnecessary fields
- "Add task" button in each column header

**Effort**: 2 SP

---

**US-FE-3.3: Task Detail & Edit**

- **As a** Frontend Engineer,
- **I want to** view and edit task details,
- **So that** users can manage task information.

**Acceptance Criteria**:

- Given a task card on the board
- When user clicks on it
- Then a drawer/modal opens showing:
  - Title (editable)
  - Description (editable, supports basic formatting)
  - Status selector
  - Priority selector
  - Source note link (if created from note)
  - Created/updated dates
  - Delete button
- And changes save on submit
- And board updates after changes

**Technical Notes**:

- Use Ant Design Drawer
- If task has `source_note_id`, show link back to the note
- Delete with Popconfirm

**Effort**: 2 SP

---

**US-FE-3.4: Task Filtering**

- **As a** Frontend Engineer,
- **I want to** filter tasks,
- **So that** users can focus on specific work.

**Acceptance Criteria**:

- Given the task board
- When I implement filtering
- Then users can filter by:
  - Priority (multi-select)
  - Search by title (debounced)
- And filtered-out cards are hidden (not removed from state)
- And active filter is visually indicated
- And "Clear" button resets filters

**Technical Notes**:

- Filter bar above the kanban board
- Client-side filtering (tasks already loaded)
- Use Ant Design Select + Input.Search

**Effort**: 2 SP

---

## Epic 4: GitHub Integration

**Priority**: Must Have (MVP)  
**Frontend Effort**: 6 story points

### Frontend Tasks

**US-FE-4.1: GitHub Connection UI**

- **As a** Frontend Engineer,
- **I want to** create UI for connecting GitHub,
- **So that** users can link their GitHub account.

**Acceptance Criteria**:

- Given the project settings page (or a dedicated integrations section)
- When I create the GitHub connection UI
- Then it displays:
  - "Connect GitHub" button (if not connected)
  - Connected status with GitHub username (if connected)
  - Disconnect button
- And clicking connect redirects to GitHub OAuth
- And after OAuth callback, status updates to connected
- And disconnect removes the connection with confirmation

**Technical Notes**:

- Add to project settings under "Integrations" section
- Handle OAuth redirect: `/integrations/github/callback`
- Store connection status from API
- Show GitHub avatar/username when connected

**Effort**: 2 SP

---

**US-FE-4.2: Repository Sync Trigger & Status**

- **As a** Frontend Engineer,
- **I want to** allow users to trigger repo sync and see its status,
- **So that** the workspace gets project context data.

**Acceptance Criteria**:

- Given a project with GitHub connected and repo URL configured
- When user clicks "Sync Repository"
- Then:
  - Loading state shows during sync
  - Success message shows on completion
  - Last synced timestamp updates
  - "Analyze with AI" button becomes available (if not analyzed yet)
- And if no repo URL is set, prompt user to add one in settings
- And errors show clear message (e.g., repo not found, rate limit)

**Technical Notes**:

- Sync button in project dashboard or settings
- Calls `POST /api/v1/projects/{id}/sync`
- After sync, enable "Analyze" button which calls `POST /api/v1/projects/{id}/analyze`
- Show last_synced_at in dashboard

**Effort**: 2 SP

---

**US-FE-4.3: AI Analysis Trigger & Display**

- **As a** Frontend Engineer,
- **I want to** trigger AI analysis and display the generated context,
- **So that** users can see their project's structured overview.

**Acceptance Criteria**:

- Given a synced project
- When user clicks "Analyze with AI" or views the context section
- Then:
  - Loading state shows during analysis
  - Generated context displays: summary, stack, architecture, modules, dependencies, observations
  - Each section is visually distinct (cards or sections)
  - "Re-analyze" button allows regeneration
- And if no context exists, empty state suggests syncing first
- And context section is prominent in the dashboard

**Technical Notes**:

- Calls `POST /api/v1/projects/{id}/analyze` to generate
- Calls `GET /api/v1/projects/{id}/context` to display
- Display stack as tags/badges
- Show modules as a list
- Show observations as info/warning cards
- This is the **hero section** of the dashboard — make it visually strong

**Effort**: 2 SP

---

## Epic 5: Activity Feed

**Priority**: Must Have (MVP)  
**Frontend Effort**: 4 story points

### Frontend Tasks

**US-FE-5.1: Activity Feed Component**

- **As a** Frontend Engineer,
- **I want to** create an activity feed for the workspace,
- **So that** users can see what happened recently in their project.

**Acceptance Criteria**:

- Given the activity section of a workspace
- When I create the activity feed
- Then it displays:
  - Events in reverse chronological order
  - Event type icon (commit, note, task, sync, analysis)
  - Event title/description
  - Relative timestamp ("2 hours ago")
  - Type filter (optional)
- And pagination/infinite scroll for older events
- And empty state when no activity exists

**Technical Notes**:

- Route: `/projects/:id/activity`
- Use Ant Design Timeline component
- Icons per type: git-commit, edit, check-square, refresh-cw, cpu
- Also show a mini version (last 5 events) in the dashboard

**Effort**: 2 SP

---

**US-FE-5.2: Activity in Dashboard (Mini Feed)**

- **As a** Frontend Engineer,
- **I want to** show recent activity in the dashboard,
- **So that** users see project pulse at a glance.

**Acceptance Criteria**:

- Given the project dashboard
- When I create the mini activity feed
- Then it shows:
  - Last 5 activity events
  - Compact format (icon + title + time)
  - "View all" link to full activity page
- And it loads as part of the dashboard API call

**Technical Notes**:

- Part of the dashboard aggregated response
- Reuse ActivityEvent component in compact mode
- No pagination needed — just last 5

**Effort**: 2 SP

---

## Epic 6: Project Dashboard

**Priority**: Must Have (MVP)  
**Frontend Effort**: 8 story points

### Frontend Tasks

**US-FE-6.1: Dashboard Layout**

- **As a** Frontend Engineer,
- **I want to** create the workspace dashboard,
- **So that** users get a complete overview of their project.

**Acceptance Criteria**:

- Given the project dashboard (default view when opening a project)
- When I create the layout
- Then it includes:
  - Project context section (AI-generated summary, stack, architecture) — hero area
  - Task summary cards (TODO, IN_PROGRESS, DONE counts)
  - Recent notes (last 5)
  - Recent activity (last 5 events)
  - Sync status (last synced date, sync/analyze buttons)
- And layout is responsive (stacks vertically on mobile)
- And sections load with skeleton states
- And empty project shows onboarding flow ("Connect repo → Sync → Analyze")

**Technical Notes**:

- Route: `/projects/:id/dashboard` (or just `/projects/:id`)
- Single API call: `GET /api/v1/projects/{id}/dashboard`
- Use CSS Grid for desktop (2 columns), stack for mobile
- Context section at the top — it's the product's differentiator
- Empty state = onboarding guide, not just "nothing here"

**Effort**: 3 SP

---

**US-FE-6.2: Task Summary Cards**

- **As a** Frontend Engineer,
- **I want to** display task count cards in the dashboard,
- **So that** users see quick metrics.

**Acceptance Criteria**:

- Given the dashboard
- When task data is loaded
- Then cards display:
  - TODO count
  - IN_PROGRESS count
  - DONE count
- And cards are clickable (navigate to tasks filtered by status)
- And cards show loading skeleton while fetching

**Technical Notes**:

- Use Ant Design Statistic or custom compact cards
- Color coding: TODO=blue, IN_PROGRESS=orange, DONE=green
- Click navigates to `/projects/:id/tasks?status=TODO`

**Effort**: 1 SP

---

**US-FE-6.3: Project Context Display**

- **As a** Frontend Engineer,
- **I want to** display the AI-generated project context prominently,
- **So that** users see the value of the workspace immediately.

**Acceptance Criteria**:

- Given a project with analyzed context
- When the context section renders
- Then it shows:
  - Summary paragraph
  - Stack as colored tags/badges
  - Architecture type
  - Modules as a clean list
  - Dependencies as tags
  - Observations as info/warning callouts
- And if no context exists, show CTA: "Sync your repo to generate context"
- And "Re-analyze" button is available for refresh

**Technical Notes**:

- This is the same data from Epic 4 US-FE-4.3 but displayed in dashboard context
- Reuse the context display component
- Stack tags could use language-specific colors (Python=blue, JS=yellow, etc.)
- Observations with type: use Ant Design Alert (info/warning)

**Effort**: 2 SP

---

**US-FE-6.4: Recent Notes Widget**

- **As a** Frontend Engineer,
- **I want to** show recent notes in the dashboard,
- **So that** users see their latest captured ideas.

**Acceptance Criteria**:

- Given the dashboard
- When notes exist
- Then it shows:
  - Last 5 notes (content preview + type badge)
  - "View all" link to notes page
  - Quick note input (same as notes page)
- And clicking a note opens the note detail

**Technical Notes**:

- Include the quick note input here too — capture ideas from dashboard
- Reuse note list item component in compact mode

**Effort**: 2 SP

---

## Epic 7: User Experience & Polish

**Priority**: Must Have (MVP)  
**Frontend Effort**: 10 story points

### Frontend Tasks

**US-FE-7.1: Dark Mode**

- **As a** Frontend Engineer,
- **I want to** implement dark mode,
- **So that** developers can use their preferred theme.

**Acceptance Criteria**:

- Given the application
- When I implement dark mode
- Then:
  - All components support both themes
  - Toggle in header/sidebar
  - Preference saved in localStorage
  - System preference detected as default
  - Smooth transition between themes

**Technical Notes**:

- Use Ant Design's ConfigProvider `theme` prop
- CSS variables for custom colors
- Detect `prefers-color-scheme` media query
- Developers overwhelmingly prefer dark mode — make it good

**Effort**: 2 SP

---

**US-FE-7.2: Responsive Design**

- **As a** Frontend Engineer,
- **I want to** ensure the app works on all screen sizes,
- **So that** users can access their workspace from any device.

**Acceptance Criteria**:

- Given any page
- When viewed on different screen sizes
- Then:
  - Mobile (320-767px): single column, hamburger menu, touch-friendly
  - Tablet (768-1023px): adapted layout
  - Desktop (1024px+): full layout with sidebar
- And all interactions work on touch
- And minimum touch target is 44px

**Technical Notes**:

- Mobile-first CSS approach
- Sidebar collapses to hamburger on mobile
- Kanban board: horizontal scroll or tabs on mobile
- Test on real devices

**Effort**: 2 SP

---

**US-FE-7.3: Loading States & Skeletons**

- **As a** Frontend Engineer,
- **I want to** implement consistent loading states,
- **So that** the app feels responsive.

**Acceptance Criteria**:

- Given any async data fetch
- When data is loading
- Then:
  - Skeleton screens for lists and cards
  - Spinner for buttons and form submissions
  - No layout shift when data arrives
- And loading states match the content shape

**Technical Notes**:

- Use Ant Design Skeleton
- Create skeleton variants for: card, list item, dashboard section
- Never show blank white space during loading

**Effort**: 2 SP

---

**US-FE-7.4: Error Handling**

- **As a** Frontend Engineer,
- **I want to** implement consistent error handling,
- **So that** users understand what went wrong and how to recover.

**Acceptance Criteria**:

- Given any error
- When it occurs
- Then:
  - Toast/notification with clear message
  - Network errors suggest retry
  - 401 errors trigger re-auth
  - 429 errors show "try again later"
  - Unhandled errors caught by error boundary
- And errors never crash the app

**Technical Notes**:

- Use Ant Design notification/message
- Global axios error interceptor
- React Error Boundary at route level
- Log errors to console (monitoring service later)

**Effort**: 2 SP

---

**US-FE-7.5: Accessibility Basics**

- **As a** Frontend Engineer,
- **I want to** ensure basic accessibility compliance,
- **So that** the app is usable by everyone.

**Acceptance Criteria**:

- Given the application
- When audited for accessibility
- Then:
  - All interactive elements are keyboard accessible
  - Focus indicators are visible
  - Color contrast meets WCAG AA
  - Form labels are properly associated
  - Images/icons have alt text or aria-label
- And Lighthouse accessibility score > 90

**Technical Notes**:

- Ant Design handles much of this by default
- Add aria-labels to icon-only buttons
- Ensure logical tab order
- Test with keyboard navigation

**Effort**: 2 SP

---

## Summary

### Total Frontend Effort by Epic

| Epic | Frontend Story Points | Phase |
|------|----------------------|-------|
| Epic 0: Authentication | 10 SP | MVP |
| Epic 1: Projects & Workspace | 8 SP | MVP |
| Epic 2: Quick Notes | 9 SP | MVP |
| Epic 3: Lightweight Tasks | 9 SP | MVP |
| Epic 4: GitHub Integration | 6 SP | MVP |
| Epic 5: Activity Feed | 4 SP | MVP |
| Epic 6: Project Dashboard | 8 SP | MVP |
| Epic 7: UX & Polish | 10 SP | MVP |
| **Total** | **64 SP** | |

### Suggested Implementation Order

```
Epic 0 (Auth) → Epic 1 (Workspace shell) → Epic 2 (Notes) + Epic 3 (Tasks) → Epic 4 (GitHub) → Epic 6 (Dashboard) → Epic 5 (Activity) → Epic 7 (Polish)
```

- Epic 1 must be first (provides the layout/navigation for everything else)
- Epics 2 and 3 can be done in parallel
- Epic 4 before Epic 6 (dashboard needs context data)
- Epic 7 is continuous but formally last

### Eliminated from MVP

| Element | Reason |
|---------|--------|
| Calendar view | Not aligned with workspace concept |
| Google Calendar sync UI | Removed from product |
| Notification bell + system | Replaced by activity feed |
| i18n / Internationalization | Not needed for MVP |
| User profile editing | Keep minimal — view only for now |
| Kanban drag-and-drop rescheduling | No due dates in simplified tasks |
| Complex filtering (date ranges) | Over-engineering for MVP |

### Technology Stack

- **Framework**: React 18+ with functional components and hooks
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **UI Library**: Ant Design 5
- **State Management**: Context API + useReducer (auth), React Query (server state)
- **Routing**: React Router v6
- **Styling**: Ant Design tokens + CSS Modules where needed
- **API Client**: Axios with interceptors
- **Drag-and-Drop**: @dnd-kit
- **Testing**: Vitest + React Testing Library
- **Form Validation**: Zod
- **Date Handling**: date-fns
- **Code Quality**: ESLint, Prettier

### Architecture Principles

- **Feature-based folder structure** (not type-based)
- **React Query for server state** — no manual loading/error state management
- **Optimistic updates** for all mutations (notes, tasks, status changes)
- **Component composition** over prop drilling
- **Custom hooks** for reusable logic (useAuth, useProject, useNotes, etc.)
- **Lazy loading** for route-level code splitting
- **API layer abstraction** — all API calls in dedicated service files, not in components

---

**Last Updated**: July 29, 2026  
**Version**: 2.0 — Workspace Flow
