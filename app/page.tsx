"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, MapPin, Mail, Zap, ShieldCheck, 
  Brain, Leaf, CheckCircle, Cpu, Network, Map, 
  Menu, X, Droplet, Sun, Layers, PlayCircle, Activity 
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa"
import ModeToggle from "@/components/ui/mode-toggle"

export default function HomePage() {
  // 1. DEFINE SLIDE DATA (Hero Backgrounds)
  const videoSlides = [
    "/1.mp4", "/2.mp4", "/3.mp4", "/4.mp4", 
    "/5.mp4", "/6.mp4", "/7.mp4", "/8.mp4"
  ];

// Track active module and create refs for the scroll-spy effect
const [activeModule, setActiveModule] = useState(0);
const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);

// Enterprise-grade copy for all 7 Palantir-style modules
const demoModules = [
  {
    id: "01",
    title: "Multi-Modal Twin Visualization",
    description: "Seamlessly toggle between 2D geographic reality and 3D physics-relaxed topological shapes. Understand the spatial and logical relationships of critical infrastructure simultaneously in real-time.",
    videoSrc: "/demo1-maps.mp4"
  },
  {
    id: "02",
    title: "Dynamic Topology Engineering",
    description: "Edit grid architecture on the fly. Drop new generation nodes, draw transmission lines, and define load parameters within an interactive sandbox to securely model infrastructure upgrades.",
    videoSrc: "/demo2-topology.mp4"
  },
  {
    id: "03",
    title: "Environmental Intelligence Fusion",
    description: "Overlay live meteorological data directly onto the grid topology. Monitor severe weather patterns, flood zones, and atmospheric conditions to proactively manage infrastructure exposure.",
    videoSrc: "/demo3-weather.mp4"
  },
  {
    id: "04",
    title: "Edge-Processed UAV Ingestion",
    description: "Pipe live drone video feeds directly into the digital twin. Deployed edge AI models process visual data locally, identifying physical threats like encroaching wildfires with zero latency.",
    videoSrc: "/demo4-uav.mp4"
  },
  {
    id: "05",
    title: "Autonomous Grid Copilot",
    description: "Transition from reactive alerts to autonomous action. The Grid Copilot instantly generates an executable mitigation matrix to isolate burning nodes, shed load, and halt cascading failures.",
    videoSrc: "/demo5-copilot.mp4"
  },
  {
    id: "06",
    title: "3D Spatial Mitigation",
    description: "Execute complex cascade and wildfire response strategies using our immersive 3D topological view. The Copilot orchestrates real-time spatial isolation commands with complete situational awareness.",
    videoSrc: "/demo6-copilot-3d.mp4"
  },
  {
    id: "07",
    title: "Physics-Informed Prediction Engine",
    description: "Stay ahead of catastrophe. Our predictive AI engine utilizes physics-informed machine learning to forecast node failures and map cascading blackouts before physical infrastructure is actually compromised.",
    videoSrc: "/demo7-prediction.mp4"
  }
];

// The Scroll-Spy Effect: Bulletproof Auto-Switching
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Trigger when the element crosses the exact middle of the viewport
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          setActiveModule(index);
        }
      });
    },
    // This creates a 10% trigger window directly in the center of the screen
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 } 
  );

  const currentRefs = moduleRefs.current;
  currentRefs.forEach((ref) => {
    if (ref) observer.observe(ref);
  });

  return () => {
    currentRefs.forEach((ref) => {
      if (ref) observer.unobserve(ref);
    });
  };
}, []);

// 2. STATE MANAGEMENT
const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const timerRef = useRef<NodeJS.Timeout | null>(null);
const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

