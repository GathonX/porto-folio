import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, BadgeCheck, CheckCircle2, CircuitBoard, Download, Mail, Phone, Shield, Loader2, Rocket, ShieldCheck, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const heroImage = "/img/concept-de-marketing-des-medias-sociaux-pour-le-marketing-avec-des-applications11.avif";

const stats = [
  { label: "Années d'expérience", value: "5+", sub: "dans le développement produit" },
  { label: "Stack couverte", value: "Front · Back · DevOps", sub: "Laravel • React • Docker" },
  { label: "Clients & projets", value: "15+", sub: "SaaS, tourisme, automation" },
];

const services = [
  {
    title: "Applications sur mesure",
    description:
      "De l’architecture au déploiement : Laravel, React, Vite, Tailwind et APIs robustes prêtes pour l’échelle.",
    icon: Rocket,
    highlights: ["Product design", "Micro-services", "Performances & sécurité"],
  },
  {
    title: "Automatisation & IA",
    description:
      "Intégrations OpenAI, workflows marketing automatisés, sprints pilotés par la donnée et reporting temps réel.",
    icon: CircuitBoard,
    highlights: ["Contenus assistés IA", "Pipelines marketing", "Dashboards ops"],
  },
  {
    title: "Cloud & DevOps",
    description:
      "CI/CD GitHub Actions, conteneurisation Docker, monitoring et stratégies de rollback sans downtime.",
    icon: ShieldCheck,
    highlights: ["Docker multi-env", "VPS & cloud", "Observabilité avancée"],
  },
];

const experiences = [
  {
    company: "PixelRise · SaaS d’automatisation",
    period: "2024 — Aujourd’hui",
    details: [
      "Plateforme Laravel 12 + React/Vite + Tailwind pour contenus générés par IA",
      "Architecture Docker (PHP, Node, MySQL) + pipelines CI/CD & rollback",
      "Optimisation SQL/NoSQL, migration progressive vers Firestore",
    ],
  },
  {
    company: "IslandManager · Plateforme tourisme",
    period: "En cours",
    details: [
      "Back-office Laravel 11 + Vite, auth Sanctum et rôles administrables",
      "API REST sécurisées, logging granulaire et doc Swagger",
      "Mise en ligne, SEO technique et accompagnement produit",
    ],
  },
  {
    company: "Formateur freelance",
    period: "2019 — Aujourd’hui",
    details: [
      "Coaching dev fullstack, DevOps et bonnes pratiques industrielles",
      "Création de programmes sur mesure pour entreprises et écoles",
    ],
  },
];

const caseStudies = [
  {
    title: "PixelRise Automation Suite",
    result: "+42% de productivité des équipes marketing",
    description:
      "Stack Laravel + React + OpenAI orchestrée avec pipelines CI/CD, tableaux de bord et génération multi-canal (blogs, réseaux sociaux, plans marketing).",
    href: "https://pixel-rise.com/",
  },
  {
    title: "IslandManager",
    result: "Gestion unifiée des hôtels & restaurants",
    description:
      "Plateforme modulaire avec rôles personnalisés, API publiques documentées et automatisation des opérations quotidiennes.",
    href: undefined,
  },
];

const contactChannels = [
  {
    label: "Email direct",
    value: "mandimbizarajuno@gmail.com",
    href: "mailto:mandimbizarajuno@gmail.com",
  },
  {
    label: "WhatsApp",
    value: "+261 32 66 875 43",
    href: "https://wa.me/261326687543",
  },
  {
    label: "GitHub",
    value: "@GathonX",
    href: "https://github.com/GathonX",
  },
  {
    label: "Facebook",
    value: "Tonny Montana MG Eltauraut",
    href: "https://web.facebook.com/tonny.montanamg/",
  },
];

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "information",
  message: "",
};

const contactReasons = [
  { value: "information", label: "Demande d'information" },
  { value: "partnership", label: "Partenariat ou mission" },
  { value: "reservation", label: "Projet client / SaaS" },
  { value: "other", label: "Autre sujet" },
];

const API_URL = import.meta.env.VITE_API_URL || "";

