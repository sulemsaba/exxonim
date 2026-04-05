import { EngineSection } from "../components/EngineSection";
import { LoadBoundary } from "../components/LoadBoundary";
import { ServicePackagesSection } from "../components/ServicePlansSection";
import { ServicesOverviewSection } from "../components/ServicesOverviewSection";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import type { ServicesPageContent } from "../types";

export function ServicesPage() {
  const { data: page, isPending, error } = usePage<ServicesPageContent>("services");
  useResolvedPageSeo(page, routes.services);

  return (
    <LoadBoundary
      error={error}
      errorDetail="The services page content could not be loaded right now."
      errorTitle="Unable to load services."
      isPending={isPending}
      isReady={Boolean(page)}
      loadingLabel="Loading services..."
    >
      {() => (
        <>
        <ServicesOverviewSection content={page!.content.overview} />
        <EngineSection content={page!.content.catalog} />
        <ServicePackagesSection variant="page" />
        </>
      )}
    </LoadBoundary>
  );
}
