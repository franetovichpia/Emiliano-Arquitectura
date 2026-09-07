import { AboutSection } from "@/components/sections/about-section";
import { BimViewerSection } from "@/components/sections/bim-viewer-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NewFormsTeaserSection } from "@/components/sections/new-forms-teaser-section";
import { ProfessionalProjectsSection } from "@/components/sections/professional-projects-section";
import { ReflectionsSection } from "@/components/sections/reflections-section";
import { ServicesSection } from "@/components/sections/services-section";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProfessionalProjectsSection />
      <BimViewerSection />
      <ContactSection />
      <ReflectionsSection />
      <NewFormsTeaserSection />
    </main>
  );
}