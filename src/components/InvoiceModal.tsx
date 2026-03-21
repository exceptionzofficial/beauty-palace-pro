import { useRef } from "react";
import { CartItem, InvoiceData } from "@/data/services";
import { saveInvoice, generateWhatsAppLink } from "@/lib/store";
import { X, Printer, Download, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpg";

interface Props {
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  subtotal: number;
  discountType: "percent" | "amount";
  discountValue: number;
  discountAmount: number;
  gstEnabled: boolean;
  gstAmount: number;
  grandTotal: number;
  onClose: () => void;
  onDone: () => void;
}

export default function InvoiceModal(props: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const invoice: InvoiceData = {
    id: `INV-${Date.now().toString(36).toUpperCase()}`,
    customerName: props.customerName,
    customerPhone: props.customerPhone,
    items: props.items,
    subtotal: props.subtotal,
    discountType: props.discountType,
    discountValue: props.discountValue,
    discountAmount: props.discountAmount,
    gstEnabled: props.gstEnabled,
    gstAmount: props.gstAmount,
    grandTotal: props.grandTotal,
    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
  };

  const handleSaveAndAction = (action: "print" | "whatsapp") => {
    saveInvoice(invoice);
    if (action === "print") {
      const content = printRef.current;
      if (!content) return;
      const win = window.open("", "_blank");
      if (!win) return;
      win.document.write(`<html><head><title>Invoice ${invoice.id}</title>
        <style>body{font-family:Inter,sans-serif;margin:0;padding:24px;color:#1a1a1a}
        table{width:100%;border-collapse:collapse}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e5e5e5}
        th{font-size:12px;text-transform:uppercase;color:#888;font-weight:600}
        .text-right{text-align:right}.font-bold{font-weight:700}
        .header{display:flex;align-items:center;gap:16px;margin-bottom:24px}
        .logo{width:60px;height:60px;border-radius:50%;object-fit:cover}
        .totals{margin-top:16px;text-align:right}
        .totals div{margin:4px 0;font-size:14px}
        .grand{font-size:18px;font-weight:700;color:#b8860b}
        .footer{margin-top:32px;text-align:center;font-size:12px;color:#999}
        </style></head><body>${content.innerHTML}</body></html>`);
      win.document.close();
      win.print();
    } else {
      window.open(generateWhatsAppLink(props.customerPhone, invoice), "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-xl">
        <button onClick={props.onClose} className="no-print absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <div ref={printRef} className="print-area">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <img src={logo} alt="Beauty Palace" className="h-14 w-14 rounded-full object-cover" />
            <div>
              <h2 className="font-display text-xl font-bold">Beauty Palace</h2>
              <p className="text-xs text-muted-foreground">Invoice #{invoice.id}</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Customer:</span> {invoice.customerName}</div>
            <div><span className="text-muted-foreground">Phone:</span> {invoice.customerPhone}</div>
            <div><span className="text-muted-foreground">Date:</span> {invoice.date}</div>
          </div>

          {/* Table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="pb-2 text-left font-semibold">Service</th>
                <th className="pb-2 text-center font-semibold">Qty</th>
                <th className="pb-2 text-right font-semibold">Price</th>
                <th className="pb-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-2">{item.service_name}</td>
                  <td className="py-2 text-center tabular-nums">{item.quantity}</td>
                  <td className="py-2 text-right tabular-nums">₹{item.editedPrice.toLocaleString("en-IN")}</td>
                  <td className="py-2 text-right tabular-nums font-medium">₹{(item.editedPrice * item.quantity).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 space-y-1 text-right text-sm">
            <div>Subtotal: <span className="tabular-nums font-medium">₹{invoice.subtotal.toLocaleString("en-IN")}</span></div>
            {invoice.discountAmount > 0 && (
              <div className="text-green-700">Discount: <span className="tabular-nums">-₹{invoice.discountAmount.toLocaleString("en-IN")}</span></div>
            )}
            {invoice.gstEnabled && (
              <div>GST (18%): <span className="tabular-nums">₹{invoice.gstAmount.toLocaleString("en-IN")}</span></div>
            )}
            <div className="border-t border-border pt-2 text-lg font-bold text-primary">
              Grand Total: ₹{invoice.grandTotal.toLocaleString("en-IN")}
            </div>
            {invoice.discountAmount > 0 && (
              <div className="text-xs text-green-700">You saved ₹{invoice.discountAmount.toLocaleString("en-IN")}!</div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Thank you for visiting Beauty Palace ✨</p>
            <p>www.exceptionz.in</p>
          </div>
        </div>

        {/* Actions */}
        <div className="no-print mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleSaveAndAction("print")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-transform active:scale-[0.97]"
          >
            <Printer size={16} /> Print / PDF
          </button>
          <button
            onClick={() => handleSaveAndAction("whatsapp")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-transform active:scale-[0.97]"
          >
            <MessageCircle size={16} /> Send via WhatsApp
          </button>
        </div>
        <button
          onClick={() => { saveInvoice(invoice); props.onDone(); }}
          className="no-print mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
        >
          Save & New Bill
        </button>
      </div>
    </div>
  );
}
