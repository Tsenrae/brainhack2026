import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { MissionHub } from './components/MissionHub';
import { SpotTheSpinQuiz } from './components/SpotTheSpinQuiz';
import { QuizFeedback } from './components/QuizFeedback';
import { ChainReaction } from './components/ChainReaction';
import { ShieldSquad } from './components/ShieldSquad';
import { MissionComplete } from './components/MissionComplete';
import { ShieldScanner } from './components/ShieldScanner';
import { ScannerResults } from './components/ScannerResults';
import { CommunitySubmit } from './components/CommunitySubmit';
import { CyberbullyingSupport } from './components/CyberbullyingSupport';
import { TelegramBot } from './components/TelegramBot';
import { GuardianHeatmap } from './components/GuardianHeatmap';
import { UserProfile } from './components/UserProfile';
import { Leaderboard } from './components/Leaderboard';
import { SquadsHub } from './components/SquadsHub';
import { AdminAnalytics } from './components/AdminAnalytics';
import { AdminVideoStudio } from './components/AdminVideoStudio';
import { ScenarioAcademy } from './components/ScenarioAcademy';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mission/digital-shield" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <MissionHub />
              </main>
            </div>
          </div>
        } />
        <Route path="/mission/digital-shield/spot-the-spin" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <SpotTheSpinQuiz />
              </main>
            </div>
          </div>
        } />
        <Route path="/mission/digital-shield/spot-the-spin/feedback" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <QuizFeedback />
              </main>
            </div>
          </div>
        } />
        <Route path="/mission/digital-shield/chain-reaction" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <ChainReaction />
              </main>
            </div>
          </div>
        } />
        <Route path="/mission/digital-shield/shield-squad" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <ShieldSquad />
              </main>
            </div>
          </div>
        } />
        <Route path="/mission/digital-shield/complete" element={<MissionComplete />} />
        <Route path="/scanner" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <ShieldScanner />
              </main>
            </div>
          </div>
        } />
        <Route path="/scanner/results" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <ScannerResults />
              </main>
            </div>
          </div>
        } />
        <Route path="/community/submit" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <CommunitySubmit />
              </main>
            </div>
          </div>
        } />
        <Route path="/support/cyberbullying" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <CyberbullyingSupport />
              </main>
            </div>
          </div>
        } />
        <Route path="/integrations/telegram" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <TelegramBot />
              </main>
            </div>
          </div>
        } />
        <Route path="/heatmap" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <GuardianHeatmap />
              </main>
            </div>
          </div>
        } />
        <Route path="/learn" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <ScenarioAcademy />
              </main>
            </div>
          </div>
        } />
        <Route path="/admin/video-studio" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-hidden">
                <AdminVideoStudio />
              </main>
            </div>
          </div>
        } />
        <Route path="/admin/analytics" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <AdminAnalytics />
              </main>
            </div>
          </div>
        } />
        <Route path="/leaderboard" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <Leaderboard />
              </main>
            </div>
          </div>
        } />
        <Route path="/squads" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <SquadsHub />
              </main>
            </div>
          </div>
        } />
        <Route path="/profile" element={
          <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto">
                <UserProfile />
              </main>
            </div>
          </div>
        } />
        <Route path="/architecture" element={<ArchitectureDiagram />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}