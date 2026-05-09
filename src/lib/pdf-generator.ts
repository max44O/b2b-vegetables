import jsPDF from 'jspdf';
import { Offer, RFQ, RFQItem, Product, User } from '@prisma/client';

interface OfferWithDetails extends Offer {
  rfq: RFQ & {
    items: (RFQItem & {
      product: Product;
    })[];
    user: User;
  };
  items: Array<{
    product: Product;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export function generateOfferPDF(offer: OfferWithDetails, locale: 'en' | 'ro' = 'en') {
  const doc = new jsPDF();
  
  // Company header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Vegetable Wholesale Co.', 20, 30);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium B2B Vegetable & Legume Wholesale', 20, 40);
  
  // Offer details
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(locale === 'en' ? 'QUOTE OFFER' : 'OFERTĂ DE PREȚ', 20, 60);
  
  // Customer info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(locale === 'en' ? 'Customer Information:' : 'Informații Client:', 20, 80);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${offer.rfq.user.name}`, 20, 90);
  doc.text(`${offer.rfq.user.email}`, 20, 100);
  doc.text(`${offer.rfq.user.companyName || ''}`, 20, 110);
  
  // Offer details
  doc.setFont('helvetica', 'bold');
  doc.text(locale === 'en' ? 'Offer Details:' : 'Detalii Ofertă:', 20, 130);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${locale === 'en' ? 'Offer ID' : 'ID Ofertă'}: ${offer.id}`, 20, 140);
  doc.text(`${locale === 'en' ? 'Date' : 'Data'}: ${new Date(offer.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ro-RO')}`, 20, 150);
  doc.text(`${locale === 'en' ? 'Valid Until' : 'Valabil Până'}: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(locale === 'en' ? 'en-US' : 'ro-RO')}`, 20, 160);
  
  // Items table
  doc.setFont('helvetica', 'bold');
  doc.text(locale === 'en' ? 'Requested Items:' : 'Articole Solicitate:', 20, 180);
  
  let yPosition = 200;
  
  // Table header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(locale === 'en' ? 'Product' : 'Produs', 20, yPosition);
  doc.text(locale === 'en' ? 'Qty' : 'Cant.', 100, yPosition);
  doc.text(locale === 'en' ? 'Unit Price' : 'Preț Unit.', 130, yPosition);
  doc.text(locale === 'en' ? 'Total' : 'Total', 170, yPosition);
  
  yPosition += 10;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  let grandTotal = 0;
  
  offer.items.forEach((item) => {
    const productName = locale === 'en' ? item.product.name : item.product.nameRo || item.product.name;
    const total = item.totalPrice;
    grandTotal += total;
    
    doc.text(productName.substring(0, 30), 20, yPosition);
    doc.text(item.quantity.toString(), 100, yPosition);
    doc.text(`$${item.unitPrice.toFixed(2)}`, 130, yPosition);
    doc.text(`$${total.toFixed(2)}`, 170, yPosition);
    
    yPosition += 8;
  });
  
  // Total
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${locale === 'en' ? 'Grand Total:' : 'Total General:'} $${grandTotal.toFixed(2)}`, 130, yPosition);
  
  // Admin message
  if (offer.notes) {
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text(locale === 'en' ? 'Message from Admin:' : 'Mesaj de la Admin:', 20, yPosition);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const messageLines = doc.splitTextToSize(offer.notes, 170);
    doc.text(messageLines, 20, yPosition + 10);
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('This offer is valid for 7 days from the date of issue.', 20, pageHeight - 20);
  doc.text('Generated on: ' + new Date().toLocaleString(), 20, pageHeight - 10);
  
  return doc;
}

export function downloadOfferPDF(offer: OfferWithDetails, locale: 'en' | 'ro' = 'en') {
  const doc = generateOfferPDF(offer, locale);
  const fileName = `offer-${offer.id}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export function getOfferPDFBlob(offer: OfferWithDetails, locale: 'en' | 'ro' = 'en'): Blob {
  const doc = generateOfferPDF(offer, locale);
  return doc.output('blob');
}
