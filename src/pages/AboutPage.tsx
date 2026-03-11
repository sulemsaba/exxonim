import { ProviderSection } from "../components/ProviderSection";
import { ReferenceHero } from "../components/ReferenceHero";
import { StackSection } from "../components/StackSection";
import type { StackItem } from "../types";

interface AboutPageProps {
  stackItems: StackItem[];
}

export function AboutPage({ stackItems }: AboutPageProps) {
  return (
    <>
      <ReferenceHero />
      <ProviderSection />
      <StackSection items={stackItems} />
    </>
  );
}
