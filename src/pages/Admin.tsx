import { useState, useMemo } from "react";
import { services as defaultServices, categories, Service } from "@/data/services";
import { verifyAdmin, getBookings, getInvoices, getCustomServices, saveCustomServices } from "@/lib/store";
import { Lock, Plus, Trash2, Edit2, Save, FileText, Calendar } from "lucide-react";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [tab, setTab] = useState<"services" | "invoices" | "bookings">("services");

  if (!authed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-xs animate-fade-in rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-center">
            <Lock size={24} className="text-primary" />
          </div>
          <h2 className="mb-4 text-center font-display text-lg font-semibold">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter PIN (1234)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verifyAdmin(pin) && setAuthed(true)}
            className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-center tracking-[0.3em]"
          />
          <button
            onClick={() => verifyAdmin(pin) ? setAuthed(true) : alert("Wrong PIN")}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container py-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-semibold">Admin Panel</h1>
          <button onClick={() => setAuthed(false)} className="text-sm text-muted-foreground hover:text-destructive">Logout</button>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-1 rounded-lg bg-muted p-1">
          {(["services", "invoices", "bookings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-card shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "services" && <ServicesTab />}
        {tab === "invoices" && <InvoicesTab />}
        {tab === "bookings" && <BookingsTab />}
      </div>
    </div>
  );
}

function ServicesTab() {
  const [customServices, setCustomServices] = useState<Service[]>(getCustomServices());
  const allServices = useMemo(() => [...defaultServices, ...customServices], [customServices]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Service>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({ category: categories[0], price: 0, duration: 30 });
  const [filterCat, setFilterCat] = useState("All");

  const displayed = filterCat === "All" ? allServices : allServices.filter((s) => s.category === filterCat);

  const handleAdd = () => {
    if (!newService.service_name?.trim()) return;
    const svc: Service = {
      id: `custom-${Date.now()}`,
      category: newService.category || categories[0],
      service_name: newService.service_name || "",
      description: newService.description || "",
      price: newService.price || 0,
      duration: newService.duration || 30,
    };
    const updated = [...customServices, svc];
    setCustomServices(updated);
    saveCustomServices(updated);
    setShowAdd(false);
    setNewService({ category: categories[0], price: 0, duration: 30 });
  };

  const handleSaveEdit = (id: string) => {
    // Check if it's a default service (can't edit those in this demo, but let's allow via custom override)
    const isCustom = customServices.find((s) => s.id === id);
    if (isCustom) {
      const updated = customServices.map((s) => (s.id === id ? { ...s, ...editData } : s));
      setCustomServices(updated);
      saveCustomServices(updated);
    }
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    const updated = customServices.filter((s) => s.id !== id);
    setCustomServices(updated);
    saveCustomServices(updated);
  };

  const handleBulkUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (Array.isArray(data)) {
            const newServices = data.map((s: any, i: number) => ({
              id: `bulk-${Date.now()}-${i}`,
              category: s.category || "Uncategorized",
              service_name: s.service_name || s.name || "",
              description: s.description || "",
              price: Number(s.price) || 0,
              duration: Number(s.duration) || 30,
            }));
            const updated = [...customServices, ...newServices];
            setCustomServices(updated);
            saveCustomServices(updated);
            alert(`${newServices.length} services imported!`);
          }
        } catch { alert("Invalid JSON file"); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <option value="All">All ({allServices.length})</option>
          {categories.map((c) => <option key={c} value={c}>{c} ({allServices.filter((s) => s.category === c).length})</option>)}
        </select>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
          <Plus size={14} /> Add Service
        </button>
        <button onClick={handleBulkUpload} className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium">
          Bulk Upload JSON
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 rounded-xl border border-border bg-card p-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <input placeholder="Service Name" value={newService.service_name || ""} onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
              className="rounded border border-border bg-background px-3 py-2 text-sm" />
            <select value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })}
              className="rounded border border-border bg-background px-3 py-2 text-sm">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Price" value={newService.price || ""} onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
              className="rounded border border-border bg-background px-3 py-2 text-sm" />
            <input type="number" placeholder="Duration (min)" value={newService.duration || ""} onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
              className="rounded border border-border bg-background px-3 py-2 text-sm" />
            <input placeholder="Description" value={newService.description || ""} onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="col-span-2 rounded border border-border bg-background px-3 py-2 text-sm sm:col-span-1" />
          </div>
          <button onClick={handleAdd} className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Save</button>
        </div>
      )}

      <div className="space-y-1">
        {displayed.map((s) => (
          <div key={s.id} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
            {editId === s.id ? (
              <div className="flex flex-1 flex-wrap gap-2">
                <input value={editData.service_name ?? s.service_name} onChange={(e) => setEditData({ ...editData, service_name: e.target.value })}
                  className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm" />
                <input type="number" value={editData.price ?? s.price} onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                  className="w-24 rounded border border-border bg-background px-2 py-1 text-sm" />
                <button onClick={() => handleSaveEdit(s.id)} className="text-green-600"><Save size={16} /></button>
              </div>
            ) : (
              <>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.service_name}</p>
                  <p className="text-xs text-muted-foreground">{s.category}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-primary">₹{s.price.toLocaleString("en-IN")}</span>
                {customServices.find((cs) => cs.id === s.id) && (
                  <>
                    <button onClick={() => { setEditId(s.id); setEditData({}); }} className="text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoicesTab() {
  const invoices = getInvoices().reverse();
  return (
    <div>
      {invoices.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No invoices yet</p>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-primary" />
                  <span className="text-sm font-medium">{inv.id}</span>
                </div>
                <span className="text-sm font-bold tabular-nums text-primary">₹{inv.grandTotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{inv.customerName} · {inv.customerPhone} · {inv.date}</p>
              <p className="text-xs text-muted-foreground">{inv.items.length} services</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BookingsTab() {
  const bookings = getBookings().reverse();
  return (
    <div>
      {bookings.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No bookings yet</p>
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{b.customerName}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={12} /> {b.date} · {b.time}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{b.serviceName} · {b.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
