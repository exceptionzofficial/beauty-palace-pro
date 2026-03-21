import { Booking, InvoiceData, Service } from "@/data/services";

const BOOKINGS_KEY = "bp_bookings";
const INVOICES_KEY = "bp_invoices";
const SERVICES_KEY = "bp_custom_services";
const ADMIN_PIN = "1234";

export function getBookings(): Booking[] {
  return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
}

export function saveBooking(booking: Booking) {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function getInvoices(): InvoiceData[] {
  return JSON.parse(localStorage.getItem(INVOICES_KEY) || "[]");
}

export function saveInvoice(invoice: InvoiceData) {
  const invoices = getInvoices();
  invoices.push(invoice);
  localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
}

export function getCustomServices(): Service[] {
  return JSON.parse(localStorage.getItem(SERVICES_KEY) || "[]");
}

export function saveCustomServices(services: Service[]) {
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

export function verifyAdmin(pin: string): boolean {
  return pin === ADMIN_PIN;
}

export function generateWhatsAppLink(phone: string, invoice: InvoiceData): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

  let msg = `Hello ${invoice.customerName},\n\n`;
  msg += `Thank you for visiting *Beauty Palace* 💇‍♀️\n\n`;
  msg += `📋 *Invoice #${invoice.id}*\n`;
  msg += `📅 ${invoice.date}\n\n`;
  msg += `*Services:*\n`;
  invoice.items.forEach((item) => {
    msg += `• ${item.service_name} × ${item.quantity} – ₹${(item.editedPrice * item.quantity).toLocaleString("en-IN")}\n`;
  });
  msg += `\n💰 *Subtotal:* ₹${invoice.subtotal.toLocaleString("en-IN")}`;
  if (invoice.discountAmount > 0) {
    msg += `\n🏷️ *Discount:* -₹${invoice.discountAmount.toLocaleString("en-IN")}`;
  }
  if (invoice.gstEnabled) {
    msg += `\n📊 *GST (18%):* ₹${invoice.gstAmount.toLocaleString("en-IN")}`;
  }
  msg += `\n\n✅ *Grand Total: ₹${invoice.grandTotal.toLocaleString("en-IN")}*`;
  msg += `\n\nVisit again! 🙏\nwww.exceptionz.in`;

  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`;
}
