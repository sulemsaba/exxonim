import { useRef } from "react";
import { useHomeData } from "../hooks/useHomeData";
import { ErrorMessage } from "../components/ErrorMessage";
import { InsightsSection } from "../components/InsightsSection";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProviderSection } from "../components/ProviderSection";
import { ReferenceHero } from "../components/ReferenceHero";
import { ServicePackagesSection } from "../components/ServicePlansSection";
import { StackSection } from "../components/StackSection";
import { usePage } from "../hooks/usePage";
import { getHomeBlogPosts } from "../utils/blog";
import BlogsSection from "../components/BlogsSection";
import type { HomePageContent } from "../types";

/**
 * HomePage Component
 * 
 * Renders the homepage with integrated API data from the unified /api/home endpoint.
 * Includes hero, provider, stack, services, blogs, and insights sections.
 * 
 * Features:
 * - Resilient data loading with fallbacks
 * - Version-based cache invalidation
 * - Deterministic failure handling
 */
export function HomePage() {
  const railRef = useRef<HTMLDivElement>(null);
  
  // Use unified home API
  const { data: homeData, isPending: dataLoading, error: dataError } = useHomeData();
  
  // Fallback to original page data if needed
  const {
    data: page,
    isPending: pagePending,
    error: pageError,
  } = usePage<HomePageContent>("home");

  const scrollRail = (direction: number) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const firstCard = rail.querySelector<HTMLElement>(
      ".home-insights__card, .blog-card, .resource-card, .cx-post-card"
    );
    const scrollAmount = firstCard
      ? firstCard.getBoundingClientRect().width + 20
      : 360;

    rail.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  };

  // Determine critical failure condition
  const isCriticalFailure = dataError && pageError && !homeData && !page;

  if (dataLoading || pagePending) {
    return <LoadingSpinner label="Loading homepage..." />;
  }

  if (isCriticalFailure) {
    return (
      <ErrorMessage
        title="Unable to load the homepage."
        detail="Check that the page and API endpoints are available."
      />
    );
  }

  // Use new unified API data if available, fallback to old structure
  const heroContent = page?.content.hero;
  const blogPosts = homeData?.blogPosts || [];
  const insightsContent = page?.content.insights_section;

  if (!heroContent) {
    return (
      <ErrorMessage
        title="Homepage data is missing."
        detail="Hero section is required but not available."
      />
    );
  }

  return (
    <>
      {page && (
        <>
          <ReferenceHero content={page.content.hero} />
          <ProviderSection content={page.content.provider_section} />
          <StackSection
            items={page.content.stack_section.items}
            defaultFeatureRows={page.content.stack_section.default_feature_rows}
            featureVisualContentMap={page.content.stack_section.feature_visual_content}
          />
          <ServicePackagesSection />
          {insightsContent && (
            <InsightsSection
              content={insightsContent}
              posts={getHomeBlogPosts([])}
              railRef={railRef}
              onPrev={() => scrollRail(-1)}
              onNext={() => scrollRail(1)}
            />
          )}
        </>
      )}
      
      {/* Render blogs from unified API */}
      {blogPosts.length > 0 && <BlogsSection blogPosts={blogPosts} />}
    </>
  );
}