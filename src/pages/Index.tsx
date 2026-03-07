import { useEffect, useState } from "react";
import { ArrowUpRight, BadgeCheck, CircuitBoard, Mail, Loader2, Rocket, ShieldCheck, Stars } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";

const heroImage = "/img/concept-de-marketing-des-medias-sociaux-pour-le-marketing-avec-des-applications11.avif";
const CONTACT_EMAIL = "mamndimbizarajuno@gmail.com";

const stats = [
  {
    labelKey: "home.stats.years.label",
    valueKey: "home.stats.years.value",
    subKey: "home.stats.years.sub",
  },
  {
    labelKey: "home.stats.stack.label",
    valueKey: "home.stats.stack.value",
    subKey: "home.stats.stack.sub",
  },
  {
    labelKey: "home.stats.projects.label",
    valueKey: "home.stats.projects.value",
    subKey: "home.stats.projects.sub",
  },
];

const services = [
  {
    titleKey: "home.services.custom.title",
    descriptionKey: "home.services.custom.description",
    icon: Rocket,
    highlights: [
      "home.services.custom.h1",
      "home.services.custom.h2",
      "home.services.custom.h3",
    ],
  },
  {
    titleKey: "home.services.ai.title",
    descriptionKey: "home.services.ai.description",
    icon: CircuitBoard,
    highlights: ["home.services.ai.h1", "home.services.ai.h2", "home.services.ai.h3"],
  },
  {
    titleKey: "home.services.devops.title",
    descriptionKey: "home.services.devops.description",
    icon: ShieldCheck,
    highlights: [
      "home.services.devops.h1",
      "home.services.devops.h2",
      "home.services.devops.h3",
    ],
  },
];

const experiences = [
  {
    companyKey: "home.experience.items.pixelrise.company",
    periodKey: "home.experience.items.pixelrise.period",
    details: [
      "home.experience.items.pixelrise.d1",
      "home.experience.items.pixelrise.d2",
      "home.experience.items.pixelrise.d3",
    ],
  },
  {
    companyKey: "home.experience.items.island.company",
    periodKey: "home.experience.items.island.period",
    details: [
      "home.experience.items.island.d1",
      "home.experience.items.island.d2",
      "home.experience.items.island.d3",
    ],
  },
  {
    companyKey: "home.experience.items.trainer.company",
    periodKey: "home.experience.items.trainer.period",
    details: [
      "home.experience.items.trainer.d1",
      "home.experience.items.trainer.d2",
    ],
  },
];

const caseStudies = [
  {
    titleKey: "home.caseStudies.items.pixelrise.title",
    resultKey: "home.caseStudies.items.pixelrise.result",
    descriptionKey: "home.caseStudies.items.pixelrise.description",
    href: "https://pixel-rise.com/",
  },
  {
    titleKey: "home.caseStudies.items.island.title",
    resultKey: "home.caseStudies.items.island.result",
    descriptionKey: "home.caseStudies.items.island.description",
    href: undefined,
  },
];

const contactChannels = [
  {
    labelKey: "home.contact.channels.email",
    value: CONTACT_EMAIL,
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    labelKey: "home.contact.channels.whatsapp",
    value: "+261 32 66 875 43",
    href: "https://wa.me/261326687543",
  },
  {
    labelKey: "home.contact.channels.github",
    value: "@GathonX",
    href: "https://github.com/GathonX",
  },
  {
    labelKey: "home.contact.channels.facebook",
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
  { value: "information", labelKey: "home.form.subjectOptions.information" },
  { value: "partnership", labelKey: "home.form.subjectOptions.partnership" },
  { value: "reservation", labelKey: "home.form.subjectOptions.reservation" },
  { value: "other", labelKey: "home.form.subjectOptions.other" },
];

const heroSkillKeys = [
  "home.hero.skills.stack",
  "home.hero.skills.ui",
  "home.hero.skills.devops",
  "home.hero.skills.ai",
];

const marqueeKeys = [
  "home.marquee.laravel",
  "home.marquee.react",
  "home.marquee.devops",
  "home.marquee.ai",
  "home.marquee.seo",
  "home.marquee.cloud",
  "home.marquee.data",
  "home.marquee.ux",
];

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

const isLoopbackUrl = (url: string) =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(url);

const resolveApiBaseUrl = () => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (!configured) return "";

  if (typeof window !== "undefined") {
    const isLiveHost = !["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (isLiveHost && isLoopbackUrl(configured)) {
      console.warn(
        `[Contact] VITE_API_URL="${configured}" ignored in production-like host, fallback to same-origin endpoint.`
      );
      return "";
    }
  }

  return normalizeBaseUrl(configured);
};

