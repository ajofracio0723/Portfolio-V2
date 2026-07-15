import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Instagram, Sparkles, Facebook, Briefcase, ExternalLink } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'

// Memoized Components
const StatusBadge = memo(() => (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          Fullstack + Agency Ops
        </span>
      </div>
    </div>
  </div>
));

const NameTitle = memo(() => (
  <div className="space-y-1" data-aos="fade-up" data-aos-delay="500">
  </div>
));

const MainTitle = memo(() => (
  <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
    <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight">
      <span className="relative inline-block">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          Fullstack
        </span>
      </span>
      <br />
      <span className="relative inline-block mt-1 sm:mt-2">
        <span className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-2xl opacity-20"></span>
        <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
          Developer
        </span>
      </span>
    </h1>
  </div>
));

const TechStack = memo(({ tech, icon }) => (
  <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {icon && (
      <img
        src={`/${icon}`}
        alt=""
        className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain rounded-sm shrink-0"
      />
    )}
    <span className="whitespace-nowrap">{tech}</span>
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href} className="flex-1 min-w-[140px] max-w-[200px] sm:flex-none sm:w-[160px]">
    <button className="group relative w-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#030014] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-[#4f52c9]/20 to-[#8644c5]/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
      </div>
    </button>
  </a>
));

// Profile Image Component
const ProfileImage = memo(({ isHovering }) => (
  <div className="relative w-full h-full flex flex-col items-center justify-center space-y-6">
    {/* Image Section */}
    <div className="relative flex items-center justify-center">
      {/* Glowing background effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-full blur-3xl transition-all duration-700 ${
        isHovering ? "opacity-60 scale-110" : "opacity-30 scale-100"
      }`}></div>
      
      {/* Image container */}
      <div className={`relative z-10 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 xl:w-[400px] xl:h-[400px] rounded-full overflow-hidden border-4 border-gradient-to-r from-[#6366f1] to-[#a855f7] shadow-2xl transition-all duration-500 ${
        isHovering ? "scale-105 shadow-[0_0_50px_rgba(99,102,241,0.3)]" : "scale-100"
      }`}>

        {/* Gradient border effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full blur-sm"></div>
        
        {/* Actual image */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {/* Your profile image */}
          <img
            src="/profile.png"
            alt="AJ Ofracio"
            className={`w-full h-full object-cover transition-all duration-500 ${
              isHovering ? "scale-110" : "scale-100"
            }`}
          />
          
          {/* Overlay gradient for better effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-30"></div>
        </div>
      </div>
      
      {/* Floating particles effect */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
        isHovering ? "opacity-100" : "opacity-70"
      }`}>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping animation-delay-2000"></div>
      </div>
    </div>
    
    {/* Name below image */}
    <div className="text-center" data-aos="fade-up" data-aos-delay="800">
      <div className="relative group">
        {/* Simple subtle glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] blur-xl opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
        
        <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold tracking-tight px-2">
          <span className="relative bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
            Abe Jay Ofracio
          </span>
        </h2>
        
        {/* Simple subtitle */}
        <div className="mt-3" data-aos="fade-up" data-aos-delay="1000">
          <p className="text-sm sm:text-base text-gray-400 font-medium tracking-wider">
            "CODE • CREATE • INNOVATE"
          </p>
        </div>
      </div>
    </div>
  </div>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;
const WORDS = [
  "Fullstack Developer.",
  "CRM Automation Specialist.",
  "GoHighLevel Ops.",
  "Funnel & Workflow Builder.",
  "AI-Assisted Delivery.",
  "Problem Solver.",
];
const TECH_STACK = [
  { tech: "React", icon: "reactjs.svg" },
  { tech: "TypeScript", icon: "typescript.svg" },
  { tech: "Node.js", icon: "nodejs.svg" },
  { tech: "GoHighLevel", icon: "gohighlevel.png" },
  { tech: "Zapier", icon: "zapier.png" },
  { tech: "Make", icon: "make.svg" },
  { tech: "Stripe", icon: "stripe.png" },
  { tech: "Cursor", icon: "cursor.png" },
  { tech: "Claude", icon: "claude.png" },
];
const SOCIAL_LINKS = [
  { icon: Github, link: "https://github.com/ajofracio0723" },
  { icon: Linkedin, link: "https://www.linkedin.com/in/abe-jay-ofracio-401449355/" },
  { icon: Instagram, link: "https://www.instagram.com/aj.ofracio/" },
  { icon: Facebook, link: "https://www.facebook.com/ajofracio7" }
];

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Optimize AOS initialization
  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
       
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  // Optimize typing effect
  const handleTyping = useCallback(() => {
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="min-h-screen bg-[#030014] overflow-x-hidden px-4 sm:px-[5%] lg:px-[10%] pt-20 sm:pt-24" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto min-h-[calc(100vh-5rem)] lg:min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 sm:gap-10 lg:gap-16 py-6 sm:py-10 lg:py-0 lg:min-h-[calc(100vh-6rem)]">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-5 sm:space-y-6 lg:space-y-8 text-left order-2 lg:order-1"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-5">
                <StatusBadge />
                <NameTitle />
                <MainTitle />

                {/* Typing Effect */}
                <div className="min-h-[2rem] sm:min-h-[2.25rem] flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-base sm:text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-5 sm:h-6 bg-gradient-to-t from-[#6366f1] to-[#a855f7] ml-1 animate-blink shrink-0"></span>
                </div>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  Full-stack apps, GHL multi-branch CRM, Zapier/Make workflows, Stripe billing, API integrations, and funnel systems - shipped with AI as a force multiplier.
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {TECH_STACK.map((item) => (
                    <TechStack key={item.tech} tech={item.tech} icon={item.icon} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Experience" text="Experience" icon={Briefcase} />
                  <CTAButton href="#Portfolio" text="Projects" icon={ExternalLink} />
                </div>

                {/* Social Links */}
                <div className="flex gap-3 sm:gap-4 justify-start" data-aos="fade-up" data-aos-delay="1600">
                  {SOCIAL_LINKS.map((social, index) => (
                    <SocialLink key={index} {...social} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Profile Image */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center order-1 lg:order-2"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              data-aos="fade-left"
              data-aos-delay="600">
              <ProfileImage isHovering={isHovering} />
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-shimmer {
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default memo(Home);