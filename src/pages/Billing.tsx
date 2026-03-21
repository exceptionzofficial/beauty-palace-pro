import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { services, categories, CartItem, Service } from "@/data/services";
import { getCustomServices } from "@/lib/store";
import { Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
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
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i))
    );
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
    <div className="min-h-screen">
      <div className="container py-4">
        <h1 className="mb-4 font-display text-2xl font-semibold">Billing</h1>

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* LEFT: Services */}
          <div className="flex-1 space-y-3">
            {/* Filters */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Service list */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {filtered.slice(0, 50).map((s) => (
                <button
                  key={s.id}
                  onClick={() => addToCart(s)}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md active:scale-[0.98]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.service_name}</p>
                    <p className="text-xs text-muted-foreground">{s.category} · {s.duration} min</p>
                  </div>
                  <div className="ml-2 flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">₹{s.price.toLocaleString("en-IN")}</span>
                    <Plus size={16} className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">No services found</p>
              )}
              {filtered.length > 50 && (
                <p className="col-span-2 text-center text-xs text-muted-foreground">Showing first 50 results. Refine your search.</p>
              )}
            </div>
          </div>

          {/* RIGHT: Cart */}
          <div className="w-full shrink-0 lg:w-[380px]">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <ShoppingCart size={18} className="text-primary" />
                <h2 className="font-display text-lg font-semibold">Cart ({cart.length})</h2>
              </div>

              {/* Customer info */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <input
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  placeholder="Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {cart.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Click a service to add</p>
              ) : (
                <div className="max-h-[40vh] space-y-2 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="rounded-lg border border-border bg-background p-3">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium leading-tight">{item.service_name}</p>
                        <button onClick={() => remove(item.id)} className="ml-2 text-destructive/60 hover:text-destructive">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(item.id, -1)} className="rounded bg-muted p-1 active:scale-95"><Minus size={12} /></button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="rounded bg-muted p-1 active:scale-95"><Plus size={12} /></button>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">₹</span>
                          <input
                            type="number"
                            value={item.editedPrice}
                            onChange={(e) => updatePrice(item.id, Number(e.target.value))}
                            className="w-20 rounded border border-border bg-card px-2 py-1 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>
                        <span className="ml-auto text-sm font-semibold tabular-nums">₹{(item.editedPrice * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-4 space-y-3 border-t border-border pt-3">
                  {/* Discount */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Discount</label>
                    <select
                      value={discountType}
                      onChange={(e) => setDiscountType(e.target.value as "percent" | "amount")}
                      className="rounded border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value="percent">%</option>
                      <option value="amount">₹</option>
                    </select>
                    <input
                      type="number"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                      className="w-20 rounded border border-border bg-background px-2 py-1 text-sm tabular-nums focus:outline-none"
                    />
                  </div>

                  {/* GST Toggle */}
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={gstEnabled} onChange={(e) => setGstEnabled(e.target.checked)} className="accent-primary" />
                    Apply GST (18%)
                  </label>

                  {/* Totals */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="tabular-nums">₹{subtotal.toLocaleString("en-IN")}</span></div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-700"><span>Discount</span><span className="tabular-nums">-₹{Math.round(discountAmount).toLocaleString("en-IN")}</span></div>
                    )}
                    {gstEnabled && (
                      <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="tabular-nums">₹{Math.round(gstAmount).toLocaleString("en-IN")}</span></div>
                    )}
                    <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                      <span>Grand Total</span>
                      <span className="tabular-nums text-primary">₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowInvoice(true)}
                    disabled={!customerName.trim() || !customerPhone.trim()}
                    className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97] disabled:opacity-50"
                  >
                    Generate Invoice
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
