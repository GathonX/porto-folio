import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  fr: {
    translation: {
      common: {
        languageLabel: "Langue",
        languages: {
          fr: "FR",
          en: "EN",
        },
      },
      home: {
        brandRole: "Architecte Fullstack + DevOps",
        brandAvailability: "Missions internationales · Disponible 2026",
        hero: {
          kicker: "Digital craftsman",
          titlePrefix: "Experiences digitales premium pour les",
          titleHighlight: "SaaS ambitieux",
          titleSuffix: "acteurs du tourisme et equipes data-driven.",
          description:
            "Architectures Laravel, interfaces React, automatisations OpenAI et operations cloud : je concois des produits elegants, securises et scalables end-to-end.",
          ctaTalk: "Planifier un echange",
          ctaGithub: "Portfolio GitHub",
          profileAvailability: "Disponible pour missions 2026",
          imageAlt: "Mandimbizara Juno en mission digitale",
          location: "Nosy Be Hell-ville · Madagascar",
          skills: {
            stack: "Laravel · Node.js · REST APIs",
            ui: "React · Vite · Tailwind · shadcn/ui",
            devops: "Docker · CI/CD · Observabilite",
            ai: "Automation & OpenAI tooling",
          },
        },
        stats: {
          years: {
            value: "5+",
            label: "Annees d'experience",
            sub: "dans le developpement produit",
          },
          stack: {
            value: "Front · Back · DevOps",
            label: "Stack couverte",
            sub: "Laravel • React • Docker",
          },
          projects: {
            value: "15+",
            label: "Clients & projets",
            sub: "SaaS, tourisme, automation",
          },
        },
        expertise: {
          kicker: "Expertises",
          title: "Ce que je construis pour mes clients",
          download: "Telecharger mon profil",
        },
        services: {
          custom: {
            title: "Applications sur mesure",
            description:
              "De l'architecture au deploiement : Laravel, React, Vite, Tailwind et APIs robustes pretes pour l'echelle.",
            h1: "Product design",
            h2: "Micro-services",
            h3: "Performances & securite",
          },
          ai: {
            title: "Automatisation & IA",
            description:
              "Integrations OpenAI, workflows marketing automatises, sprints pilotes par la donnee et reporting temps reel.",
            h1: "Contenus assistes IA",
            h2: "Pipelines marketing",
            h3: "Dashboards ops",
          },
          devops: {
            title: "Cloud & DevOps",
            description:
              "CI/CD GitHub Actions, conteneurisation Docker, monitoring et strategies de rollback sans downtime.",
            h1: "Docker multi-env",
            h2: "VPS & cloud",
            h3: "Observabilite avancee",
          },
        },
        caseStudies: {
          kicker: "Etudes de cas",
          title: "Impact mesurable",
          hint: "Glissez ou laissez defiler",
          resultLabel: "Resultats",
          viewProject: "Voir le projet",
          items: {
            pixelrise: {
              title: "PixelRise Automation Suite",
              result: "+42% de productivite des equipes marketing",
              description:
                "Stack Laravel + React + OpenAI orchestree avec pipelines CI/CD, tableaux de bord et generation multi-canal (blogs, reseaux sociaux, plans marketing).",
            },
            island: {
              title: "IslandManager",
              result: "Gestion unifiee des hotels & restaurants",
              description:
                "Plateforme modulaire avec roles personnalises, API publiques documentees et automatisation des operations quotidiennes.",
            },
          },
        },
        marquee: {
          laravel: "Laravel 12",
          react: "React/Vite",
          devops: "Docker & CI/CD",
          ai: "Automation OpenAI",
          seo: "Audits SEO/Tech",
          cloud: "Cloud scaling",
          data: "Strategies data-driven",
          ux: "UX immersive",
        },
        experience: {
          kicker: "Experiences",
          title: "Des contextes varies, une exigence identique",
          items: {
            pixelrise: {
              company: "PixelRise · SaaS d'automatisation",
              period: "2024 — Aujourd'hui",
              d1: "Plateforme Laravel 12 + React/Vite + Tailwind pour contenus generes par IA",
              d2: "Architecture Docker (PHP, Node, MySQL) + pipelines CI/CD & rollback",
              d3: "Optimisation SQL/NoSQL, migration progressive vers Firestore",
            },
            island: {
              company: "IslandManager · Plateforme tourisme",
              period: "En cours",
              d1: "Back-office Laravel 11 + Vite, auth Sanctum et roles administrables",
              d2: "API REST securisees, logging granulaire et doc Swagger",
              d3: "Mise en ligne, SEO technique et accompagnement produit",
            },
            trainer: {
              company: "Formateur freelance",
              period: "2019 — Aujourd'hui",
              d1: "Coaching dev fullstack, DevOps et bonnes pratiques industrielles",
              d2: "Creation de programmes sur mesure pour entreprises et ecoles",
            },
          },
        },
        contact: {
          kicker: "Collaboration",
          title: "Pret a lancer votre prochain produit ?",
          description:
            "Decrivez votre besoin (SaaS, tourisme, cloud, automation) et je reviens vers vous sous 24h pour cadrer la mission. L'envoi passe par mon serveur securise (SMTP O2Switch).",
          directTitle: "Coordonnees directes",
          quickTitle: "Contact express",
          quickWhatsapp: "WhatsApp direct",
          quickChannel: "Chaine GathonX",
          channels: {
            email: "Email direct",
            whatsapp: "WhatsApp",
            github: "GitHub",
            facebook: "Facebook",
          },
        },
        form: {
          labels: {
            name: "Nom complet",
            email: "Email",
            phone: "Telephone (optionnel)",
            subject: "Sujet",
            message: "Message",
          },
          placeholders: {
            name: "Ex: Rabea Andriamihaja",
            email: "vous@entreprise.com",
            phone: "+33 6 12 34 56 78",
            message: "Decrivez votre projet, vos objectifs, vos deadlines...",
          },
          subjectOptions: {
            information: "Demande d'information",
            partnership: "Partenariat ou mission",
            reservation: "Projet client / SaaS",
            other: "Autre sujet",
          },
          requiredError: "Merci de remplir les champs obligatoires.",
          loading: "Envoi en cours...",
          successDefault: "Merci ! Votre message a bien ete envoye.",
          errorFallback: "Impossible d'envoyer le message. Reessayez dans quelques minutes.",
          responseEmpty: "Reponse vide",
          buttonSubmit: "Envoyer le message",
          buttonSubmitting: "Envoi en cours...",
          toasts: {
            missingTitle: "Champs incomplets",
            successTitle: "Message envoye",
            errorTitle: "Envoi impossible",
          },
        },
      },
      thankYou: {
        kicker: "Merci pour votre confiance",
        titleWithName: "Merci {{name}}, votre message est bien recu.",
        titleDefault: "Votre message est bien recu.",
        description:
          "Merci pour votre collaboration. Je reviens vers vous sous 24h avec une reponse claire et des prochaines etapes adaptees a votre besoin.",
        subjectSent: "Sujet transmis:",
        actions: {
          home: "Retour a l'accueil",
          whatsapp: "WhatsApp direct",
        },
        subjectOptions: {
          information: "demande d'information",
          partnership: "partenariat ou mission",
          reservation: "projet client / SaaS",
          other: "autre sujet",
        },
      },
      notFound: {
        message: "Oups! Page introuvable",
        backHome: "Retour a l'accueil",
      },
    },
  },
  en: {
    translation: {
      common: {
        languageLabel: "Language",
        languages: {
          fr: "FR",
          en: "EN",
        },
      },
      home: {
        brandRole: "Fullstack + DevOps Architect",
        brandAvailability: "International projects · Available in 2026",
        hero: {
          kicker: "Digital craftsman",
          titlePrefix: "Premium digital experiences for",
          titleHighlight: "ambitious SaaS",
          titleSuffix: "tourism leaders, and data-driven teams.",
          description:
            "Laravel architectures, React interfaces, OpenAI automations, and cloud operations: I build elegant, secure, and scalable end-to-end products.",
          ctaTalk: "Schedule a call",
          ctaGithub: "GitHub portfolio",
          profileAvailability: "Available for 2026 projects",
          imageAlt: "Mandimbizara Juno on a digital mission",
          location: "Nosy Be Hell-ville · Madagascar",
          skills: {
            stack: "Laravel · Node.js · REST APIs",
            ui: "React · Vite · Tailwind · shadcn/ui",
            devops: "Docker · CI/CD · Observability",
            ai: "Automation & OpenAI tooling",
          },
        },
        stats: {
          years: {
            value: "5+",
            label: "Years of experience",
            sub: "in product engineering",
          },
          stack: {
            value: "Front · Back · DevOps",
            label: "Stack coverage",
            sub: "Laravel • React • Docker",
          },
          projects: {
            value: "15+",
            label: "Clients & projects",
            sub: "SaaS, tourism, automation",
          },
        },
        expertise: {
          kicker: "Expertise",
          title: "What I build for my clients",
          download: "Download my profile",
        },
        services: {
          custom: {
            title: "Custom applications",
            description:
              "From architecture to deployment: Laravel, React, Vite, Tailwind, and robust APIs ready to scale.",
            h1: "Product design",
            h2: "Micro-services",
            h3: "Performance & security",
          },
          ai: {
            title: "Automation & AI",
            description:
              "OpenAI integrations, automated marketing workflows, data-driven sprint execution, and real-time reporting.",
            h1: "AI-assisted content",
            h2: "Marketing pipelines",
            h3: "Ops dashboards",
          },
          devops: {
            title: "Cloud & DevOps",
            description:
              "GitHub Actions CI/CD, Docker containerization, monitoring, and rollback strategies with zero downtime.",
            h1: "Multi-environment Docker",
            h2: "VPS & cloud",
            h3: "Advanced observability",
          },
        },
        caseStudies: {
          kicker: "Case studies",
          title: "Measurable impact",
          hint: "Swipe or let it auto-scroll",
          resultLabel: "Results",
          viewProject: "View project",
          items: {
            pixelrise: {
              title: "PixelRise Automation Suite",
              result: "+42% marketing team productivity",
              description:
                "Laravel + React + OpenAI stack orchestrated with CI/CD pipelines, dashboards, and multi-channel generation (blogs, social media, marketing plans).",
            },
            island: {
              title: "IslandManager",
              result: "Unified hotel & restaurant management",
              description:
                "Modular platform with custom roles, documented public APIs, and automation for daily operations.",
            },
          },
        },
        marquee: {
          laravel: "Laravel 12",
          react: "React/Vite",
          devops: "Docker & CI/CD",
          ai: "OpenAI automation",
          seo: "SEO/Tech audits",
          cloud: "Cloud scaling",
          data: "Data-driven strategy",
          ux: "Immersive UX",
        },
        experience: {
          kicker: "Experience",
          title: "Different contexts, same standards",
          items: {
            pixelrise: {
              company: "PixelRise · Automation SaaS",
              period: "2024 — Present",
              d1: "Laravel 12 + React/Vite + Tailwind platform for AI-generated content",
              d2: "Docker architecture (PHP, Node, MySQL) + CI/CD pipelines & rollback",
              d3: "SQL/NoSQL optimization and progressive migration to Firestore",
            },
            island: {
              company: "IslandManager · Tourism platform",
              period: "In progress",
              d1: "Laravel 11 + Vite back-office, Sanctum auth, and role management",
              d2: "Secure REST APIs, detailed logging, and Swagger documentation",
              d3: "Deployment, technical SEO, and product support",
            },
            trainer: {
              company: "Freelance trainer",
              period: "2019 — Present",
              d1: "Coaching in fullstack, DevOps, and engineering best practices",
              d2: "Custom training programs for companies and schools",
            },
          },
        },
        contact: {
          kicker: "Collaboration",
          title: "Ready to launch your next product?",
          description:
            "Describe your need (SaaS, tourism, cloud, automation) and I will get back to you within 24 hours with a clear project scope.",
          directTitle: "Direct contacts",
          quickTitle: "Quick contact",
          quickWhatsapp: "Direct WhatsApp",
          quickChannel: "GathonX channel",
          channels: {
            email: "Direct email",
            whatsapp: "WhatsApp",
            github: "GitHub",
            facebook: "Facebook",
          },
        },
        form: {
          labels: {
            name: "Full name",
            email: "Email",
            phone: "Phone (optional)",
            subject: "Subject",
            message: "Message",
          },
          placeholders: {
            name: "e.g. John Doe",
            email: "you@company.com",
            phone: "+33 6 12 34 56 78",
            message: "Describe your project, objectives, and timeline...",
          },
          subjectOptions: {
            information: "Information request",
            partnership: "Partnership or mission",
            reservation: "Client project / SaaS",
            other: "Other subject",
          },
          requiredError: "Please fill in all required fields.",
          loading: "Sending in progress...",
          successDefault: "Thanks! Your message has been sent.",
          errorFallback: "Message could not be sent. Please try again in a few minutes.",
          responseEmpty: "Empty response",
          buttonSubmit: "Send message",
          buttonSubmitting: "Sending...",
          toasts: {
            missingTitle: "Missing fields",
            successTitle: "Message sent",
            errorTitle: "Sending failed",
          },
        },
      },
      thankYou: {
        kicker: "Thank you for your trust",
        titleWithName: "Thank you {{name}}, your message has been received.",
        titleDefault: "Your message has been received.",
        description:
          "Thank you for your collaboration. I will get back to you within 24 hours with clear next steps tailored to your needs.",
        subjectSent: "Submitted topic:",
        actions: {
          home: "Back to home",
          whatsapp: "Direct WhatsApp",
        },
        subjectOptions: {
          information: "information request",
          partnership: "partnership or mission",
          reservation: "client project / SaaS",
          other: "other subject",
        },
      },
      notFound: {
        message: "Oops! Page not found",
        backHome: "Return to home",
      },
    },
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    supportedLngs: ["fr", "en"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
    },
    returnNull: false,
  });

if (typeof document !== "undefined") {
  const syncHtmlLang = (lng: string) => {
    document.documentElement.lang = lng.startsWith("en") ? "en" : "fr";
  };

  syncHtmlLang(i18n.resolvedLanguage || i18n.language || "fr");
  i18n.on("languageChanged", syncHtmlLang);
}

export default i18n;
