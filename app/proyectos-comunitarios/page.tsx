import type { Metadata } from "next";

import { CommunityHeroSection } from "@/components/sections/community-hero-section";
import { ParticipatoryProjectsSection } from "@/components/sections/participatory-projects-section";
import { ResourcesSection } from "@/components/sections/resources-section";
import { SovereignContentSection } from "@/components/sections/sovereign-content-section";

export const metadata: Metadata = {
  title: "Proyectos comunitarios | Emiliano Gabriel Rossotti",
  description:
    "Proyectos participativos y soberanos, comunidades, mapas y recursos compartidos por Emiliano Gabriel Rossotti.",
};

export default function CommunityProjectsPage() {
  return (
    <main>
      <CommunityHeroSection />

      {/* Propuestas destacadas */}
      <ParticipatoryProjectsSection />

      {/* Proyectos amigos y contenidos relacionados */}
      <SovereignContentSection />

      {/* Recursos complementarios */}
      <ResourcesSection />
    </main>
  );
}