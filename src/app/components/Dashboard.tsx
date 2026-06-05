import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DashboardHome } from './DashboardHome';

export function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <DashboardHome />
        </main>
      </div>
    </div>
  );
}
