import { EngineSection } from "../components/EngineSection";
import { ResultsSection } from "../components/ResultsSection";
import { ServicePackagesSection } from "../components/ServicePlansSection";
import { ServicesOverviewSection } from "../components/ServicesOverviewSection";

export function ServicesPage() {
  return (
    <>
      <ServicesOverviewSection />
      <EngineSection />
      <ServicePackagesSection variant="page" />
      <ResultsSection />
    </>
  );
}