const shouldLoadVideo = (index: number) => {
  const total = videoSlides.length;
  const nextIdx = (currentSlideIdx + 1) % total;
  const prevIdx = (currentSlideIdx - 1 + total) % total;
  return index === currentSlideIdx || index === nextIdx || index === prevIdx;
};

  // Shared Social Buttons Component
  const SocialButtons = () => (
    <>
      <Link href="https://www.linkedin.com/company/kraftgeneai" target="_blank">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-md text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
          <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </Link>
      <Link href="https://github.com/KraftgeneAI/" target="_blank">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-md text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
          <FaGithub className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </Link>
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

            {/* Logo & Brand */}
             <div className="flex items-center space-x-2 z-50">
              <Link href="#" className="flex items-center space-x-3 group" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 md:w-10 md:h-10 relative rounded overflow-hidden group-hover:opacity-80 transition-opacity">
                  <Image src="/images/new_logo.PNG" alt="Kraftgene AI" width={40} height={40} className="w-full h-full object-cover" />
                </div>
                 <div className="flex flex-col justify-center">
                  <span className="text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-gray-300 transition-colors leading-none mb-1">
                    Kraftgene AI Inc.
                  </span>
                  <span className="text-[10px] font-bold text-[#AA8239] uppercase tracking-widest leading-none mb-0.5">
                    Made in Canada
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-gray-500 group-hover:text-slate-400 dark:group-hover:text-gray-400 transition-colors leading-none">
                    Empowering a Sustainable Energy Future.
                   </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-2">
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
               <Link href="#solutions">
                 <Button variant="ghost" className="text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 h-9 px-4 text-sm font-medium rounded-md">
                   Solutions
                 </Button>
               </Link>
               <Link href="#demo">
                 <Button variant="ghost" className="text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 h-9 px-4 text-sm font-medium rounded-md">
                   <PlayCircle className="w-4 h-4 mr-2"/> Platform
                 </Button>
               </Link>

               <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
               <SocialButtons />
               
               <div className="flex items-center gap-2 sm:gap-4 ml-4">
                 <Link href="#contact">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-9 px-5 text-sm font-medium shadow-lg shadow-emerald-900/20 rounded-md">
                    Get in Touch
                  </Button>
                 </Link>
                 <ModeToggle />
               </div>
            </div>

            {/* Mobile Menu Toggle */}
             <div className="xl:hidden flex items-center gap-2 z-50">
                <ModeToggle />
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-900 dark:text-white">
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                <Link href="#solutions" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                     <Button variant="ghost" className="w-full justify-start text-base h-10 text-slate-900 dark:text-white">Solutions</Button>
                </Link>
                <Link href="#demo" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                    <Button variant="ghost" className="w-full justify-start text-base h-10 text-emerald-600 dark:text-emerald-400"><PlayCircle className="w-4 h-4 mr-2"/> Platform</Button>
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
            <video ref={(el) => { videoRefs.current[index] = el }} muted loop playsInline className="w-full h-full object-cover opacity-60" src={shouldLoadVideo(index) ? src : undefined} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/50 to-transparent dark:from-black dark:via-black/40 dark:to-black/30"></div>
          </div>
        ))}

        {/* STATIC CONTENT LAYER */}
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
          <div className="max-w-5xl mx-auto text-center pointer-events-auto">
            <Badge className="mb-6 bg-slate-800/80 text-emerald-400 border-emerald-500/30 backdrop-blur-md px-4 py-1.5 text-sm uppercase tracking-widest">
              Enterprise Infrastructure Intelligence
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              The Operating System for <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                Critical Grid Resilience
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto px-2">
              EnergyEminence™ is a physics-backed digital twin that fuses live drone surveillance with an autonomous AI Copilot to instantly detect, isolate, and mitigate catastrophic failures before they happen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Link href="#demo" className="w-full sm:w-auto">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white w-full sm:w-auto border-0 h-14 px-8 text-lg shadow-lg shadow-emerald-900/20 transition-all">
                  <PlayCircle className="mr-2 w-5 h-5" /> Watch Platform Demo
                </Button>
              </Link>
              <Link href="#contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 h-14 px-8 text-lg bg-white/50 dark:bg-black/50 backdrop-blur transition-all">
                  Talk to Sales
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

      {/* Platform Capabilities (Palantir-Style Scroll-Spy Walkthrough) */}
      <section id="demo" className="py-24 bg-slate-50 dark:bg-[#0A0A0A] text-slate-900 dark:text-white border-t border-slate-200 dark:border-white/5 transition-colors duration-300 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="max-w-4xl mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Designed for Mission-Critical Action.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              EnergyEminence™ replaces legacy, reactive telemetry with an active, physics-informed environment built for decisive defensive control.
            </p>
          </div>

          {/* Interactive Feature Explorer */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
            
            {/* Left Column: Scrollable Text Blocks */}
            <div className="lg:col-span-5 pb-[40vh]"> {/* Padding ensures the last item can scroll to the middle */}
              {demoModules.map((mod, idx) => {
                const isActive = activeModule === idx;
                return (
                  <div 
                    key={idx}
                    data-index={idx}
                    ref={(el) => { moduleRefs.current[idx] = el; }}
                    // min-h-[50vh] gives each item vertical space, forcing the scroll effect
                    // opacity fades items out when they aren't active
                    className={`relative group pl-8 transition-all duration-700 min-h-[50vh] flex flex-col justify-center cursor-pointer ${
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-70 dark:opacity-30 dark:hover:opacity-60"
                    }`}
                    onClick={() => setActiveModule(idx)}
                  >
                    {/* Left Border Indicator */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 transition-all duration-500 rounded-r-full ${
                      isActive ? "bg-emerald-500 h-full max-h-[80%]" : "bg-slate-200 dark:bg-white/10 h-0"
                    }`} />

                    {/* Text Content */}
                    <div className="flex flex-col space-y-4">
                      <span className={`text-[11px] font-mono font-bold tracking-widest uppercase transition-colors duration-300 ${
                        isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                      }`}>
                        Capability {mod.id}
                      </span>
                      
                      <h3 className={`text-3xl font-semibold tracking-tight transition-colors duration-300 ${
                        isActive ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                      }`}>
                        {mod.title}
                      </h3>
                      
                      <p className={`text-lg leading-relaxed pr-4 transition-colors duration-300 ${
                        isActive ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"
                      }`}>
                        {mod.description}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Book a Demo CTA */}
              <div className="pt-12 pl-8">
                <Link href="https://calendar.app.google/GtTi43tYn5J2QN8G8" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full sm:w-auto bg-slate-900 text-white dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 dark:text-black h-14 px-10 font-bold text-sm rounded-none pointer-events-auto transition-transform hover:scale-[1.02]">
                    Book a Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Sticky Video Player */}
            <div className="lg:col-span-7 sticky top-32">
            <div className="relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black p-2 shadow-2xl shadow-emerald-900/5 dark:shadow-emerald-900/10 transition-colors duration-300">
  
  {/* Visual Terminal Chrome */}
  <div className="flex items-center justify-between border-b border-slate-300 dark:border-white/5 pb-2 mb-2 px-2 transition-colors">
    <div className="flex items-center space-x-2">
      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
    </div>
    <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Terminal
    </span>
  </div>

  {/* Dynamic Video Player */}
  <div className="relative overflow-hidden rounded-md border border-slate-300 dark:border-white/5 bg-white dark:bg-[#050505] aspect-video transition-colors">
                  <video 
                    key={activeModule}
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-contain opacity-95"
                  >
                    <source src={demoModules[activeModule].videoSrc} type="video/mp4" />
                  </video>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Unified Sector Solutions (9-Photo Enterprise Storytelling Layout) */}
      <section id="solutions" className="py-32 bg-white dark:bg-[#050505] border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            
            {/* Section Header */}
            <div className="text-center mb-24 md:mb-32">
                <Badge variant="outline" className="mb-6 border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-4 py-1.5 uppercase tracking-widest text-xs">
                  Sector Convergence
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                  One Core Engine. Global Scale.
                </h2>
                <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  EnergyEminence bridges the gap between sectors with a highly modular architecture. Our edge-deployed AI agents deliver fast, comprehensive optimization across all facets of critical infrastructure.
                </p>
            </div>

            <div className="space-y-40">
                
                {/* SECTOR 1: UTILITIES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 lg:order-1 space-y-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-emerald-100 dark:bg-emerald-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Utilities & Power Grids</h3>
                        </div>
                        <div className="space-y-4 mt-6">
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                Protecting critical infrastructure from compounding threats like severe weather and equipment failure is no longer a reactive process, but a highly proactive one. In recent real-world applications, utility giants like Pacific Gas and Electric Company (PG&E) have launched AI-driven continuous monitoring centers that analyze millions of sensor data points to spot problems before they ignite. 
                            </p>
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                Similar to how predictive intelligence successfully intercepted 17 potential ignitions in high fire-risk areas and avoided 12 million minutes of outages for PG&E, our Graph Neural Networks process vast arrays of telemetry to forecast catastrophic events before physical infrastructure is compromised. Instead of waiting for a system failure, our predictive cascade mitigation automatically isolates failing nodes and executes active load balancing to prevent widespread blackouts. Furthermore, by utilizing real-time drone telemetry, vegetation and wildfire defenses can autonomously map encroachment and safely de-energize lines in the direct path of impending fires.
                            </p>
                        </div>
                    </div>
                    {/* 3-Image Masonry Grid */}
                    <div className="order-1 lg:order-2 grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-2 row-span-1 group">
                            <Image src="/images/utility1.jpg" alt="Utility Infrastructure Operations" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/utility2.jfif" alt="Transmission Lines" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/utility3.jfif" alt="Power Generation Plant" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

                {/* SECTOR 2: OIL & GAS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* 3-Image Masonry Grid */}
                    <div className="order-1 lg:order-1 grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/oil2.jfif" alt="Refinery Construction" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/oil3.jfif" alt="Pipeline Inspection" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-2 row-span-1 group">
                            <Image src="/images/oil1.jfif" alt="Oil and Gas Integrity Monitoring" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                    <div className="order-2 lg:order-2 space-y-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-blue-100 dark:bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                                <Droplet className="w-6 h-6 text-blue-600 dark:text-blue-500" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Oil & Gas Midstream</h3>
                        </div>
                        <div className="space-y-4 mt-6">
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                Ensuring pipeline integrity and maintaining strict regulatory compliance requires more than traditional pressure monitoring. The midstream sector is increasingly adopting artificial intelligence to secure high-risk transport corridors against environmental threats. Modern AI-enhanced systems continuously learn from operational data and integrate statistical pattern recognition to detect and localize leaks with unprecedented speed, identifying anomalies that conventional systems miss entirely.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                By mapping complex fluid dynamics and pressure variances, EnergyEminence secures vulnerable networks in real-time. Autonomous drone fleets are deployed to actively monitor remote pipelines, identifying structural threats, landslides, and encroachments long before they escalate. Simultaneously, this automated data ingestion digitizes the tracking process, guaranteeing that operators maintain seamless, real-time environmental compliance with the EPA.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SECTOR 3: RENEWABLES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 lg:order-1 space-y-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-yellow-100 dark:bg-yellow-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                                <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Renewable Integration</h3>
                        </div>
                        <div className="space-y-4 mt-6">
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                As the global grid replaces traditional synchronous generation with intermittent wind and solar, stabilizing the inherent volatility of green energy has become the industry's greatest engineering challenge. According to the U.S. Department of Energy, scaling Virtual Power Plants (VPPs) could address up to 20% of peak demand and save roughly $10 billion annually in grid costs.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                We provide the necessary intelligence layer to integrate these massive-scale Distributed Energy Resources (DERs) smoothly into the global grid. Edge AI agents autonomously coordinate a diverse mix of solar, wind, and battery storage to simulate reliable baseload power. During severe weather events or cold snaps, AI has already proven essential in helping real-world VPPs alleviate grid stress through intelligent load interaction. By fusing live meteorological data with historical output, our platform accurately forecasts renewable yields days in advance, turning unpredictable elements into a highly synchronized, resilient energy network.
                            </p>
                        </div>
                    </div>
                    {/* 3-Image Masonry Grid */}
                    <div className="order-1 lg:order-2 grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-2 row-span-1 group">
                            <Image src="/images/renew 3.jpg" alt="Wind Farm Engineers" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/renew2.jfif" alt="Solar Installation" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/renew1.jpg" alt="Renewable Energy Integration" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 md:py-32 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 transition-colors duration-300 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Main Header */}
          <div className="max-w-4xl mx-auto text-center mb-24">
            <Badge variant="outline" className="mb-6 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 uppercase tracking-widest text-xs">
              Our Mission
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
              Safeguarding the World's Energy.
            </h2>
            <p className="text-xl text-slate-600 dark:text-gray-400 leading-relaxed">
              We envision a future where artificial intelligence seamlessly protects global energy infrastructure—from pipelines to power lines—while actively safeguarding the environment. By unifying interactive digital twins with robotic telemetry, we are building the ultimate defensive layer for our planet's most critical resources.
            </p>
          </div>

          <div className="space-y-32">
            
            {/* Story Block 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-200 dark:border-purple-500/20 mb-6">
                  <Brain className="w-7 h-7 text-purple-600 dark:text-purple-500" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">The Autonomous Infrastructure Brain</h3>
                <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                  Moving beyond passive monitoring, we are building the neurological system for global energy. By bridging interactive digital twins with real-time robotic telemetry, we are pioneering AI agentic swarms capable of autonomous decision-making. 
                </p>
                <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                  This means enabling a future where the grid instantly self-heals and reroutes power during a severe storm, or a pipeline automatically isolates a compromised valve before a single drop is spilled—all executed with mathematical precision and zero human intervention.
                </p>
              </div>
              <div className="order-1 lg:order-2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image src="/images/vision-ai-brain.png" alt="AI Agentic Neural Network" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>

            {/* Story Block 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-1 lg:order-1 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image src="/images/vision-environment.png" alt="Proactive Environmental Shield" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="order-2 lg:order-2 space-y-6">
                <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-200 dark:border-red-500/20 mb-6">
                  <ShieldCheck className="w-7 h-7 text-red-600 dark:text-red-500" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Proactive Environmental Shield</h3>
                <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                  The energy sector and the environment are intrinsically linked. Our vision positions artificial intelligence as the ultimate guardian of planetary health, ensuring that human progress does not come at the cost of the natural world.
                </p>
                <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                  By synthesizing environmental intelligence—such as live weather patterns, flood zones, and atmospheric conditions—with edge-processed drone data, we enable the early detection and prevention of catastrophic events. We identify encroaching wildfires, forecast structural floods, and monitor emissions before they escalate into disasters.
                </p>
              </div>
            </div>

            {/* Story Block 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 lg:order-1 space-y-6">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20 mb-6">
                  <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Accelerating the Clean Transition</h3>
                <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                  True resilience means evolving how we generate and distribute power. As the world aggressively pursues decarbonization, EnergyEminence serves as the critical intelligence layer necessary to stabilize this massive infrastructure transition.
                </p>
                <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                  We are deeply committed to supporting global clean energy initiatives. By optimizing highly volatile distributed energy resources and automating strict environmental compliance tracking, we are smoothing out the engineering hurdles and paving the way for a sustainable, zero-emission future.
                </p>
              </div>
              <div className="order-1 lg:order-2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image src="/images/vision-clean-energy.png" alt="Sustainable Energy Transition" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="relative py-16 md:py-32 bg-slate-50 dark:bg-black border-t border-slate-200 dark:border-white/10 overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] md:w-[1000px] h-[500px] bg-emerald-200/50 dark:bg-emerald-900/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-20">
            <Badge variant="outline" className="mb-4 border-slate-300 dark:border-white/20 text-slate-600 dark:text-gray-400 uppercase tracking-wider text-xs">Technical Architecture</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Engineered for Scale</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400">
            Explore the engineering behind EnergyEminence. From our foundational data acquisition platform handling complex Grid & Flow Physics to our advanced roadmap for autonomous agentic systems.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="group relative bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 dark:from-emerald-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 md:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                    <Network className="w-6 h-6 md:w-7 md:h-7 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <Badge className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 px-3 py-1 text-xs md:text-sm">Current Platform</Badge>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">EnergyEminence Foundation</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed h-auto md:h-32 text-sm md:text-base">
                  Moving beyond basic data acquisition, our platform leverages Physics-Informed Graph Neural Networks combined with Neural ODEs and discrete jump handlers to model cascading failure continuous dynamics governed by Kirchhoff's laws alongside discrete relay trips. This allows for exact, component-level failure predictions across utility and pipeline assets before physical breakdown occurs.
                </p>
                <Link href="#contact">
                  <Button className="w-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300 font-semibold h-12">
                    Request Architecture Specs
                  </Button>
                </Link>
              </div>
            </div>

            <div className="group relative bg-white/80 dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 dark:from-purple-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 md:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 dark:bg-purple-950/50 rounded-2xl border border-purple-200 dark:border-purple-500/20 flex items-center justify-center">
                    <Cpu className="w-6 h-6 md:w-7 md:h-7 text-purple-600 dark:text-purple-500" />
                  </div>
                  <Badge className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 px-3 py-1 text-xs md:text-sm">Future Vision</Badge>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">AI Agentic System Extension</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-8 leading-relaxed h-auto md:h-32 text-sm md:text-base">
                  Our roadmap utilizes bounded Agentic AI and multi-agent reinforcement learning for deep perception, reasoning, and multi-step planning. These autonomous decision-making agents bypass human latency, executing automated self-healing networks and pipeline isolation operations strictly enforced by supervisory safety constraints.
                </p>
                <Link href="#contact">
                  <Button className="w-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 font-semibold h-12">
                    Request Vision Paper
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Leadership Section */}
      <section id="about" className="py-24 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row: About & MVP Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20 px-4 py-1 text-sm">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">About Kraftgene AI</h2>
              <p className="text-base md:text-lg text-slate-700 dark:text-gray-300 mb-6 leading-relaxed">
                Founded in Toronto, Ontario, Kraftgene AI develops enterprise artificial intelligence solutions for the energy sector. We build technology that protects critical infrastructure while accelerating environmental sustainability.
                <br /><br />
                Our platform acts as a "Single Pane of Glass" for energy convergence. Whether monitoring electron flow in utility grids or fluid dynamics in pipelines, our core AI engine unifies infrastructure health with environmental intelligence through real-time digital twin visualization.
              </p>
            </div>
            
            {/* Live MVP Card */}
            <div className="flex justify-center">
              <div className="bg-slate-50 dark:bg-gray-900/50 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center max-w-md w-full shadow-2xl shadow-emerald-900/10 dark:shadow-emerald-900/20 transition-colors duration-300">
                  <div className="flex justify-center mb-6">
                    <Activity className="w-12 h-12 md:w-16 md:h-16 text-emerald-600 dark:text-emerald-500" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Live MVP</h3>
                  <p className="text-lg text-slate-600 dark:text-gray-400 mb-8">Experience EnergyEminence™ in action. Explore our real-time interactive digital twin.</p>
                  <Link href="https://www.energyeminence.online/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors">
                      Access the live platform <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
              </div>
            </div>
          </div>

          {/* Bottom Row: Founders */}
          <div id="team" className="pt-16 border-t border-slate-200 dark:border-white/10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Meet Our Founders
              </h2>
              <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                A diverse group of experts in AI, robotics, and engineering dedicated to building resilient critical infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {[
                {
                  name: "Yu Nong (John)",
                  role: "Co-Founder & CEO",
                  image: "images/me.jpg",
                  linkedin: "https://www.linkedin.com/in/nongyu/",
                  bio: "John blends visionary leadership with expertise in ML, software engineering, and robotics to drive global infrastructure resilience.",
                },
                {
                  name: "Huy (Michel) Trinh",
                  role: "Co-Founder, Digital Twins Engineer & Head of Technical Partnerships",
                  image: "images/Huy.jfif",
                  linkedin: "https://www.linkedin.com/in/huy-michel-trinh-masc-085905187/",
                  bio: "Michel bridges physics-informed modeling with machine learning, leading the development of our high-performance Digital Twin architecture and spearheading strategic industry partnerships.",
                },
                {
                  name: "Yonghao Mai (Michael)",
                  role: "Co-Founder & Chief AI Officer",
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
                      <img src={member.image} alt={member.name} className="object-cover w-full h-full" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-emerald-600 dark:text-emerald-500 text-sm font-medium mb-4">{member.role}</p>
                  <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </a>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Strategic Partners Section */}
      <section className="py-16 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
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
              { src: "/images/vin.png", alt: "Vector Institute", href: "https://vectorinstitute.ai/" },
              { src: "/images/partnerp.jpg", alt: "Plug and Play", href: "https://www.plugandplaytechcenter.com/" },
              { src: "/images/partner11.PNG", alt: "Microsoft", href: "https://www.microsoft.com" },
            ].map((partner, index) => (
              <a 
                key={index} 
                href={partner.href}
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-slate-50 dark:bg-white rounded-xl p-4 w-30 h-24 md:w-32 md:h-28 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-sm dark:shadow-none border border-slate-200 dark:border-transparent"
              >
                <div className="relative w-full h-full">
                  <Image src={partner.src} alt={partner.alt} fill className="object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Platform / Contact CTA */}
      <section id="contact" className="py-16 md:py-20 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-black border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Contact Info */}
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">Secure Your Infrastructure Today</h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-gray-400 mb-10 max-w-lg">
                We are currently seeking enterprise pilot partners and engaging with strategic investors to scale our platform deployment.
              </p>
              
              <div className="flex flex-col gap-6 mb-12">
                 <div className="flex items-center space-x-4 text-slate-700 dark:text-gray-300">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center rounded-full">
                      <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <span className="text-lg font-medium">Toronto, Ontario, Canada</span>
                 </div>
                 <div className="flex items-center space-x-4 text-slate-700 dark:text-gray-300">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center rounded-full">
                      <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <span className="text-lg font-medium">info@kraftgeneai.ca</span>
                 </div>
              </div>
              
              <div className="flex justify-start space-x-4">
                 <SocialButtons />
              </div>
            </div>

            {/* Right: Interactive Map */}
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl shadow-emerald-900/5 dark:shadow-emerald-900/10">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184552.674101416!2d-79.54286524388836!3d43.71837095818981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sToronto%2C%20ON!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="filter dark:invert-[90%] dark:hue-rotate-180 transition-all duration-300"
              />
            </div>

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