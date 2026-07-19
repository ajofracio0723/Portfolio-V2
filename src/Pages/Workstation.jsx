import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Laptop,
  Monitor,
  Tablet,
  MonitorSmartphone,
  Wifi,
  Moon,
} from "lucide-react";

const setupItems = [
  { icon: Monitor, label: "Windows" },
  { icon: Laptop, label: "macOS" },
];

const setupDetails = [
  {
    icon: Laptop,
    title: "MacBook",
    description:
      "Main machine for macOS work - building and testing web apps, funnels, and automations in a Unix environment.",
    color: "text-indigo-400",
  },
  {
    icon: Monitor,
    title: "Windows PC",
    description:
      "Dedicated Windows rig with an external monitor for CRM ops, client work, and cross-platform testing.",
    color: "text-sky-400",
  },
  {
    icon: Tablet,
    title: "iPad Second Screen",
    description:
      "iPad on the side as an extra display for docs, previews, and monitoring while the main screens stay on code.",
    color: "text-purple-400",
  },
  {
    icon: MonitorSmartphone,
    title: "Cross-Platform Testing",
    description:
      "Every build gets checked on both operating systems and real devices, so it works for any client on any machine.",
    color: "text-emerald-400",
  },
  {
    icon: Wifi,
    title: "Always Online",
    description:
      "Stable fiber connection with mobile data backup - ready for calls, screen shares, and deploys without interruptions.",
    color: "text-cyan-400",
  },
  {
    icon: Moon,
    title: "Flexible Hours",
    description:
      "A setup built for deep work at any hour - comfortable overlapping with US, AU, and EU timezones when clients need me.",
    color: "text-violet-400",
  },
];

export default function Workstation() {
  useEffect(() => {
    AOS.init({ once: false });
  }, []);

  return (
    <div
      className="md:px-[10%] px-4 sm:px-[5%] w-full py-16 bg-[#030014] overflow-x-hidden"
      id="Workstation"
    >
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto">
          <span
            style={{
              color: "#6366f1",
              backgroundImage: "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Workstation
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2 leading-relaxed">
          Engineered for deep work and high-output days.
        </p>
      </div>

      <div
        className="max-w-4xl mx-auto"
        data-aos="zoom-in-up"
        data-aos-duration="1000"
      >
        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-2xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
          <video
            src="/workstation.mp4"
            poster="/workstation.jpg"
            autoPlay
            loop
            muted
            playsInline
            aria-label="AJ's Windows and macOS workstation"
            className="relative w-full h-auto object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {setupItems.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <Icon className="w-4 h-4 text-indigo-400" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {setupDetails.map((item, index) => (
          <div
            key={item.title}
            className="bg-gray-900/30 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:scale-105 transition-all duration-300 group relative overflow-hidden"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay={index * 100}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 via-transparent to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 rounded-full bg-white/10 group-hover:scale-110 transition-transform flex-shrink-0">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-base mb-1.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#a855f7] transition-all duration-300">
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
