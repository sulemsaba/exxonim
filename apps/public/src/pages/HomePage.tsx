import { useRef } from "react";
import { ErrorMessage } from "../components/ErrorMessage";
import { InsightsSection } from "../components/InsightsSection";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProviderSection } from "../components/ProviderSection";
import { ReferenceHero } from "../components/ReferenceHero";
import { ServicePackagesSection } from "../components/ServicePlansSection";
import { StackSection } from "../components/StackSection";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import { getHomeBlogPosts } from "../utils/blog";
import type { HomePageContent } from "../types";

export function HomePage() {
  const railRef = useRef<HTMLDivElement>(null);
  const {
    data: page,
    isPending: pagePending,
    error: pageError,
  } = usePage<HomePageContent>("home");
  const {
    data: posts = [],
    isPending: postsPending,
    error: postsError,
  } = useBlogPosts();

  useResolvedPageSeo(page, routes.home);

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

  if (pagePending || postsPending) {
    return <LoadingSpinner label="Loading homepage..." />;
  }

  if (pageError || !page) {
    return (
      <ErrorMessage
        title="Unable to load the homepage."
        detail="Check that the page endpoint is available."
      />
    );
  }

  const homePosts = getHomeBlogPosts(posts);

  return (
    <>
      <ReferenceHero content={page.content.hero} />
      {page.content.provider_section && (
        <ProviderSection content={page.content.provider_section} />
      )}
      {page.content.stack_section && (
        <StackSection
          items={page.content.stack_section.items}
          defaultFeatureRows={page.content.stack_section.default_feature_rows}
          featureVisualContentMap={page.content.stack_section.feature_visual_content}
        />
      )}
      <ServicePackagesSection />
      {page.content.insights_section && !postsError && homePosts.length > 0 ? (
        <InsightsSection
          content={page.content.insights_section}
          posts={homePosts}
          railRef={railRef}
          onPrev={() => scrollRail(-1)}
          onNext={() => scrollRail(1)}
        />
      ) : null}
    </>
  );
}
