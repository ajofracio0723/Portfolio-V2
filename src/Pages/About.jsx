import { useEffect, memo, useMemo, useState } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, Sparkles, Star, Monitor, Smartphone, Database, Settings } from "lucide-react"

// AOS Library (using CDN)
const loadAOS = () => {
  return new Promise((resolve) => {
    if (window.AOS) {
      resolve(window.AOS);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js';
    script.onload = () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css';
      document.head.appendChild(link);
      resolve(window.AOS);
    };
    document.head.appendChild(script);
  });
};

// Memoized Components
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]" data-aos="fade-down" data-aos-duration="1000">
    <div className="inline-block relative group">
      <h2 
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]" 
      >
        About Me
      </h2>
    </div>
    <p 
      className="mt-2 text-gray-400 max-w-2xl mx-auto text-base sm:text-lg flex items-center justify-center gap-2"
    >
      <Sparkles className="w-5 h-5 text-purple-400" />
      Transforming ideas into digital experiences
      <Sparkles className="w-5 h-5 text-purple-400" />
    </p>
  </div>
));

const ProfileImage = memo(() => (
  <div className="flex justify-center items-center sm:p-12 sm:py-0 sm:pb-0 p-0 py-2 pb-2" data-aos="fade-left" data-aos-duration="1000" data-aos-delay="200">
    <div className="relative group">
      {/* Optimized gradient backgrounds with reduced complexity for mobile */}
      <div className="absolute -inset-6 opacity-[25%] z-0 hidden sm:block">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600 rounded-full blur-2xl animate-spin-slower" />
        <div className="absolute inset-0 bg-gradient-to-l from-fuchsia-500 via-rose-500 to-pink-600 rounded-full blur-2xl animate-pulse-slow opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 rounded-full blur-2xl animate-float opacity-50" />
      </div>

      <div className="relative">
        <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_0_40px_rgba(120,119,198,0.3)] transform transition-all duration-700 group-hover:scale-105">
          <div className="absolute inset-0 border-4 border-white/20 rounded-full z-20 transition-all duration-700 group-hover:border-white/40 group-hover:scale-105" />
          
          {/* Optimized overlay effects - disabled on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 z-10 transition-opacity duration-700 group-hover:opacity-0 hidden sm:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-blue-500/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block" />
          
          <img
            src="/Photo.jpg"
            alt="Profile"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            loading="lazy"
          />

          {/* Advanced hover effects - desktop only */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 z-20 hidden sm:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent transform translate-y-full group-hover:-translate-y-full transition-transform duration-1000 delay-100" />
            <div className="absolute inset-0 rounded-full border-8 border-white/10 scale-0 group-hover:scale-100 transition-transform duration-700 animate-pulse-slow" />
          </div>
        </div>
      </div>
    </div>
  </div>
));

const WorkspaceImage = memo(() => (
  <div className="relative group" data-aos="fade-right" data-aos-duration="1000">
    <div className="absolute -inset-4 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
    <div className="relative bg-gray-900/50 backdrop-blur-lg rounded-2xl p-4 border border-white/10 overflow-hidden">
      <div className="w-full h-64 rounded-xl overflow-hidden">
        <img
          src="/coder.gif"
          alt="Developer workspace"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>
      <div className="absolute bottom-8 left-8 text-white">
        <p className="text-sm font-medium">My Creative Space</p>
        <p className="text-xs text-gray-300">Where ideas come to life</p>
      </div>
    </div>
  </div>
));

