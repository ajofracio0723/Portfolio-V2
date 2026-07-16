import React, { useState, useCallback } from "react";
import {
  Database,
  Workflow,
  Layout,
  Plug,
  CreditCard,
  ShieldCheck,
  Mail,
  Globe,
  Sparkles,
  Wrench,
  FileText,
  ChevronDown,
  ImagePlus,
  Building2,
  Briefcase,
  Trophy,
  Layers,
} from "lucide-react";
import {
  agencyStats,
  agencyRole,
  agencySections,
  agencyAchievements,
  agencyTechStack,
} from "../data/agencyExperience";
import { resolveTechLogo } from "../data/techLogos";
import WorkflowOrbitCarousel from "../components/WorkflowOrbitCarousel";
import WorkflowCarousel from "../components/WorkflowCarousel";
import CrmShowcase from "../components/CrmShowcase";

const ICON_MAP = {
  Database,
  Workflow,
  Layout,
  Plug,
  CreditCard,
  ShieldCheck,
  Mail,
  Globe,
  Sparkles,
  Wrench,
  FileText,
};

const StatCard = ({ value, label }) => (
  <div
    className="relative group overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/40 hover:bg-white/[0.06] "
  >
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent mb-1 sm:mb-2">
        {value}
      </div>
      <p className="text-xs sm:text-sm text-slate-400 leading-snug">{label}</p>
    </div>
  </div>
);

const TechBadge = ({ tech }) => {
  const logo = resolveTechLogo(tech);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
      {logo && (
        <img src={logo} alt="" className="w-3.5 h-3.5 object-contain shrink-0" />
      )}
      {tech}
    </span>
  );
};

