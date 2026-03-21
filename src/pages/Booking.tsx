import { useState } from "react";
import { services, categories, Booking } from "@/data/services";
import { saveBooking } from "@/lib/store";
import { CalendarDays, Clock, Check } from "lucide-react";
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-fade-in text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="text-green-600" size={28} />
          </div>
          <h2 className="font-display text-2xl font-semibold">Booking Confirmed!</h2>
          <p className="mt-2 text-sm text-muted-foreground">We'll see you soon at Beauty Palace</p>
          <button onClick={() => { setDone(false); setSelectedService(""); setDate(""); setTime(""); setName(""); setPhone(""); }}
            className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Book Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-2xl py-6">
        <h1 className="mb-6 font-display text-2xl font-semibold">Book Appointment</h1>

        <div className="space-y-4">
          {/* Service selection */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Scissors size={16} className="text-primary" /> Select Service
            </h3>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="All">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="">Choose a service...</option>
              {filtered.map((s) => (
                <option key={s.id} value={s.id}>{s.service_name} - ₹{s.price.toLocaleString("en-IN")} ({s.duration} min)</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <CalendarDays size={16} className="text-primary" /> Date & Time
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <select value={time} onChange={(e) => setTime(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="">Select time...</option>
                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Customer info */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Clock size={16} className="text-primary" /> Your Details
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </div>
          </div>

          <button onClick={handleBook}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]">
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

function Scissors(props: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>
    </svg>
  );
}