const CodingAnimation = memo(() => {
  const [currentLine, setCurrentLine] = useState(0);
  const codeLines = [
    "const developer = {",
    "  name: 'Abe Jay Ofracio',",
    "  passion: 'Creating amazing web experiences',",
    "  skills: ['React', 'Node.js', 'Full Stack'],",
    "  coffee: '☕ Always brewing',",
    "  motto: 'Leveraging AI as a professional tool, not a replacement.'",
    "};"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % codeLines.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group" data-aos="fade-left" data-aos-duration="1000">
      <div className="absolute -inset-4 bg-gradient-to-r from-[#a855f7]/20 to-[#6366f1]/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
      <div className="relative bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-400 text-sm ml-2">developer.js</span>
        </div>
        <div className="font-mono text-sm space-y-2">
          {codeLines.map((line, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ${
                index <= currentLine 
                  ? 'text-green-400 opacity-100' 
                  : 'text-gray-600 opacity-50'
              }`}
            >
              <span className="text-gray-500 mr-2">{index + 1}</span>
              {line}
              {index === currentLine && (
                <span className="animate-pulse text-white">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const SkillBadge = memo(({ skill, delay, index }) => (
  <div 
    className="px-4 py-2 bg-gradient-to-r from-[#6366f1]/10 to-[#a855f7]/10 rounded-full border border-[#6366f1]/30 text-sm text-gray-300 hover:scale-105 transition-all duration-300 animate-float"
    style={{ animationDelay: `${delay}ms` }}
    data-aos="zoom-in"
    data-aos-duration="600"
    data-aos-delay={index * 50}
  >
    {skill}
  </div>
));

const StatCard = memo(({ icon: Icon, color, value, label, description, animation, index }) => (
  <div className="relative group" data-aos={animation} data-aos-duration="1000" data-aos-delay={index * 200}>
    <div className="relative z-10 bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col justify-between">
      <div className={`absolute -z-10 inset-0 bg-gradient-to-br ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 transition-transform group-hover:rotate-6">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <span className="text-4xl font-bold text-white">
          {value}
        </span>
      </div>

      <div>
        <p className="text-sm uppercase tracking-wider text-gray-300 mb-2">
          {label}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {description}
          </p>
          <ArrowUpRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Initialize AOS
  useEffect(() => {
    loadAOS().then((AOS) => {
      AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-out-cubic',
      });
    });
  }, []);

  // Memoized calculations
  const { totalProjects, totalCertificates, YearExperience } = useMemo(() => {
    // Using fallback values since localStorage isn't available in artifacts
    const totalProjects = 25; // fallback value
    const totalCertificates = 12; // fallback value
    
    const startDate = new Date("2020-01-01"); // Change this date to your desired start date
    const today = new Date();
    const experience = today.getFullYear() - startDate.getFullYear() -
      (today < new Date(today.getFullYear(), startDate.getMonth(), startDate.getDate()) ? 1 : 0);

    return {
      totalProjects,
      totalCertificates,
      YearExperience: experience
    };
  }, []);

  // Mouse tracking for interactive effects (disabled)
  // useEffect(() => {
  //   const handleMouseMove = (e) => {
  //     setMousePosition({ x: e.clientX, y: e.clientY });
  //   };
  //   window.addEventListener('mousemove', handleMouseMove);
  //   return () => window.removeEventListener('mousemove', handleMouseMove);
  // }, []);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Code,
      color: "from-[#6366f1] to-[#a855f7]",
      value: totalProjects,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
      animation: "fade-right",
    },
    {
      icon: Award,
      color: "from-[#a855f7] to-[#6366f1]",
      value: totalCertificates,
      label: "Certificates",
      description: "Professional skills validated",
      animation: "fade-up",
    },
    {
      icon: Globe,
      color: "from-[#6366f1] to-[#a855f7]",
      value: YearExperience,
      label: "Years of Experience",
      description: "Continuous learning journey",
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  const skills = [
    "Html", "CSS", "React", "Node.js", "JavaScript",
    "MongoDB", "PostgreSQL", "Tailwind CSS", "Next.js", "Express.js",
    "Git", "REST APIs"
  ];

  const services = [
    { 
      icon: Monitor, 
      title: "Full-Stack Web Development", 
      description: "Complete web applications from concept to deployment with modern technologies",
      color: "text-blue-400" 
    },
    { 
      icon: Smartphone, 
      title: "Responsive Design", 
      description: "Mobile-first designs that work seamlessly across all devices and screen sizes",
      color: "text-green-400" 
    },
    { 
      icon: Database, 
      title: "Database Integration", 
      description: "Efficient data management with MongoDB, PostgreSQL, and API development",
      color: "text-purple-400" 
    },
    { 
      icon: Settings, 
      title: "Performance Optimization", 
      description: "Fast-loading, SEO-friendly websites with clean, maintainable code",
      color: "text-orange-400" 
    },
  ];

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm-mt-0 relative" 
      id="About"
    >
      {/* Interactive background particles (mouse effects disabled) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative">
        {/* Hero Section */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          <div className="space-y-6 text-center lg:text-left" data-aos="fade-right" data-aos-duration="1000">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                Hello, I&apos;m
              </span>
              <span className="block mt-2 text-gray-200">
                Abe Jay Ofracio
              </span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0">
              I&apos;m a passionate Fullstack Developer based in Sorsogon City, with expertise in building modern, responsive websites and web applications. With a keen eye for design and a strong understanding of development principles, I create digital experiences that are both visually appealing and highly functional.

              My journey in web development began with a curiosity about how websites work, which quickly turned into a career. I enjoy solving complex problems and turning ideas into reality through clean, efficient code using tools like React, Vite, Supabase, MongoDB, Git, and more.
            </p>

            <hr className="my-4 border-gray-600" />

            <p className="text-base sm:text-lg lg:text-xl text-gray-400 leading-relaxed text-justify pb-4 sm:pb-0">
              In addition to my development skills, I also have experience working as a Virtual Assistant (VA). I provide support in data entry, file organization, document management, and IT troubleshooting, making me adaptable to both technical and administrative roles. My ability to balance creative design, technical development, and virtual assistance allows me to deliver well-rounded solutions to clients and teams.
            </p>


            {/* Quote Section */}
            <div className="relative bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 border border-gradient-to-r border-[#6366f1]/30 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden" data-aos="fade-up" data-aos-delay="300">
              {/* Floating orbs background */}
              <div className="absolute top-2 right-4 w-16 h-16 bg-gradient-to-r from-[#6366f1]/20 to-[#a855f7]/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-gradient-to-r from-[#a855f7]/20 to-[#6366f1]/20 rounded-full blur-lg"></div>
              
              {/* Quote icon */}
              <div className="absolute top-3 left-4 text-[#6366f1] opacity-30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              
              <blockquote className="text-gray-300 text-center lg:text-left italic font-medium text-sm relative z-10 pl-6">
                &ldquo;Leveraging AI as a professional tool, not a replacement.&rdquo;
              </blockquote>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-4 lg:px-0 w-full" data-aos="fade-up" data-aos-delay="400">
              <a href="https://drive.google.com/file/d/1Cl_gz0ikmeCui6vQVXZTBCW013w1XAU0/view?usp=sharing" className="w-full lg:w-auto">
                <button className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 shadow-lg hover:shadow-xl">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Download CV
                </button>
              </a>
              <a href="#Portofolio" className="w-full lg:w-auto">
                <button className="w-full lg:w-auto sm:px-6 py-2 sm:py-3 rounded-lg border border-[#a855f7]/50 text-[#a855f7] font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center lg:justify-start gap-2 hover:bg-[#a855f7]/10">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5" /> View Projects
                </button>
              </a>
            </div>
          </div>

          <ProfileImage />
        </div>

        {/* Stats Section */}
        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 cursor-pointer">
            {statsData.map((stat, index) => (
              <StatCard key={stat.label} {...stat} index={index} />
            ))}
          </div>
        </a>

        {/* Visual Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <WorkspaceImage />
          <CodingAnimation />
        </div>

        {/* Skills Section */}
        <div className="mb-20">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] mb-4">
              Technical Arsenal
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {skills.map((skill, index) => (
              <SkillBadge key={skill} skill={skill} delay={index * 100} index={index} />
            ))}
          </div>
        </div>

        {/* What I Can Offer Section */}
        <div className="mb-20">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] mb-4">
              What I Can Offer
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Professional services tailored to bring your digital vision to life
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 group relative overflow-hidden" 
                data-aos="fade-up" 
                data-aos-duration="800" 
                data-aos-delay={index * 150}
              >
                {/* Gradient background overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-full bg-white/10 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <service.icon className={`w-6 h-6 ${service.color}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7] transition-all duration-300">
                        {service.title}
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Fact Section */}
        <div className="text-center bg-gradient-to-br from-[#6366f1]/10 via-transparent to-[#a855f7]/10 rounded-3xl p-8 border border-white/10 backdrop-blur-md" data-aos="zoom-in" data-aos-duration="1000">
          <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <h4 className="text-2xl font-bold text-white mb-4">Fun Fact</h4>
          <p className="text-gray-400 text-lg">
            I debug code best with a cup of coffee and lo-fi beats playing in the background! ☕🎵
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes spin-slower {
          to { transform: rotate(360deg); }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        .animate-spin-slower {
          animation: spin-slower 8s linear infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);