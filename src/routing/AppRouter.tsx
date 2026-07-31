import React, { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../shared/components/protected-route/ProtectedRoute";
import AuthLayout from "../shared/components/auth-layout/AuthLayout";

// Auth pages
const Home = lazy(() => import("../features/home/pages/Home"));
const Login = lazy(() => import("../features/auth/pages/login/Login"));
const Register = lazy(() => import("../features/auth/pages/register/Register"));
const PasswordReset = lazy(() => import("../features/auth/pages/password-reset/PasswordReset"));
const ResetPasswordForm = lazy(() => import("../features/auth/components/reset-password/ResetPasswordForm"));

// App pages
const Projects = lazy(() => import("../features/projects/pages/projects/Projects"));
const ProjectWorkspace = lazy(() => import("../features/projects/pages/project-workspace/ProjectWorkspace"));
const Overview = lazy(() => import("../features/projects/pages/overview/Overview"));
const NotesView = lazy(() => import("../features/projects/pages/notes/NotesView"));
const TasksView = lazy(() => import("../features/projects/pages/tasks/TasksView"));
const ContextView = lazy(() => import("../features/projects/pages/context/ContextView"));
const ActivityView = lazy(() => import("../features/projects/pages/activity/ActivityView"));

// Loading fallback
const LoadingFallback = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg)',
  }}>
    <div style={{
      width: 32,
      height: 32,
      border: '3px solid var(--border)',
      borderTopColor: 'var(--accent)',
      borderRadius: '50%',
      animation: 'spin 0.6s linear infinite',
    }} />
  </div>
);

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/reset-password" element={
          <AuthLayout>
            <ResetPasswordForm />
          </AuthLayout>
        } />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Projects Home */}
          <Route path="/projects" element={<Projects />} />

          {/* Project Workspace with nested views */}
          <Route path="/projects/:id" element={<ProjectWorkspace />}>
            <Route index element={<Overview />} />
            <Route path="notes" element={<NotesView />} />
            <Route path="tasks" element={<TasksView />} />
            <Route path="context" element={<ContextView />} />
            <Route path="activity" element={<ActivityView />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
