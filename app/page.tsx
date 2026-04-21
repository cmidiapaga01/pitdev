import TopNavBar from "@/components/navigation/TopNavBar";
import SecondaryNav from "@/components/navigation/SecondaryNav";
import HeroSlider from "@/components/home/HeroSlider";
import HeroPromo from "@/components/home/HeroPromo";
import BookingSection from "@/components/booking/BookingSection";
import TestimonialsSection from "@/app/landingpage/sections/TestimonialsSection";
import TrustBar from "@/app/landingpage/sections/TrustBar";
import FeaturesSection from "@/app/landingpage/sections/FeaturesSection";
import ServicesSection from "@/app/landingpage/sections/ServicesSection";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const heroSlides = [
  { image: "/assets/images/hero-1.jpg", name: "Happy dogs playing" },
  { image: "/assets/images/hero-2.jpg", name: "Dog on playground" },
  { image: "/assets/images/hero-3.jpg", name: "Dog in pool" },
  { image: "/assets/images/hero-4.jpg", name: "Dog swimming" },
  { image: "/assets/images/hero-5.jpg", name: "Dog in ball pit" },
];

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "PitPet Store",
    url: "https://pitpetstore.com.br",
    description:
      "PitPet Store — Hotel, creche e banho & tosa para cães. Cuidado humanizado 24h/dia, desde 2019.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
    },
    sameAs: ["https://www.instagram.com/pitpetstore"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <TopNavBar />
      <SecondaryNav />

      <HeroSlider slides={heroSlides} />

      <BookingSection />
      <TestimonialsSection />

      <HeroPromo
        title="Seu pet merece as melhores férias."
        subtitle="No PitPet, seu animalzinho fica solto, feliz e bem cuidado. Cuidado humanizado 24h por dia — como se fosse em casa."
        ctaText="Fazer Reserva"
        ctaLink="#reserva"
        image="/assets/images/hero-2.jpg"
        imageAlt="Cão feliz no PitPet"
      />
      
      <ServicesSection />
      <TrustBar />
      <FeaturesSection imageSrc="/assets/images/hero-4.jpg" />
      <FloatingWhatsApp message="Olá! Gostaria de informações sobre o PitPet Store 🐾" />

      <Footer />
    </>
  );
}
