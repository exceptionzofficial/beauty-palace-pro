export interface Service {
  id: string;
  category: string;
  service_name: string;
  description: string;
  price: number;
  duration: number;
}

export interface CartItem extends Service {
  quantity: number;
  editedPrice: number;
}

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  createdAt: string;
}

export interface InvoiceData {
  id: string;
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
  date: string;
}

export const categories = [
  "Hair Styling",
  "Hair Treatment",
  "Hair Care",
  "Face Care",
  "Body Care",
  "Waxing",
  "Beauty Packages",
  "Threading",
  "Massage Services",
] as const;

export const services: Service[] = [
  // Hair Treatment Services
  { id: "ht-1", category: "Hair Treatment", service_name: "Long Lasting Damage Hair Repair (Upto Waist)", description: "Deep repair treatment for long hair, restoring strength and moisture to damaged strands.", price: 2200, duration: 90 },
  { id: "ht-2", category: "Hair Treatment", service_name: "Long Lasting Damage Hair Repair (Upto Shoulder)", description: "Repair treatment for medium-length hair focusing on restoring strength and reducing frizz.", price: 1500, duration: 60 },
  { id: "ht-3", category: "Hair Treatment", service_name: "Long Lasting Damage Hair Repair (Below Shoulder)", description: "Comprehensive repair for longer hair targeting damage, dryness, and frizz.", price: 2000, duration: 75 },
  { id: "ht-4", category: "Hair Treatment", service_name: "Long Lasting Damage Hair Repair (Upto Neck)", description: "Restorative treatment for short to medium hair restoring moisture and shine.", price: 1000, duration: 45 },
  { id: "ht-5", category: "Hair Treatment", service_name: "Keratin Hair Treatment - Women (Short)", description: "Professional keratin treatment adding shine, smoothness, and manageability to short hair.", price: 6000, duration: 120 },
  { id: "ht-6", category: "Hair Treatment", service_name: "Keratin Hair Treatment - Women (Medium)", description: "Keratin smoothing treatment eliminating frizz and restoring shine for medium hair.", price: 6800, duration: 150 },
  { id: "ht-7", category: "Hair Treatment", service_name: "Keratin Hair Treatment - Women (Long)", description: "Transformative keratin service for long hair reducing frizz and enhancing shine.", price: 8000, duration: 180 },
  { id: "ht-8", category: "Hair Treatment", service_name: "Keratin Hair Treatment - Men (Long)", description: "Keratin treatment for men's long hair reducing frizz and adding shine.", price: 10000, duration: 180 },
  { id: "ht-9", category: "Hair Treatment", service_name: "Instant Hair Repair - Men (Short)", description: "Quick restorative treatment for men's short hair, repairing damage and improving texture.", price: 1500, duration: 30 },
  { id: "ht-10", category: "Hair Treatment", service_name: "Instant Hair Repair - Women (Short)", description: "Immediate repair and hydration for women's short damaged hair.", price: 2000, duration: 40 },
  { id: "ht-11", category: "Hair Treatment", service_name: "Hair Protein Restore - Women (Medium)", description: "Protein-rich treatment restoring hair health and texture for medium hair.", price: 1600, duration: 60 },
  { id: "ht-12", category: "Hair Treatment", service_name: "Hair Keratin Express", description: "Quick keratin application for instant frizz control and smoothness.", price: 3500, duration: 60 },

  // Hair Care Services
  { id: "hc-1", category: "Hair Care", service_name: "Hair Spa", description: "Deep conditioning spa treatment to nourish and revitalize hair with essential oils.", price: 1500, duration: 60 },
  { id: "hc-2", category: "Hair Care", service_name: "Hair Wash & Style", description: "Professional hair wash followed by blow-dry and styling.", price: 950, duration: 30 },
  { id: "hc-3", category: "Hair Care", service_name: "L'Oreal Classic Hair Spa (Rough Hair)", description: "L'Oreal professional spa for rough, unruly hair to smoothen and hydrate.", price: 900, duration: 45 },
  { id: "hc-4", category: "Hair Care", service_name: "L'Oreal Hair Spa - Women (Medium)", description: "Luxurious L'Oreal spa experience for medium-length hair.", price: 1150, duration: 50 },
  { id: "hc-5", category: "Hair Care", service_name: "L'Oreal Hair Spa - Men", description: "Premium L'Oreal hair spa designed for men's hair care needs.", price: 1100, duration: 45 },
  { id: "hc-6", category: "Hair Care", service_name: "L'Oreal Hair Spa - Women (Long)", description: "Rejuvenating L'Oreal spa treatment for long hair.", price: 1400, duration: 60 },
  { id: "hc-7", category: "Hair Care", service_name: "Deep Nourishing Oil Spa - Women (Short)", description: "Deep oil treatment delivering essential nutrients and hydration for short hair.", price: 1750, duration: 45 },
  { id: "hc-8", category: "Hair Care", service_name: "Deep Nourishing Oil Spa - Women (Medium)", description: "Oil-based spa providing intense hydration for medium-length hair.", price: 1500, duration: 50 },
  { id: "hc-9", category: "Hair Care", service_name: "Deep Nourishing Oil Spa - Women (Long)", description: "Luxurious oil spa for long hair promoting healthy growth and shine.", price: 1200, duration: 55 },
  { id: "hc-10", category: "Hair Care", service_name: "Anti Dandruff Hair Spa - Women (Medium)", description: "Specialized anti-dandruff treatment soothing scalp irritation.", price: 800, duration: 40 },
  { id: "hc-11", category: "Hair Care", service_name: "Anti Dandruff Hair Spa - Women (Short)", description: "Anti-dandruff spa targeting scalp health for short hair.", price: 1200, duration: 35 },
  { id: "hc-12", category: "Hair Care", service_name: "Power Mix Hair Spa - Women (Medium)", description: "Revitalizing power mix treatment for medium hair restoration.", price: 1300, duration: 50 },

  // Hair Styling Services
  { id: "hs-1", category: "Hair Styling", service_name: "Women's Haircut & Style", description: "Professional haircut with styling for women.", price: 500, duration: 45 },
  { id: "hs-2", category: "Hair Styling", service_name: "Men's Haircut & Style", description: "Trendy haircut with styling for men.", price: 300, duration: 30 },
  { id: "hs-3", category: "Hair Styling", service_name: "Hair Straightening (Short)", description: "Professional hair straightening service for short hair.", price: 3500, duration: 90 },
  { id: "hs-4", category: "Hair Styling", service_name: "Hair Straightening (Medium)", description: "Hair straightening treatment for medium-length hair.", price: 5000, duration: 120 },
  { id: "hs-5", category: "Hair Styling", service_name: "Hair Straightening (Long)", description: "Complete hair straightening for long hair.", price: 7000, duration: 150 },
  { id: "hs-6", category: "Hair Styling", service_name: "Blow Dry & Set", description: "Professional blow-dry and setting for any occasion.", price: 400, duration: 30 },
  { id: "hs-7", category: "Hair Styling", service_name: "Hair Coloring (Global)", description: "Full head hair coloring with premium products.", price: 2500, duration: 90 },
  { id: "hs-8", category: "Hair Styling", service_name: "Hair Highlights", description: "Partial or full highlights with foil technique.", price: 3000, duration: 120 },
  { id: "hs-9", category: "Hair Styling", service_name: "Bridal Hair Styling", description: "Elegant bridal hairstyling for your special day.", price: 5000, duration: 120 },
  { id: "hs-10", category: "Hair Styling", service_name: "Hair Perming", description: "Professional perming for natural-looking curls.", price: 4000, duration: 120 },

  // Face Care Services
  { id: "fc-1", category: "Face Care", service_name: "Classic Facial", description: "Deep cleansing facial with extraction and hydration mask.", price: 800, duration: 45 },
  { id: "fc-2", category: "Face Care", service_name: "Gold Facial", description: "Luxurious gold-infused facial for radiant, glowing skin.", price: 1500, duration: 60 },
  { id: "fc-3", category: "Face Care", service_name: "Diamond Facial", description: "Premium diamond facial for deep exfoliation and rejuvenation.", price: 2000, duration: 60 },
  { id: "fc-4", category: "Face Care", service_name: "Anti-Aging Facial", description: "Targeted facial treatment reducing fine lines and wrinkles.", price: 2500, duration: 75 },
  { id: "fc-5", category: "Face Care", service_name: "Fruit Facial", description: "Natural fruit-based facial nourishing and brightening skin.", price: 700, duration: 40 },
  { id: "fc-6", category: "Face Care", service_name: "De-Tan Facial", description: "Specialized facial removing tan and evening skin tone.", price: 1200, duration: 50 },
  { id: "fc-7", category: "Face Care", service_name: "Acne Treatment Facial", description: "Deep cleansing facial targeting acne and blemishes.", price: 1800, duration: 60 },
  { id: "fc-8", category: "Face Care", service_name: "Skin Brightening Facial", description: "Brightening treatment for a luminous, even complexion.", price: 1600, duration: 55 },
  { id: "fc-9", category: "Face Care", service_name: "Cleanup - Basic", description: "Quick skin cleanup with extraction and toning.", price: 500, duration: 30 },
  { id: "fc-10", category: "Face Care", service_name: "Cleanup - Advanced", description: "Thorough cleanup with deep pore cleansing and mask.", price: 900, duration: 40 },

  // Body Care Services
  { id: "bc-1", category: "Body Care", service_name: "Full Body Massage", description: "Relaxing full body massage with aromatic oils.", price: 2000, duration: 60 },
  { id: "bc-2", category: "Body Care", service_name: "Back & Shoulder Massage", description: "Targeted massage for back and shoulder tension relief.", price: 800, duration: 30 },
  { id: "bc-3", category: "Body Care", service_name: "Body Scrub & Polish", description: "Exfoliating body scrub for smooth, glowing skin.", price: 1500, duration: 45 },
  { id: "bc-4", category: "Body Care", service_name: "Body Wrap Treatment", description: "Detoxifying body wrap for skin tightening and hydration.", price: 2500, duration: 60 },
  { id: "bc-5", category: "Body Care", service_name: "Foot Reflexology", description: "Therapeutic foot massage targeting pressure points.", price: 600, duration: 30 },
  { id: "bc-6", category: "Body Care", service_name: "Manicure - Classic", description: "Complete manicure with nail shaping, cuticle care, and polish.", price: 400, duration: 30 },
  { id: "bc-7", category: "Body Care", service_name: "Pedicure - Classic", description: "Relaxing pedicure with scrub, massage, and polish.", price: 500, duration: 40 },
  { id: "bc-8", category: "Body Care", service_name: "Manicure - Luxury", description: "Premium manicure with spa treatment and gel polish.", price: 800, duration: 45 },
  { id: "bc-9", category: "Body Care", service_name: "Pedicure - Luxury", description: "Luxury pedicure with paraffin wax and spa treatment.", price: 1000, duration: 50 },

  // Waxing Services
  { id: "wx-1", category: "Waxing", service_name: "Full Arms Waxing", description: "Complete waxing for both arms using premium wax.", price: 300, duration: 20 },
  { id: "wx-2", category: "Waxing", service_name: "Full Legs Waxing", description: "Thorough waxing for both legs for smooth skin.", price: 500, duration: 30 },
  { id: "wx-3", category: "Waxing", service_name: "Half Arms Waxing", description: "Waxing for forearms or upper arms.", price: 200, duration: 15 },
  { id: "wx-4", category: "Waxing", service_name: "Half Legs Waxing", description: "Waxing for lower or upper legs.", price: 300, duration: 20 },
  { id: "wx-5", category: "Waxing", service_name: "Underarm Waxing", description: "Gentle waxing for underarm area.", price: 150, duration: 10 },
  { id: "wx-6", category: "Waxing", service_name: "Full Body Waxing", description: "Complete body waxing for smooth, hair-free skin.", price: 2000, duration: 90 },
  { id: "wx-7", category: "Waxing", service_name: "Bikini Waxing", description: "Professional bikini area waxing service.", price: 500, duration: 20 },
  { id: "wx-8", category: "Waxing", service_name: "Stomach Waxing", description: "Waxing for the stomach/abdomen area.", price: 300, duration: 15 },
  { id: "wx-9", category: "Waxing", service_name: "Back Waxing", description: "Full back waxing for smooth skin.", price: 400, duration: 20 },
  { id: "wx-10", category: "Waxing", service_name: "Chocolate Waxing - Full Arms", description: "Premium chocolate wax for gentle, smooth results.", price: 500, duration: 25 },

  // Beauty Packages
  { id: "bp-1", category: "Beauty Packages", service_name: "Bridal Package - Gold", description: "Complete bridal beauty package with facial, hair styling, makeup, and more.", price: 15000, duration: 300 },
  { id: "bp-2", category: "Beauty Packages", service_name: "Bridal Package - Diamond", description: "Premium bridal package with luxury treatments and HD makeup.", price: 25000, duration: 360 },
  { id: "bp-3", category: "Beauty Packages", service_name: "Party Ready Package", description: "Quick glam package with makeup, hair styling, and touch-ups.", price: 3500, duration: 90 },
  { id: "bp-4", category: "Beauty Packages", service_name: "Glow & Go Package", description: "Facial, cleanup, and basic styling for instant glow.", price: 2000, duration: 75 },
  { id: "bp-5", category: "Beauty Packages", service_name: "Complete Grooming - Men", description: "Men's grooming package with haircut, facial, and massage.", price: 2500, duration: 90 },
  { id: "bp-6", category: "Beauty Packages", service_name: "Monthly Care Package", description: "Monthly maintenance package with facial, hair spa, and waxing.", price: 3000, duration: 120 },

  // Threading Services
  { id: "th-1", category: "Threading", service_name: "Eyebrow Threading", description: "Precise eyebrow shaping using threading technique.", price: 50, duration: 10 },
  { id: "th-2", category: "Threading", service_name: "Upper Lip Threading", description: "Clean upper lip hair removal with threading.", price: 30, duration: 5 },
  { id: "th-3", category: "Threading", service_name: "Full Face Threading", description: "Complete face threading including forehead, cheeks, chin.", price: 150, duration: 20 },
  { id: "th-4", category: "Threading", service_name: "Chin Threading", description: "Precise chin hair removal with threading.", price: 30, duration: 5 },
  { id: "th-5", category: "Threading", service_name: "Forehead Threading", description: "Forehead hair removal using threading technique.", price: 30, duration: 5 },
  { id: "th-6", category: "Threading", service_name: "Side Locks Threading", description: "Side face hair removal with threading.", price: 40, duration: 10 },

  // Massage Services
  { id: "ms-1", category: "Massage Services", service_name: "Head Massage", description: "Gentle pressure and rhythmic movements applied to the scalp to relieve stress.", price: 500, duration: 30 },
  { id: "ms-2", category: "Massage Services", service_name: "Aromatherapy Massage", description: "Relaxing massage with essential oils for deep relaxation.", price: 2500, duration: 60 },
  { id: "ms-3", category: "Massage Services", service_name: "Deep Tissue Massage", description: "Intense massage targeting deep muscle tension and knots.", price: 3000, duration: 60 },
  { id: "ms-4", category: "Massage Services", service_name: "Hot Stone Massage", description: "Soothing massage with heated stones for muscle relaxation.", price: 3500, duration: 75 },
  { id: "ms-5", category: "Massage Services", service_name: "Swedish Massage", description: "Classic massage technique for overall relaxation and wellness.", price: 2000, duration: 60 },
];
