import { Link } from "react-router-dom";
import { services, categories } from "@/data/services";
import { Scissors, Calendar, CreditCard, Sparkles, Star, Clock, MapPin, Phone } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import servicesBanner from "@/assets/services-banner.jpg";
import logo from "@/assets/logo.jpg";

const features = [
  { icon: Scissors, title: "Expert Stylists", desc: "Trained professionals for every service" },
  { icon: Calendar, title: "Easy Booking", desc: "Book your slot in seconds" },
  { icon: CreditCard, title: "Quick Billing", desc: "POS-style instant invoicing" },
  { icon: Sparkles, title: "Premium Products", desc: "Only the finest beauty brands" },
];

const stats = [
  { value: "2,500+", label: "Happy Clients" },
  { value: "85+", label: "Services" },
  { value: "8+", label: "Years Experience" },
  { value: "4.8★", label: "Google Rating" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-transparent" />
        </div>
        <div className="container relative z-10 py-24 md:py-36">
          <div className="max-w-xl">
            <p className="animate-fade-up mb-4 inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur-sm" style={{ animationDelay: "0ms" }}>
              ✨ Premium Salon Experience
            </p>
            <h1 className="animate-fade-up font-display text-5xl font-bold leading-[1.05] text-card md:text-7xl" style={{ animationDelay: "100ms" }}>
              Beauty Palace
            </h1>
            <p className="animate-fade-up mt-2 font-display text-xl text-rose-gold-light italic md:text-2xl" style={{ animationDelay: "200ms" }}>
              Where elegance meets expertise
            </p>
            <p className="animate-fade-up mt-4 max-w-md text-sm leading-relaxed text-card/70" style={{ animationDelay: "300ms" }}>
              Experience luxury beauty services with our expert team. From hair treatments to bridal packages, we make you feel extraordinary.
            </p>
            <div className="animate-fade-up mt-8 flex flex-wrap gap-3" style={{ animationDelay: "400ms" }}>
              <Link to="/booking" className="gradient-cherry rounded-full px-7 py-3 text-sm font-semibold text-primary-foreground shadow-glow-lg transition-transform active:scale-[0.97] hover:shadow-glow">
                Book Appointment
              </Link>
              <Link to="/billing" className="rounded-full border-2 border-card/30 bg-card/10 px-7 py-3 text-sm font-semibold text-card backdrop-blur-sm transition-all hover:bg-card/20 active:scale-[0.97]">
                Start Billing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-8 z-20">
        <div className="container">
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-card p-4 shadow-glow-lg md:grid-cols-4 md:gap-4 md:p-6">
            {stats.map((s, i) => (
              <div key={s.label} className="animate-fade-up text-center" style={{ animationDelay: `${i * 80}ms` }}>
                <p className="font-display text-2xl font-bold text-cherry md:text-3xl">{s.value}</p>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cherry">Why Choose Us</p>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">The Beauty Palace Difference</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="animate-fade-up group rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cherry-light transition-colors group-hover:gradient-cherry">
                  <f.icon className="text-cherry transition-colors group-hover:text-primary-foreground" size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="bg-cream py-20">
        <div className="container">
          <div className="mb-10 flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cherry">Our Expertise</p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Service Categories</h2>
            </div>
            <Link to="/billing" className="text-sm font-medium text-cherry hover:underline">
              View all services →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((cat, i) => {
              const count = services.filter((s) => s.category === cat).length;
              return (
                <Link
                  key={cat}
                  to={`/billing?category=${encodeURIComponent(cat)}`}
                  className="animate-fade-up group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <div className="absolute inset-0 gradient-cherry opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
                  <h3 className="relative font-display text-base font-semibold">{cat}</h3>
                  <p className="relative mt-1 text-xs font-medium text-cherry">{count} services</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img src={servicesBanner} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 to-foreground/60" />
        </div>
        <div className="container relative z-10 text-center">
          <h2 className="animate-fade-up font-display text-3xl font-bold text-card md:text-5xl" style={{ lineHeight: 1.1 }}>
            Ready for a Transformation?
          </h2>
          <p className="animate-fade-up mx-auto mt-4 max-w-md text-sm text-card/70" style={{ animationDelay: "100ms" }}>
            Book your appointment today and let our experts bring out your best look.
          </p>
          <div className="animate-fade-up mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "200ms" }}>
            <Link to="/booking" className="gradient-cherry rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground shadow-glow-lg transition-transform active:scale-[0.97]">
              Book Now
            </Link>
            <a href="tel:+919876543210" className="flex items-center gap-2 rounded-full border-2 border-card/30 bg-card/10 px-6 py-3 text-sm font-semibold text-card backdrop-blur-sm">
              <Phone size={14} /> Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16">
        <div className="container max-w-lg">
          <h2 className="mb-6 text-center font-display text-2xl font-bold">Visit Us</h2>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-glow">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cherry-light">
                <Clock size={18} className="text-cherry" />
              </div>
              <div>
                <p className="text-sm font-semibold">Business Hours</p>
                <p className="text-xs text-muted-foreground">Open 7 days a week</p>
              </div>
            </div>
            <div className="space-y-2">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                <div key={d} className="flex items-center justify-between rounded-lg bg-cream px-4 py-2.5 text-sm">
                  <span className="font-medium">{d}</span>
                  <span className="text-muted-foreground">8:00 AM – 9:00 PM</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-gold-light px-4 py-3">
              <MapPin size={16} className="text-cherry shrink-0" />
              <p className="text-xs text-foreground/80">Beauty Palace, Main Street, Erode, Tamil Nadu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-salon-dark py-10">
        <div className="container text-center">
          <img src={logo} alt="Beauty Palace" className="mx-auto h-14 w-14 rounded-full object-cover ring-2 ring-primary/30" />
          <p className="mt-3 font-display text-xl font-semibold text-card">Beauty Palace</p>
          <p className="mt-1 text-xs text-card/40">Premium Cosmetics & Salon</p>
          <div className="mx-auto mt-4 flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} className="fill-primary text-primary" />
            ))}
            <span className="ml-1 text-xs text-card/50">4.8 on Google</span>
          </div>
          <p className="mt-4 text-xs text-card/30">Open daily 8:00 AM – 9:00 PM · www.exceptionz.in</p>
        </div>
      </footer>
    </div>
  );
}
