import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';
import { UIProvider } from './lib/uiStore';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { AIAssistant } from './components/layout/AIAssistant';
import { FloatingAIButton } from './components/layout/FloatingAIButton';
import { ToastContainer } from './components/ui/Toast';
import { DashboardPage } from './pages/Dashboard';
import { ProjectsPage } from './pages/Projects';
import { ProjectDetailPage } from './pages/ProjectDetail';
import { WorkflowPage } from './pages/Workflow';
import { CalendarPage } from './pages/Calendar';
import { AnalyticsPage } from './pages/Analytics';
import { NotificationsPage } from './pages/Notifications';
import { ActivityPage } from './pages/Activity';
import { TeamPage } from './pages/Team';
import { FilesPage } from './pages/Files';
import { AIPage } from './pages/AI';
import { OrganizationPage } from './pages/Organization';
import { SettingsPage } from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <UIProvider>
        <BrowserRouter>
          <div className="min-h-screen flex bg-[var(--bg)]">
            <Sidebar />
            <div className="flex-1 min-w-0 flex flex-col">
              <TopBar />
              <main className="flex-1 overflow-x-hidden">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:id" element={<ProjectDetailPage />} />
                  <Route path="/workflow" element={<WorkflowPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/activity" element={<ActivityPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/files" element={<FilesPage />} />
                  <Route path="/ai" element={<AIPage />} />
                  <Route path="/organization" element={<OrganizationPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </main>
            </div>
            <CommandPalette />
            <AIAssistant />
            <FloatingAIButton />
            <ToastContainer />
          </div>
        </BrowserRouter>
      </UIProvider>
    </ThemeProvider>
  );
}
