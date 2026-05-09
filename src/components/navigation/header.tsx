'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
// Using regular img tag for logo

export function Header() {
  const { data: session, status } = useSession();
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper function to check if link is active
  const isActive = (path: string) => {
    if (!pathname) return false;
    // Check if pathname includes the path
    return pathname.includes(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-32 flex items-center justify-start">
              <img
                src="/logo.png"
                alt="Dimax Distribution"
                className="h-full w-auto object-contain max-w-full"
                style={{ display: 'block' }}
                onError={(e) => {
                  console.error('Logo failed to load:', e);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Logo loaded successfully');
                }}
              />
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/about') ? 'text-green-600 font-semibold' : 'text-muted-foreground'
              }`}
            >
              {t('about')}
            </Link>
            <Link 
              href="/products" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/products') ? 'text-green-600 font-semibold' : 'text-muted-foreground'
              }`}
            >
              {t('products')}
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/contact') ? 'text-green-600 font-semibold' : 'text-muted-foreground'
              }`}
            >
              {t('contact')}
            </Link>
            <Link 
              href={`/${locale}/terms`} 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/terms') ? 'text-green-600 font-semibold' : 'text-muted-foreground'
              }`}
            >
              {t('terms')}
            </Link>
            <Link 
              href={`/${locale}/privacy`} 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/privacy') ? 'text-green-600 font-semibold' : 'text-muted-foreground'
              }`}
            >
              {t('privacy')}
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {status === 'loading' ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-muted"></div>
            ) : session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    {t('dashboard')}
                  </Button>
                </Link>
                <Link href="/api/auth/signout">
                  <Button variant="ghost" size="sm">
                    {t('logout')}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    {t('register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 space-y-4">
            <Link 
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-green-600 hover:bg-gray-50 rounded-md ${
                isActive('/about') ? 'text-green-600 font-semibold bg-green-50' : 'text-muted-foreground'
              }`}
            >
              {t('about')}
            </Link>
            <Link 
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-green-600 hover:bg-gray-50 rounded-md ${
                isActive('/products') ? 'text-green-600 font-semibold bg-green-50' : 'text-muted-foreground'
              }`}
            >
              {t('products')}
            </Link>
            <Link 
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-green-600 hover:bg-gray-50 rounded-md ${
                isActive('/contact') ? 'text-green-600 font-semibold bg-green-50' : 'text-muted-foreground'
              }`}
            >
              {t('contact')}
            </Link>
            <Link 
              href={`/${locale}/terms`}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-green-600 hover:bg-gray-50 rounded-md ${
                isActive('/terms') ? 'text-green-600 font-semibold bg-green-50' : 'text-muted-foreground'
              }`}
            >
              {t('terms')}
            </Link>
            <Link 
              href={`/${locale}/privacy`}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-green-600 hover:bg-gray-50 rounded-md ${
                isActive('/privacy') ? 'text-green-600 font-semibold bg-green-50' : 'text-muted-foreground'
              }`}
            >
              {t('privacy')}
            </Link>
            
            <div className="border-t pt-4 space-y-2">
              {status === 'loading' ? (
                <div className="h-9 w-full animate-pulse rounded-md bg-muted"></div>
              ) : session ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('dashboard')}
                    </Button>
                  </Link>
                  <Link href="/api/auth/signout" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      {t('logout')}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">
                      {t('login')}
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      {t('register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


