import { useState } from "react";
import { services, categories, Booking } from "@/data/services";
import { saveBooking } from "@/lib/store";
import { CalendarDays, Clock, User, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
];

export default function BookingPage() {
  const [category, setCategory] = useState("All");
  const [selectedService, setSelectedService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const filtered = category === "All" ? services : services.filter((s) => s.category === category);

  const handleBook = () => {
    if (!selectedService || !date || !time || !name.trim() || !phone.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    const svc = services.find((s) => s.id === selectedService);
    const booking: Booking = {
      id: `BK-${Date.now().toString(36).toUpperCase()}`,
      customerName: name,
      phone,
      serviceId: selectedService,
      serviceName: svc?.service_name || "",
      date,
      time,
      createdAt: new Date().toISOString(),
    };
    saveBooking(booking);
    setDone(true);
    toast.success("Booking confirmed!");
  };

  if (done) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <div className="animate-fade-up text-center max-w-sm">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 shadow-lg">
            <Check className="text-green-600" size={36} />
          </div>
          <h2 className="font-display text-3xl font-bold">Booking Confirmed!</h2>
          <p className="mt-2 text-sm text-muted-foreground">We'll see you at Beauty Palace. Get ready to look amazing! ✨</p>
          <button onClick={() => { setDone(false); setSelectedService(""); setDate(""); setTime(""); setName(""); setPhone(""); }}
            className="mt-8 gradient-cherry rounded-full px-8 py-3 text-sm font-bold text-primary-foreground shadow-glow transition-transform active:scale-[0.97]">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container max-w-2xl py-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cherry">Reserve Your Spot</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">Book Appointment</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose your service and preferred time</p>
        </div>

        <div className="space-y-4">
          {/* Service selection */}
          <div className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-glow" style={{ animationDelay: "0ms" }}>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cherry-light">
                <Sparkles size={14} className="text-cherry" />
              </div>
              Select Service
            </h3>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="mb-3 w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-xl border border-border bg-cream px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Choose a service...</option>
              {filtered.map((s) => (
                <option key={s.id} value={s.id}>{s.service_name} — ₹{s.price.toLocaleString("en-IN")} ({s.duration} min)</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-glow" style={{ animationDelay: "100ms" }}>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cherry-light">
                <CalendarDays size={14} className="text-cherry" />
              </div>
              Date & Time
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="rounded-xl border border-border bg-cream px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
              <select value={time} onChange={(e) => setTime(e.target.value)}
                className="rounded-xl border border-border bg-cream px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select time...</option>
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Customer info */}
          <div className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-glow" style={{ animationDelay: "200ms" }}>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cherry-light">
                <User size={14} className="text-cherry" />
              </div>
              Your Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-border bg-cream px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
              <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border border-border bg-cream px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>

          <button onClick={handleBook}
            className="animate-fade-up w-full gradient-cherry rounded-xl py-4 text-sm font-bold text-primary-foreground shadow-glow-lg transition-all active:scale-[0.97]"
            style={{ animationDelay: "300ms" }}>
            Confirm Booking ✨
          </button>
        </div>
      </div>
    </div>
  );
}