const API_BASE_URL = resolveApiBaseUrl();
const CONTACT_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL}/send_email.php`
  : `${import.meta.env.BASE_URL}send_email.php`;

const Index = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [formStatus, setFormStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });
  const [caseCarouselApi, setCaseCarouselApi] = useState<CarouselApi | null>(null);
  const isSubmitting = formStatus.type === "loading";

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
      const trimmed = fallback.trim();
      const looksLikeHtml = /^<!doctype html/i.test(trimmed) || /^<html/i.test(trimmed);
      const statusBasedMessage =
        response.status === 404 ? t("home.form.endpointMissing") : t("home.form.errorFallback");
      return {
        success: response.ok,
        message:
          looksLikeHtml
            ? statusBasedMessage
            : fallback || t("home.form.responseEmpty"),
      };
    }
  };

  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      const requiredError = t("home.form.requiredError");
      setFormStatus({
        type: "error",
        message: requiredError,
      });
      toast({
        variant: "destructive",
        title: t("home.form.toasts.missingTitle"),
        description: requiredError,
      });
      return;
    }

    try {
      console.log("[Contact] Payload", formData);
      setFormStatus({ type: "loading", message: t("home.form.loading") });
      const response = await fetch(CONTACT_ENDPOINT, {
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

      const successMessage = result?.message || t("home.form.successDefault");
      setFormStatus({
        type: "success",
        message: successMessage,
      });
      toast({
        title: t("home.form.toasts.successTitle"),
        description: successMessage,
      });
      navigate("/merci", {
        state: {
          name: formData.name,
          subject: formData.subject,
          from: "contact-form",
        },
      });
      setFormData(initialFormState);
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : t("home.form.errorFallback");
      setFormStatus({
        type: "error",
        message: errorMessage,
      });
      console.error("[Contact] Submit error", error);
      toast({
        variant: "destructive",
        title: t("home.form.toasts.errorTitle"),
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
                <p className="text-[0.6rem] text-foreground/70">{t("home.brandRole")}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[0.65rem] font-semibold">
              <Stars className="h-3.5 w-3.5 text-primary" />
              {t("home.brandAvailability")}
            </span>
            <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 py-1.5 text-[0.6rem] font-semibold tracking-[0.25em]">
              <span className="px-2 text-white/70">{t("common.languageLabel")}</span>
              {(["fr", "en"] as const).map((lng) => {
                const active = (i18n.resolvedLanguage || i18n.language || "fr").startsWith(lng);
                return (
                  <button
                    key={lng}
                    type="button"
                    onClick={() => i18n.changeLanguage(lng)}
                    className={`rounded-full px-3 py-1 transition ${
                      active
                        ? "bg-primary text-white shadow-button"
                        : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                    }`}
                    aria-pressed={active}
                    aria-label={t(`common.languages.${lng}`)}
                  >
                    {t(`common.languages.${lng}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.5em] text-primary/70">{t("home.hero.kicker")}</p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                {t("home.hero.titlePrefix")}{" "}
                <span className="text-primary">{t("home.hero.titleHighlight")}</span>,{" "}
                {t("home.hero.titleSuffix")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                {t("home.hero.description")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="shadow-button shadow-primary/40" asChild>
                  <a href={`mailto:${CONTACT_EMAIL}`}>
                    <Mail className="h-4 w-4" />
                    {t("home.hero.ctaTalk")}
                  </a>
                </Button>
                <Button variant="secondary" size="lg" className="border border-white/20" asChild>
                  <a href="https://github.com/GathonX" target="_blank" rel="noreferrer">
                    {t("home.hero.ctaGithub")}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.labelKey}
                    className="interactive-card rounded-2xl border border-white/10 bg-white/5 p-4 text-white backdrop-blur"
                  >
                    <p className="text-3xl font-semibold">{t(stat.valueKey)}</p>
                    <p className="text-sm font-medium text-white/70">{t(stat.labelKey)}</p>
                    <p className="mt-2 text-xs text-white/60">{t(stat.subKey)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="halo">
              <div className="glass-card pulse-border relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 px-8 pb-10 pt-8">
                <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-primary/20 px-4 py-2 text-xs font-semibold text-primary backdrop-blur md:left-auto md:right-6 md:translate-x-0">
                  {t("home.hero.profileAvailability")}
                </div>
                <div className="relative aspect-[5/6] overflow-hidden rounded-[2rem] border border-white/15">
                  <img
                    src={heroImage}
                    alt={t("home.hero.imageAlt")}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F27]/80 via-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white">
                    {t("home.hero.location")}
                  </div>
                </div>

                <div className="mt-8 space-y-4 text-sm">
                  {heroSkillKeys.map((skillKey) => (
                    <div key={skillKey} className="flex items-center gap-3 text-white/80">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      {t(skillKey)}
                    </div>
                  ))}
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
                {t("home.expertise.kicker")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                {t("home.expertise.title")}
              </h2>
            </div>
            <Button
              variant="secondary"
              className="rounded-full border border-white/20 text-white"
              asChild
            >
              <a href="/docs/mandimbizara-juno-cv.pdf" download>
                {t("home.expertise.download")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.titleKey}
                className="interactive-card group relative rounded-3xl border border-white/10 bg-white/5 p-8 text-white backdrop-blur"
              >
                <div className="inline-flex rounded-2xl bg-primary/20 p-3 text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold">{t(service.titleKey)}</h3>
                <p className="mt-4 text-sm text-white/70">{t(service.descriptionKey)}</p>
                <ul className="mt-6 space-y-2 text-sm text-white/80">
                  {service.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
                      {t(item)}
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
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">{t("home.caseStudies.kicker")}</p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">{t("home.caseStudies.title")}</h2>
            </div>
            <div className="text-xs uppercase tracking-[0.4em] text-white/60">
              {t("home.caseStudies.hint")}
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
                <CarouselItem key={study.titleKey} className="pl-8 md:basis-1/2">
                  <article className="interactive-card h-full rounded-3xl border border-white/15 bg-white/10 p-8 text-white shadow-2xl shadow-primary/20 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary/80">{t("home.caseStudies.resultLabel")}</p>
                    <h3 className="mt-3 text-2xl font-semibold">{t(study.titleKey)}</h3>
                    <p className="mt-2 text-lg font-medium text-primary">{t(study.resultKey)}</p>
                    <p className="mt-4 text-sm text-white/80">{t(study.descriptionKey)}</p>
                    {study.href && (
                      <Button variant="secondary" size="sm" className="mt-6 border border-white/30 text-white" asChild>
                        <a href={study.href} target="_blank" rel="noreferrer">
                          {t("home.caseStudies.viewProject")}
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
            {marqueeKeys.map((itemKey) => (
              <span key={itemKey}>{t(itemKey)}</span>
            ))}
          </span>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-primary/70">
                {t("home.experience.kicker")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
                {t("home.experience.title")}
              </h2>
            </div>
          </div>

          <div className="mt-12 space-y-10">
            {experiences.map((exp) => (
              <article
                key={exp.companyKey}
                className="interactive-card rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-lg shadow-primary/10 backdrop-blur"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-2xl font-semibold">{t(exp.companyKey)}</h3>
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                    {t(exp.periodKey)}
                  </span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-white/75">
                  {exp.details.map((detail) => (
                    <li key={detail} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary/70" />
                      {t(detail)}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-3 py-20 sm:px-5 md:px-10 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(18,118,158,0.35),rgba(10,15,39,0.95))]" />
        <div className="relative mx-auto max-w-6xl rounded-[3.5rem] border border-white/15 bg-white/5 p-4 text-white shadow-2xl shadow-primary/40 backdrop-blur-lg sm:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-white/70">{t("home.contact.kicker")}</p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
              {t("home.contact.title")}
            </h2>
            <p className="mx-auto mt-4 text-base text-white/75">
              {t("home.contact.description")}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <form
              onSubmit={handleSubmit}
              aria-busy={isSubmitting}
              className="w-full space-y-6 rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-xl shadow-primary/20 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/70">{t("home.form.labels.name")} *</label>
                  <Input
                    name="name"
                    placeholder={t("home.form.placeholders.name")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="mt-2 border-white/20 bg-white/5 text-white placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/70">{t("home.form.labels.email")} *</label>
                  <Input
                    type="email"
                    name="email"
                    placeholder={t("home.form.placeholders.email")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="mt-2 border-white/20 bg-white/5 text-white placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/70">{t("home.form.labels.phone")}</label>
                  <Input
                    name="phone"
                    placeholder={t("home.form.placeholders.phone")}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="mt-2 border-white/20 bg-white/5 text-white placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.3em] text-white/70">{t("home.form.labels.subject")} *</label>
                  <div className="relative mt-2">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full appearance-none rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {contactReasons.map((reason) => (
                        <option key={reason.value} value={reason.value} className="text-gray-900">
                          {t(reason.labelKey)}
                        </option>
                      ))}
                    </select>
                    <ArrowUpRight className="pointer-events-none absolute right-3 top-2 h-4 w-4 rotate-45 text-white/60" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-white/70">{t("home.form.labels.message")} *</label>
                <Textarea
                  name="message"
                  placeholder={t("home.form.placeholders.message")}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="mt-2 min-h-[150px] border-white/20 bg-white/5 text-white placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {formStatus.type !== "idle" && (
                <div
                  aria-live="polite"
                  className={`status-pill enter ${
                    formStatus.type === "success"
                      ? "success"
                      : formStatus.type === "loading"
                        ? "loading"
                        : "error"
                  }`}
                >
                  {formStatus.type === "success" ? (
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  ) : formStatus.type === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("home.form.buttonSubmitting")}
                  </>
                ) : (
                  <>
                    {t("home.form.buttonSubmit")}
                    <Mail className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="w-full space-y-6">
              <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{t("home.contact.directTitle")}</p>
                <div className="mt-6 space-y-4">
                  {contactChannels.map((channel) => (
                    <a
                      key={channel.labelKey}
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer"
                      className="interactive-card block rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/60">
                        {t(channel.labelKey)}
                      </p>
                      <p className="mt-1 break-words text-lg font-semibold text-white">{channel.value}</p>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">{t("home.contact.quickTitle")}</p>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="flex-1 shadow-button shadow-primary/40" asChild>
                    <a href="https://wa.me/261326687543" target="_blank" rel="noreferrer">
                      {t("home.contact.quickWhatsapp")}
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="secondary" size="lg" className="flex-1 border border-white/30 text-white" asChild>
                    <a href="https://whatsapp.com/channel/0029VbBWzH1FnSz5p855Iz0R" target="_blank" rel="noreferrer">
                      {t("home.contact.quickChannel")}
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
