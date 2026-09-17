import Header from "@/components/customer/Header";
import CategorySection from "@/components/customer/home/CategorySection";
import CraftsmanshipBanner from "@/components/customer/home/CraftsmanshipBanner";
import Footer from "@/components/customer/Footer";
import HeroSection from "@/components/customer/home/HeroSection";
import ProfessionalCTA from "@/components/customer/home/ProfessionalCTA";
import SignatureProducts from "@/components/customer/home/SignatureProducts";
import TrustStrip from "@/components/customer/home/TrustStrip";
import WhyChooseFTC from "@/components/customer/home/WhyChooseFTC";

export default function Home() {
  return (
    <>
      <Header />

      <main className="bg-white">
        <HeroSection />
         <TrustStrip />
         <CategorySection />
         <SignatureProducts />
         <CraftsmanshipBanner />
         <WhyChooseFTC />
         <ProfessionalCTA />
      </main>

      <Footer />
    </>
  );
}