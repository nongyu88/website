"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";
import { 
  ArrowRight, MapPin, Mail, Zap, ShieldCheck, 
  Brain, Leaf, CheckCircle, Cpu, Network, Map, 
  Menu, X, Droplet, Sun, Layers, PlayCircle, Activity,
  CloudLightning, AlertTriangle, Database, ArrowUpRight,
  Volume2, VolumeX // <-- Add these two
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FaGithub, FaDiscord, FaLinkedin } from "react-icons/fa"
import ModeToggle from "@/components/ui/mode-toggle"

export default function HomePage() {
  // 1. DEFINE SLIDE DATA (Hero Backgrounds)
  const videoSlides = [
    "/1.webm", "/2.webm", "/3.webm", "/4.webm", 
    "/5.webm", "/6.webm", "/7.webm", "/8.webm"
  ];

  const [currentNewsIdx, setCurrentNewsIdx] = useState(0);
  const newsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  // ADD THIS STATE:
  const [clientName, setClientName] = useState<string | null>(null);

  // ADD THIS EFFECT:
  useEffect(() => {
    const token = localStorage.getItem("kraftgene_token");
    const loginTime = localStorage.getItem("login_timestamp");
    const userStr = localStorage.getItem("user");

    if (token && loginTime && userStr) {
      const timeElapsed = Date.now() - parseInt(loginTime);
      const fifteenMinutes = 15 * 60 * 1000;

      // Only show the name if the session is still active
      if (timeElapsed < fifteenMinutes) {
        try {
          const user = JSON.parse(userStr);
          setClientName(user.company || "Enterprise Client");
        } catch (e) {
          console.error("Failed to parse user data");
        }
      }
    }
  }, []);

  // This function decides where the buttons should take the user
  const handleProtectedNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("kraftgene_token");
    const loginTime = localStorage.getItem("login_timestamp");

    if (token && loginTime) {
      const timeElapsed = Date.now() - parseInt(loginTime);
      const fifteenMinutes = 15 * 60 * 1000;

      if (timeElapsed < fifteenMinutes) {
        // User is logged in AND within 15 minutes -> Send to Dashboard
        router.push("/dashboard");
        return;
      }
    }

    // User is NOT logged in (or session expired) -> Send to Login
    router.push("/login");
  };

  const newsItems = [
    {
      id: 1,
      date: "May 29, 2026",
      title: "Kraftgene AI at Toronto Tech Week",
      content: "We successfully hosted our latest tech showcase at Toronto Tech Week. Thank you to everyone who joined us to discuss the future of critical infrastructure resilience and autonomous AI.",
      links: [{ url: "https://luma.com/wiupfm5m", text: "View Event Details", isProtected: false }],
      media: [
        { type: "image", src: "/images/TTW-1.webp" },
        { type: "image", src: "/images/TTW-2.webp" }
      ]
    },
    {
      id: 2,
      date: "July 20, 2026",
      title: "EnergyEminence™ - G is Now Live",
      content: "Experience the future of grid monitoring. Our Power Grid Digital Twin MVP is officially online, interactive, and ready for exploration.",
      links: [{ url: "", text: "Access Grid MVP", isProtected: true }],
      media: [
        { type: "video", src: "/demo1-maps.webm" } 
      ]
    },
    {
      id: 3,
      date: "July 27, 2026",
      title: "EnergyEminence™ - P is Now Live",
      content: "Explore our real-time interactive fluid dynamics twin. The Oil & Gas Pipeline Digital Twin MVP is officially online for enterprise testing.",
      links: [{ url: "", text: "Access Pipeline MVP", isProtected: true }],
      media: [
        { type: "video", src: "/cap5.webm" } 
      ]
    },
    {
      id: 4,
      date: "July 11, 2026",
      title: "Networking at StartupFest Montreal",
      content: "The Kraftgene AI team traveled to Montreal for StartupFest, connecting with industry leaders, investors, and innovators to expand our strategic partnerships across Canada.",
      links: [],
      media: [
        { type: "image", src: "/images/startupfest1.webp" },
        { type: "image", src: "/images/startupfest2.webp" },
        { type: "image", src: "/images/startupfest3.webp" }
      ]
    },
    {
      id: 5,
      date: "July 27, 2026",
      title: "Joining Vector Institute Fast Lane & DaRmod",
      content: "We are proud to become an active member of the Vector Institute's Fast Lane program and officially join the DaRmod program, accelerating our AI capabilities with world-class research backing.",
      links: [],
      media: [
        { type: "image", src: "/images/fast-lane.png" } 
      ]
    },
    {
      id: 6,
      date: "April 11, 2026",
      title: "Accepted into Microsoft for Startups Founders Hub",
      content: "We are thrilled to join the Microsoft for Startups Founders Hub, gaining access to industry-leading AI infrastructure and Azure cloud resources to scale EnergyEminence™ globally.",
      links: [],
      media: [
        { type: "image", src: "/images/news-MSforS.jfif" } 
      ]
    },
    {
      id: 7,
      date: "December 17, 2025",
      title: "Accepted into NVIDIA Inception Program",
      content: "Kraftgene AI is officially part of the NVIDIA Inception global program, empowering our physics-informed predictive models with cutting-edge GPU acceleration.",
      links: [],
      media: [
        { type: "image", src: "/images/news-nvidia-inception.jpeg" } 
      ]
    },
    {
      id: 8,
      date: "November 10, 2025",
      title: "Accepted into AWS Activate Program",
      content: "We have partnered with AWS through the Activate program, strengthening our digital twin pipeline with enterprise-grade cloud reliability.",
      links: [],
      media: [
        { type: "image", src: "/images/news-aws-activate.jfif" } 
      ]
    },
    {
      id: 9,
      date: "May 10, 2026",
      title: "Accepted into Google for Startups",
      content: "Kraftgene AI has joined the Google for Startups ecosystem, gaining strategic support to scale our AI-driven critical infrastructure solutions.",
      links: [],
      media: [
        { type: "image", src: "/images/news-google-startup.jfif" } 
      ]
    }
  ];
  const nextNewsSlide = () => {
    setCurrentNewsIdx((prevIdx) => (prevIdx === newsItems.length - 1 ? 0 : prevIdx + 1));
  };

  const jumpToNews = (index: number) => {
    setCurrentNewsIdx(index);
    if (newsTimerRef.current) clearInterval(newsTimerRef.current);
    newsTimerRef.current = setInterval(nextNewsSlide, 12000);
  };

  useEffect(() => {
    newsTimerRef.current = setInterval(nextNewsSlide, 12000); 
    return () => {
      if (newsTimerRef.current) clearInterval(newsTimerRef.current);
    };
  }, []);
  
  // Tab State for Mission-Critical Action Section
  const [activeTab, setActiveTab] = useState<"utility" | "pipeline">("utility");

  // Track active module and create refs for the scroll-spy effect
  const [activeModule, setActiveModule] = useState(0);
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track mute state for the demo videos (false = audio on by default)
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // --------------------------------------------------------
  // UTILITY POWER GRID MODULES (Original 8 Caps)
  // --------------------------------------------------------
  const utilityModules = [
    {
      id: "01",
      title: "Multi-Modal Twin Visualization",
      description: "Seamlessly toggle between 2D geographic reality and 3D physics-relaxed topological shapes. Understand the spatial and logical relationships of critical infrastructure simultaneously in real-time.",
      videoSrc: "/demo1-maps.webm"
    },
    {
      id: "02",
      title: "Dynamic Topology Engineering",
      description: "Edit grid architecture on the fly. Drop new generation nodes, draw transmission lines, and define load parameters within an interactive sandbox to securely model infrastructure upgrades.",
      videoSrc: "/demo2-topology.webm"
    },
    {
      id: "03",
      title: "Environmental Intelligence Fusion",
      description: "Overlay live meteorological data directly onto the grid topology. Monitor severe weather patterns, flood zones, and atmospheric conditions to proactively manage infrastructure exposure.",
      videoSrc: "/demo3-weather.webm"
    },
    {
      id: "04",
      title: "Edge-Processed UAV Ingestion",
      description: "Pipe live drone video feeds directly into the digital twin. Deployed edge AI models process visual data locally, identifying physical threats like encroaching wildfires with zero latency.",
      videoSrc: "/demo4-uav.webm"
    },
    {
      id: "05",
      title: "Autonomous Grid Copilot",
      description: "Transition from reactive alerts to autonomous action. The Grid Copilot instantly generates an executable mitigation matrix to isolate burning nodes, shed load, and halt cascading failures.",
      videoSrc: "/demo5-copilot.webm"
    },
    {
      id: "06",
      title: "3D Spatial Mitigation",
      description: "Execute complex cascade and wildfire response strategies using our immersive 3D topological view. The Copilot orchestrates real-time spatial isolation commands with complete situational awareness.",
      videoSrc: "/demo6-copilot-3d.webm"
    },
    {
      id: "07",
      title: "Multi-Spectrum Thermal Vision",
      description: "Go beyond standard optical feeds with real-time FLIR and thermal infrared drone ingestion. The AI vision engine continuously scans for intense heat anomalies—detecting overheating transformers and invisible structural fires to trigger immediate Copilot isolation.",
      videoSrc: "/demo7-thermal.webm"
    },
    {
      id: "08",
      title: "Physics-Informed Prediction Engine",
      description: "Stay ahead of catastrophe. Our predictive AI engine utilizes physics-informed machine learning to forecast node failures and map cascading blackouts before physical infrastructure is actually compromised.",
      videoSrc: "/demo8-prediction.webm" 
    },
  ];

  // --------------------------------------------------------
  // OIL & GAS PIPELINE MODULES (Derived from Uploaded Frames)
  // --------------------------------------------------------
  const pipelineModules = [
    {
      id: "01",
      title: "Multi-Modal Topology & Telemetry",
      description: "Seamlessly transition between 2D geographic reality and 3D logical topologies. Inspect live SCADA telemetry, pressure, and flow dynamics across individual pipeline segments.",
      videoSrc: "/cap1.webm"
    },
    {
      id: "02",
      title: "Dynamic Network Engineering",
      description: "Modify pipeline infrastructure on the fly. Drop new pump stations, delivery terminals, and valves, then draw transmission segments within an interactive digital sandbox.",
      videoSrc: "/cap2.webm"
    },
    {
      id: "03",
      title: "Environmental Hazard Fusion",
      description: "Overlay live meteorological data directly onto the pipeline corridor. Monitor severe weather fronts, active flood zones, storm tracks, and tornado risks to defend vulnerable assets.",
      videoSrc: "/cap3.webm"
    },
    {
      id: "04",
      title: "Multi-Stream UAV Ingestion",
      description: "Stream multiple live drone feeds directly into the digital twin. Edge AI models process visual and thermal data locally to detect physical encroachments across the network.",
      videoSrc: "/cap4.webm"
    },
    {
      id: "05",
      title: "Thermal Anomaly Detection",
      description: "Go beyond optical feeds using multi-spectrum thermal drone ingestion. Continuously scan high-risk pipeline corridors to instantly detect intense heat signatures and active fires.",
      videoSrc: "/cap5.webm"
    },
    {
      id: "06",
      title: "Autonomous AI Copilot Isolation",
      description: "Transition from manual monitoring to AI-assisted defense. The Pipeline Copilot instantly generates and executes an action plan to isolate compromised wildfire nodes and prevent systemic failure.",
      videoSrc: "/cap6.webm"
    },
    {
      id: "07",
      title: "Physics-Informed Prediction Engine",
      description: "Prevent failure before it strikes. Powered by physics-informed machine learning, our predictive AI accurately forecasts critical node vulnerabilities and models cascade paths before real-world infrastructure is impacted.",
      videoSrc: "/cap7.webm"
    }
  ];

  // Determine which array to render based on active tab
  const currentModules = activeTab === "utility" ? utilityModules : pipelineModules;

  // The Scroll-Spy Effect: Bulletproof Auto-Switching
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveModule(index);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 } 
    );

    const currentRefs = moduleRefs.current;
    // Disconnect old observer when switching tabs to prevent glitches
    observer.disconnect(); 
    
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [activeTab]); // Re-run effect when tabs change

  // Reset active module to 0 when switching tabs
  const handleTabSwitch = (tab: "utility" | "pipeline") => {
    setActiveTab(tab);
    setActiveModule(0);
    // Optional: Smooth scroll back to the top of the section
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  // 2. STATE MANAGEMENT (Existing Hero Code)
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [loginText, setLoginText] = useState("Client Login");

  const handleLoginClick = () => {
    setLoginText("Coming Soon...");
    setTimeout(() => {
      setLoginText("Client Login");
    }, 3000);
  };

  const nextSlide = () => {
    setCurrentSlideIdx((prevIdx) => (prevIdx === videoSlides.length - 1 ? 0 : prevIdx + 1));
  };

  const jumpToSlide = (index: number) => {
    setCurrentSlideIdx(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(nextSlide, 10000);
  };

  // 3. EFFECTS (Existing Hero Code)
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

  const SocialButtons = () => (
    /* Existing Social Buttons Code */
    <></>
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
            <div className="hidden xl:flex items-center gap-6">
               <div className="flex items-center space-x-2">
                   <Link href="#demo">
                     <Button variant="ghost" className="text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 h-9 px-4 text-sm font-medium rounded-md">
                       Platform
                     </Button>
                   </Link>
                   <Link href="#solutions">
                     <Button variant="ghost" className="text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 h-9 px-4 text-sm font-medium rounded-md">
                       Solutions
                     </Button>
                   </Link>
                   <Link href="#about">
                     <Button variant="ghost" className="text-slate-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 h-9 px-4 text-sm font-medium rounded-md">
                       About
                     </Button>
                   </Link>
               </div>

               <div className="h-5 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
               
               <div className="flex items-center gap-3">
                {/* Dynamic Client Login / Greeting Button */}
                <Button 
                  onClick={handleProtectedNavigation}
                  variant="ghost" 
                  className="text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white h-9 px-4 text-sm font-medium transition-all duration-300"
                >
                  {clientName ? `Hello, welcome ${clientName}!` : "Client Login"}
                </Button>

                {/* Grid MVP Button (Dynamic) */}
                <Button 
                  onClick={handleProtectedNavigation}
                  className="bg-white text-black hover:bg-slate-100 dark:bg-white dark:text-black dark:hover:bg-slate-200 border border-slate-200 dark:border-transparent rounded-full h-9 px-5 text-sm font-semibold shadow-sm transition-all flex items-center"
                >
                  Grid MVP <ArrowUpRight className="ml-1.5 w-4 h-4" />
                </Button>

                {/* Pipeline MVP Button (Dynamic) */}
                <Button 
                  onClick={handleProtectedNavigation}
                  variant="outline" 
                  className="text-slate-900 dark:text-white border-slate-300 dark:border-white/30 rounded-full h-9 px-5 text-sm font-semibold shadow-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center"
                >
                  Pipeline MVP <ArrowUpRight className="ml-1.5 w-4 h-4" />
                </Button>

                 <Link href="#contact">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 h-9 px-5 text-sm font-medium shadow-sm rounded-md transition-all">
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
                {/* Mobile Grid MVP Button (Dynamic) */}
                <Button 
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleProtectedNavigation(e);
                  }} 
                  className="w-full bg-white text-black hover:bg-slate-100 border border-slate-200 dark:border-transparent dark:bg-white dark:text-black dark:hover:bg-slate-200 h-10 font-semibold flex items-center justify-center"
                >
                  Grid MVP <ArrowUpRight className="ml-1.5 w-4 h-4" />
                </Button>
                
                {/* Mobile Pipeline MVP Button (Dynamic) */}
                <Button 
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleProtectedNavigation(e);
                  }} 
                  variant="outline" 
                  className="w-full text-slate-900 dark:text-white border-slate-300 dark:border-white/30 h-10 font-semibold flex items-center justify-center"
                >
                  Pipeline MVP <ArrowUpRight className="ml-1.5 w-4 h-4" />
                </Button>
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
              preload={index === 0 ? "auto" : "none"} // <-- ONLY preload the very first video
              className="w-full h-full object-cover opacity-60" 
              src={shouldLoadVideo(index) ? src : undefined} 
            />
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
                Critical Grid Resilience, Oil & Gas Pipelines, & Renewable Energy Management
              </span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-700 dark:text-gray-300 mb-10 max-w-3xl mx-auto px-2">
              EnergyEminence™ is a physics-backed digital twin that fuses live drone surveillance and physics-informed ML as a predictive engine with an autonomous AI Copilot to instantly detect, isolate, and mitigate catastrophic failures before they happen.
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
          
          {/* Section Header & Tabs */}
          <div className="max-w-4xl mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Designed for Mission-Critical Action.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mb-10">
              The <strong className="text-slate-900 dark:text-white">EnergyEminence™</strong> suite—anchored by its flagship twins, <span className="font-semibold text-emerald-600 dark:text-emerald-400">EnergyEminence - G</span> (Power Grids) and <span className="font-semibold text-blue-600 dark:text-blue-400">EnergyEminence - P</span> (Oil & Gas Pipelines)—replaces legacy, reactive telemetry with an active, physics-informed environment built for decisive defensive control.
            </p>

            {/* HORIZONTAL TABS */}
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
              <Button 
                variant={activeTab === "utility" ? "default" : "ghost"}
                onClick={() => handleTabSwitch("utility")}
                className={`h-11 px-6 text-sm font-semibold rounded-full transition-all ${
                  activeTab === "utility" 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-900/20" 
                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                <Zap className="w-4 h-4 mr-2" /> Utility Power Grid
              </Button>
              <Button 
                variant={activeTab === "pipeline" ? "default" : "ghost"}
                onClick={() => handleTabSwitch("pipeline")}
                className={`h-11 px-6 text-sm font-semibold rounded-full transition-all ${
                  activeTab === "pipeline" 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-900/20" 
                    : "text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
                }`}
              >
                <Droplet className="w-4 h-4 mr-2" /> Oil & Gas Pipeline
              </Button>
            </div>
          </div>

          {/* Interactive Feature Explorer */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start relative">
            
            {/* Left Column: Scrollable Text Blocks */}
            <div className="lg:col-span-5 pb-[40vh]"> 
              {currentModules.map((mod, idx) => {
                const isActive = activeModule === idx;
                return (
                  <div 
                    key={`${activeTab}-${idx}`} // Force re-render of blocks when tab changes
                    data-index={idx}
                    ref={(el) => { moduleRefs.current[idx] = el; }}
                    className={`relative group pl-8 transition-all duration-700 min-h-[50vh] flex flex-col justify-center cursor-pointer ${
                      isActive ? "opacity-100" : "opacity-40 hover:opacity-70 dark:opacity-30 dark:hover:opacity-60"
                    }`}
                    onClick={() => setActiveModule(idx)}
                  >
                    {/* Left Border Indicator */}
                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 transition-all duration-500 rounded-r-full ${
                      isActive ? (activeTab === "utility" ? "bg-emerald-500" : "bg-blue-500") + " h-full max-h-[80%]" : "bg-slate-200 dark:bg-white/10 h-0"
                    }`} />

                    {/* Text Content */}
                    <div className="flex flex-col space-y-4">
                      <span className={`text-[11px] font-mono font-bold tracking-widest uppercase transition-colors duration-300 ${
                        isActive 
                          ? (activeTab === "utility" ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400") 
                          : "text-slate-400 dark:text-slate-500"
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
                    Book a Meeting
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Sticky Video Player */}
            <div className="lg:col-span-7 sticky top-32">
              <div className="relative rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black p-2 shadow-2xl transition-colors duration-300">
                
                {/* Visual Terminal Chrome */}
                <div className="flex items-center justify-between border-b border-slate-300 dark:border-white/5 pb-2 mb-2 px-2 transition-colors">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-white/20" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeTab === "utility" ? "bg-emerald-500" : "bg-blue-500"}`} /> 
                    Live Terminal ({activeTab === "utility" ? "Grid" : "Pipeline"})
                  </span>
                </div>

                {/* Dynamic Video Player */}
                <div className="relative overflow-hidden rounded-md border border-slate-300 dark:border-white/5 bg-white dark:bg-[#050505] aspect-video transition-colors group">
                  <video 
                    key={`${activeTab}-${activeModule}`}
                    autoPlay 
                    loop 
                    muted={isVideoMuted} 
                    playsInline
                    preload="none"
                    poster="/images/snowscreen.jfif"
                    className="w-full h-full object-cover opacity-95" 
                  >
                    <source src={currentModules[activeModule]?.videoSrc} type="video/webm" />
                  </video>

                  {/* Audio Toggle Button */}
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="absolute bottom-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/60 dark:bg-black/60 hover:bg-slate-900/80 dark:hover:bg-black/80 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-lg border border-white/10 flex items-center justify-center"
                    aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
                  >
                    {isVideoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
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
                  EnergyEminence™bridges the gap between sectors with a highly modular architecture. Our edge-deployed AI agents deliver fast, comprehensive optimization across all facets of critical infrastructure.
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
                            <Image src="/images/utility1.webp" alt="Utility Infrastructure Operations" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/utility2.webp" alt="Transmission Lines" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/utility3.webp" alt="Power Generation Plant" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

                {/* SECTOR 2: OIL & GAS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* 3-Image Masonry Grid */}
                    <div className="order-1 lg:order-1 grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/oil2.webp" alt="Refinery Construction" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/oil3.webp" alt="Pipeline Inspection" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-2 row-span-1 group">
                            <Image src="/images/oil1.webp" alt="Oil and Gas Integrity Monitoring" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
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
                                By mapping complex fluid dynamics and pressure variances, EnergyEminence™secures vulnerable networks in real-time. Autonomous drone fleets are deployed to actively monitor remote pipelines, identifying structural threats, landslides, and encroachments long before they escalate. Simultaneously, this automated data ingestion digitizes the tracking process, guaranteeing that operators maintain seamless, real-time environmental compliance with the EPA.
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
                            <Image src="/images/renew 3.webp" alt="Wind Farm Engineers" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/renew2.webp" alt="Solar Installation" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/renew1.webp" alt="Renewable Energy Integration" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
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
                <Image src="/images/vision-ai-brain.webp" alt="AI Agentic Neural Network" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>

            {/* Story Block 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-1 lg:order-1 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image src="/images/vision-environment.webp" alt="Proactive Environmental Shield" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
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
                  True resilience means evolving how we generate and distribute power. As the world aggressively pursues decarbonization, EnergyEminence™serves as the critical intelligence layer necessary to stabilize this massive infrastructure transition.
                </p>
                <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                  We are deeply committed to supporting global clean energy initiatives. By optimizing highly volatile distributed energy resources and automating strict environmental compliance tracking, we are smoothing out the engineering hurdles and paving the way for a sustainable, zero-emission future.
                </p>
              </div>
              <div className="order-1 lg:order-2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image src="/images/vision-clean-energy.webp" alt="Sustainable Energy Transition" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Market Urgency Section */}
      <section id="urgency" className="py-32 bg-slate-50 dark:bg-[#050505] border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            
            {/* Section Header */}
            <div className="text-center mb-24 md:mb-32">
                <Badge variant="outline" className="mb-6 border-red-500 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-4 py-1.5 uppercase tracking-widest text-xs">
                  The Urgency of Now
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                  Infrastructure at a Breaking Point.
                </h2>
                <p className="text-xl text-slate-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  We are entering an era of unprecedented stress on global energy networks. Legacy monitoring systems are fundamentally unequipped to handle the speed, complexity, and scale of modern grid threats.
                </p>
            </div>

            <div className="space-y-40">
                
                {/* URGENCY 1: CLIMATE VOLATILITY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 lg:order-1 space-y-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-red-100 dark:bg-red-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                                <CloudLightning className="w-6 h-6 text-red-600 dark:text-red-500" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Extreme Weather Events</h3>
                        </div>
                        <div className="space-y-4 mt-6">
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                Wildfires, deep freezes, and category 5 hurricanes are increasing in frequency. The grid was not engineered to withstand these relentless environmental assaults, leading to catastrophic physical damage.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                Relying on historical weather models is no longer safe. Trillion-dollar energy grids need dynamic, physics-backed situational awareness to anticipate atmospheric impacts hours before they strike physical nodes.
                            </p>
                        </div>
                    </div>
                    {/* 4-Image 2x2 Grid ('e' group) */}
                    <div className="order-1 lg:order-2 grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/e1.webp" alt="Severe weather storm over power grid" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/e2.webp" alt="Wildfire encroaching infrastructure" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/e3.webp" alt="Iced transmission lines" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/e4.webp" alt="Climate impact" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

                {/* URGENCY 2: THE AI POWER SURGE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* 4-Image 2x2 Grid ('a' group) */}
                    <div className="order-1 lg:order-1 grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/a1.webp" alt="Massive data center racks" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/a2.webp" alt="High voltage power substation" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/a3.webp" alt="Global energy consumption overlay" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/a4.webp" alt="AI grid demand" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                    <div className="order-2 lg:order-2 space-y-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-amber-100 dark:bg-amber-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-amber-600 dark:text-amber-500" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">The AI Power Surge</h3>
                        </div>
                        <div className="space-y-4 mt-6">
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                The rapid scaling of AI data centers and global electrification is draining baseload power. Grids are operating dangerously close to their maximum physical thresholds on a daily basis.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                Without real-time topology adjustments and autonomous load-shedding configurations, localized thermal overloads from high-density computation clusters risk triggering massive, cascading regional blackouts.
                            </p>
                        </div>
                    </div>
                </div>

                {/* URGENCY 3: AGING ASSETS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 lg:order-1 space-y-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="bg-orange-100 dark:bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-500" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Aging Assets & Legacy Decay</h3>
                        </div>
                        <div className="space-y-4 mt-6">
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                Much of the global transmission architecture is decades past its intended lifespan. Relying on human dispatchers and delayed SCADA alerts to manage decaying assets is a mathematical impossibility.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed">
                                To prevent trillion-dollar collapses, the grid must think for itself. Autonomous AI is no longer a futuristic luxury—it is the only statistically viable way to calculate asset degradation and execute defensive isolation in real-time.
                            </p>
                        </div>
                    </div>
                    {/* 4-Image 2x2 Grid ('o' group) */}
                    <div className="order-1 lg:order-2 grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/o1.webp" alt="Aging heavy industrial plant" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/o2.webp" alt="Old substation transformer" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/o3.webp" alt="Corroded electrical components" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 col-span-1 row-span-1 group">
                            <Image src="/images/o4.webp" alt="Infrastructure wear" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* How It Works (Data Pipeline) */}
      <section className="py-24 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 uppercase tracking-widest text-xs">
              The Data Pipeline
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              How EnergyEminence™ Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              A seamless, continuous loop of intelligence bridging the physical and digital worlds in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-[3rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent z-0"></div>

            {/* Step 1: Ingest */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-slate-50 dark:bg-[#050505] rounded-full border-4 border-white dark:border-black flex items-center justify-center shadow-xl shadow-slate-200/50 dark:shadow-none mb-8 group-hover:scale-110 transition-transform duration-500">
                <Database className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Ingest</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed max-w-xs">
                Connect directly to existing SCADA systems, distributed IoT sensors, and live edge-processed drone telemetry.
              </p>
            </div>

            {/* Step 2: Process */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-slate-50 dark:bg-[#050505] rounded-full border-4 border-white dark:border-black flex items-center justify-center shadow-xl shadow-slate-200/50 dark:shadow-none mb-8 group-hover:scale-110 transition-transform duration-500">
                <Layers className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Process</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed max-w-xs">
                Map incoming spatial and meteorological data instantly onto the 3D physics-informed topological digital twin.
              </p>
            </div>

            {/* Step 3: Act */}
            <div className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-slate-50 dark:bg-[#050505] rounded-full border-4 border-white dark:border-black flex items-center justify-center shadow-xl shadow-slate-200/50 dark:shadow-none mb-8 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Act</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed max-w-xs">
                The autonomous AI Copilot calculates mitigation matrices, isolates failing nodes, and prevents cascading infrastructure collapse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Leadership Section */}
      <section id="about" className="py-24 bg-white dark:bg-black border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row: About & MVP Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mb-24">
            
            {/* Column 1: Text Content */}
            <div className="lg:pr-4">
              <Badge className="mb-4 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-500 border-emerald-200 dark:border-emerald-500/20 px-4 py-1 text-sm">
                Our Story
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">About Kraftgene AI</h2>
              <p className="text-base md:text-lg text-slate-700 dark:text-gray-300 mb-6 leading-relaxed">
                Founded in Toronto, Ontario, Kraftgene AI develops enterprise artificial intelligence solutions for the energy sector. We build technology that protects critical infrastructure while accelerating environmental sustainability.
                <br /><br />
                Our platform acts as a "Single Pane of Glass" for energy convergence. Whether monitoring electron flow in utility grids or fluid dynamics in pipelines, our core AI engine unifies infrastructure health with environmental intelligence through real-time digital twin visualization.
              </p>
            </div>
            
            {/* Column 2: Live MVP Showcase Card (Grid) */}
            <div 
              onClick={handleProtectedNavigation}
              className="bg-[#0a1110] border border-emerald-900/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col group transition-all duration-300 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] w-full max-w-md mx-auto h-[480px] cursor-pointer"
            >
              {/* Top: The Map Image (60% Height) */}
              <div className="relative w-full h-[60%] overflow-hidden bg-black border-b border-emerald-900/30">
                <Image 
                  src="/images/MVP_face.webp" 
                  alt="EnergyEminence™ Grid MVP" 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80" 
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0a1110] to-transparent"></div>
              </div>

              {/* Bottom: The Content (40% Height) */}
              <div className="w-full h-[40%] px-6 py-4 flex flex-col items-center justify-center text-center relative z-10">
                <Zap className="w-8 h-8 text-emerald-400 mb-3 stroke-[2.5]" />
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Power Grid MVP</h3>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed px-2">
                  Experience EnergyEminence™ - G. Explore our real-time interactive grid digital twin.
                </p>
                <span className="text-emerald-400 text-sm font-semibold flex items-center group-hover:text-emerald-300 transition-colors">
                  Access Grid Platform 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </div>
            </div>

            {/* Column 3: Live MVP Showcase Card (Pipeline) */}
            <div 
              onClick={handleProtectedNavigation}
              className="bg-[#050a14] border border-blue-900/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col group transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] w-full max-w-md mx-auto h-[480px] cursor-pointer"
            >
              {/* Top: The Map Image (60% Height) */}
              <div className="relative w-full h-[60%] overflow-hidden bg-black border-b border-blue-900/30">
                <Image 
                  src="/images/pipeline-mvp.webp" 
                  alt="EnergyEminence™ Pipeline MVP" 
                  fill 
                  className="object-cover object-left-top group-hover:scale-105 transition-transform duration-700 opacity-80" 
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#050a14] to-transparent"></div>
              </div>

              {/* Bottom: The Content (40% Height) */}
              <div className="w-full h-[40%] px-6 py-4 flex flex-col items-center justify-center text-center relative z-10">
                <Droplet className="w-8 h-8 text-blue-400 mb-3 stroke-[2.5]" />
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Oil & Gas Pipeline MVP</h3>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed px-2">
                  Experience EnergyEminence™ - P. Explore our real-time interactive fluid dynamics twin.
                </p>
                <span className="text-blue-400 text-sm font-semibold flex items-center group-hover:text-blue-300 transition-colors">
                  Access Pipeline Platform 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </div>
            </div>

          </div>

      {/* Investor & Customer Q&A Section */}
      <section id="faq" className="py-24 bg-slate-50 dark:bg-[#050505] border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 uppercase tracking-widest text-xs">
              Investor & Customer Q&A
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-lg">
              Everything you need to know about our technology, market focus, and strategic growth.
            </p>
          </div>

          <div className="space-y-4">
            {/* FAQ Item 1 */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isExpanded = content.style.maxHeight;
                  
                  // Close all other accordions
                  document.querySelectorAll('.faq-content').forEach((el) => {
                    (el as HTMLElement).style.maxHeight = "";
                    el.previousElementSibling?.querySelector('svg')?.classList.remove('rotate-180');
                  });

                  // Toggle current accordion
                  if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    e.currentTarget.querySelector('svg')?.classList.add('rotate-180');
                  }
                }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  What exactly does EnergyEminence™ do?
                </h3>
                <svg className="w-6 h-6 text-emerald-500 transform transition-transform duration-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="faq-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-slate-50 dark:bg-transparent">
                <div className="px-8 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                  EnergyEminence™ is an advanced AI platform that integrates energy infrastructure monitoring with environmental threat detection, robotics, and agentic AI. This enables sustainable energy management and protects critical assets from catastrophic failure before it happens.
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isExpanded = content.style.maxHeight;
                  
                  document.querySelectorAll('.faq-content').forEach((el) => {
                    (el as HTMLElement).style.maxHeight = "";
                    el.previousElementSibling?.querySelector('svg')?.classList.remove('rotate-180');
                  });

                  if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    e.currentTarget.querySelector('svg')?.classList.add('rotate-180');
                  }
                }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  What is the core problem Kraftgene AI is solving?
                </h3>
                <svg className="w-6 h-6 text-emerald-500 transform transition-transform duration-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="faq-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-slate-50 dark:bg-transparent">
                <div className="px-8 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                  Every year, there is approximately $25B in damages resulting from climate-related energy infrastructure failure. Currently, utilities rely on outdated monitoring systems that are fragmented and suffer from significant response delays when environmental threats like wildfires or flash floods occur. Our platform bridges this gap with real-time, autonomous intelligence.
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isExpanded = content.style.maxHeight;
                  
                  document.querySelectorAll('.faq-content').forEach((el) => {
                    (el as HTMLElement).style.maxHeight = "";
                    el.previousElementSibling?.querySelector('svg')?.classList.remove('rotate-180');
                  });

                  if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    e.currentTarget.querySelector('svg')?.classList.add('rotate-180');
                  }
                }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  How does Kraftgene AI differentiate from legacy enterprise platforms?
                </h3>
                <svg className="w-6 h-6 text-emerald-500 transform transition-transform duration-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="faq-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-slate-50 dark:bg-transparent">
                <div className="px-8 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                  Unlike broader, generalized data platforms, Kraftgene AI provides a comprehensive solution explicitly designed for energy infrastructure. We are uniquely positioned with an AI-native platform featuring Agentic AI, full integration of environmental intelligence, real-time alerting, and autonomous data collection via drones and robotics.
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isExpanded = content.style.maxHeight;
                  
                  document.querySelectorAll('.faq-content').forEach((el) => {
                    (el as HTMLElement).style.maxHeight = "";
                    el.previousElementSibling?.querySelector('svg')?.classList.remove('rotate-180');
                  });

                  if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    e.currentTarget.querySelector('svg')?.classList.add('rotate-180');
                  }
                }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  What is the environmental and social impact of your technology?
                </h3>
                <svg className="w-6 h-6 text-emerald-500 transform transition-transform duration-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="faq-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-slate-50 dark:bg-transparent">
                <div className="px-8 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                  Our platform actively enhances the protection of critical energy infrastructure and monitors vulnerable ecosystems, aiding in proactive risk management. Socially, we aim to ensure stable energy grids for the public, enhance community safety against threats like wildfires, and create dozens of high-skilled engineering and AI jobs as we scale.
                </div>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isExpanded = content.style.maxHeight;
                  
                  document.querySelectorAll('.faq-content').forEach((el) => {
                    (el as HTMLElement).style.maxHeight = "";
                    el.previousElementSibling?.querySelector('svg')?.classList.remove('rotate-180');
                  });

                  if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    e.currentTarget.querySelector('svg')?.classList.add('rotate-180');
                  }
                }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  How do you ensure the security of critical infrastructure data?
                </h3>
                <svg className="w-6 h-6 text-emerald-500 transform transition-transform duration-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="faq-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-slate-50 dark:bg-transparent">
                <div className="px-8 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                  Security is foundational to our architecture. We utilize enterprise-grade encryption, edge-processing (where data is processed locally to minimize transmission vulnerabilities), and strict access controls. Our digital twins are designed to securely integrate with existing SCADA systems without exposing operational networks to external threats.
                </div>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isExpanded = content.style.maxHeight;
                  
                  document.querySelectorAll('.faq-content').forEach((el) => {
                    (el as HTMLElement).style.maxHeight = "";
                    el.previousElementSibling?.querySelector('svg')?.classList.remove('rotate-180');
                  });

                  if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    e.currentTarget.querySelector('svg')?.classList.add('rotate-180');
                  }
                }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  What is your business model?
                </h3>
                <svg className="w-6 h-6 text-emerald-500 transform transition-transform duration-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="faq-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-slate-50 dark:bg-transparent">
                <div className="px-8 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                  We operate on a SaaS model with multiple revenue streams. The primary driver is Platform Subscriptions, which are based on coverage area and features. We also generate revenue through Professional Services for custom integration and training, as well as Data Services for premium environmental feeds and custom analysis.
                </div>
              </div>
            </div>

             {/* FAQ Item 7 */}
             <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isExpanded = content.style.maxHeight;
                  
                  document.querySelectorAll('.faq-content').forEach((el) => {
                    (el as HTMLElement).style.maxHeight = "";
                    el.previousElementSibling?.querySelector('svg')?.classList.remove('rotate-180');
                  });

                  if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    e.currentTarget.querySelector('svg')?.classList.add('rotate-180');
                  }
                }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Is your technology open source?
                </h3>
                <svg className="w-6 h-6 text-emerald-500 transform transition-transform duration-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="faq-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-slate-50 dark:bg-transparent">
                <div className="px-8 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                  While our core enterprise platform is proprietary, we strongly believe in building alongside the developer community. We maintain an active presence on GitHub where you can view our public repositories, including web demos and a Mini-MVP of the EnergyEminence Platform, at <a href="https://github.com/KraftgeneAI" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 hover:underline transition-colors">github.com/KraftgeneAI</a>.
                </div>
              </div>
            </div>

            {/* FAQ Item 8 */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                className="w-full text-left px-8 py-6 flex justify-between items-center focus:outline-none hover:bg-slate-50 dark:hover:bg-white/5"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  const isExpanded = content.style.maxHeight;
                  
                  document.querySelectorAll('.faq-content').forEach((el) => {
                    (el as HTMLElement).style.maxHeight = "";
                    el.previousElementSibling?.querySelector('svg')?.classList.remove('rotate-180');
                  });

                  if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    e.currentTarget.querySelector('svg')?.classList.add('rotate-180');
                  }
                }}
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  How can I stay updated on Kraftgene AI's latest developments or job openings?
                </h3>
                <svg className="w-6 h-6 text-emerald-500 transform transition-transform duration-300 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="faq-content max-h-0 overflow-hidden transition-all duration-500 ease-in-out bg-slate-50 dark:bg-transparent">
                <div className="px-8 pb-6 text-slate-600 dark:text-gray-400 leading-relaxed">
                  The best way to follow our journey, read our latest announcements, and check for open roles is by following our official LinkedIn page at <a href="https://www.linkedin.com/company/kraftgeneai" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 hover:underline transition-colors">linkedin.com/company/kraftgeneai</a>. You can also reach out to us directly via our contact section to subscribe to investor or customer updates.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

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
                  name: "Huy (Michel) Trinh",
                  role: "Co-Founder, Digital Twins Engineer & Head of Technical Partnerships",
                  image: "images/Huy.jfif",
                  linkedin: "https://www.linkedin.com/in/huy-michel-trinh-masc-085905187/",
                  bio: "Michel bridges physics-informed modeling with machine learning, leading the development of our high-performance Digital Twin architecture and spearheading strategic industry partnerships.",
                },
                {
                  name: "Yu Nong (John)",
                  role: "Co-Founder & CEO",
                  image: "images/yu-nong-ceo.jpg",
                  linkedin: "https://www.linkedin.com/in/nongyu/",
                  bio: "John blends visionary leadership with expertise in ML, software engineering, and robotics to drive global infrastructure resilience.",
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

      {/* Latest News & Updates Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#0a0a0a] border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1.5 uppercase tracking-widest text-xs">
              Latest News
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Company Updates
            </h2>
          </div>

          {/* Carousel Container */}
          <div className="relative w-full rounded-3xl overflow-hidden bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl h-[550px] md:h-[450px] transition-colors duration-300">
            
            {/* Slides */}
            {newsItems.map((news, index) => (
              <div
                key={news.id}
                className={`absolute inset-0 w-full h-full flex flex-col md:flex-row transition-all duration-1000 ease-in-out ${
                  index === currentNewsIdx 
                    ? "opacity-100 translate-x-0 z-10" 
                    : "opacity-0 translate-x-full z-0 pointer-events-none"
                }`}
              >
                {/* Content Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center h-1/2 md:h-full z-20 relative">
                  {/* Date display */}
                  <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
                    {news.date}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-8 transition-colors">
                    {news.content}
                  </p>
                  
                  {/* Action Links */}
                  {news.links && news.links.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-auto md:mt-0">
                      {news.links.map((link, i) => (
                        link.isProtected ? (
                          <button 
                            key={i}
                            onClick={handleProtectedNavigation}
                            className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-500/20"
                          >
                            {link.text}
                            <ArrowUpRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>
                        ) : (
                          <a 
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-500/20"
                          >
                            {link.text}
                            <ArrowUpRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>

                {/* Media Side (Dynamic Grid Support) */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-white/5 transition-colors">
                  {/* Fade overlays that adapt to light/dark mode */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 dark:from-black/90 dark:via-black/20 to-transparent z-10 hidden md:block pointer-events-none transition-colors"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 dark:from-black/90 dark:via-black/20 to-transparent z-10 md:hidden pointer-events-none transition-colors"></div>
                  
                  <div className={`w-full h-full grid gap-1 p-1 ${
                    news.media.length === 1 ? 'grid-cols-1' : 
                    news.media.length === 2 ? 'grid-cols-2' : 
                    'grid-cols-2 grid-rows-2'
                  }`}>
                    {news.media.map((mediaItem, mediaIdx) => (
                      <div 
                        key={mediaIdx} 
                        className={`relative w-full h-full overflow-hidden rounded-md ${
                          news.media.length === 3 && mediaIdx === 0 ? 'col-span-2 row-span-1' : ''
                        }`}
                      >
                        {mediaItem.type === "video" ? (
                          <video 
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            // Pipeline Video (ID 3) shifts right to preserve the thermal camera view
                            className={`w-full h-full object-cover opacity-90 dark:opacity-80 ${news.id === 3 ? 'object-right' : 'object-center'}`} 
                            src={mediaItem.src} 
                          />
                        ) : (
                          <Image 
                            src={mediaItem.src} 
                            alt={`News media ${mediaIdx + 1}`}
                            fill
                            // Events (ID 1 & 4) use object-cover, everything else uses object-contain with padding
                            className={`hover:scale-105 transition-transform duration-1000 ${
                              (news.id === 1 || news.id === 4) 
                                ? 'object-cover opacity-90 dark:opacity-80' 
                                : 'object-contain p-6 opacity-100'
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Widget */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
              {newsItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => jumpToNews(index)}
                  aria-label={`Go to news slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    index === currentNewsIdx 
                      ? "w-8 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] dark:shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                      : "w-2.5 bg-slate-300 hover:bg-slate-400 dark:bg-gray-500 dark:hover:bg-gray-400"
                  }`}
                />
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
              { src: "/images/openai.jfif", alt: "Open AI", href: "https://openai.com/" },
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

            {/* Right: Static Map Facade (Fast Loading) */}
            <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl shadow-emerald-900/5 dark:shadow-emerald-900/10 group cursor-pointer">
              <a href="https://www.google.com/maps/place/Toronto,+ON" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                
                {/* The Map Screenshot */}
                <Image 
                  src="/images/toronto-map.PNG" 
                  alt="Kraftgene AI Office Location" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105 filter dark:invert-[90%] dark:hue-rotate-180" 
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/5 dark:bg-white/5 group-hover:bg-transparent transition-colors"></div>
                
                {/* Floating "View Map" Button (Appears on hover) */}
                <div className="absolute bottom-6 right-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl flex items-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <MapPin className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" /> 
                  Open in Google Maps
                </div>

              </a>
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