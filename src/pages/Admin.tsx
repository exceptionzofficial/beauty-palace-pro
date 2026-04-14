import { useState, useMemo } from "react";
import { services as defaultServices, categories as defaultCategories, Service } from "@/data/services";
import { verifyAdmin, getBookings, getInvoices, getCustomServices, saveCustomServices, getCustomCategories, saveCustomCategories, generateWhatsAppLink } from "@/lib/store";
import { printInvoiceFromData } from "@/components/InvoiceModal";
import { Lock, Plus, Trash2, Edit2, Save, FileText, Calendar, Shield, Upload, MessageCircle, Printer, Eye, X, Tag, CheckSquare } from "lucide-react";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [tab, setTab] = useState<"services" | "invoices" | "bookings">("services");

  if (!authed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <div className="w-full max-w-xs animate-fade-up rounded-2xl border border-border bg-card p-8 shadow-glow-lg">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full gradient-cherry">
            <Shield size={22} className="text-primary-foreground" />
          </div>
          <h2 className="mb-2 text-center font-display text-2xl font-bold">Admin Access</h2>
          <p className="mb-5 text-center text-xs text-muted-foreground">Enter PIN to continue</p>
          <input
            type="password"
            placeholder="• • • •"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && verifyAdmin(pin) && setAuthed(true)}
            className="mb-3 w-full rounded-xl border border-border bg-cream px-4 py-3 text-center text-lg tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={() => verifyAdmin(pin) ? setAuthed(true) : alert("Incorrect PIN")}
            className="w-full gradient-cherry rounded-xl py-3 text-sm font-bold text-primary-foreground shadow-glow transition-all active:scale-[0.97]"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Manage services, invoices & bookings</p>
          </div>
          <button onClick={() => setAuthed(false)} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive">
            Logout
          </button>
        </div>

        <div className="mb-5 flex gap-1 rounded-xl bg-card border border-border p-1 shadow-sm">
          {(["services", "invoices", "bookings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold capitalize transition-all ${
                tab === t ? "gradient-cherry text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
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
  const [customCats, setCustomCats] = useState<string[]>(getCustomCategories());
  const allCategories = useMemo(() => [...defaultCategories, ...customCats], [customCats]);
  const allServices = useMemo(() => [...defaultServices.filter(s => !hiddenDefaults.includes(s.id)), ...customServices], [customServices, hiddenDefaults]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Service>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newService, setNewService] = useState<Partial<Service>>({ category: allCategories[0], price: 0, duration: 30 });
  const [filterCat, setFilterCat] = useState("All");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const displayed = filterCat === "All" ? allServices : allServices.filter((s) => s.category === filterCat);

  const handleAdd = () => {
    if (!newService.service_name?.trim()) return;
    const svc: Service = {
      id: `custom-${Date.now()}`,
      category: newService.category || allCategories[0],
      service_name: newService.service_name || "",
      description: newService.description || "",
      price: newService.price || 0,
      duration: newService.duration || 30,
    };
    const updated = [...customServices, svc];
    setCustomServices(updated);
    saveCustomServices(updated);
    setShowAdd(false);
    setNewService({ category: allCategories[0], price: 0, duration: 30 });
  };

  const handleAddCategory = () => {
    const name = newCatName.trim();
    if (!name || allCategories.includes(name)) return;
    const updated = [...customCats, name];
    setCustomCats(updated);
    saveCustomCategories(updated);
    setNewCatName("");
    setShowAddCat(false);
  };

  const handleSaveEdit = (id: string) => {
    const isDefault = defaultServices.find((s) => s.id === id);
    if (isDefault) {
      // Save default service edits as a custom override
      const override: Service = { ...isDefault, ...editData, id: `edit-${id}` };
      // Remove old override if exists
      const filtered = customServices.filter((s) => s.id !== `edit-${id}`);
      const updated = [...filtered, override];
      setCustomServices(updated);
      saveCustomServices(updated);
    } else {
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

  const [hiddenDefaults, setHiddenDefaults] = useState<string[]>(() => JSON.parse(localStorage.getItem("bp_hidden_defaults") || "[]"));

  const handleDeleteAny = (id: string) => {
    if (!confirm("Delete this product?")) return;
    const isCustom = customServices.find((s) => s.id === id);
    if (isCustom) {
      handleDelete(id);
    } else {
      const updated = [...hiddenDefaults, id];
      setHiddenDefaults(updated);
      localStorage.setItem("bp_hidden_defaults", JSON.stringify(updated));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected services?`)) return;
    const updated = customServices.filter((s) => !selectedIds.has(s.id));
    setCustomServices(updated);
    saveCustomServices(updated);
    setSelectedIds(new Set());
    setBulkMode(false);
  };

  const handleClearAll = () => {
    if (!confirm("Delete ALL custom services? This cannot be undone.")) return;
    setCustomServices([]);
    saveCustomServices([]);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllCustom = () => {
    const customIds = displayed.filter((s) => !!customServices.find((cs) => cs.id === s.id)).map((s) => s.id);
    setSelectedIds(new Set(customIds));
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
      {/* Action bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm">
          <option value="All">All ({allServices.length})</option>
          {allCategories.map((c) => <option key={c} value={c}>{c} ({allServices.filter((s) => s.category === c).length})</option>)}
        </select>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 gradient-cherry rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
          <Plus size={14} /> Add Service
        </button>
        <button onClick={() => setShowAddCat(!showAddCat)} className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm">
          <Tag size={14} /> Add Category
        </button>
        <button onClick={handleBulkUpload} className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm">
          <Upload size={14} /> Bulk Upload
        </button>
        <button onClick={() => setBulkMode(!bulkMode)} className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium shadow-sm ${bulkMode ? "border-cherry bg-cherry-light text-cherry" : "border-border bg-card"}`}>
          <CheckSquare size={14} /> Bulk Select
        </button>
      </div>

      {/* Bulk actions */}
      {bulkMode && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-cherry/30 bg-cherry-light p-3 animate-fade-up">
          <span className="text-sm font-medium text-cherry">{selectedIds.size} selected</span>
          <button onClick={selectAllCustom} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium">Select All Custom</button>
          <button onClick={handleBulkDelete} disabled={selectedIds.size === 0} className="flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-xs font-semibold text-destructive-foreground disabled:opacity-40">
            <Trash2 size={12} /> Delete Selected
          </button>
          <button onClick={handleClearAll} className="flex items-center gap-1 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive">
            <Trash2 size={12} /> Clear All Custom
          </button>
        </div>
      )}

      {/* Add category */}
      {showAddCat && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card p-4 shadow-glow animate-fade-up">
          <Tag size={16} className="text-cherry" />
          <input placeholder="New Category Name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-cream px-3 py-2 text-sm" />
          <button onClick={handleAddCategory} className="gradient-cherry rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Add</button>
        </div>
      )}

      {/* Add service */}
      {showAdd && (
        <div className="mb-4 rounded-2xl border border-border bg-card p-5 shadow-glow animate-fade-up">
          <h3 className="mb-3 font-display text-base font-semibold">New Service</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <input placeholder="Service Name" value={newService.service_name || ""} onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
              className="rounded-lg border border-border bg-cream px-3 py-2.5 text-sm" />
            <select value={newService.category} onChange={(e) => setNewService({ ...newService, category: e.target.value })}
              className="rounded-lg border border-border bg-cream px-3 py-2.5 text-sm">
              {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Price (₹)" value={newService.price || ""} onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
              className="rounded-lg border border-border bg-cream px-3 py-2.5 text-sm" />
            <input type="number" placeholder="Duration (min)" value={newService.duration || ""} onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
              className="rounded-lg border border-border bg-cream px-3 py-2.5 text-sm" />
            <input placeholder="Description" value={newService.description || ""} onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              className="col-span-2 rounded-lg border border-border bg-cream px-3 py-2.5 text-sm sm:col-span-1" />
          </div>
          <button onClick={handleAdd} className="mt-3 gradient-cherry rounded-lg px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Save Service</button>
        </div>
      )}

      {/* Service list */}
      <div className="space-y-1.5">
        {displayed.map((s) => {
          const isCustom = !!customServices.find((cs) => cs.id === s.id);
          return (
            <div key={s.id} className="flex items-center gap-2 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-shadow hover:shadow-glow">
              {bulkMode && isCustom && (
                <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => toggleSelect(s.id)} className="h-4 w-4 accent-primary shrink-0" />
              )}
              {editId === s.id ? (
                <div className="flex flex-1 flex-wrap gap-2">
                  <input value={editData.service_name ?? s.service_name} onChange={(e) => setEditData({ ...editData, service_name: e.target.value })}
                    className="flex-1 rounded-lg border border-border bg-cream px-3 py-1.5 text-sm" placeholder="Name" />
                  <input type="number" value={editData.price ?? s.price} onChange={(e) => setEditData({ ...editData, price: Number(e.target.value) })}
                    className="w-24 rounded-lg border border-border bg-cream px-3 py-1.5 text-sm" placeholder="Price" />
                  <input type="number" value={editData.duration ?? s.duration} onChange={(e) => setEditData({ ...editData, duration: Number(e.target.value) })}
                    className="w-20 rounded-lg border border-border bg-cream px-3 py-1.5 text-sm" placeholder="Min" />
                  <select value={editData.category ?? s.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="rounded-lg border border-border bg-cream px-3 py-1.5 text-sm">
                    {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={() => handleSaveEdit(s.id)} className="rounded-lg bg-green-100 p-2 text-green-700 hover:bg-green-200"><Save size={14} /></button>
                  <button onClick={() => setEditId(null)} className="rounded-lg bg-accent p-2 text-muted-foreground hover:text-foreground"><X size={14} /></button>
                </div>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{s.service_name}</p>
                    <p className="text-xs text-muted-foreground">{s.category} · {s.duration} min</p>
                  </div>
                  <span className="rounded-lg bg-cherry-light px-2.5 py-1 text-sm font-bold tabular-nums text-cherry">₹{s.price.toLocaleString("en-IN")}</span>
                  <button onClick={() => { setEditId(s.id); setEditData({}); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent"><Edit2 size={14} /></button>
                  <button onClick={() => handleDeleteAny(s.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 size={14} /></button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InvoicesTab() {
  const invoices = getInvoices().reverse();
  const [viewInv, setViewInv] = useState<any>(null);

  return (
    <div>
      {invoices.length === 0 ? (
        <div className="py-16 text-center">
          <FileText size={36} className="mx-auto text-border" />
          <p className="mt-3 text-sm text-muted-foreground">No invoices yet — create one in Billing</p>
        </div>
      ) : (
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cherry-light">
                    <FileText size={14} className="text-cherry" />
                  </div>
                  <div>
                    <span className="text-sm font-bold">{inv.id}</span>
                    <p className="text-xs text-muted-foreground">{inv.customerName} · {inv.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold tabular-nums text-cherry">₹{inv.grandTotal.toLocaleString("en-IN")}</span>
                  <p className="text-xs text-muted-foreground">{inv.items.length} services</p>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button onClick={() => setViewInv(viewInv?.id === inv.id ? null : inv)}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                  <Eye size={12} /> {viewInv?.id === inv.id ? "Hide" : "View"}
                </button>
                <button onClick={() => printInvoiceFromData(inv, "thermal")}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                  <Printer size={12} /> Thermal Print
                </button>
                <button onClick={() => printInvoiceFromData(inv, "a4")}
                  className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:bg-accent">
                  <Printer size={12} /> A4 Print
                </button>
                <button
                  onClick={() => window.open(generateWhatsAppLink(inv.customerPhone, inv), "_blank")}
                  className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-200"
                >
                  <MessageCircle size={12} /> WhatsApp
                </button>
              </div>

              {/* Inline invoice details */}
              {viewInv?.id === inv.id && (
                <div className="mt-3 rounded-lg border border-border bg-cream p-3 animate-fade-up">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-1.5 text-left font-semibold">Service</th>
                        <th className="py-1.5 text-center font-semibold">Qty</th>
                        <th className="py-1.5 text-right font-semibold">Price</th>
                        <th className="py-1.5 text-right font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inv.items.map((item) => (
                        <tr key={item.id} className="border-b border-border/50">
                          <td className="py-1.5">{item.service_name}</td>
                          <td className="py-1.5 text-center">{item.quantity}</td>
                          <td className="py-1.5 text-right">₹{item.editedPrice.toLocaleString("en-IN")}</td>
                          <td className="py-1.5 text-right font-semibold">₹{(item.editedPrice * item.quantity).toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-2 space-y-0.5 text-right text-xs">
                    <div><span className="text-muted-foreground">Subtotal:</span> ₹{inv.subtotal.toLocaleString("en-IN")}</div>
                    {inv.discountAmount > 0 && <div className="text-green-700">Discount: -₹{inv.discountAmount.toLocaleString("en-IN")}</div>}
                    {inv.gstEnabled && <div><span className="text-muted-foreground">GST:</span> ₹{inv.gstAmount.toLocaleString("en-IN")}</div>}
                    <div className="text-sm font-bold text-cherry">Total: ₹{inv.grandTotal.toLocaleString("en-IN")}</div>
                  </div>
                </div>
              )}
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
        <div className="py-16 text-center">
          <Calendar size={36} className="mx-auto text-border" />
          <p className="mt-3 text-sm text-muted-foreground">No bookings yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-glow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cherry-light">
                    <Calendar size={14} className="text-cherry" />
                  </div>
                  <div>
                    <span className="text-sm font-bold">{b.customerName}</span>
                    <p className="text-xs text-muted-foreground">{b.serviceName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{b.date}</p>
                  <p className="text-xs text-muted-foreground">{b.time} · {b.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
