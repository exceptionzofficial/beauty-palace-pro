import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.jpg";
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
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Beauty Palace" className="h-10 w-10 rounded-full object-cover" />
          <div className="leading-tight">
            <span className="font-display text-lg font-semibold text-foreground">Beauty Palace</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Cosmetics</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="flex flex-col border-t border-border bg-card p-2 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`rounded-md px-4 py-3 text-sm font-medium ${
                pathname === l.to ? "bg-primary text-primary-foreground" : "text-foreground/70"
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
