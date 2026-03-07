import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type ThankYouState = {
  from?: string;
  name?: string;
  subject?: string;
};

const subjectLabels: Record<string, string> = {
  information: "demande d'information",
  partnership: "partenariat ou mission",
  reservation: "projet client / SaaS",
  other: "autre sujet",
};

const ThankYou = () => {
  const location = useLocation();
  const state = (location.state ?? {}) as ThankYouState;
  const contactName = state.name?.trim();
  const subjectLabel = state.subject ? subjectLabels[state.subject] || state.subject : undefined;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,40,94,0.85),_rgba(10,15,39,0.95))] px-6 py-16 text-white md:px-12">
      <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
        <article className="w-full rounded-[2.5rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl shadow-primary/30 backdrop-blur-lg sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/50 bg-primary/20">
            <BadgeCheck className="h-8 w-8 text-primary" />
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-white/70">Merci pour votre confiance</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            {contactName ? `Merci ${contactName}, votre message est bien reçu.` : "Votre message est bien reçu."}
          </h1>
          <p className="mt-4 text-base text-white/75">
            Merci pour votre collaboration. Je reviens vers vous sous 24h avec une réponse claire et des prochaines
            étapes adaptées à votre besoin.
          </p>

          {subjectLabel && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/85">
              <Mail className="h-4 w-4 text-primary" />
              Sujet transmis: <span className="font-semibold">{subjectLabel}</span>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="flex-1 shadow-button shadow-primary/40" asChild>
              <Link to="/">
                Retour à l'accueil
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" className="flex-1 border border-white/30 text-white" asChild>
              <a href="https://wa.me/261326687543" target="_blank" rel="noreferrer">
                WhatsApp direct
                <MessageCircle className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </article>
      </section>
    </main>
  );
};

export default ThankYou;
