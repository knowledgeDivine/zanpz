export const naira = (kobo: number) => "₦" + Math.round(kobo / 100).toLocaleString("en-NG");
export const salePrice = (p: { price: number; discountPct: number }) => Math.round(p.price * (100 - p.discountPct) / 100);
