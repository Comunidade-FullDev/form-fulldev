'use client'
import AOS from "aos";
import "aos/dist/aos.css";
import { useState } from "react";
import AnimatedBackground from "@/components/Animate/BgAnimate";
import { CarouselSlides } from "@/components/Animate/CarouselSlides";
import { Contact } from "@/components/Sections_LP/Contact";
import { Copyright } from "@/components/Sections_LP/Copyright";
import { Differences } from "@/components/Sections_LP/Differences";
import { Header } from "@/components/Sections_LP/Header";
import { Hero } from "@/components/Sections_LP/Hero";
import { useEffect } from "react";
import TokenExpiredNotice from './../components/TokenExpired';
import Cookies from "js-cookie";



export default function Home(): JSX.Element {
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
    });

    const handleTokenExpired = () => {
      setShowModal(true);
    };

    window.addEventListener('tokenExpired', handleTokenExpired);

    return () => {
      window.removeEventListener('tokenExpired', handleTokenExpired);
    };
  }, []);
  
  return (
    <main className="relative h-screen w-full">
      <AnimatedBackground />
      <div className="absolute inset-0 flex flex-col z-10">
        <Header />
        <div>
          <Hero />
          <Differences />
          <CarouselSlides />
          <Contact />
          <Copyright />
          <TokenExpiredNotice showModal={showModal} setShowModal={setShowModal} />

        </div>
      </div>
    </main>
  );
}
