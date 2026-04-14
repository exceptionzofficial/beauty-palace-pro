import { useRef } from "react";
import { CartItem, InvoiceData } from "@/data/services";
import { saveInvoice, generateWhatsAppLink } from "@/lib/store";
import { X, Printer, Download, MessageCircle, Check } from "lucide-react";
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

const thermalPrintCSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Arial',sans-serif;color:#000;background:#fff;width:72mm;margin:0 auto;padding:2mm 1mm 4mm 1mm;font-size:10px;line-height:1.3}
.invoice-box{width:100%}
.header{text-align:center;padding-bottom:3mm;border-bottom:1px dashed #000}
.logo{width:18mm;height:18mm;border-radius:50%;object-fit:cover;display:block;margin:0 auto 2mm auto;border:1px solid #666}
.brand h1{font-size:14px;font-weight:700;margin:0;letter-spacing:0.5px}
.brand p{font-size:8px;letter-spacing:1.5px;text-transform:uppercase;margin:1mm 0 0 0;color:#444}
.meta{margin:2mm 0;font-size:9px;border-bottom:1px dashed #000;padding-bottom:2mm}
.meta div{margin:0.5mm 0}
.meta span{color:#666}
table{width:100%;border-collapse:collapse;margin:2mm 0;font-size:9px}
th{padding:1mm 0;text-align:left;font-size:8px;text-transform:uppercase;font-weight:700;border-bottom:1px solid #000;border-top:1px solid #000}
th:last-child,td:last-child{text-align:right}
th:nth-child(2),td:nth-child(2){text-align:center;width:8mm}
th:nth-child(3),td:nth-child(3){text-align:right;width:14mm}
td{padding:1mm 0;border-bottom:1px dotted #ccc;font-size:9px}
.text-right{text-align:right}
.totals{text-align:right;margin:2mm 0;font-size:9px;border-top:1px dashed #000;padding-top:2mm}
.totals div{margin:0.5mm 0}
.totals .label{color:#666}
.totals .grand{font-size:13px;font-weight:700;margin-top:1mm;padding-top:1.5mm;border-top:1px solid #000}
.savings{text-align:center;font-size:8px;font-weight:600;margin:1.5mm 0;padding:1mm;border:1px dashed #000}
.footer{text-align:center;padding-top:2mm;border-top:1px dashed #000;margin-top:2mm}
.footer p{font-size:8px;color:#666;margin:0.5mm 0}
.footer .thanks{font-size:10px;color:#000;font-weight:700}
@media print{@page{size:80mm auto;margin:0}body{width:72mm;padding:2mm 1mm 4mm 1mm}}
`;

const a4PrintCSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter','Arial',sans-serif;color:#1e1e1e;background:#fff;padding:24px}
.invoice-box{max-width:600px;margin:0 auto}
.header{text-align:center;padding-bottom:16px;border-bottom:2px solid #c73e5a}
.logo{width:64px;height:64px;border-radius:50%;object-fit:cover;display:block;margin:0 auto 8px auto;border:2px solid #f3d5d5}
.brand h1{font-size:22px;font-weight:700;color:#1e1e1e;font-family:'Cormorant Garamond',serif}
.brand p{font-size:10px;color:#c73e5a;letter-spacing:2px;text-transform:uppercase}
.meta{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:16px 0;font-size:12px}
.meta span{color:#888}
table{width:100%;border-collapse:collapse;margin:16px 0}
thead{background:linear-gradient(135deg,#c73e5a,#d4917a)}
th{padding:8px 10px;text-align:left;color:#fff;font-size:10px;text-transform:uppercase;letter-spacing:1px;font-weight:600}
td{padding:8px 10px;border-bottom:1px solid #f0e8e8;font-size:12px}
.text-right{text-align:right}
.totals{text-align:right;margin:12px 0;font-size:12px}
.totals div{margin:3px 0}
.totals .label{color:#888}
.totals .grand{font-size:18px;font-weight:700;color:#c73e5a;font-family:'Cormorant Garamond',serif;margin-top:6px;padding-top:6px;border-top:2px solid #c73e5a}
.savings{background:#f0fdf4;border-radius:6px;padding:6px 12px;text-align:center;color:#16a34a;font-size:11px;font-weight:600;margin:10px 0}
.footer{text-align:center;padding-top:16px;border-top:1px solid #f0e8e8;margin-top:16px}
.footer p{font-size:10px;color:#999;margin:3px 0}
.footer .thanks{font-family:'Cormorant Garamond',serif;font-size:14px;color:#c73e5a;font-weight:600}
@media print{body{padding:12px}button{display:none!important}}
`;

function buildInvoiceHTML(content: string) {
  return `<div class="invoice-box">${content}</div>`;
}

export function printInvoiceFromData(invoice: InvoiceData, mode: "thermal" | "a4" = "thermal") {
  const css = mode === "thermal" ? thermalPrintCSS : a4PrintCSS;
  const html = renderInvoiceHTML(invoice);
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoice.id}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${css}</style></head><body>${buildInvoiceHTML(html)}<script>window.onload=function(){window.print()}<\/script></body></html>`);
  win.document.close();
}

function renderInvoiceHTML(invoice: InvoiceData): string {
  const logoUrl = typeof window !== "undefined" ? new URL("/src/assets/logo.jpg", window.location.origin).href : "";
  let html = `<div class="header"><img src="${logoUrl}" alt="Beauty Palace" class="logo"/><div class="brand"><h1>Beauty Palace</h1><p>Premium Cosmetics & Salon</p></div></div>`;
  html += `<div class="meta"><div><span>Invoice:</span> <strong>${invoice.id}</strong></div><div><span>Date:</span> <strong>${invoice.date}</strong></div><div><span>Customer:</span> <strong>${invoice.customerName}</strong></div><div><span>Phone:</span> <strong>${invoice.customerPhone}</strong></div></div>`;
  html += `<table><thead><tr><th>Service</th><th>Qty</th><th>Price</th><th style="text-align:right">Total</th></tr></thead><tbody>`;
  invoice.items.forEach(item => {
    html += `<tr><td>${item.service_name}</td><td style="text-align:center">${item.quantity}</td><td style="text-align:right">₹${item.editedPrice.toLocaleString("en-IN")}</td><td style="text-align:right">₹${(item.editedPrice * item.quantity).toLocaleString("en-IN")}</td></tr>`;
  });
  html += `</tbody></table>`;
  html += `<div class="totals"><div><span class="label">Subtotal: </span><span>₹${invoice.subtotal.toLocaleString("en-IN")}</span></div>`;
  if (invoice.discountAmount > 0) html += `<div><span>Discount: </span><span>-₹${invoice.discountAmount.toLocaleString("en-IN")}</span></div>`;
  if (invoice.gstEnabled) html += `<div><span class="label">GST (18%): </span><span>₹${invoice.gstAmount.toLocaleString("en-IN")}</span></div>`;
  html += `<div class="grand">Total: ₹${invoice.grandTotal.toLocaleString("en-IN")}</div></div>`;
  if (invoice.discountAmount > 0) html += `<div class="savings">🎉 You saved ₹${invoice.discountAmount.toLocaleString("en-IN")}!</div>`;
  html += `<div class="footer"><p class="thanks">Thank you for visiting Beauty Palace ✨</p><p>www.exceptionz.in</p></div>`;
  return html;
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

  const handleThermalPrint = () => {
    saveInvoice(invoice);
    printInvoiceFromData(invoice, "thermal");
  };

  const handleA4Print = () => {
    saveInvoice(invoice);
    printInvoiceFromData(invoice, "a4");
  };

  const handleWhatsApp = () => {
    saveInvoice(invoice);
    window.open(generateWhatsAppLink(props.customerPhone, invoice), "_blank");
  };

  const handleDownloadPDF = () => {
    saveInvoice(invoice);
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoice.id} - Beauty Palace</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>${a4PrintCSS}</style></head><body>
<div class="invoice-box">${content.innerHTML}</div>
<p style="text-align:center;margin-top:24px;font-size:12px;color:#999">Use Ctrl+P / Cmd+P → Save as PDF to download</p>
</body></html>`);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-md">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-glow-lg animate-fade-up">
        <button onClick={props.onClose} className="no-print absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <X size={18} />
        </button>

        <div ref={printRef} className="print-area">
          {/* Invoice Header */}
          <div className="header flex flex-col items-center gap-3 border-b-2 border-primary pb-5">
            <img src={logo} alt="Beauty Palace" className="logo h-20 w-20 rounded-full object-cover ring-2 ring-rose-gold shadow-glow" />
            <div className="brand text-center">
              <h1 className="font-display text-2xl font-bold">Beauty Palace</h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cherry">Premium Cosmetics & Salon</p>
            </div>
          </div>

          {/* Invoice meta */}
          <div className="meta mt-5 grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Invoice:</span> <strong>{invoice.id}</strong></div>
            <div><span className="text-muted-foreground">Date:</span> <strong>{invoice.date}</strong></div>
            <div><span className="text-muted-foreground">Customer:</span> <strong>{invoice.customerName}</strong></div>
            <div><span className="text-muted-foreground">Phone:</span> <strong>{invoice.customerPhone}</strong></div>
          </div>

          {/* Table */}
          <table className="mt-5 w-full text-sm">
            <thead>
              <tr className="gradient-cherry">
                <th className="rounded-tl-lg py-2.5 pl-3 text-left text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Service</th>
                <th className="py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Qty</th>
                <th className="py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Price</th>
                <th className="rounded-tr-lg py-2.5 pr-3 text-right text-[10px] font-bold uppercase tracking-wider text-primary-foreground">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-2.5 pl-3 font-medium">{item.service_name}</td>
                  <td className="py-2.5 text-center tabular-nums">{item.quantity}</td>
                  <td className="py-2.5 text-right tabular-nums">₹{item.editedPrice.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 pr-3 text-right tabular-nums font-semibold">₹{(item.editedPrice * item.quantity).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals mt-4 space-y-1 text-right text-sm">
            <div><span className="label text-muted-foreground">Subtotal: </span><span className="font-semibold tabular-nums">₹{invoice.subtotal.toLocaleString("en-IN")}</span></div>
            {invoice.discountAmount > 0 && (
              <div className="text-green-700"><span>Discount: </span><span className="font-semibold tabular-nums">-₹{invoice.discountAmount.toLocaleString("en-IN")}</span></div>
            )}
            {invoice.gstEnabled && (
              <div><span className="label text-muted-foreground">GST (18%): </span><span className="font-semibold tabular-nums">₹{invoice.gstAmount.toLocaleString("en-IN")}</span></div>
            )}
            <div className="grand border-t-2 border-primary pt-2 text-xl font-bold text-cherry font-display">
              Grand Total: ₹{invoice.grandTotal.toLocaleString("en-IN")}
            </div>
          </div>

          {invoice.discountAmount > 0 && (
            <div className="savings mt-3 rounded-lg bg-green-50 px-4 py-2 text-center text-xs font-semibold text-green-700">
              🎉 You saved ₹{invoice.discountAmount.toLocaleString("en-IN")}!
            </div>
          )}

          {/* Footer */}
          <div className="footer mt-6 border-t border-border pt-5 text-center">
            <p className="thanks font-display text-base font-semibold text-cherry">Thank you for visiting Beauty Palace ✨</p>
            <p className="mt-1 text-[11px] text-muted-foreground">www.exceptionz.in</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="no-print mt-6 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleThermalPrint}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold transition-all hover:shadow-sm active:scale-[0.97]"
            >
              <Printer size={14} /> Thermal Print
            </button>
            <button
              onClick={handleA4Print}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold transition-all hover:shadow-sm active:scale-[0.97]"
            >
              <Printer size={14} /> A4 Print
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold transition-all hover:shadow-sm active:scale-[0.97]"
            >
              <Download size={14} /> PDF
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-green-600 py-2.5 text-xs font-semibold text-card transition-all hover:bg-green-700 active:scale-[0.97]"
            >
              <MessageCircle size={14} /> WhatsApp
            </button>
          </div>
          <button
            onClick={() => { saveInvoice(invoice); props.onDone(); }}
            className="flex w-full items-center justify-center gap-2 gradient-cherry rounded-xl py-3 text-sm font-bold text-primary-foreground shadow-glow transition-all active:scale-[0.97]"
          >
            <Check size={16} /> Save & New Bill
          </button>
        </div>
      </div>
    </div>
  );
}
