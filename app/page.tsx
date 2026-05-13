"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, MapPin, Mail, FileText, Activity, Zap, 
  ShieldCheck, Brain, Leaf, CheckCircle, Download, Cpu, 
  Network, Map, Menu, X, Droplet, Sun, Layers, Wind, Users
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa";
import ModeToggle from "@/components/ui/mode-toggle"

export default function HomePage() {
  // 1. DEFINE SLIDE DATA 
  const videoSlides = [
    "/1.mp4", "/2.mp4", "/3.mp4", "/4.mp4", 
    "/5.mp4", "/6.mp4", "/7.mp4", "/8.mp4"
  ];

  // 2. STATE MANAGEMENT
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New State for Mobile Menu
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Add this definition above your component or inside the file
  type SelectedImage = {
    src: string;
    alt: string;
    type?: 'image' | 'video'; // Include this if you kept the video logic, otherwise optional
  };

  // Update the hook inside your component
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  // 2. Define image data array for cleaner rendering and easier click handling
  const researchImages = [
    { src: "/images/f1.JPG", alt: "Figure 1(a): High-Level System Architecture" },
    { src: "/images/f2.JPG", alt: "Figure 1(b): Data Source Integration Architecture" },
    { src: "/images/f3.JPG", alt: "Figure 1(c): Fusion Processing Architecture" },
    { src: "/images/f4.JPG", alt: "Figure 1(c): Sample topology" },
    { src: "/images/f5.JPG", alt: "Figure 1(c): Risk management" },
    { src: "/images/f6.JPG", alt: "Figure 1(d): End-to-End System Data Flow" },
  ];

  const nextSlide = () => {
    setCurrentSlideIdx((prevIdx) => (prevIdx === videoSlides.length - 1 ? 0 : prevIdx + 1));
  };

  const jumpToSlide = (index: number) => {
    setCurrentSlideIdx(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, 10000);
  };

  // 3. EFFECTS
  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 10000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const activeVideo = videoRefs.current[currentSlideIdx];
    if (activeVideo) {
      activeVideo.currentTime = 0; 
      setTimeout(() => {
          activeVideo.play().catch(e => console.log("Autoplay prevented:", e));
      }, 50);
    }
  }, [currentSlideIdx]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup listener when modal closes or component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  const shouldLoadVideo = (index: number) => {
    const total = videoSlides.length;
    const nextIdx = (currentSlideIdx + 1) % total;
    const prevIdx = (currentSlideIdx - 1 + total) % total;
    return index === currentSlideIdx || index === nextIdx || index === prevIdx;
  };

  // Shared Social Buttons Component - Responsive Sizing
  const SocialButtons = () => (
    <>
      {/* LinkedIn */}
      <Link href="https://www.linkedin.com/company/kraftgeneai" target="_blank">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-md text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
          <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </Link>

      {/* GitHub */}
      <Link href="https://github.com/KraftgeneAI/" target="_blank">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-md text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
          <FaGithub className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </Link>

      {/* Discord */}
      <Link href="https://discord.gg/xcW6GUsPdH" target="_blank">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-md text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
          <FaDiscord className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-white selection:bg-emerald-500/30 transition-colors duration-300">
      
{/* Navigation */}
<nav className="border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">

            {/* Logo & Brand - Left Side */}
             <div className="flex items-center space-x-2 z-50">
              <Link href="#about" className="flex items-center space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
                {/* Logo Container */}
                <div className="w-8 h-8 md:w-10 md:h-10 relative rounded overflow-hidden group-hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/new_logo.PNG"
                    alt="Kraftgene AI"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Brand Text Stack */}
                 <div className="flex flex-col justify-center">
                  <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-gray-300 transition-colors leading-none mb-1">
                    Kraftgene AI Inc.
                  </span>
                  {/* 2. Added "Made in Canada" */}
                  <span className="text-[10px] font-bold text-[#AA8239] uppercase tracking-widest leading-none mb-0.5">
                    Made in Canada
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-gray-500 group-hover:text-slate-400 dark:group-hover:text-gray-400 transition-colors leading-none">
                    Empowering a Sustainable Energy Future.
                   </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Right Side */}
            <div className="hidden xl:flex items-center gap-2">
               
               {/* 1. Refined Buttons (Smaller, Cleaner) & 3. Added Team Button */}
               <Link href="#about">
                 <Button variant="ghost" className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 h-9 px-4 text-sm font-medium rounded-md">
                   About
                 </Button>
               </Link>

               <Link href="#team">
                 <Button variant="ghost" className="text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 h-9 px-4 text-sm font-medium rounded-md">
                   Team
                 </Button>
               </Link>

               <Link href="#roadmap">
                 <Button variant="ghost" className="text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 h-9 px-4 text-sm font-medium rounded-md">
                   <Map className="w-3 h-3 mr-2"/> Roadmap
                 </Button>
               </Link>

               {/* Separator line for visual hierarchy */}
               <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>

                <SocialButtons />
               
               <div className="flex items-center gap-2 sm:gap-4 ml-4">
                 <Link href="#contact">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-9 px-5 text-sm font-medium shadow-lg shadow-emerald-900/20 rounded-md">
                    Get in Touch
                  </Button>
                 </Link>
                 
                 {/* The Toggle */}
                 <ModeToggle />
               </div>
            </div>

            {/* Mobile Menu Toggle */}
             <div className="xl:hidden flex items-center gap-2 z-50">
                <ModeToggle />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900 dark:text-white">
                    {isMobileMenuOpen ?
                     <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
             <div className="xl:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 border-b border-slate-200 dark:border-white/10 backdrop-blur-xl p-6 flex flex-col gap-3 shadow-2xl animate-in slide-in-from-top-5">
                <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button variant="ghost" className="w-full justify-start text-base h-10 text-slate-900 dark:text-white">About</Button>
                </Link>
                <Link href="#team" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button variant="ghost" className="w-full justify-start text-base h-10 text-slate-900 dark:text-white">Team</Button>
                </Link>
                <Link href="#roadmap" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                     <Button variant="ghost" className="w-full justify-start text-base h-10 text-emerald-600 dark:text-emerald-400"><Map className="w-4 h-4 mr-2"/> Roadmap</Button>
                </Link>
                <Link href="#research" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button variant="ghost" className="w-full justify-start text-base h-10 text-slate-900 dark:text-white">Research</Button>
                </Link>
                 <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                 <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-10">Get in Touch</Button>
                </Link>
                
                <div className="flex justify-center gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <SocialButtons />
                </div>
            </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-300">
        {/* VIDEO LAYER */}
        {videoSlides.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out pointer-events-none ${
              index === currentSlideIdx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <video
              ref={(el) => { videoRefs.current[index] = el }}
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-60"
              src={shouldLoadVideo(index) ? src : undefined}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/50 to-transparent dark:from-black dark:via-black/40 dark:to-black/30"></div>
          </div>
        ))}

        {/* STATIC CONTENT LAYER */}
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="max-w-5xl mx-auto text-center pointer-events-auto">
            <Badge className="mb-6 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/50 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 px-4 py-1 text-sm md:text-base">Early Stage Startup</Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Building the Future of <br className="hidden md:block"/>
              <span className="text-emerald-600 dark:text-emerald-500 block md:inline mt-2 md:mt-0">Critical Infrastructure Resilience</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto px-2">
            Kraftgene AI is developing the EnergyEminence platform—a Unified Critical Infrastructure Operating System integrating high-fidelity digital twins and immersive visualization with environmental threat detection, autonomous robotics, and AI agents to protect and quantifiably optimize the performance of Utility Grids, Oil & Gas pipelines, and Renewable assets.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link href="#research" className="w-full sm:w-auto">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto border-0 h-14 text-lg">
                  Explore Our Research <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* NAVIGATION DOTS */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center items-center space-x-3 px-4 flex-wrap">
          {videoSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => jumpToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer mb-2 ${
                index === currentSlideIdx 
                  ? "w-8 bg-emerald-500" 
                  : "w-2 bg-slate-400 hover:bg-slate-600 dark:bg-white/30 dark:hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* About Kraftgene AI Section */}
      <section id="about" className="py-16 md:py-24 bg-slate-100 dark:bg-gray-900 border-b border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* About Text Section */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">About Kraftgene AI</h2>
              <p className="text-base md:text-lg text-slate-700 dark:text-gray-300 mb-6 leading-relaxed">
                Founded in Toronto, Ontario, Kraftgene AI is an early-stage startup focused on developing artificial intelligence solutions for the energy sector. We are working to create innovative technologies that will help protect Canada's energy infrastructure while supporting environmental sustainability.
                <br /><br />
                Our platform acts as a "Single Pane of Glass" for energy convergence, driving operational efficiency across the sector. Whether monitoring electron flow in utility grids or fluid dynamics in pipelines, our core AI engine unifies infrastructure health with environmental intelligence through real-time digital twin visualization. This integrated view enables autonomous robotic responses to address critical risks and the complex challenges of a changing climate.
              </p>
              <ul className="space-y-3 text-slate-700 dark:text-gray-300">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-emerald-500 mr-3 shrink-0" /> Unified OS for Utility & O&G</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-emerald-500 mr-3 shrink-0" /> Physics-Informed AI (GNNs)</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-emerald-500 mr-3 shrink-0" /> Committed to environmental sustainability</li>
              </ul>
            </div>

            {/* Innovation in Progress Card */}
            <div className="flex justify-center">
              <div className="bg-white/80 dark:bg-black/50 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/20 backdrop-blur-sm transition-colors duration-300">
                  <div className="flex justify-center mb-6">
                    <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Innovation in Progress</h3>
                  <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-8">Building tomorrow's solutions today</p>
                  <Link href="https://www.energyeminence.online" target="_blank" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors">
                      Visit our dashboard demo <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Unified Sector Solutions */}
      <section className="py-16 bg-white dark:bg-black border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-transparent">Sector Convergence</Badge>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">One Platform. Multiple Industries.</h2>
                <p className="text-lg text-slate-600 dark:text-gray-400 max-w-3xl mx-auto">
                EnergyEminence bridges the gap between sectors with a highly modular architecture designed for seamless exchangeability across all industrial scenarios. Our AI agents operate at the edge, delivering fast, efficient, and comprehensive optimization—from substation voltage to pipeline pressure—ensuring real-time operational resilience.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Utilities Column */}
                <div className="bg-slate-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-all">
                    <div className="bg-emerald-100 dark:bg-emerald-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                        <Zap className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Utilities</h3>
                    <p className="text-slate-600 dark:text-gray-400 mb-6">
                        Eliminating cascading failures through Graph Neural Networks. We provide vegetation management, flood risk monitoring for substations, and automated load balancing.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
                        <li className="flex items-center"><ArrowRight className="w-4 h-4 text-emerald-500 mr-2"/> Grid Physics (Voltage/Freq)</li>
                        <li className="flex items-center"><ArrowRight className="w-4 h-4 text-emerald-500 mr-2"/> Wildfire Prevention</li>
                    </ul>
                </div>

                {/* Oil & Gas Column */}
                <div className="bg-slate-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-blue-500/30 transition-all">
                    <div className="bg-blue-100 dark:bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                        <Droplet className="w-7 h-7 text-blue-600 dark:text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Oil & Gas</h3>
                    <p className="text-slate-600 dark:text-gray-400 mb-6">
                        Ensuring integrity and compliance. Autonomous drones monitor pipelines for leaks, landslides, and encroachment while automating emissions tracking for EPA standards.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
                        <li className="flex items-center"><ArrowRight className="w-4 h-4 text-blue-500 mr-2"/> Flow Physics (Pressure)</li>
                        <li className="flex items-center"><ArrowRight className="w-4 h-4 text-blue-500 mr-2"/> Leak & Encroachment AI</li>
                    </ul>
                </div>

                {/* Renewables Column */}
                <div className="bg-slate-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-yellow-400 dark:hover:border-yellow-500/30 transition-all">
                    <div className="bg-yellow-100 dark:bg-yellow-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                        <Sun className="w-7 h-7 text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Renewables</h3>
                    <p className="text-slate-600 dark:text-gray-400 mb-6">
                        Integrating Distributed Energy Resources (DERs). Our edge agents create Virtual Power Plants (VPPs) by coordinating solar, wind, and battery storage autonomously.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
                        <li className="flex items-center"><ArrowRight className="w-4 h-4 text-yellow-500 mr-2"/> DER Integration</li>
                        <li className="flex items-center"><ArrowRight className="w-4 h-4 text-yellow-500 mr-2"/> Edge-Agent Optimization</li>
                    </ul>
                </div>
            </div>
        </div>
      </section>

       <section className="py-16 md:py-24 bg-slate-50 dark:bg-black transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-8">Our Vision</h2>
            <p className="text-base md:text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
            We envision a future where artificial intelligence seamlessly protects the world's energy infrastructure—from pipelines to power lines—while safeguarding the environment. Our goal is to develop comprehensive AI solutions that integrate interactive digital twins, environmental intelligence, energy infrastructure monitoring, and real-time data from robotics. We are extending our platform with an AI Agent System for autonomous decision-making, enabling automated grid stabilization, valve control, threat response, and emissions optimization.
            </p>
          </div>

          {/* Vision Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { icon: ShieldCheck, color: "text-red-600 dark:text-red-500", bg: "bg-red-100 dark:bg-red-500/10", title: "Environmental Protection", desc: "Early detection of wildfires, floods, and emissions" },
                { icon: Layers, color: "text-orange-600 dark:text-orange-500", bg: "bg-orange-100 dark:bg-orange-500/10", title: "Unified Infrastructure", desc: "Protecting Grids, Pipelines and Renewables" },
                { icon: Brain, color: "text-purple-600 dark:text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/10", title: "AI Innovation", desc: "Physics-Informed Learning & Agentic Swarms" },
                { icon: Leaf, color: "text-emerald-600 dark:text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/10", title: "Sustainable Future", desc: "Supporting the clean energy transition & compliance" }
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-white/10 rounded-2xl p-6 md:p-8 text-center hover:bg-slate-50 dark:hover:bg-gray-900 transition-colors">
                  <div className={`${card.bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <card.icon className={`w-8 h-8 ${card.color}`} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{card.title}</h4>
                  <p className="text-slate-600 dark:text-gray-400">{card.desc}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* System Architecture & Future Vision Section */}
      <section id="roadmap" className="relative py-16 md:py-32 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 overflow-hidden transition-colors duration-300">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[1000px] h-[500px] bg-emerald-200/50 dark:bg-emerald-900/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
            <Badge variant="outline" className="mb-4 border-slate-300 dark:border-white/20 text-slate-600 dark:text-gray-400 uppercase tracking-wider text-xs">Technical Documentation</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">System Architecture & Roadmap</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400">
            Explore the engineering behind EnergyEminence. From our foundational data acquisition platform handling complex Grid & Flow Physics to our advanced visualization standards and roadmap for autonomous agentic systems, we are building the future of infrastructure resilience.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* Card 1: Foundation Platform */}
            <div className="group relative bg-slate-50/80 dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 dark:from-emerald-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6 md:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                    <Network className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <Badge className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 px-3 py-1 text-xs md:text-sm">Current Platform</Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">EnergyEminence Foundation</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed h-auto md:h-20">
                  The core system design for high-frequency data acquisition, multi-modal environmental analytics, and robotic fleet integration across utility and pipeline assets.
                </p>

                <div className="space-y-3 mb-10 border-t border-slate-200 dark:border-white/5 pt-6">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-4">System Specifications</h4>
                  <ul className="space-y-3">
                    {["Real-time Telemetry (SCADA/Pipeline)", "Physics-Informed Analytics Engine", "Robotic Control Interface"].map((item, i) => (
                      <li key={i} className="flex items-center text-slate-700 dark:text-gray-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/EnergyEminence AI Platform System Design and Architecture.pdf" target="_blank" download>
                  <Button className="w-full bg-slate-200 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 font-semibold h-12">
                    <Download className="w-4 h-4 mr-2" /> Download Architecture
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card 2: Agentic System Extension */}
            <div className="group relative bg-slate-50/80 dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 dark:from-purple-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6 md:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 dark:bg-purple-950/50 rounded-2xl border border-purple-200 dark:border-purple-500/20 flex items-center justify-center">
                    <Cpu className="w-6 h-6 md:w-7 md:h-7 text-purple-600 dark:text-purple-500" />
                  </div>
                  <Badge className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 px-3 py-1 text-xs md:text-sm">Future Vision</Badge>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">AI Agentic System Extension</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed h-auto md:h-20">
                  Our roadmap for transitioning from predictive monitoring to autonomous decision-making agents for grid self-healing and pipeline isolation.
                </p>

                <div className="space-y-3 mb-10 border-t border-slate-200 dark:border-white/5 pt-6">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-4">Capabilities Roadmap</h4>
                  <ul className="space-y-3">
                    {["Autonomous Grid & Flow Stabilization", "Multi-Agent Response Swarms", "Automated Emissions & DER Optimization"].map((item, i) => (
                        <li key={i} className="flex items-center text-slate-700 dark:text-gray-300 text-sm">
                        <Brain className="w-4 h-4 text-purple-500 mr-3 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/EnergyEminence Platform AI Agentic System Extension.pdf" target="_blank" download>
                  <Button className="w-full bg-slate-200 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 font-semibold h-12">
                    <Download className="w-4 h-4 mr-2" /> Download Vision Paper
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

{/* Co-founding Team Section */}
<section id="team" className="py-24 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20 px-4 py-1 text-sm">
        Our Leadership
      </Badge>
      <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
        Meet Our Founding Team
      </h2>
      <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
        A diverse group of experts in AI, robotics, and engineering dedicated to building resilient critical infrastructure.
      </p>
    </div>

    {/* Updated to grid-cols-4 since there are now 4 members */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
      {[
        {
          name: "Yu Nong (John)",
          role: "Founder & CEO",
          image: "images/me.jpg",
          linkedin: "https://www.linkedin.com/in/nongyu/",
          bio: "John blends visionary leadership with expertise in ML, software engineering, and robotics to drive global infrastructure resilience.",
        },
        {
          name: "Huy (Michel) Trinh",
          role: "Founder & Digital Twins Engineer",
          image: "images/huy.jpg", // Make sure to add this image to your public/images folder
          linkedin: "https://www.linkedin.com/in/huy-michel-trinh-masc-085905187/",
          bio: "Huy bridges physics-informed modeling with machine learning, leading the development of our high-performance Digital Twin architecture.",
        },
        {
          name: "Min (Rominou) Lee",
          role: "Founder & Lead AI Engineer",
          image: "images/min.jpg",
          linkedin: "https://www.linkedin.com/in/min-lee0/",
          bio: "Rominou specializes in ML systems, PyTorch, GNNs, and real-time inference, driving the development of our core predictive analytics capabilities.",
        },
        {
          name: "Yonghao Mai (Michael)",
          role: "Founder & Chief AI Officer",
          image: "images/michael_mai.PNG",
          linkedin: "https://www.linkedin.com/in/michael-yong-hao-mai-78702234/",
          bio: "Michael has expertise in ML, full-stack architecture, and automation to build high-impact, market-ready platforms.",
        },
      ].map((member, index) => (
        <a 
          key={index} 
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group p-8 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/50 shadow-sm dark:shadow-none transition-all duration-300 text-center block cursor-pointer"
        >
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-500/20 blur-lg group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/40 transition-all"></div>
            <div className="relative w-full h-full rounded-full border-2 border-emerald-200 dark:border-emerald-500/30 overflow-hidden">
              <Image 
                src={member.image} 
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
          <p className="text-emerald-600 dark:text-emerald-500 text-sm font-medium mb-4">{member.role}</p>
          <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">
            {member.bio}
          </p>
        </a>
      ))}
    </div>
  </div>
</section>

      {/* Research & Innovation Section */}
      <section id="research" className="py-16 md:py-24 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Latest Research & Innovations</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400">
              From the lab to the field. Our predictive AI works across vectors—whether it's a transmission tower or a gas pipeline corridor.
            </p>
          </div>

          <div className="space-y-16 md:space-y-24">
            
{/* Research Item 1: Cascade Failure Main Content */}
    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start relative z-10">
      {/* TEXT CONTENT (Left Column on Desktop, Bottom on Mobile) */}
      <div className="order-2 lg:order-1">
        <div className="flex items-center space-x-3 mb-4">
          <Badge variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-400">Breakthrough Research</Badge>
          <span className="text-slate-500 dark:text-gray-500 text-sm">Nov 2025</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Predictive Cascade Failure Analysis</h3>
        <p className="text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
          We have developed a sophisticated model built on Graph Neural Networks (GNNs) and a Physics-Informed Learning (PIL) framework. By processing the grid as a graph and fusing multi-modal data, we can forecast catastrophic cascade failures 15-35 minutes before they occur.
        </p>
        <ul className="space-y-3 mb-8 text-slate-700 dark:text-gray-300 text-sm md:text-base">
          <li className="flex items-center"><Activity className="w-5 h-5 text-emerald-500 mr-3 shrink-0" /> 78.4% detection rate</li>
          <li className="flex items-center"><Activity className="w-5 h-5 text-emerald-500 mr-3 shrink-0" /> Fuses telemetry, satellite, and robotic sensors</li>
          <li className="flex items-center"><Activity className="w-5 h-5 text-emerald-500 mr-3 shrink-0" /> Physically plausible predictions via PIL</li>
        </ul>
        <div className="flex gap-4">
          <Link href="https://www.techrxiv.org/users/880618/articles/1357639-ai-driven-predictive-cascade-failure-analysis-using-multi-modal-environmental-infrastructure-data-fusion-a-real-time-prediction-framework-for-critical-energy-infrastructure" target="_blank">
            <Button variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" /> Read Paper
            </Button>
          </Link>
          <Link href="https://github.com/KraftgeneAI/CascadeFailureDetection/tree/main" target="_blank" className="w-full sm:w-auto">
    <Button variant="outline" className="w-full sm:w-auto border-slate-300 dark:border-gray-500 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white hover:text-slate-900 dark:hover:text-black transition-colors">
      <FaGithub className="w-4 h-4 mr-2"/> View Code
    </Button>
  </Link>
        </div>
      </div>

      {/* 6-IMAGE GRID (Right Column on Desktop, Top on Mobile) */}
      <div className="order-1 lg:order-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-emerald-100 dark:shadow-emerald-900/20 bg-slate-50 dark:bg-gray-900 p-3 md:p-4">
        {/* Grid container for 6 images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          
          {/* Mapping through the images array */}
          {researchImages.map((img, index) => (
            <div 
              key={index}
              // Added 'cursor-pointer' for requirement #1
              // Added onClick handler for requirement #2
              className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-white/5 hover:border-emerald-400 dark:hover:border-emerald-500/30 transition-colors group cursor-pointer"
              onClick={() => setSelectedImage(img)}
             >
              <Image
                src={img.src}
                alt={img.alt}
                width={400} height={250}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}

        </div>
        {/* Combined Caption */}
        <p className="text-slate-600 dark:text-gray-400 text-xs sm:text-sm mt-4 text-center leading-relaxed px-2">
          <strong>Figures 1(a)-(d):</strong> Complete system overview covering high-level architecture, data source integration, risk management, tensor-based fusion processing, and end-to-end data flow pipeline. Click images to enlarge.
        </p>
      </div>
    </div>


    {/* --- IMAGE MODAL / LIGHTBOX --- */}
    {/* Requirement #2: Pop up right size to read clearly */}
    {selectedImage && (
      <div 
        // Fixed overlay covering the screen with dark background
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-sm p-4 md:p-8"
        // Close modal when clicking the background
        onClick={() => setSelectedImage(null)}
      >
        {/* Close Button */}
        <button 
          className="absolute top-4 right-4 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-full p-2 transition-colors z-[101]"
          onClick={() => setSelectedImage(null)}
        >
          <X className="w-8 h-8" />
        </button>

        {/* Image Container within Modal */}
        <div 
          className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col items-center justify-center"
          // Stop clicks on the image itself from closing the modal
          onClick={(e) => e.stopPropagation()} 
        >
           {/* Using Next.js Image with 'fill' and 'object-contain' to ensure it fits screen nicely without stretching */}
           <div className="relative w-full h-full">
             <Image
               src={selectedImage.src}
               alt={selectedImage.alt}
               fill
               className="object-contain"
               priority // Load enlarged image quickly
             />
           </div>
           
           {/* Optional caption below enlarged image */}
           <p className="text-slate-900 dark:text-gray-300 text-sm mt-4 text-center max-w-3xl">{selectedImage.alt}</p>
        </div>
      </div>
    )}

            {/* Research Item 2: Wildfire Detection (Edge AI) */}
            <div className="flex flex-col gap-8">
              <div className="w-full">
                <div className="flex items-center space-x-3 mb-4">
                   <Badge variant="outline" className="border-red-500 text-red-600 dark:text-red-400">Edge AI</Badge>
                   <span className="text-slate-500 dark:text-gray-500 text-sm">Real-time Demo</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Real-Time Edge Wildfire Detection</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Relying on the cloud is too slow for wildfire response. Our new YOLO-based model runs directly on the embedded processors of autonomous drones. It identifies fire threats instantly, whether over power lines or pipeline corridors.
                </p>
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
                  {[
                    { val: "91.5%", label: "mAP50" },
                    { val: "2 ms", label: "Inference Speed" },
                    { val: "6 MB", label: "Model Size" }
                  ].map((stat, i) => (
                    <div key={i} className="p-2 md:p-4 bg-white dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 text-center shadow-sm dark:shadow-none">
                      <div className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.val}</div>
                      <div className="text-[10px] md:text-xs text-slate-500 dark:text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-xl mb-6">
  <h4 className="text-red-600 dark:text-red-400 font-semibold mb-2">Impact</h4>
  <p className="text-slate-700 dark:text-gray-300 text-sm">
    Enables immediate autonomous detection without network dependency, reducing response times from minutes to milliseconds to prevent ignition spread.
  </p>
</div>
                <div className="flex gap-4">
                  <Link href="https://www.linkedin.com/feed/update/urn:li:activity:7391079734203400192" target="_blank" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-600 dark:hover:text-white transition-colors">
                      <FaLinkedin className="w-4 h-4 mr-2"/> View on LinkedIn
                    </Button>
                  </Link>
                </div>
              </div>

              {/* ITEM 2 FIGURE & CAPTION */}
              <div className="w-full rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-red-100 dark:shadow-red-900/20 bg-slate-50 dark:bg-gray-900 p-2 md:p-4">
                <video 
                  autoPlay loop muted playsInline 
                  className="w-full h-auto rounded-xl"
                  src="/wildfiredetec_sidebyside.mp4" 
                />
                 <p className="text-slate-600 dark:text-gray-400 text-sm mt-4 text-center leading-relaxed">
                  Figure 2: Real-time edge AI wildfire detection demonstration (Original vs. AI Predicted).
                </p>
              </div>
            </div>

            {/* Research Item 3: Flood Detection */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
               <div className="order-2 lg:order-1">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge variant="outline" className="border-blue-500 text-blue-600 dark:text-blue-400">Computer Vision</Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Flood Detection for Infrastructure Resilience</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
                   Detecting floodwaters in muddy, complex terrain is notoriously difficult. Our custom segmentation models distinguish actual water threats from harmless background noise, protecting substations and valve stations alike.
<br /><br />
These visual insights serve as dynamic inputs for our failure analysis, predicting how the infrastructure will react to rising waters minutes before submersion.
                </p>
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-xl mb-6 mt-6">
  <h4 className="text-blue-600 dark:text-blue-400 font-semibold mb-2">Impact</h4>
  <p className="text-slate-700 dark:text-gray-300 text-sm">
    Provides precise flood mapping around critical assets, allowing operators to deploy defenses or isolate equipment before water breaches critical levels.
  </p>
</div>
                <div className="flex gap-4 mt-6">
                  
                  <Link href="https://www.linkedin.com/feed/update/urn:li:activity:7403183040929398785" target="_blank" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-600 dark:hover:text-white transition-colors">
                      <FaLinkedin className="w-4 h-4 mr-2"/> View on LinkedIn
                    </Button>
                  </Link>
                </div>
              </div>

              {/* ITEM 3 FIGURE & CAPTION */}
              <div 
  className="order-1 lg:order-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-blue-100 dark:shadow-blue-900/20 bg-slate-50 dark:bg-gray-900 p-2 md:p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500/50 transition-colors"
  onClick={() => setSelectedImage({ src: "/images/flood_detec.jpg", alt: "Figure 3: Flood detection segmentation model output" })}
>
                <Image 
                  src="/images/flood_detec.jpg" 
                  alt="Flood Segmentation Model" 
                  width={800} height={600} 
                  className="w-full h-auto rounded-xl"
                />
                 <p className="text-slate-600 dark:text-gray-400 text-sm mt-4 text-center leading-relaxed">
                  Figure 3: Flood detection segmentation model output identifying water in complex terrain.
                </p>
              </div>
            </div>

             {/* Research Item 4: Landslide */}
             <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
               
              {/* ITEM 4 FIGURE & CAPTION */}
              <div 
  className="rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-emerald-100 dark:shadow-emerald-900/20 bg-slate-50 dark:bg-gray-900 p-2 md:p-4 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-colors"
  onClick={() => setSelectedImage({ src: "/images/landslide_detec.jpg", alt: "Figure 4: Predictive landslide risk assessment" })}
>
                <Image 
                  src="/images/landslide_detec.jpg" 
                  alt="Landslide Mask Detection" 
                  width={800} height={600} 
                  className="w-full h-auto rounded-xl"
                />
                 <p className="text-slate-600 dark:text-gray-400 text-sm mt-3 text-center leading-relaxed px-2">
                    Figure 4: Predictive landslide risk assessment using multi-modal data fusion (Satellite & SCADA).
                  </p>

              </div>

               <div className="order-2 lg:order-2">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600 dark:text-yellow-400">Multi-Modal Fusion</Badge>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Predictive Landslide Risk</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
                   Our framework fuses satellite imagery with real-time SCADA telemetry to pinpoint landslide risks with high true-positive rates and minimal false positives (7.8%). This is critical for both transmission towers and pipeline integrity management.
                </p>
                
                {/* Impact Box */}
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl mb-6">
                  <h4 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">Impact</h4>
                  <p className="text-slate-700 dark:text-gray-300 text-sm">
                    Enables operators to de-energize lines or reroute power/flow 15-35 minutes before physical impact, preventing cascading blackouts, leaks, and wildfires.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Link href="https://www.linkedin.com/feed/update/urn:li:activity:7392044029498195969" target="_blank" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-500 dark:hover:text-black transition-colors">
                      <FaLinkedin className="w-4 h-4 mr-2"/> View on LinkedIn
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          {/* Research Item 5: Mini-MVP */}
             <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
               
              {/* ITEM 5 FIGURE & CAPTION */}
<div 
  className="rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-emerald-100 dark:shadow-emerald-900/20 bg-slate-50 dark:bg-gray-900 p-2 md:p-4 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-colors"
  onClick={() => setSelectedImage({ src: "/images/screenshot1.JPG", alt: "Figure 5: Interactive Mini-MVP Engineer Mode" })}
>



                <Image 
                  src="/images/screenshot1.JPG" 
                  alt="Mini-MVP Dashboard" 
                  width={1280} height={1024} 
                  className="w-full h-auto rounded-xl"
                />
                 <p className="text-slate-600 dark:text-gray-400 text-sm mt-3 text-center leading-relaxed px-2">
                    Figure 5: Interactive Mini-MVP showing Engineer Mode diagnostics and cascade path prediction.
                  </p>

              
              
              </div>

               <div className="order-2 lg:order-2">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge variant="outline" className="border-emerald-500 text-emerald-600 dark:text-emerald-400">Interactive MVP</Badge>
                  <span className="text-slate-500 dark:text-gray-500 text-sm">Live Demo</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Interactive Mini-MVP: Physics-Informed Cascade Detection</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
                   A streamlined, interactive demonstration of our core AI engine designed for technical validation. This Mini-MVP allows engineering teams to explore failure scenarios using synthetic data, showcasing our "Zero-Miss" architecture for critical infrastructure.
                </p>
                
                {/* Impact Box */}
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/20 rounded-xl mb-6">
                  <h4 className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">Capabilities</h4>
                  <ul className="space-y-2 text-slate-700 dark:text-gray-300 text-sm">
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 text-emerald-500 mr-2" /> Tuned for "Zero-Miss" sensitivity (100% event recall).</li>
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 text-emerald-500 mr-2" /> Interactive "Engineer Mode" for deep signal diagnostics.</li>
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 text-emerald-500 mr-2" /> Adheres to physics-based power and flow constraints.</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Link href="https://www.linkedin.com/feed/update/urn:li:activity:7407573580798083072" target="_blank" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500 dark:hover:text-black transition-colors">
                      <FaLinkedin className="w-4 h-4 mr-2"/> View on LinkedIn
                    </Button>
                  </Link>
                  <Link href="https://github.com/KraftgeneAI/Mini-MVP" target="_blank" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-slate-300 dark:border-gray-500 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white hover:text-slate-900 dark:hover:text-black transition-colors">
                      <FaGithub className="w-4 h-4 mr-2"/> View Code
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            {/* Research Item 6: Agentic System */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              
              {/* ITEM 6 FIGURE & CAPTION (Left) */}
              <div 
                className="rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-purple-100 dark:shadow-purple-900/20 bg-slate-50 dark:bg-gray-900 p-2 md:p-4 cursor-pointer hover:border-purple-400 dark:hover:border-purple-500/50 transition-colors"
                onClick={() => setSelectedImage({ src: "/images/agentic_arch.JPG", alt: "Figure 6: Agentic System Architecture" })}
              >
                <Image 
                  src="/images/agentic_arch.JPG" 
                  alt="Agentic System Architecture" 
                  width={800} height={600} 
                  className="w-full h-auto rounded-xl"
                />
                <p className="text-slate-600 dark:text-gray-400 text-sm mt-3 text-center leading-relaxed px-2">
                  Figure 6: Agentic Cascade Failure Detection System Architecture
                </p>
              </div>

              {/* TEXT CONTENT (Right) */}
              <div className="order-2 lg:order-2">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge variant="outline" className="border-purple-500 text-purple-600 dark:text-purple-400">Autonomous System</Badge>
                  <span className="text-slate-500 dark:text-gray-500 text-sm">Live PoC</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Agentic Cascade Failure Detection</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Moving beyond static models, we have deployed a multi-agent system where specialized AI agents collaborate asynchronously. The system self-regulates data ingestion, physics-informed inference, and risk assessment cycles to monitor stability in real-time without human intervention.
                </p>
                
                {/* Capabilities Box */}
                <div className="p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/20 rounded-xl mb-6">
                  <h4 className="text-purple-600 dark:text-purple-400 font-semibold mb-2">Capabilities</h4>
                  <ul className="space-y-2 text-slate-700 dark:text-gray-300 text-sm">
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 text-purple-500 mr-2" /> Autonomous orchestration of 4 specialized AI agents.</li>
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 text-purple-500 mr-2" /> Physics-informed GNN predictions with 7-dimensional risk vectors.</li>
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 text-purple-500 mr-2" /> Self-healing data pipeline with robust error handling.</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Link href="https://www.techrxiv.org/users/880618/articles/1375885-agentic-ai-for-autonomous-cascade-failure-detection-and-response-in-critical-energy-infrastructure-proof-of-concept-implementation-and-validation-framework-for-multi-agent-decision-systems" target="_blank" className="w-full sm:w-auto">
    <Button variant="outline" className="border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-purple-300 transition-colors w-full sm:w-auto">
      <FileText className="w-4 h-4 mr-2" /> Read Paper
    </Button>
  </Link>
                  <Link href="https://www.linkedin.com/feed/update/urn:li:activity:7412264883318190080" target="_blank" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-500 dark:hover:text-white transition-colors">
                      <FaLinkedin className="w-4 h-4 mr-2"/> View on LinkedIn
                    </Button>
                  </Link>
                  <Link href="https://github.com/KraftgeneAI/CascadeFailureDetection/tree/main/agentic_cascade_system" target="_blank" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-slate-300 dark:border-gray-500 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white hover:text-slate-900 dark:hover:text-black transition-colors">
                      <FaGithub className="w-4 h-4 mr-2"/> View Code
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Strategic Partners Section */}
      <section className="py-16 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Strategic Partners & Ecosystem</h2>
            <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              Accelerating our technology with the support of industry leaders and innovation hubs.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            {[
    { src: "/images/partner2.JPG", alt: "Altitude Accelerator", href: "https://altitudeaccelerator.ca" },
    { src: "/images/partner3.png", alt: "AWS", href: "https://aws.amazon.com" },
    { src: "/images/partner6.jpg", alt: "Nvidia", href: "https://www.nvidia.com" },
    { src: "/images/partner10.JPG", alt: "Google", href: "https://www.google.com" },
    { src: "/images/partner111.jpg", alt: "Cooperathon", href: "https://cooperathon.ca/" },
    { src: "/images/partner11.PNG", alt: "MS", href: "https://www.microsoft.com" },
  ].map((partner, index) => (
    <a 
    key={index} 
    href={partner.href}
    target="_blank" 
    rel="noopener noreferrer"
    className="group bg-white rounded-xl p-4 w-30 h-24 md:w-32 md:h-28 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent"
  >
    <div className="relative w-full h-full">
      <Image
        src={partner.src}
        alt={partner.alt}
        fill
        className="object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
      />
    </div>
  </a>
            ))}
          </div>
        </div>
      </section>
      {/* Platform / Contact CTA */}
      <section id="contact" className="py-16 md:py-20 bg-gradient-to-b from-white to-slate-100 dark:from-black dark:to-gray-900 border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Join Us in Building the Future</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              We are currently seeking pilot partners in the energy sector and engaging with investors to scale this critical technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
               <div className="flex items-center space-x-3 text-slate-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  <span>Toronto, Ontario</span>
               </div>
               <div className="flex items-center space-x-3 text-slate-700 dark:text-gray-300">
                  <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  <span>info@kraftgeneai.ca</span>
               </div>
            </div>
            
            <div className="flex justify-center space-x-4">
               <SocialButtons />
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black text-slate-500 dark:text-gray-500 py-12 border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
           <p className="text-sm md:text-base">&copy; 2026 Kraftgene AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
