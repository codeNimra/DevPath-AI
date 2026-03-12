import { useApp }           from './context/AppContext';
import Sidebar              from './components/layout/Sidebar';
import Topbar               from './components/layout/Topbar';

import Dashboard            from './pages/Dashboard';
import GoalSetup            from './pages/GoalSetup';
import Roadmap              from './pages/Roadmap';
import CodeReview           from './pages/CodeReview';
import MockInterview        from './pages/MockInterview';
import ProjectIdeas         from './pages/ProjectIdeas';
import PortfolioAnalyzer    from './pages/PortfolioAnalyzer';
import Settings             from './pages/Settings';

const PAGES = {
  dashboard:  Dashboard,
  goalsetup:  GoalSetup,
  roadmap:    Roadmap,
  codereview: CodeReview,
  interview:  MockInterview,
  projects:   ProjectIdeas,
  portfolio:  PortfolioAnalyzer,
  settings:   Settings,
};

export default function App() {
  const { activePage, sidebarCollapsed } = useApp();

  const PageComponent = PAGES[activePage] ?? Dashboard;

  return (
    <div className="app-shell">
      <div className="grid-bg" aria-hidden="true" />

      <Sidebar />

      <main
        className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}
        id="main-content"
        role="main"
      >
        <Topbar />

        <PageComponent key={activePage} />
      </main>
    </div>
  );
}