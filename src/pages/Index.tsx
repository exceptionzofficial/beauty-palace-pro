import { Link } from "react-router-dom";
import { services, categories } from "@/data/services";
import { Scissors, Calendar, CreditCard, Sparkles } from "lucide-react";

const features = [
  { icon: Scissors, title: "Expert Services", desc: "Professional beauty & salon services" },
  { icon: Calendar, title: "Easy Booking", desc: "Book appointments online anytime" },
  { icon: CreditCard, title: "Quick Billing", desc: "POS-style instant invoicing" },
  { icon: Sparkles, title: "Premium Care", desc: "Quality products & treatments" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-salon-dark py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-salon-dark via-salon-dark to-gold-dark/30" />
        <div className="container relative z-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-gold">Welcome to</p>
          <h1 className="font-display text-4xl font-bold text-gold-light md:text-6xl" style={{ lineHeight: 1.1 }}>
            Beauty Palace
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-beige-dark/80">
            Your destination for premium beauty, hair care, and wellness services in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/booking" className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]">
              Book Appointment
            </Link>
            <Link to="/billing" className="rounded-lg border border-gold/40 px-6 py-3 text-sm font-semibold text-gold-light transition-transform active:scale-[0.97]">
              Start Billing
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="animate-fade-in rounded-xl border border-border bg-card p-5 text-center shadow-sm"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
            >
              <f.icon className="mx-auto mb-3 text-primary" size={28} strokeWidth={1.5} />
              <h3 className="font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-2xl font-semibold">Our Services</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((cat, i) => {
              const count = services.filter((s) => s.category === cat).length;
              return (
                <Link
                  key={cat}
                  to={`/billing?category=${encodeURIComponent(cat)}`}
                  className="animate-fade-in rounded-xl border border-border bg-card p-4 text-center shadow-sm transition-shadow hover:shadow-md active:scale-[0.97]"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
                >
                  <h3 className="font-display text-sm font-semibold">{cat}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{count} services</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-salon-dark py-8 text-center text-xs text-beige-dark/60">
        <p className="font-display text-sm text-gold-light">Beauty Palace</p>
        <p className="mt-1">Open daily 8:00 AM – 9:00 PM</p>
        <p className="mt-1">www.exceptionz.in</p>
      </footer>
    </div>
  );
}
