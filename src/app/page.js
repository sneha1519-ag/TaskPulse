import {CalendarManager} from "@/components/calendar-manager.jsx";
import Image from "next/image";
import HeroSection from "../components/herosection";
import Navbar from "@/components/navbar";
import Companies from "@/components/companies";
import Feature43 from "@/components/feature";
import Pricing from "@/components/pricing";
import FooterSection from "@/components/footer";
import ContentSection from "@/components/solution";
export default function Home() {
  return (
    <>
    <Navbar />
    <HeroSection />
    <Companies />
    <Feature43 />
    <ContentSection />
    <Pricing />
    <FooterSection />
    </>
  );
}
