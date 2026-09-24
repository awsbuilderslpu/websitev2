import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Build } from "@/components/landing/build";
import { Community } from "@/components/landing/community";
import { Philosophy } from "@/components/landing/philosophy";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Build />
        <Community />
        <Philosophy />
      </main>
    </>
  );
}