const DetailBlocksShowcase = ({
  section,
  highlights = [],
  scopeLabel = "Scope covered",
}) => (
  <div className="pt-5 space-y-6">
    <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 p-4 md:p-5">
      <p className="text-sm text-slate-300 leading-relaxed">{section.overview}</p>
      {highlights.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {highlights.map((h) => (
            <div
              key={h.value}
              className="rounded-lg border border-white/10 bg-black/30 px-3 py-2"
            >
              <p className="text-lg font-semibold text-indigo-300">{h.value}</p>
              <p className="text-[11px] text-slate-500">{h.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      {section.detailBlocks.map((block) => (
        <div
          key={block.title}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2"
        >
          <h4 className="text-sm font-semibold text-white">{block.title}</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{block.body}</p>
        </div>
      ))}
    </div>

    <div>
      <p className="text-xs uppercase tracking-wider text-indigo-400/80 mb-3 font-medium">
        Stack notes
      </p>
      <ul className="space-y-2">
        {section.techNotes.map((item) => (
          <li
            key={item.label}
            className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-3 text-sm border-b border-white/5 pb-2 last:border-0"
          >
            <span className="font-medium text-indigo-300 shrink-0 min-w-[140px]">
              {item.label}
            </span>
            <span className="text-slate-400 text-xs sm:text-sm">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>

    <div>
      <p className="text-xs uppercase tracking-wider text-indigo-400/80 mb-3 font-medium">
        {scopeLabel}
      </p>
      <ul className="grid sm:grid-cols-2 gap-2">
        {section.responsibilities.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm text-slate-300"
          >
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 mt-5">
        {section.technologies.map((tech) => (
          <TechBadge key={tech} tech={tech} />
        ))}
      </div>
    </div>
  </div>
);

const AccordionSection = ({ section, isOpen, onToggle }) => {
  const Icon = ICON_MAP[section.icon] || Layers;
  const imageSrc = `/agency/${section.id}.png`;
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isOpen
          ? "border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 via-white/[0.03] to-purple-500/10 shadow-lg shadow-indigo-500/10"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 text-left"
        aria-expanded={isOpen}
      >
        <div
          className={`flex-shrink-0 p-2.5 sm:p-3 rounded-xl  ${
            isOpen
              ? "bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-indigo-200"
              : "bg-white/5 text-indigo-400"
          }`}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1 pr-1">
            {section.title}
          </h3>
          <div className="hidden sm:flex flex-wrap gap-1.5">
            {section.technologies.slice(0, 4).map((tech) => (
              <TechBadge key={tech} tech={tech} />
            ))}
            {section.technologies.length > 4 && (
              <span className="text-xs text-slate-500 self-center">
                +{section.technologies.length - 4}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0  ${
            isOpen ? "rotate-180 text-indigo-400" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-3 sm:px-5 md:px-6 pb-5 sm:pb-6 pt-0 border-t border-white/5 ">
            {section.id === "workflows" ? (
              <WorkflowCarousel
                responsibilities={section.responsibilities}
                technologies={section.technologies}
              />
            ) : section.id === "crm" && section.screenshots?.length ? (
              <CrmShowcase
                screenshots={section.screenshots}
                responsibilities={section.responsibilities}
                technologies={section.technologies}
                showcaseLabel="Live CRM Screens"
                highlight={{
                  value: "20+",
                  label: "GoHighLevel sub-accounts managed",
                  note: "Healthcare · Wellness · Coaching · Solar · Home services",
                }}
              />
            ) : section.id === "funnels" && section.screenshots?.length ? (
              <CrmShowcase
                screenshots={section.screenshots}
                responsibilities={section.responsibilities}
                technologies={section.technologies}
                showcaseLabel="Funnels & Sites Showcase"
                autoPlay={false}
                showCarouselNav={false}
                highlight={{
                  value: "70+",
                  label: "Funnels & websites built",
                  note: "40+ industry verticals - Solar, Healthcare, Coaching, Real Estate, Fitness, Legal, Spa, Dental, Restaurant, Ecommerce, Auto, Insurance, Pets, Education, Accounting, Wedding, Mortgage, SaaS, Cleaning, Photography, Chiropractic, Interior Design, HVAC, Landscaping, Therapy, Daycare, Roofing, MedSpa, Barbershop, Yoga, Moving, Senior Care, Martial Arts, Bakery, PC Tech, Coffee Shop, PH Tourism, Podcast Studios, YouTube Agencies, App Waitlists, NFT Creative Studios & more",
                }}
              />
            ) : section.id === "integrations" && section.screenshots?.length ? (
              <CrmShowcase
                screenshots={section.screenshots}
                responsibilities={section.responsibilities}
                technologies={section.technologies}
                showcaseLabel="Integrations Showcase"
                highlight={{
                  value: "20+",
                  label: "Native, marketplace & private API integrations",
                  note: "Google · Facebook · Stripe · Xero · Shopify · Private API · Zapier · Make · Webhooks",
                }}
              />
            ) : section.id === "payments" && section.screenshots?.length ? (
              <CrmShowcase
                screenshots={section.screenshots}
                responsibilities={section.responsibilities}
                technologies={section.technologies}
                showcaseLabel="Payments & Billing Showcase"
                highlight={{
                  value: "73+",
                  label: "Products, payment links & invoices managed",
                  note: "Products · Payment Links · Invoices · Subscriptions · Stripe Providers · Payment Received workflows",
                }}
              />
            ) : section.id === "a2p" && section.screenshots?.length ? (
              <CrmShowcase
                screenshots={section.screenshots}
                responsibilities={section.responsibilities}
                technologies={section.technologies}
                showcaseLabel="A2P & SMS Compliance Showcase"
                highlight={{
                  value: "A2P",
                  label: "10DLC brand & campaign registration",
                  note: "Trust Center · Phone Numbers · SHAKEN/STIR · CNAM · Voice Integrity",
                }}
              />
            ) : section.id === "email" && section.screenshots?.length ? (
              <CrmShowcase
                screenshots={section.screenshots}
                responsibilities={section.responsibilities}
                technologies={section.technologies}
                showcaseLabel="Email Marketing Showcase"
                highlight={{
                  value: "3.9k+",
                  label: "Emails delivered in tracked campaigns",
                  note: "SPF · DKIM · DMARC · Broadcasts · Drips · Deliverability",
                }}
              />
            ) : section.id === "domains" && section.screenshots?.length ? (
              <CrmShowcase
                screenshots={section.screenshots}
                responsibilities={section.responsibilities}
                technologies={section.technologies}
                showcaseLabel="Domains & DNS Showcase"
                highlight={{
                  value: "20+",
                  label: "Client domains & DNS configurations managed",
                  note: "GoDaddy · Cloudflare · A/CNAME/MX/TXT · SSL · Custom Domains",
                }}
              />
            ) : section.id === "ai" && section.detailBlocks?.length ? (
              <DetailBlocksShowcase
                section={section}
                scopeLabel="Scope covered"
                highlights={[
                  { value: "AI-first", label: "Build · iterate · ship" },
                  { value: "5 tools", label: "Lovable → Cursor stack" },
                  { value: "Docs + SOPs", label: "Automations documented" },
                ]}
              />
            ) : section.id === "troubleshooting" && section.detailBlocks?.length ? (
              <DetailBlocksShowcase
                section={section}
                scopeLabel="Issues handled"
                highlights={[
                  { value: "Live fixes", label: "Production workflows" },
                  { value: "Root cause", label: "Not just quick patches" },
                  { value: "GHL + Zapier", label: "Make · Webhooks" },
                ]}
              />
            ) : section.id === "docs" && section.detailBlocks?.length ? (
              <DetailBlocksShowcase
                section={section}
                scopeLabel="Docs delivered"
                highlights={[
                  { value: "SOPs", label: "Repeatable client processes" },
                  { value: "Workflow maps", label: "Triggers → outcomes" },
                  { value: "Handoffs", label: "Notion · Docs · GHL" },
                ]}
              />
            ) : (
            <div className="grid md:grid-cols-5 gap-6 pt-5">
              <div className="md:col-span-3">
                <p className="text-xs uppercase tracking-wider text-indigo-400/80 mb-3 font-medium">
                  Responsibilities
                </p>
                <ul className="space-y-2">
                  {section.responsibilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-300"
                    >
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-5">
                  {section.technologies.map((tech) => (
                    <TechBadge key={tech} tech={tech} />
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-indigo-400/80 mb-3 font-medium">
                  Screenshot
                </p>
                <div className="relative aspect-video rounded-xl border border-dashed border-white/15 bg-black/30 overflow-hidden">
                  {!imgLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500 p-4 text-center">
                      <ImagePlus className="w-8 h-8 text-indigo-400/50" />
                      <p className="text-xs font-medium text-slate-400">
                        {section.screenshotHint}
                      </p>
                      <p className="text-[10px] text-slate-600">
                        Drop image at public/agency/{section.id}.png
                      </p>
                    </div>
                  )}
                  <img
                    src={imageSrc}
                    alt={`${section.title} screenshot`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
                      imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => setImgLoaded(true)}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </div>
            </div>
            )}
        </div>
      )}
    </div>
  );
};

export default function AgencyExperience() {
  const [openId, setOpenId] = useState(null);


  const toggleSection = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section
      id="Experience"
      className="md:px-[10%] px-4 sm:px-[5%] w-full py-12 sm:py-16 md:py-24 bg-[#030014] overflow-x-hidden relative"
    >
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center pb-12">
          <p className="text-sm font-medium tracking-widest uppercase text-indigo-400 mb-3">
            Case Study
          </p>
          <h2
            className="inline-block text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          >
            Agency Experience
          </h2>
          <p
            className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-4"
          >
            Real-world technical operations, automation, and CRM work as a
            GoHighLevel specialist - built for scale, compliance, and conversion.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 mb-12 sm:mb-16">
          {agencyStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Role card */}
        <div
          className="mb-16 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 md:p-10 backdrop-blur-sm"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Company
                  </p>
                  <p className="text-lg md:text-xl font-semibold text-white">
                    {agencyRole.company}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                    Role
                  </p>
                  <p className="text-lg md:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                    {agencyRole.role}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">
                Scope
              </p>
              <ul className="space-y-3">
                {agencyRole.responsibilities.map((text) => (
                  <li
                    key={text.slice(0, 40)}
                    className="text-sm md:text-base text-slate-300 leading-relaxed flex gap-3"
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <WorkflowOrbitCarousel />

        {/* Capability accordions */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Capabilities
            </h3>
            <p className="text-slate-400 text-sm">
              Expand each area for responsibilities, tech stack, and live screens.
            </p>
          </div>
          <div className="space-y-3">
            {agencySections.map((section) => (
              <AccordionSection
                key={section.id}
                section={section}
                isOpen={openId === section.id}
                onToggle={() => toggleSection(section.id)}
              />
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Achievements
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {agencyAchievements.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300 "
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
                  <Trophy className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-slate-200 leading-snug">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Technology Stack
            </h3>
            <p className="text-slate-400 text-sm">
              Tools powering agency operations at scale
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-4xl mx-auto">
            {agencyTechStack.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-slate-200 border border-white/10 hover:border-indigo-500/40 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
