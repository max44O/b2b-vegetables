'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Using regular img tag for logo

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-24 flex items-center justify-start">
                <img
                  src="/logo.png"
                  alt="Dimax Distribution"
                  className="h-full w-auto object-contain max-w-full"
                  style={{ display: 'block' }}
                  onError={(e) => {
                    console.error('Logo failed to load:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('description')}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-muted-foreground hover:text-primary">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{t('contact')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="font-medium">{t('email')}:</span><br />
                {process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@dimaxdistribution.ro'}
              </li>
              <li>
                <span className="font-medium">{t('phone')}:</span><br />
                {process.env.NEXT_PUBLIC_COMPANY_PHONE || ''}
              </li>
              <li>
                <span className="font-medium">{t('address')}:</span><br />
                Bd. Voluntari nr.78 24B
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Business Hours</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>Monday - Friday: 8:00 - 18:00</li>
              <li>Saturday: 9:00 - 14:00</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 {t('company')}. {t('rights')}
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href={`/${locale}/privacy`} className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href={`/${locale}/terms`} className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}















