import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { services, categories as defaultCategories, CartItem, Service } from "@/data/services";
import { getCustomServices, getCustomCategories } from "@/lib/store";
import { Search, Plus, Minus, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import InvoiceModal from "@/components/InvoiceModal";

export default function Billing() {
  const [params] = useSearchParams();
  const initialCat = params.get("category") || "All";
  const [category, setCategory] = useState(initialCat);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [discountValue, setDiscountValue] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);

  const allServices = useMemo(() => {
    const custom = getCustomServices();
    return [...services, ...custom];
  }, []);

  const filtered = useMemo(() => {
    let list = allServices;
    if (category !== "All") list = list.filter((s) => s.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.service_name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    return list;
  }, [category, search, allServices]);

  const addToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === service.id);
      if (existing) return prev.map((i) => (i.id === service.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...service, quantity: 1, editedPrice: service.price }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)));
  };

  const updatePrice = (id: string, price: number) => {
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, editedPrice: price } : i)));
  };

  const remove = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.editedPrice * i.quantity, 0);
  const discountAmount = discountType === "percent" ? (subtotal * discountValue) / 100 : discountValue;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const gstAmount = gstEnabled ? afterDiscount * 0.18 : 0;
  const grandTotal = afterDiscount + gstAmount;

  return (
    <div className="min-h-screen bg-cream">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cherry-light">
            <Sparkles size={18} className="text-cherry" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Billing Station</h1>
            <p className="text-xs text-muted-foreground">Create invoices & manage bills</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:flex-row">
          {/* LEFT: Services */}
          <div className="flex-1 space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCategory("All")}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${category === "All" ? "gradient-cherry text-primary-foreground shadow-glow" : "bg-card border border-border text-foreground/60 hover:text-foreground"}`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${category === c ? "gradient-cherry text-primary-foreground shadow-glow" : "bg-card border border-border text-foreground/60 hover:text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Service list */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {filtered.slice(0, 60).map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => addToCart(s)}
                  className="animate-fade-up group flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{s.service_name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.category} · {s.duration} min</p>
                  </div>
                  <div className="ml-3 flex items-center gap-2 shrink-0">
                    <span className="rounded-lg bg-cherry-light px-2.5 py-1 text-sm font-bold text-cherry tabular-nums">
                      ₹{s.price.toLocaleString("en-IN")}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent opacity-0 transition-all group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Plus size={14} />
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-2 py-12 text-center text-sm text-muted-foreground">No services found</p>
              )}
              {filtered.length > 60 && (
                <p className="col-span-2 text-center text-xs text-muted-foreground">Showing first 60 — refine your search</p>
              )}
            </div>
          </div>

          {/* RIGHT: Cart */}
          <div className="w-full shrink-0 lg:w-[400px]">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-5 shadow-glow-lg">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-cherry">
                  <ShoppingCart size={16} className="text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold">Cart</h2>
                  <p className="text-xs text-muted-foreground">{cart.length} items</p>
                </div>
              </div>

              {/* Customer info */}
              <div className="mb-4 grid grid-cols-2 gap-2">
                <input
                  placeholder="Customer Name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-lg border border-border bg-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  placeholder="Phone Number *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="rounded-lg border border-border bg-cream px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {cart.length === 0 ? (
                <div className="py-10 text-center">
                  <ShoppingCart size={32} className="mx-auto text-border" />
                  <p className="mt-2 text-sm text-muted-foreground">Click a service to add</p>
                </div>
              ) : (
                <div className="max-h-[35vh] space-y-2 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="rounded-xl border border-border bg-cream p-3">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-semibold leading-tight pr-2">{item.service_name}</p>
                        <button onClick={() => remove(item.id)} className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card">
                          <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1.5 text-muted-foreground hover:text-foreground active:scale-95"><Minus size={12} /></button>
                          <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1.5 text-muted-foreground hover:text-foreground active:scale-95"><Plus size={12} /></button>
                        </div>
                        <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card px-1">
                          <span className="text-xs text-muted-foreground pl-1">₹</span>
                          <input
                            type="number"
                            value={item.editedPrice}
                            onChange={(e) => updatePrice(item.id, Number(e.target.value))}
                            className="w-16 bg-transparent py-1.5 text-sm font-semibold tabular-nums focus:outline-none"
                          />
                        </div>
                        <span className="ml-auto text-sm font-bold tabular-nums text-cherry">₹{(item.editedPrice * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  {/* Discount */}
                  <div className="flex items-center gap-2 rounded-lg bg-cream p-2.5">
                    <label className="text-xs font-medium text-muted-foreground whitespace-nowrap">Discount</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "percent" | "amount")}
                      className="rounded-md border border-border bg-card px-2 py-1 text-xs font-medium"
                    >
                      <option value="percent">%</option>
                      <option value="amount">₹</option>
                    </select>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-20 rounded-md border border-border bg-card px-2 py-1 text-sm font-semibold tabular-nums focus:outline-none"
                    />
                  </div>

                  {/* GST */}
                  <label className="flex items-center gap-2.5 rounded-lg bg-cream p-2.5 cursor-pointer">
                    <input type="checkbox" checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} className="h-4 w-4 rounded accent-primary" />
                    <span className="text-xs font-medium">Apply GST (18%)</span>
                  </label>

                  {/* Totals */}
                  <div className="space-y-1.5 rounded-xl bg-cream p-3">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold tabular-nums">₹{subtotal.toLocaleString("en-IN")}</span></div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-700"><span>Discount</span><span className="font-semibold tabular-nums">-₹{Math.round(discountAmount).toLocaleString("en-IN")}</span></div>
                    )}
                    {gstEnabled && (
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">GST (18%)</span><span className="font-semibold tabular-nums">₹{Math.round(gstAmount).toLocaleString("en-IN")}</span></div>
                    )}
                    <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                      <span className="font-display">Grand Total</span>
                      <span className="tabular-nums text-cherry">₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowInvoice(true)}
                    disabled={!customerName.trim() || !customerPhone.trim()}
                    className="w-full gradient-cherry rounded-xl py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all active:scale-[0.97] disabled:opacity-50 disabled:shadow-none"
                  >
                    Generate Invoice ✨
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showInvoice && (
        <InvoiceModal
          customerName={customerName}
          customerPhone={customerPhone}
          items={cart}
          subtotal={subtotal}
          discountType={discountType}
          discountValue={discountValue}
          discountAmount={Math.round(discountAmount)}
          gstEnabled={gstEnabled}
          gstAmount={Math.round(gstAmount)}
          grandTotal={Math.round(grandTotal)}
          onClose={() => setShowInvoice(false)}
          onDone={() => {
            setCart([]);
            setCustomerName("");
            setCustomerPhone("");
            setDiscountValue(0);
            setGstEnabled(false);
            setShowInvoice(false);
          }}
        />
      )}
    </div>
  );
}
