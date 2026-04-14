import { Link, useLocation } from "react-router-dom";

import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/billing", label: "Billing" },
  { to: "/booking", label: "Book Now" },
  { to: "/admin", label: "Admin" },
];

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="leading-tight">
            <span className="font-display text-2xl font-bold tracking-wide text-foreground">BEAUTY PALACE</span>
            <span className="block text-[8px] font-medium uppercase tracking-[0.18em] text-rose-gold">Skin Care, Hair Care, Cosmetics, Self Grooming, Couple Makeup, Nail Art, Saree Draping & more...</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === l.to
                  ? "gradient-cherry text-primary-foreground shadow-glow"
                  : "text-foreground/60 hover:text-foreground hover:bg-accent"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button className="md:hidden rounded-lg p-2 hover:bg-accent transition-colors" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-border/60 bg-card p-2 md:hidden animate-fade-up">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                pathname === l.to ? "gradient-cherry text-primary-foreground" : "text-foreground/70 hover:bg-accent"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