const Index = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [caseCarouselApi, setCaseCarouselApi] = useState<CarouselApi | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const parseResponsePayload = async (response: Response) => {
    try {
      const cloned = response.clone();
      const json = await cloned.json();
      return typeof json === "object" ? json : { success: response.ok, message: String(json) };
    } catch (jsonError) {
      console.warn("[Contact] JSON parse failed, fallback to text", jsonError);
      const fallback = await response.text();
      return {
        success: response.ok,
        message: fallback || "Réponse vide",
      };
    }
  };

  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        type: "error",
        message: "Merci de remplir les champs obligatoires.",
      });
      return;
    }

    try {
      console.log("[Contact] Payload", formData);
      setFormStatus({ type: "loading" });
      const response = await fetch(`${API_URL}/send_email.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("[Contact] Response status", response.status);
      const result = await parseResponsePayload(response);
      console.log("[Contact] Response body", result);

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || `Erreur (${response.status})`);
      }

      const successMessage = result?.message || "Merci ! Votre message a bien été envoyé.";
      setFormStatus({
        type: "success",
        message: successMessage,
      });
      toast({
        title: "Message envoyé",
        description: successMessage,
      });
      setFormData(initialFormState);
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Impossible d’envoyer le message. Réessayez dans quelques minutes.";
      setFormStatus({
        type: "error",
        message: errorMessage,
      });
      console.error("[Contact] Submit error", error);
      toast({
        variant: "destructive",
        title: "Envoi impossible",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (formStatus.type === "success" || formStatus.type === "error") {
      const timer = setTimeout(() => setFormStatus({ type: "idle" }), 6000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [formStatus.type]);

  useEffect(() => {
    if (!caseCarouselApi) return;
    const interval = setInterval(() => {
      if (caseCarouselApi.canScrollNext()) {
        caseCarouselApi.scrollNext();
      } else {
        caseCarouselApi.scrollTo(0);
      }
    }, 6500);
    return () => clearInterval(interval);
  }, [caseCarouselApi]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,40,94,0.85),_rgba(10,15,39,0.95))] text-foreground">
      <section className="relative overflow-hidden px-6 pt-20 pb-16 md:px-12">
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-orb orb-1" aria-hidden="true" />
        <div className="hero-orb orb-2" aria-hidden="true" />
        <div className="absolute inset-y-10 inset-x-4 md:inset-x-16 rounded-[3.5rem] bg-[linear-gradient(120deg,rgba(4,55,117,0.6),rgba(0,25,82,0.85))] blur-3xl opacity-70" />
        <div className="relative mx-auto max-w-6xl space-y-8">
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.3em] text-foreground/80">
            <div className="flex items-center gap-3 rounded-full border border-white/15 px-4 py-2">
              <span className="logo-mark shadow-button">MJ</span>
              <div>
                <p className="text-[0.65rem] font-semibold">Mandimbizara Juno</p>
                <p className="text-[0.6rem] text-foreground/70">Fullstack + DevOps architect</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[0.65rem] font-semibold">
              <Stars className="h-3.5 w-3.5 text-primary" />
              Missions internationales · Disponible 2026
            </span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.5em] text-primary/70">Digital craftsman</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Expériences digitales premium pour les{" "}
                <span className="text-primary">SaaS ambiteux</span>,
                acteurs du tourisme et équipes data-driven.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Architectures Laravel, interfaces React, automatisations OpenAI et opérations cloud :
                je conçois des produits élégants, sécurisés et scalables end-to-end.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="shadow-button shadow-primary/40" asChild>
                  <a href="mailto:mandimbizarajuno@gmail.com">
                    <Mail className="h-4 w-4" />
                    Planifier un échange
                  </a>
                </Button>
                <Button variant="secondary" size="lg" className="border border-white/20" asChild>
                  <a href="https://github.com/GathonX" target="_blank" rel="noreferrer">
                    Portfolio GitHub
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="interactive-card rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur"
                  >
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <p className="text-sm font-medium text-white/70">{stat.label}</p>
                    <p className="mt-2 text-xs text-white/60">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="halo">
              <div className="glass-card pulse-border relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 px-8 pb-10 pt-8">
                <div className="absolute -top-4 right-6 rounded-full bg-primary/20 px-4 py-2 text-xs font-semibold text-primary backdrop-blur">
                  Disponible pour missions 2026
                </div>
                <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] border border-white/15">
                  <img
                    src={heroImage}
                    alt="Mandimbizara Juno en mission digitale"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F27]/80 via-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white">
                    Nosy Be Hell-ville · Madagascar
                  </div>
                </div>

                <div className="mt-8 space-y-4 text-sm">
                  <div className="flex items-center gap-3 text-white/80">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    Laravel · Node.js · REST APIs
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    React · Vite · Tailwind · shadcn/ui
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    Docker · CI/CD · Observabilité
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                    Automation & OpenAI tooling
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="noise-overlay bg-[linear-gradient(135deg,rgba(10,15,39,0.95),rgba(4,55,117,0.85))] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-white/70">
                Expertises
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                Ce que je construis pour mes clients
              </h2>
            </div>
            <Button
              variant="secondary"
              className="rounded-full border border-white/20 text-white"
              asChild
            >
              <a href="/docs/mandimbizara-juno-cv.pdf" download>
                Télécharger mon profil
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="interactive-card group relative rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur"
              >
                <div className="inline-flex rounded-2xl bg-primary/20 p-3 text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">{service.title}</h3>
                <p className="mt-4 text-sm text-white/70">{service.description}</p>
                <ul className="mt-6 space-y-2 text-sm text-white/80">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">Études de cas</p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Impact mesurable</h2>
            </div>
            <div className="text-xs uppercase tracking-[0.4em] text-white/60">
              Glissez ou laissez défiler
            </div>
          </div>

          <Carousel
            className="mt-10"
            setApi={setCaseCarouselApi}
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="pl-0">
              {caseStudies.map((study) => (
                <CarouselItem key={study.title} className="pl-8 md:basis-1/2">
                  <article className="interactive-card h-full rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-2xl shadow-primary/20 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Résultats</p>
                    <h3 className="mt-3 text-2xl font-semibold">{study.title}</h3>
                    <p className="mt-2 text-lg font-medium text-primary">{study.result}</p>
                    <p className="mt-4 text-sm text-white/80">{study.description}</p>
                    {study.href && (
                      <Button variant="secondary" size="sm" className="mt-6 border border-white/30 text-white" asChild>
                        <a href={study.href} target="_blank" rel="noreferrer">
                          Voir le projet
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-3">
              <CarouselPrevious className="border-white/20 bg-white/10 text-white hover:bg-white/20" />
              <CarouselNext className="border-white/20 bg-white/10 text-white hover:bg-white/20" />
            </div>
          </Carousel>
        </div>
      </section>

      <section className="px-6 py-12 md:px-12">
        <div className="scroll-marquee text-white/50">
          <span>
            <span>Laravel 12</span>
            <span>React/Vite</span>
            <span>Docker & CI/CD</span>
            <span>Automation OpenAI</span>
            <span>Audits SEO/Tech</span>
            <span>Cloud scaling</span>
            <span>Stratégies data-driven</span>
            <span>UX immersive</span>
          </span>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">
                Expériences
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                Des contextes variés, une exigence identique
              </h2>
            </div>
          </div>

          <div className="mt-12 space-y-10">
            {experiences.map((exp) => (
              <article
                key={exp.company}
                className="interactive-card rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-lg shadow-primary/10 backdrop-blur"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-2xl font-semibold">{exp.company}</h3>
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                    {exp.period}
                  </span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-white/75">
                  {exp.details.map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/70" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-20 md:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(18,118,158,0.35),rgba(10,15,39,0.95))]" />
        <div className="relative mx-auto max-w-6xl rounded-[3.5rem] border border-white/15 bg-white/5 p-10 text-white shadow-2xl shadow-primary/40 backdrop-blur-lg">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">Collaboration</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              Prêt à lancer votre prochain produit ?
            </h2>
            <p className="mx-auto mt-4 text-base text-white/75">
              Décrivez votre besoin (SaaS, tourisme, cloud, automation) et je reviens vers vous
              sous 24h pour cadrer la mission. L’envoi passe par mon serveur sécurisé (SMTP O2Switch).
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-xl shadow-primary/20">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/70">Nom complet *</label>
                  <Input
                    name="name"
                    placeholder="Ex: Rabea Andriamihaja"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/70">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="vous@entreprise.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/70">Téléphone (optionnel)</label>
                  <Input
                    name="phone"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2 border-white/20 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/70">Sujet *</label>
                  <div className="relative mt-2">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {contactReasons.map((reason) => (
                        <option key={reason.value} value={reason.value} className="text-gray-900">
                          {reason.label}
                        </option>
                      ))}
                    </select>
                    <ArrowUpRight className="pointer-events-none absolute right-3 top-2 h-4 w-4 rotate-45 text-white/60" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-white/70">Message *</label>
                <Textarea
                  name="message"
                  placeholder="Décrivez votre projet, vos objectifs, vos deadlines…"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-2 min-h-[150px] border-white/20 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>

              {formStatus.type !== "idle" && (
                <div
                  aria-live="polite"
                  className={`status-pill enter ${
                    formStatus.type === "success" ? "success" : "error"
                  }`}
                >
                  {formStatus.type === "success" ? (
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 text-red-200" />
                  )}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full justify-center shadow-button shadow-primary/40"
                disabled={formStatus.type === "loading"}
              >
                {formStatus.type === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    Envoyer le message
                    <Mail className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Coordonnées directes</p>
                <div className="mt-6 space-y-4">
                  {contactChannels.map((channel) => (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer"
                      className="interactive-card block rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/60">
                        {channel.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">{channel.value}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Contact express</p>
                <div className="mt-4 flex flex-wrap gap-4">
                  <Button size="lg" className="flex-1 shadow-button shadow-primary/40" asChild>
                    <a href="https://wa.me/261326687543" target="_blank" rel="noreferrer">
                      WhatsApp direct
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="secondary" size="lg" className="flex-1 border border-white/30 text-white" asChild>
                    <a href="https://whatsapp.com/channel/0029VbBWzH1FnSz5p855Iz0R" target="_blank" rel="noreferrer">
                      Chaîne GathonX
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
