import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { HowItWorksSection } from './HowItWorksSection';
import { FeaturedMissionSection } from './FeaturedMissionSection';
import { FeatureCardsSection } from './FeatureCardsSection';
import { GamificationSection } from './GamificationSection';
import { CommunityScoreSection } from './CommunityScoreSection';
import { FinalCTASection } from './FinalCTASection';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturedMissionSection />
      <FeatureCardsSection />
      <GamificationSection />
      <CommunityScoreSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
